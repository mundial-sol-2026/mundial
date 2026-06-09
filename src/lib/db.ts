// src/lib/db.ts
import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('Falta la variable de entorno DATABASE_URL en Neon.');
}

// Creamos un pool de conexiones optimizado para Next.js Serverless
export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Función auxiliar para ejecutar queries limpias
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await dbPool.query(text, params);
  const duration = Date.now() - start;
  console.log(`[Neon DB] Ejecutada query en ${duration}ms`);
  return res;
}
