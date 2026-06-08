"use client";

import { FC } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

const Navbar: FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <img
                src="/token-icon.png"
                alt="$MUNDIAL"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full float-animation"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(212, 160, 23, 0.5))",
                }}
              />
              <div className="absolute inset-0 rounded-full glow-pulse bg-gold/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black gold-shimmer tracking-wider">
                $MUNDIAL
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground -mt-1 tracking-widest uppercase">
                {t.nav.subtitle}
              </span>
            </div>
          </div>

          {/* Center Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: t.nav.home, href: "#" },
              { label: t.nav.predictions, href: "#predicciones" },
              { label: t.nav.ranking, href: "#ranking" },
              { label: t.nav.token, href: "#token" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-gold transition-colors duration-300 rounded-lg hover:bg-gold/5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side: Language + Buy + Wallet */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher />
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20 hover:border-neon-green/40 transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              {t.nav.buy}
            </a>
            <div className="wallet-btn-wrapper">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
