/**
 * ========================================
 * POST /api/claim
 * ========================================
 * Endpoint CRÍTICO para reclamar tokens de pump.fun
 * 
 * Flujo:
 * 1. Rate limiting por IP + wallet
 * 2. Backend valida saldo en la DB (con bloqueo de fila preventivo)
 * 3. Se libera inmediatamente la transacción SQL para liberar el Pool de Neon
 * 4. Backend genera y espera la confirmación de la transferencia en Solana
 * 5. Si la blockchain falla, se ejecuta un rollback/reembolso atómico en la DB
 * 
 * Prevención de ataques:
 * - Rate Limiting: Upstash Ratelimit por IP y wallet
 * - Double Spend: Bloqueo de fila (FOR UPDATE) en PostgreSQL
 * - Connection Exhaustion: Liberación temprana del pool de conexiones serverless
 * - Race Condition: Transacciones aisladas BEGIN/COMMIT
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import { dbPool } from '@/lib/db';
import bs58 from 'bs58';
import { isValidSolanaAddress } from '@/lib/crypto';
import { checkClaimRateLimit } from '@/lib/ratelimit';

interface ClaimPayload {
  userWallet: string;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

interface SuccessResponse {
  success: boolean;
  txSignature: string;
}

type Response = ErrorResponse | SuccessResponse;

// Configuración de Solana (del .env seguro de Vercel)
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_RPC_PROVIDER || process.env.SOLANA_RPC_URL;
const DISTRIBUTOR_PRIVATE_KEY = process.env.DISTRIBUTOR_PRIVATE_KEY;
const REWARD_TOKEN_MINT = process.env.REWARD_TOKEN_MINT;

if (!SOLANA_RPC_URL || !DISTRIBUTOR_PRIVATE_KEY || !REWARD_TOKEN_MINT) {
  console.error('❌ Falta configuración crítica en variables de entorno');
}

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  
  const { userWallet } = req.body as ClaimPayload;

  if (!userWallet || !isValidSolanaAddress(userWallet)) {
    return res.status(400).json({ error: 'Wallet inválida', code: 'INVALID_WALLET' });
  }

  // ─── RATE LIMITING ───
  // Limitamos tanto por IP como por wallet para prevenir ataques
  const clientIP = getClientIP(req);
  
  const [ipLimit, walletLimit] = await Promise.all([
    checkClaimRateLimit(`ip:${clientIP}`),
    checkClaimRateLimit(`wallet:${userWallet}`),
  ]);

  if (!ipLimit.success) {
    return res.status(429).json({
      error: 'Demasiadas solicitudes desde tu IP. Intenta de nuevo en 1 minuto.',
      code: 'RATE_LIMIT_IP'
    });
  }

  if (!walletLimit.success) {
    return res.status(429).json({
      error: 'Demasiadas solicitudes para esta wallet. Intenta de nuevo en 1 minuto.',
      code: 'RATE_LIMIT_WALLET'
    });
  }

  // Obtenemos un cliente individualizado del Pool de Neon para la transacción
  const client = await dbPool.connect();
  let claimableAmount = 0;

  // 1. FASE DE BASE DE DATOS (ULTRARRÁPIDA): Bloquear, verificar y debitar preventivamente en Neon
  try {
    await client.query('BEGIN');

    const rewardQuery = await client.query(
      `SELECT accumulated_tokens, claimed_tokens FROM user_rewards WHERE user_wallet = $1 FOR UPDATE`,
      [userWallet]
    );

    if (rewardQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'No tienes recompensas registradas', code: 'NO_REWARDS' });
    }

    const { accumulated_tokens, claimed_tokens } = rewardQuery.rows[0];
    claimableAmount = Number(accumulated_tokens) - Number(claimed_tokens);

    if (claimableAmount <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No hay saldo disponible', code: 'ZERO_BALANCE' });
    }

    // Descontamos congelando transitoriamente el saldo en la base de datos
    await client.query(
      `UPDATE user_rewards SET claimed_tokens = claimed_tokens + $1, updated_at = NOW() WHERE user_wallet = $2`,
      [claimableAmount, userWallet]
    );

    await client.query('COMMIT'); // 🔓 ¡LIBERAMOS LA FILA Y LA TRANSACCIÓN DE NEON DE INMEDIATO!
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error de DB en pre-claim:', error);
    return res.status(500).json({ error: 'Error interno de base de datos', code: 'INTERNAL_ERROR' });
  } finally {
    client.release(); // Devolvemos la conexión al pool de Neon para evitar saturación
  }

  // 2. FASE BLOCKCHAIN (FUERA DE LA TRANSACCIÓN SQL): No retiene recursos de base de datos
  try {
    const connection = new Connection(SOLANA_RPC_URL!, 'confirmed');
    const DISTRIBUTOR_KEYPAIR = Keypair.fromSecretKey(bs58.decode(DISTRIBUTOR_PRIVATE_KEY!));
    const TOKEN_MINT_ADDRESS = new PublicKey(REWARD_TOKEN_MINT!);
    const destinationWallet = new PublicKey(userWallet);

    const distributorTA = await getOrCreateAssociatedTokenAccount(connection, DISTRIBUTOR_KEYPAIR, TOKEN_MINT_ADDRESS, DISTRIBUTOR_KEYPAIR.publicKey);
    const userTA = await getOrCreateAssociatedTokenAccount(connection, DISTRIBUTOR_KEYPAIR, TOKEN_MINT_ADDRESS, destinationWallet);

    const decimals = 6;
    const amountInLamports = Math.floor(claimableAmount * Math.pow(10, decimals));

    const transferInstruction = createTransferInstruction(
      distributorTA.address, userTA.address, DISTRIBUTOR_KEYPAIR.publicKey, amountInLamports
    );

    const transaction = new Transaction().add(transferInstruction);
    const signature = await connection.sendTransaction(transaction, [DISTRIBUTOR_KEYPAIR], {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`✅ Transacción confirmada en Solana: ${signature}`);

    return res.status(200).json({ success: true, txSignature: signature });

  } catch (web3Error) {
    console.error('❌ Falló Solana. Iniciando rollback de saldo en Neon...', web3Error);

    // 3. FASE DE REEMBOLSO (Solo si blockchain falla): Abre otra conexión ultra-corta para restaurar fondos
    const refundClient = await dbPool.connect();
    let refundSuccess = false;
    try {
      const refundResult = await refundClient.query(
        `UPDATE user_rewards SET claimed_tokens = claimed_tokens - $1, updated_at = NOW() WHERE user_wallet = $2`,
        [claimableAmount, userWallet]
      );
      refundSuccess = (refundResult.rowCount ?? 0) > 0;
      
      if (!refundSuccess) {
        console.error('🔥 ALERTA CRÍTICA: El rollback no afectó ninguna fila. Wallet:', userWallet, 'Amount:', claimableAmount);
      } else {
        console.log('✅ Rollback exitoso. Saldo restaurado para wallet:', userWallet);
      }
    } catch (refundError) {
      console.error('🔥 ERROR CRÍTICO: No se pudo reembolsar el saldo de forma automática:', refundError);
      // Aquí deberías disparar una alerta a tu sistema de monitoreo (PagerDuty, Slack, etc.)
      // Ejemplo: await sendAlert(`ROLLBACK FAILED for wallet ${userWallet}`);
    } finally {
      refundClient.release();
    }

    // Si el rollback falló, retornamos un error diferente para que el usuario contacte soporte
    if (!refundSuccess) {
      return res.status(500).json({
        error: 'Error crítico: Tu transacción falló y no pudimos restaurar tu saldo automáticamente. Contacta soporte inmediatamente.',
        code: 'WEB3_ERROR_REFUND_FAILED'
      });
    }

    return res.status(500).json({
      error: 'Error procesando transacción en Solana. Tu saldo ha sido resguardado de forma segura, por favor intenta de nuevo.',
      code: 'WEB3_ERROR'
    });
  }
}
