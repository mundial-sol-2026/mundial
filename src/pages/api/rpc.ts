/**
 * ========================================
 * POST /api/rpc
 * ========================================
 * Proxy seguro para RPC de Solana
 * 
 * ¿Por qué?
 * - Si pasas tu API key de Helius/QuickNode directamente en el frontend,
 *   los hackers la roban inspeccionando el tráfico de red.
 * - Este proxy evita que la API key se exponga públicamente.
 * - El backend (Vercel) es la única entidad que conoce la clave real.
 * 
 * Flujo:
 * 1. Frontend hace request a /api/rpc con un payload JSON
 * 2. Este endpoint toma la API key de las variables de entorno seguras
 * 3. Reenvía la petición al RPC real de Solana (Helius, QuickNode, etc.)
 * 4. Retorna la respuesta al frontend
 */

import type { NextApiRequest, NextApiResponse } from 'next';

const RPC_PROVIDER = process.env.NEXT_PUBLIC_RPC_PROVIDER || process.env.SOLANA_RPC_URL;

if (!RPC_PROVIDER) {
  throw new Error('❌ SOLANA_RPC_URL no configurada');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  try {
    const rpcBody = req.body;

    // Validación básica del payload
    if (!rpcBody || typeof rpcBody !== 'object') {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    // Reenviar a Solana RPC con la API key segura desde el servidor
    const rpcResponse = await fetch(RPC_PROVIDER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rpcBody),
    });

    const data = await rpcResponse.json();

    // Retornar respuesta del RPC sin modificar
    return res.status(rpcResponse.status).json(data);
  } catch (error) {
    console.error('❌ Error en RPC proxy:', error);
    return res.status(500).json({ error: 'Error comunicando con RPC de Solana' });
  }
}
