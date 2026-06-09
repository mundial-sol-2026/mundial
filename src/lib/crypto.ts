/**
 * ========================================
 * Criptografía Solana - Verificación de Firmas
 * ========================================
 * Implementa validación de firmas Ed25519 usando TweetNaCl
 * Previene ataques de suplantación, replay attacks y MITM
 */

import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Verifica una firma criptográfica Ed25519
 * @param message - Mensaje original en texto plano
 * @param signature - Firma en base58 (formato estándar de Phantom)
 * @param publicKey - Clave pública del usuario en base58
 * @returns boolean - True si la firma es válida y auténtica
 */
export function verifySolanaSignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);

    // Validar longitudes (Ed25519 tiene tamaños fijos)
    if (signatureBytes.length !== nacl.sign.signatureBytesLength) {
      console.error('❌ Firma con longitud inválida');
      return false;
    }

    if (publicKeyBytes.length !== nacl.sign.publicKeyBytesLength) {
      console.error('❌ Clave pública con longitud inválida');
      return false;
    }

    // Verificación criptográfica pura
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    return isValid;
  } catch (error) {
    console.error('❌ Error verificando firma:', error);
    return false;
  }
}

/**
 * Valida que un mensaje tenga timestamp reciente (anti-replay)
 * @param message - Mensaje que debe contener "Timestamp: <unixTime>"
 * @param maxAgeMs - Edad máxima permitida en milisegundos (default: 3 min)
 * @returns boolean - True si el timestamp está dentro del rango válido
 */
export function validateMessageTimestamp(message: string, maxAgeMs: number = 3 * 60 * 1000): boolean {
  const timestampLine = message
    .split('\n')
    .find((line) => line.startsWith('Timestamp:'));

  if (!timestampLine) {
    console.error('❌ Mensaje sin timestamp');
    return false;
  }

  const clientTimestamp = parseInt(timestampLine.split(': ')[1]);
  const age = Date.now() - clientTimestamp;

  if (age > maxAgeMs) {
    console.error(`❌ Mensaje expirado: ${age}ms > ${maxAgeMs}ms`);
    return false;
  }

  if (age < 0) {
    console.error('❌ Timestamp del futuro (posible ataque de sincronización)');
    return false;
  }

  return true;
}

/**
 * Extrae información estructurada del mensaje firmado
 * @param message - Mensaje en formato de predicción estructurado
 * @returns objeto con matchId, voto y timestamp extraídos
 */
export function parsePredictionMessage(message: string): {
  matchId: string;
  vote: string;
  timestamp: number;
} | null {
  try {
    const lines = message.split('\n');
    
    const matchLine = lines.find((l) => l.startsWith('Match ID:') || l.startsWith('Match:'));
    const voteLine = lines.find((l) => l.startsWith('Voto:') || l.startsWith('Prediccion:'));
    const timestampLine = lines.find((l) => l.startsWith('Timestamp:'));

    if (!matchLine || !voteLine || !timestampLine) {
      return null;
    }

    return {
      matchId: matchLine.split(': ')[1].trim(),
      vote: voteLine.split(': ')[1].trim(),
      timestamp: parseInt(timestampLine.split(': ')[1]),
    };
  } catch (error) {
    console.error('❌ Error parseando mensaje:', error);
    return null;
  }
}

/**
 * Valida que una dirección de wallet de Solana sea válida (base58)
 * @param wallet - String de wallet
 * @returns boolean - True si la dirección es válida
 */
export function isValidSolanaAddress(wallet: string): boolean {
  try {
    const decoded = bs58.decode(wallet);
    // Solana Public Keys tienen exactamente 32 bytes
    return decoded.length === 32;
  } catch {
    return false;
  }
}