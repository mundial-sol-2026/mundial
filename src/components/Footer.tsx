"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Share2,
  ExternalLink,
  Heart,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer: FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative py-12 md:py-16 border-t border-gold/10">
      <div className="absolute inset-0 bg-gradient-to-t from-premium-black to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/token-icon.png"
                alt="$MUNDIAL"
                className="w-10 h-10 rounded-full"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(212, 160, 23, 0.4))",
                }}
              />
              <div>
                <div className="text-xl font-black gold-shimmer">
                  $MUNDIAL
                </div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase">
                  {t.nav.subtitle}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t.footer.brand}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3 text-gold" />
              <span>{t.footer.builtOn}</span>
              <span>&#183;</span>
              <span>{t.footer.liveOn}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t.footer.navigation}
            </h4>
            <div className="space-y-2">
              {[
                { label: t.footer.links.predictions, href: "#predicciones" },
                { label: t.footer.links.ranking, href: "#ranking" },
                { label: t.footer.links.tokenInfo, href: "#token" },
                { label: t.footer.links.buyToken, href: "https://pump.fun" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors duration-300 group"
                >
                  {link.label}
                  {link.href.startsWith("http") && (
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t.footer.community}
            </h4>
            <div className="space-y-3">
              {[
                {
                  icon: <MessageCircle className="w-4 h-4" />,
                  label: t.footer.social.telegram,
                  href: "#",
                  color: "hover:text-blue-400",
                },
                {
                  icon: <Share2 className="w-4 h-4" />,
                  label: t.footer.social.twitter,
                  href: "#",
                  color: "hover:text-sky-400",
                },
                {
                  icon: <ExternalLink className="w-4 h-4" />,
                  label: t.footer.social.pumpfun,
                  href: "https://pump.fun",
                  color: "hover:text-gold",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-sm text-muted-foreground ${social.color} transition-colors duration-300`}
                >
                  {social.icon}
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              {t.footer.copyright}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {t.footer.madeWith}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
