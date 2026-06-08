"use client";

import { FC } from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Award, Medal, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface LeaderboardEntry {
  rank: number;
  name: string;
  wallet: string;
  points: number;
  predictions: number;
  accuracy: number;
  streak: number;
  isUser?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "CryptoMessi10",
    wallet: "DR8k...3xKp",
    points: 48500,
    predictions: 142,
    accuracy: 89,
    streak: 12,
  },
  {
    rank: 2,
    name: "SolanaRonaldo",
    wallet: "7fXm...9qWn",
    points: 42100,
    predictions: 128,
    accuracy: 85,
    streak: 9,
  },
  {
    rank: 3,
    name: "FutbolWhale",
    wallet: "Bp4n...2vLz",
    points: 38700,
    predictions: 115,
    accuracy: 82,
    streak: 7,
  },
  {
    rank: 4,
    name: "TokenNeymar",
    wallet: "Hk9s...6mRt",
    points: 35200,
    predictions: 108,
    accuracy: 79,
    streak: 5,
  },
  {
    rank: 5,
    name: "GoalPredictor",
    wallet: "3Kdv...8nWf",
    points: 31800,
    predictions: 99,
    accuracy: 77,
    streak: 4,
  },
  {
    rank: 6,
    name: "PumpFanatic",
    wallet: "Jx2p...5bQm",
    points: 28400,
    predictions: 95,
    accuracy: 74,
    streak: 3,
  },
  {
    rank: 7,
    name: "MundialHODL",
    wallet: "Rw7n...1cKx",
    points: 25100,
    predictions: 87,
    accuracy: 71,
    streak: 2,
  },
  {
    rank: 8,
    name: "DeFiMbappe",
    wallet: "5Ntq...4dYa",
    points: 22800,
    predictions: 82,
    accuracy: 68,
    streak: 4,
  },
  {
    rank: 9,
    name: "BlockFutbol",
    wallet: "9Ghj...7pEs",
    points: 19500,
    predictions: 76,
    accuracy: 66,
    streak: 2,
  },
  {
    rank: 10,
    name: "AirdropKing",
    wallet: "Tm4w...3jLr",
    points: 16200,
    predictions: 71,
    accuracy: 63,
    streak: 1,
  },
];

const getRankIcon = (rank: number) => {
  if (rank === 1)
    return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
  if (rank === 2)
    return (
      <Medal className="w-5 h-5 text-gray-300 fill-gray-300" />
    );
  if (rank === 3)
    return <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />;
  return (
    <span className="text-sm font-bold text-muted-foreground w-5 text-center">
      {rank}
    </span>
  );
};

const getRankBg = (rank: number) => {
  if (rank === 1)
    return "bg-gradient-to-r from-yellow-900/20 via-yellow-800/10 to-transparent border-yellow-500/30";
  if (rank === 2)
    return "bg-gradient-to-r from-gray-800/20 via-gray-700/10 to-transparent border-gray-500/20";
  if (rank === 3)
    return "bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-transparent border-amber-600/20";
  return "";
};

const AnimatedNumber: FC<{ value: number; suffix?: string }> = ({
  value,
  suffix = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 30;
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

const LeaderboardSection: FC = () => {
  const { t } = useLanguage();

  return (
    <section id="ranking" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-premium-dark to-background" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="mb-4 bg-gold/5 border-gold/20 text-gold"
          >
            <Crown className="w-3 h-3 mr-1" />
            {t.ranking.badge}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gold-shimmer">{t.ranking.heading}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {t.ranking.subtitle.replace("{token}", "$MUNDIAL")}
          </p>
        </motion.div>

        {/* Top 3 podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-3 md:gap-4 mb-8"
        >
          {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map(
            (entry, i) => {
              const isFirst = i === 1;
              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`text-center ${isFirst ? "-mt-4 md:-mt-6" : ""}`}
                >
                  <Card
                    className={`glass-card premium-border p-3 md:p-4 ${
                      isFirst ? "ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,160,23,0.1)]" : ""
                    }`}
                  >
                    <div
                      className={`text-3xl md:text-4xl mb-1 ${
                        isFirst ? "animate-bounce" : ""
                      }`}
                    >
                      {entry.rank === 1
                        ? "👑"
                        : entry.rank === 2
                        ? "🥈"
                        : "🥉"}
                    </div>
                    <div className="text-sm md:text-base font-bold text-foreground truncate">
                      {entry.name}
                    </div>
                    <div className="text-xs text-gold font-bold">
                      <AnimatedNumber value={entry.points} /> pts
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {entry.accuracy}% {t.ranking.precision}
                    </div>
                  </Card>
                </motion.div>
              );
            }
          )}
        </motion.div>

        {/* Full leaderboard */}
        <Card className="glass-card premium-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gold/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">{t.ranking.table.rank}</div>
            <div className="col-span-3">{t.ranking.table.predictor}</div>
            <div className="col-span-2 text-center">{t.ranking.table.points}</div>
            <div className="col-span-2 text-center hidden md:block">
              {t.ranking.table.predictions}
            </div>
            <div className="col-span-2 text-center">{t.ranking.table.accuracy}</div>
            <div className="col-span-2 text-center hidden md:block">
              {t.ranking.table.streak}
            </div>
          </div>

          {/* Table rows */}
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gold/5 last:border-0 transition-all duration-300 hover:bg-gold/5 ${getRankBg(
                entry.rank
              )} ${entry.rank <= 3 ? "font-bold" : ""}`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Name & Wallet */}
              <div className="col-span-3">
                <div className="text-sm text-foreground truncate">
                  {entry.name}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono truncate">
                  {entry.wallet}
                </div>
              </div>

              {/* Points */}
              <div className="col-span-2 text-center">
                <span className="text-sm text-gold font-bold">
                  <AnimatedNumber value={entry.points} />
                </span>
              </div>

              {/* Predictions */}
              <div className="col-span-2 text-center hidden md:block text-sm text-muted-foreground">
                {entry.predictions}
              </div>

              {/* Accuracy */}
              <div className="col-span-2 text-center">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    entry.accuracy >= 80
                      ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                      : entry.accuracy >= 70
                      ? "bg-gold/10 text-gold border-gold/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {entry.accuracy}%
                </Badge>
              </div>

              {/* Streak */}
              <div className="col-span-2 text-center hidden md:block">
                {entry.streak >= 5 ? (
                  <span className="flex items-center justify-center gap-1 text-xs text-orange-400">
                    <TrendingUp className="w-3 h-3" />
                    {entry.streak}🔥
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {entry.streak}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </Card>

        {/* Rewards info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              key: "first" as const,
              icon: <Crown className="w-5 h-5 text-yellow-400" />,
            },
            {
              key: "second" as const,
              icon: <Award className="w-5 h-5 text-gray-300" />,
            },
            {
              key: "third" as const,
              icon: <Star className="w-5 h-5 text-amber-600" />,
            },
          ].map((item) => (
            <Card
              key={item.key}
              className="glass-card premium-border p-4 text-center"
            >
              <div className="flex justify-center mb-2">{item.icon}</div>
              <div className="text-sm font-bold text-foreground mb-1">
                {t.ranking.rewards[item.key].place}
              </div>
              <div className="text-lg font-black text-gold">{t.ranking.rewards[item.key].reward}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t.ranking.rewards[item.key].extra}
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
