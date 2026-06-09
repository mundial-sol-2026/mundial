/**
 * ========================================
 * Hook: Reclamar tokens de pump.fun
 * ========================================
 * Maneja el flujo completo de reclamación con manejo de errores
 * Coordina la transferencia on-chain con la actualización de DB
 */

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface UseClaimReturn {
  claimTokens: () => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  txSignature: string | null;
}

export function useClaim(): UseClaimReturn {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const claimTokens = async () => {
    setError(null);
    setSuccess(false);
    setTxSignature(null);

    // Validación: wallet conectada
    if (!publicKey) {
      setError('Por favor, conecta tu wallet primero');
      return;
    }

    setLoading(true);

    try {
      // Enviar solicitud de claim al backend
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al reclamar tokens');
        return;
      }

      // Éxito: guardar firma de transacción
      setSuccess(true);
      setTxSignature(data.txSignature);
      console.log(`✅ Tokens reclamados exitosamente: ${data.txSignature}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error: ${errorMsg}`);
      console.error('❌ Error en useClaim:', err);
    } finally {
      setLoading(false);
    }
  };

  return { claimTokens, loading, error, success, txSignature };
}
