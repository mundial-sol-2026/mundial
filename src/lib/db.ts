/**
 * ========================================
 * Database Client - Vercel Postgres
 * ========================================
 * Gestión centralizada de conexiones seguras a Vercel Postgres
 * Evita exponer credenciales y mantiene pool de conexiones óptimo
 */

import { sql } from '@vercel/postgres';

export { sql };

/**
 * Función auxiliar para ejecutar queries transaccionales con seguridad
 * Previene race conditions en operaciones críticas (claim, settlement)
 */
export async function executeTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await sql.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Función para ejecutar queries de solo lectura (optimización)
 */
export async function executeRead<T>(query: string, values?: any[]): Promise<T[]> {
  const result = await sql.query(query, values);
  return result.rows as T[];
}