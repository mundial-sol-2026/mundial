import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate Limiter para endpoints críticos como /api/claim
 * Previene ataques de fuerza bruta y bombardeo de solicitudes
 */

let ratelimitClaim: Ratelimit | null = null;
let ratelimitAdmin: Ratelimit | null = null;

function getRedisClient(): Redis {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("UPSTASH_REDIS no está configurado en variables de entorno");
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Rate limit para /api/claim: 5 requests por IP/wallet por minuto
export async function checkClaimRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: Date;
}> {
  if (!ratelimitClaim) {
    const redis = getRedisClient();
    ratelimitClaim = new Ratelimit({
      redis,
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

// Rate limit para /api/admin/*: 30 requests por IP por 5 minutos
export async function checkAdminRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: Date;
}> {
  if (!ratelimitAdmin) {
    const redis = getRedisClient();
    ratelimitAdmin = new Ratelimit({
      redis,
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
