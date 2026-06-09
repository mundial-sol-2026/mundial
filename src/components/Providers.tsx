"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/i18n/LanguageContext";

// Dynamic import for wallet adapter CSS to avoid SSR issues
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface ProvidersProps {
  children: ReactNode;
}

/**
 * ========================================
 * Providers Component
 * ========================================
 * Configura los proveedores de Solana con proxy seguro para RPC
 * 
 * IMPORTANTE: El endpoint apunta a /api/rpc (proxy local)
 * en lugar de exponer la API key de Helius/QuickNode directamente.
 */
export const Providers: FC<ProvidersProps> = ({ children }) => {
  const router = useRouter();
  
  // 🛡️ Endpoint seguro: Usa proxy local en lugar de RPC público
  // El proxy (/api/rpc) añade la API key de forma segura en el servidor
  const endpoint = useMemo(() => {
    // En desarrollo local: http://localhost:3000/api/rpc
    // En producción (Vercel): https://mundialprize2026.vercel.app/api/rpc
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/api/rpc`;
    }
    return 'http://localhost:3000/api/rpc';
  }, []);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <LanguageProvider defaultLocale="en">
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletGuard>{children}</WalletGuard>
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </LanguageProvider>
  );
};

// Wallet guard that shows connect prompt when needed
interface WalletGuardProps {
  children: ReactNode;
}

const WalletGuard: FC<WalletGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default Providers;
