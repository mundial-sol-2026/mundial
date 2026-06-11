import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate Limiter DISTRIBUIDO con Upstash Redis
 * Funciona correctamente en serverless de Vercel
 * 
 * Las variables UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN
 * se configuran automáticamente al conectar Upstash desde Vercel Marketplace
 */

let ratelimitClaim: Ratelimit | null = null;
let ratelimitAdmin: Ratelimit | null = null;

function getRedisClient(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/**
 * Rate limit para /api/claim: 5 requests por IP/wallet por minuto
 * Previene bombardeo del endpoint de reclamo de tokens
 */
export async function checkClaimRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: Date;
}> {
  if (!ratelimitClaim) {
    ratelimitClaim = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "ratelimit:claim",
    });
  }

  const result = await ratelimitClaim.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: new Date(result.reset),
  };
}

/**
 * Rate limit para /api/admin/*: 30 requests por IP por 5 minutos
 * Previene ataques al endpoint de liquidación
 */
export async function checkAdminRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: Date;
}> {
  if (!ratelimitAdmin) {
    ratelimitAdmin = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(30, "5 m"),
      analytics: true,
      prefix: "ratelimit:admin",
    });
  }

  const result = await ratelimitAdmin.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: new Date(result.reset),
  };
}
