"use client";

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Zap, Wallet, TrendingUp, Users, Shield } from "lucide-react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/i18n/LanguageContext";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

// Client-only floating particles to avoid hydration mismatch
const FloatingParticles: FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 1200,
    y: Math.random() * 800,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-gold/40"
          initial={{ x: p.x, y: p.y, opacity: 0 }}
          animate={{ y: [p.y, p.y - 200, p.y - 600], opacity: [0, 0.8, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: FC<AnimatedCounterProps> = ({
  target,
  suffix = "",
  prefix = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const HeroSection: FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Trophy,
      value: 72,
      suffix: "",
      label: t.hero.stats.groupMatches,
      color: "text-gold",
    },
    {
      icon: Users,
      value: 48,
      suffix: "",
      label: t.hero.stats.nationalTeams,
      color: "text-neon-green",
    },
    {
      icon: Zap,
      value: 12,
      suffix: "",
      label: t.hero.stats.groups,
      color: "text-gold-light",
    },
    {
      icon: TrendingUp,
      value: 104,
      suffix: "",
      label: t.hero.stats.totalMatches,
      color: "text-neon-green",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 gradient-bg" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-premium-black/50 to-premium-black" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gold/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-sm font-medium text-gold">
            {t.hero.badge}
          </span>
          <span className="text-sm text-muted-foreground">
            | {t.hero.badgeHosts}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4"
        >
          <span className="gold-shimmer">{t.hero.heading.split(".")[0]}</span>
          <br />
          {t.hero.heading.split(".").slice(1).map((part, i) => (
            <span key={i}>
              <span className="text-foreground">{part}</span>
              <span className="text-gold">.</span>
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          {t.hero.subtitle.replace("{token}", "$MUNDIAL")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#predicciones"
            className="group relative px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(212,160,23,0.5)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 text-premium-black flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {t.hero.cta}
            </span>
          </a>

          <div className="wallet-btn-hero">
            <WalletMultiButton />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
              className="glass-card rounded-2xl p-4 md:p-6 text-center premium-border transition-all duration-300"
            >
              <stat.icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 ${stat.color}`} />
              <div
                className={`text-xl md:text-3xl font-black ${stat.color}`}
              >
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ""}
                />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold/60" />
            <span>{t.hero.trust.security}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gold/60" />
            <span>{t.hero.trust.wallet}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold/60" />
            <span>{t.hero.trust.network}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
