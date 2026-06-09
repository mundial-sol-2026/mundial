/**
 * ========================================
 * Hook: Manejar firma y envío de predicciones
 * ========================================
 * Encapsula toda la lógica criptográfica para la experiencia del usuario
 * El componente solo llama handlePrediction() sin conocer detalles de Web3
 */

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

interface UsePredictionReturn {
  submitPrediction: (matchId: string, vote: 'HOME' | 'AWAY' | 'DRAW') => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function usePrediction(): UsePredictionReturn {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitPrediction = async (matchId: string, vote: 'HOME' | 'AWAY' | 'DRAW') => {
    setError(null);
    setSuccess(false);

    // Validación: wallet conectada
    if (!publicKey || !signMessage) {
      setError('Por favor, conecta tu wallet primero');
      return;
    }

    setLoading(true);

    try {
      // 1. Crear mensaje estructurado con timestamp
      const timestamp = Date.now();
      const messageText = `MundialPrize2026 - Predicción\nMatch ID: ${matchId}\nVoto: ${vote}\nTimestamp: ${timestamp}`;

      // 2. Solicitar firma a la wallet (Phantom/Solflare abre diálogo nativo)
      const encodedMessage = new TextEncoder().encode(messageText);
      const signature = await signMessage(encodedMessage);

      // 3. Enviar firma verificada al backend
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          message: messageText,
          signature: bs58.encode(signature),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al guardar la predicción');
        return;
      }

      setSuccess(true);
      console.log('✅ Predicción guardada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error: ${errorMsg}`);
      console.error('❌ Error en usePrediction:', err);
    } finally {
      setLoading(false);
    }
  };

  return { submitPrediction, loading, error, success };
}
