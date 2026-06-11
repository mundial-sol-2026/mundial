import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { dbPool } from '@/lib/db';
import { checkAdminRateLimit } from '@/lib/ratelimit';

/**
 * ========================================
 * POST /api/admin/settle
 * ========================================
 * Endpoint de administrador para liquidar partidos y repartir premios.
 * 
 * Seguridad:
 * - timingSafeEqual para comparación de secrets (previene timing attacks)
 * - Rate limiting por IP
 * - client.release() en lugar de client.end() para no cerrar el pool
 */

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function safeCompareSecrets(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Aun así hacemos la comparación para no revelar longitud por timing
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length, 0));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Rate limiting para admin
  const clientIP = getClientIP(req);
  const ipLimit = await checkAdminRateLimit(`admin:ip:${clientIP}`);
  if (!ipLimit.success) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta más tarde.' });
  }

  const { matchId, result, tokensPerWinner, adminSecret } = req.body;

  // Validar clave de administrador con timingSafeEqual para prevenir timing attacks
  const expectedSecret = process.env.ADMIN_SECRET_KEY;
  if (!expectedSecret || !safeCompareSecrets(adminSecret, expectedSecret)) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  if (!matchId || !result || !tokensPerWinner) {
    return res.status(400).json({ error: 'Faltan parámetros: matchId, result, tokensPerWinner' });
  }

  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');

    // 1. Actualizar el estado del partido a FINISHED y colocar el resultado
    const matchUpdate = await client.query(
      `UPDATE matches SET status = 'FINISHED', result = $1, updated_at = NOW() WHERE id = $2 AND status = 'SCHEDULED'`,
      [result, matchId]
    );

    if (matchUpdate.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El partido no existe o ya fue liquidado anteriormente.' });
    }

    // 2. Traer a los ganadores que no han sido procesados
    const winnersQuery = await client.query(
      `SELECT user_wallet FROM predictions WHERE match_id = $1 AND predicted_winner = $2 AND is_processed = FALSE`,
      [matchId, result]
    );

    console.log(`🎯 Encontrados ${winnersQuery.rows.length} ganadores para el partido ${matchId}`);

    // 3. Asignar los tokens a cada ganador en user_rewards
    for (const row of winnersQuery.rows) {
      await client.query(
        `INSERT INTO user_rewards (user_wallet, accumulated_tokens, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_wallet)
         DO UPDATE SET accumulated_tokens = user_rewards.accumulated_tokens + $2, updated_at = NOW()`,
        [row.user_wallet, tokensPerWinner]
      );
    }

    // 4. Marcar todas las predicciones de este partido como procesadas para evitar doble pago
    await client.query(
      `UPDATE predictions SET is_processed = TRUE WHERE match_id = $1`,
      [matchId]
    );

    await client.query('COMMIT');
    return res.status(200).json({ success: true, message: `Partido ${matchId} liquidado. ${winnersQuery.rows.length} usuarios premiados.` });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error liquidando partido:', error);
    return res.status(500).json({ error: 'Fallo interno liquidando el juego.' });
  } finally {
    // ✅ FIX: Usar release() en lugar de end() para devolver la conexión al pool
    client.release();
  }
}
