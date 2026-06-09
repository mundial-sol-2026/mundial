/**
 * ========================================
 * POST /api/predictions
 * ========================================
 * Endpoint CRÍTICO para guardar predicciones con firma criptográfica
 * 
 * Flujo:
 * 1. Frontend obtiene firma del usuario (sin gas)
 * 2. Backend verifica la firma criptográficamente
 * 3. Backend valida que el partido no haya comenzado
 * 4. Si todo es válido, guarda en Vercel Postgres
 * 
 * Prevención de ataques:
 * - Replay attacks: Validación de timestamp reciente
 * - Front-running: Validación de hora del partido
 * - Suplantación: Verificación criptográfica Ed25519
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import {
  verifySolanaSignature,
  validateMessageTimestamp,
  parsePredictionMessage,
  isValidSolanaAddress,
} from '@/lib/crypto';

interface PredictionPayload {
  publicKey: string;
  message: string;
  signature: string;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

type Response = ErrorResponse | SuccessResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { publicKey, message, signature } = req.body as PredictionPayload;

  // Validaciones básicas
  if (!publicKey || !message || !signature) {
    return res.status(400).json({
      error: 'Faltan parámetros requeridos: publicKey, message, signature',
      code: 'MISSING_PARAMS',
    });
  }

  try {
    // 🛡️ SEGURIDAD 1: Validar que la wallet sea una dirección de Solana válida
    if (!isValidSolanaAddress(publicKey)) {
      return res.status(400).json({
        error: 'Dirección de wallet inválida',
        code: 'INVALID_WALLET',
      });
    }

    // 🛡️ SEGURIDAD 2: Anti-Replay Attack - Timestamp debe ser reciente (3 minutos máximo)
    if (!validateMessageTimestamp(message, 3 * 60 * 1000)) {
      return res.status(400).json({
        error: 'Firma expirada o timestamp inválido. Intenta de nuevo.',
        code: 'EXPIRED_SIGNATURE',
      });
    }

    // 🛡️ SEGURIDAD 3: Verificación Criptográfica - Ed25519
    if (!verifySolanaSignature(message, signature, publicKey)) {
      return res.status(401).json({
        error: 'Firma criptográfica inválida. No proviene de tu wallet real.',
        code: 'INVALID_SIGNATURE',
      });
    }

    // Parse del mensaje para extraer matchId y voto
    const parsedMessage = parsePredictionMessage(message);
    if (!parsedMessage) {
      return res.status(400).json({
        error: 'Formato de mensaje inválido',
        code: 'INVALID_MESSAGE_FORMAT',
      });
    }

    const { matchId, vote } = parsedMessage;

    // 🛡️ SEGURIDAD 4: Anti-Front-Running - Validar que el partido no haya comenzado
    const matchResult = await sql`
      SELECT start_time, status FROM matches WHERE id = ${matchId}
    `;

    if (matchResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Partido no encontrado',
        code: 'MATCH_NOT_FOUND',
      });
    }

    const match = matchResult.rows[0];
    const currentUnixTime = Math.floor(Date.now() / 1000);

    if (currentUnixTime >= match.start_time) {
      return res.status(400).json({
        error: 'Las apuestas para este partido ya han cerrado.',
        code: 'BETTING_CLOSED',
      });
    }

    if (match.status !== 'SCHEDULED') {
      return res.status(400).json({
        error: 'Este partido no está en estado de apuesta',
        code: 'MATCH_NOT_AVAILABLE',
      });
    }

    // 🔥 Todo pasó validación de seguridad, guardar en la base de datos
    await sql`
      INSERT INTO predictions (user_wallet, match_id, predicted_winner)
      VALUES (${publicKey}, ${matchId}, ${vote})
      ON CONFLICT (user_wallet, match_id) DO UPDATE
      SET predicted_winner = ${vote}, created_at = CURRENT_TIMESTAMP
    `;

    console.log(`✅ Predicción guardada: ${publicKey.slice(0, 8)}... -> ${vote} en ${matchId}`);

    return res.status(200).json({
      success: true,
      message: '✅ ¡Predicción guardada exitosamente!',
    });
  } catch (error) {
    console.error('❌ Error en /api/predictions:', error);
    return res.status(500).json({
      error: 'Error interno del servidor. Por favor intenta de nuevo.',
      code: 'INTERNAL_ERROR',
    });
  }
}
