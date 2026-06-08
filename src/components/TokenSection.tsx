"use client";

import { FC, useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ExternalLink,
  Shield,
  Zap,
  Globe,
  Users,
  BarChart3,
  Flame,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const AnimatedNumber: FC<{ value: number; suffix?: string }> = ({
  value,
  suffix = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const TokenSection: FC = () => {
  const { t } = useLanguage();

  return (
    <section id="token" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-field-green/20 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 bg-gold/5 border-gold/20 text-gold"
          >
            <Zap className="w-3 h-3 mr-1" />
            {t.token.badge}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gold-shimmer">{t.token.heading}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {t.token.subtitle}
          </p>
        </motion.div>

        {/* Token Price Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="glass-card premium-border overflow-hidden pulse-gold">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Token info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="/token-icon.png"
                      alt="$MUNDIAL"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                      style={{
                        filter:
                          "drop-shadow(0 0 20px rgba(212, 160, 23, 0.5))",
                      }}
                    />
                    <div className="absolute -inset-2 rounded-full glow-pulse bg-gold/5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl md:text-3xl font-black gold-shimmer">
                        $MUNDIAL
                      </h3>
                      <Badge className="bg-neon-green/10 text-neon-green border-neon-green/20 text-[10px]">
                        <Flame className="w-2.5 h-2.5 mr-1" />
                        TRENDING
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {t.token.network}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        &#183;
                      </span>
                      <span className="text-xs text-muted-foreground">
                        pump.fun
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Price */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t.token.price}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-foreground">
                    $0.00
                    <AnimatedNumber value={42} suffix="7" />
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-neon-green" />
                    <span className="text-neon-green font-bold text-sm">
                      +850.2%
                    </span>
                    <span className="text-xs text-muted-foreground">24h</span>
                  </div>
                </div>

                {/* Right: Market Data */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      Market Cap
                    </div>
                    <div className="font-bold text-foreground">
                      $<AnimatedNumber value={127} suffix="K" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      Holders
                    </div>
                    <div className="font-bold text-foreground">
                      <AnimatedNumber value={2847} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      Volume 24h
                    </div>
                    <div className="font-bold text-foreground">
                      $<AnimatedNumber value={89} suffix="K" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      Transactions
                    </div>
                    <div className="font-bold text-foreground">
                      <AnimatedNumber value={15623} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://pump.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,160,23,0.4)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #a67c00, #d4a017, #f5d060)",
                  }}
                >
                  <span className="text-premium-black flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5" />
                    {t.token.buyButton}
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tokenomics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[
            {
              icon: <Shield className="w-6 h-6 text-gold" />,
              title: t.token.features.security.title,
              description: t.token.features.security.description,
            },
            {
              icon: <Globe className="w-6 h-6 text-neon-green" />,
              title: t.token.features.community.title,
              description: t.token.features.community.description,
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-gold-light" />,
              title: t.token.features.deflationary.title,
              description: t.token.features.deflationary.description,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="glass-card premium-border p-6 h-full hover:shadow-[0_0_30px_rgba(212,160,23,0.06)] transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gold/10">{item.icon}</div>
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card premium-border p-6 md:p-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                <span className="gold-shimmer text-xl md:text-2xl">
                  {t.token.howToWin.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {t.token.howToWin.steps.map((item, index) => {
                  const icons = [<Users className="w-5 h-5" />, <Zap className="w-5 h-5" />, <TrendingUp className="w-5 h-5" />, <Trophy className="w-5 h-5" />];
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold text-premium-black font-black text-lg mb-3 shadow-[0_0_15px_rgba(212,160,23,0.3)]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="flex justify-center mb-2 text-gold">
                        {icons[index]}
                      </div>
                      <h4 className="text-sm font-bold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TokenSection;
