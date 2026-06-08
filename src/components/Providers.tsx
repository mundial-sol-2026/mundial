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

export const Providers: FC<ProvidersProps> = ({ children }) => {
  const router = useRouter();
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

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
