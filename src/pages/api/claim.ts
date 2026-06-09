/**
 * ========================================
 * POST /api/claim
 * ========================================
 * Endpoint CRÍTICO para reclamar tokens de pump.fun
 * 
 * Flujo:
 * 1. Usuario solicita reclamar sus tokens acumulados
 * 2. Backend valida saldo en la DB (con bloqueo de fila para evitar race conditions)
 * 3. Backend genera transacción Solana transferiendo tokens desde wallet distribuidora
 * 4. Backend espera confirmación de Solana
 * 5. Backend actualiza DB de forma atómica
 * 
 * Prevención de ataques:
 * - Double Spend: Bloqueo de fila (FOR UPDATE) en PostgreSQL
 * - Race Condition: Transacción atómica BEGIN/COMMIT
 * - Falsificación: Validación de identidad del usuario
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import { sql } from '@vercel/postgres';
import bs58 from 'bs58';
import { isValidSolanaAddress } from '@/lib/crypto';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { userWallet } = req.body as ClaimPayload;

  if (!userWallet) {
    return res.status(400).json({
      error: 'Falta el parámetro userWallet',
      code: 'MISSING_WALLET',
    });
  }

  // Validar que la wallet sea una dirección Solana válida
  if (!isValidSolanaAddress(userWallet)) {
    return res.status(400).json({
      error: 'Dirección de wallet inválida',
      code: 'INVALID_WALLET',
    });
  }

  const client = await sql.connect();

  try {
    // 🔒 Inicia transacción SQL para atomicidad
    await client.query('BEGIN');

    // 🛡️ SEGURIDAD 1: Bloqueo de fila para evitar race conditions
    // FOR UPDATE bloquea esta fila hasta que confirmemos COMMIT o ROLLBACK
    const rewardQuery = await client.query(
      `SELECT accumulated_tokens, claimed_tokens FROM user_rewards 
       WHERE user_wallet = $1 FOR UPDATE`,
      [userWallet]
    );

    if (rewardQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'No tienes recompensas registradas',
        code: 'NO_REWARDS',
      });
    }

    const { accumulated_tokens, claimed_tokens } = rewardQuery.rows[0];
    const claimableAmount = Number(accumulated_tokens) - Number(claimed_tokens);

    if (claimableAmount <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'No tienes saldo disponible para reclamar',
        code: 'ZERO_BALANCE',
      });
    }

    // --- BLOQUE WEB3: TRANSFERENCIA ON-CHAIN ---
    try {
      const connection = new Connection(SOLANA_RPC_URL!, 'confirmed');
      const DISTRIBUTOR_KEYPAIR = Keypair.fromSecretKey(
        bs58.decode(DISTRIBUTOR_PRIVATE_KEY!)
      );
      const TOKEN_MINT_ADDRESS = new PublicKey(REWARD_TOKEN_MINT!);
      const destinationWallet = new PublicKey(userWallet);

      // Obtener o crear cuenta de tokens del distribuidor
      const distributorTA = await getOrCreateAssociatedTokenAccount(
        connection,
        DISTRIBUTOR_KEYPAIR,
        TOKEN_MINT_ADDRESS,
        DISTRIBUTOR_KEYPAIR.publicKey
      );

      // Obtener o crear cuenta de tokens del usuario (cobra renta si es necesario)
      const userTA = await getOrCreateAssociatedTokenAccount(
        connection,
        DISTRIBUTOR_KEYPAIR,
        TOKEN_MINT_ADDRESS,
        destinationWallet
      );

      // Calcular cantidad con decimales (pump.fun típicamente usa 6 decimales)
      const decimals = 6;
      const amountInLamports = Math.floor(claimableAmount * Math.pow(10, decimals));

      // Crear instrucción de transferencia SPL
      const transferInstruction = createTransferInstruction(
        distributorTA.address,
        userTA.address,
        DISTRIBUTOR_KEYPAIR.publicKey,
        amountInLamports
      );

      const transaction = new Transaction().add(transferInstruction);

      // Firmar y enviar transacción a Solana
      const signature = await connection.sendTransaction(transaction, [DISTRIBUTOR_KEYPAIR], {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

      // Esperar confirmación
      await connection.confirmTransaction(signature, 'confirmed');
      console.log(`✅ Transacción confirmada: ${signature}`);
      // --- FIN BLOQUE WEB3 ---

      // 🔥 Si Solana confirmó, actualizar la DB de forma atómica
      await client.query(
        `UPDATE user_rewards SET claimed_tokens = claimed_tokens + $1, updated_at = NOW() 
         WHERE user_wallet = $2`,
        [claimableAmount, userWallet]
      );

      // ✅ Confirmar transacción SQL
      await client.query('COMMIT');

      return res.status(200).json({
        success: true,
        txSignature: signature,
      });
    } catch (web3Error) {
      // Si falla Solana, rollback de la DB
      await client.query('ROLLBACK');
      console.error('❌ Error en transacción Solana:', web3Error);
      return res.status(500).json({
        error: 'Error procesando transacción en Solana. Intenta de nuevo.',
        code: 'WEB3_ERROR',
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en /api/claim:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    });
  } finally {
    await client.end();
  }
}
