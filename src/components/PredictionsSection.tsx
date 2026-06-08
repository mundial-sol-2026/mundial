"use client";

import { FC, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Clock, Users, Star, Zap, ArrowUpRight, Lock, Flame,
} from "lucide-react";
import dynamic from "next/dynamic";
import { allMatches, getGroupLetters } from "@/data/worldcup2026";
import type { MatchData } from "@/data/worldcup2026";
import { useLanguage } from "@/i18n/LanguageContext";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const difficultyColors = {
  easy: "bg-neon-green/10 text-neon-green border-neon-green/20",
  medium: "bg-gold/10 text-gold border-gold/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
};

// Group colors for filter buttons
const groupFilterColors: Record<string, string> = {
  ALL: "bg-gold/15 text-gold border-gold/30 shadow-[0_0_10px_rgba(212,160,23,0.2)]",
};

const PredictionCard: FC<{ match: MatchData; index: number }> = ({
  match,
  index,
}) => {
  const { connected } = useWallet();
  const { t } = useLanguage();
  const [selectedPrediction, setSelectedPrediction] = useState<
    "home" | "draw" | "away" | null
  >(null);

  const handlePredict = (choice: "home" | "draw" | "away") => {
    if (!connected) return;
    setSelectedPrediction(choice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="glass-card premium-border overflow-hidden group hover:shadow-[0_0_40px_rgba(212,160,23,0.08)] transition-all duration-500">
        {/* Match Header */}
        <div className="px-4 md:px-6 pt-4 md:pt-5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="bg-gold/5 text-gold border-gold/20 font-bold"
            >
              {t.predictions.group} {match.group}
            </Badge>
            <Badge
              variant="outline"
              className={
                match.status === "live"
                  ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse"
                  : "bg-muted/50 text-muted-foreground border-muted"
              }
            >
              {match.status === "live" ? (
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {t.predictions.live}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {match.date} {match.time}
                </span>
              )}
            </Badge>
            <Badge
              variant="outline"
              className={difficultyColors[match.difficulty]}
            >
              {t.predictions.difficulty[match.difficulty]}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.predictions.reward}</div>
            <div className="text-sm font-bold text-gold">{match.reward}</div>
          </div>
        </div>

        {/* Teams */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-center gap-3 md:gap-8">
            {/* Home Team */}
            <button
              onClick={() => handlePredict("home")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 rounded-2xl transition-all duration-300 flex-1 cursor-pointer ${
                selectedPrediction === "home"
                  ? "bg-gold/10 border-2 border-gold/40 shadow-[0_0_20px_rgba(212,160,23,0.2)]"
                  : "border-2 border-transparent hover:border-gold/20 hover:bg-gold/5"
              } ${!connected ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="text-3xl md:text-4xl">{match.homeTeam.flag}</span>
              <span className="text-xs md:text-sm font-bold text-center leading-tight">
                {match.homeTeam.name}
              </span>
              {match.status === "finished" && match.homeScore !== undefined && (
                <span className="text-lg font-black text-gold">
                  {match.homeScore}
                </span>
              )}
              {selectedPrediction === "home" && (
                <ArrowUpRight className="w-4 h-4 text-gold" />
              )}
            </button>

            {/* VS / Result */}
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              {match.status === "live" ? (
                <div className="flex items-center gap-2">
                  {match.homeScore !== undefined && (
                    <span className="text-2xl md:text-3xl font-black text-gold">
                      {match.homeScore}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">-</span>
                  {match.awayScore !== undefined && (
                    <span className="text-2xl md:text-3xl font-black text-gold">
                      {match.awayScore}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold-light flex items-center justify-center">
                  <span className="text-xs font-black text-premium-black">
                    VS
                  </span>
                </div>
              )}
              <span className="text-[10px] md:text-xs text-muted-foreground">
                {match.status === "live" ? (
                  <span className="text-red-400">67&apos;</span>
                ) : (
                  <Users className="w-3 h-3 inline mr-1" />
                )}
                {match.totalPredictions.toLocaleString()}
              </span>
            </div>

            {/* Away Team */}
            <button
              onClick={() => handlePredict("away")}
              className={`flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 rounded-2xl transition-all duration-300 flex-1 cursor-pointer ${
                selectedPrediction === "away"
                  ? "bg-gold/10 border-2 border-gold/40 shadow-[0_0_20px_rgba(212,160,23,0.2)]"
                  : "border-2 border-transparent hover:border-gold/20 hover:bg-gold/5"
              } ${!connected ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="text-3xl md:text-4xl">{match.awayTeam.flag}</span>
              <span className="text-xs md:text-sm font-bold text-center leading-tight">
                {match.awayTeam.name}
              </span>
              {match.status === "finished" && match.awayScore !== undefined && (
                <span className="text-lg font-black text-gold">
                  {match.awayScore}
                </span>
              )}
              {selectedPrediction === "away" && (
                <ArrowUpRight className="w-4 h-4 text-gold" />
              )}
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-4 md:pb-5 px-4 md:px-6">
          {/* Draw option */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => handlePredict("draw")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedPrediction === "draw"
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "bg-muted/50 text-muted-foreground border border-transparent hover:border-gold/15 hover:text-foreground"
              } ${!connected ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {t.predictions.draw}
            </button>
          </div>

          {/* Action */}
          {connected ? (
            selectedPrediction ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Button className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-premium-black font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(212,160,23,0.4)] transition-all duration-300">
                  <Trophy className="w-4 h-4 mr-2" />
                  {t.predictions.confirm}
                  <Star className="w-3 h-3 ml-1" />
                </Button>
              </motion.div>
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                <Zap className="w-3 h-3 inline mr-1 text-gold" />
                {t.predictions.selectHint}
              </div>
            )
          ) : (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gold">
                <Lock className="w-4 h-4" />
                {t.predictions.connectWallet}
              </div>
              <div className="flex justify-center">
                <WalletMultiButton />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PredictionsSection: FC = () => {
  const { t } = useLanguage();
  const groupLetters = useMemo(() => getGroupLetters(), []);
  const [selectedGroup, setSelectedGroup] = useState("ALL");

  const filteredMatches = useMemo(() => {
    if (selectedGroup === "ALL") return allMatches;
    return allMatches.filter((m) => m.group === selectedGroup);
  }, [selectedGroup]);

  const totalPreds = useMemo(
    () => allMatches.reduce((sum, m) => sum + m.totalPredictions, 0),
    []
  );

  return (
    <section id="predicciones" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-field-green/30 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <Badge
            variant="outline"
            className="mb-4 bg-gold/5 border-gold/20 text-gold"
          >
            <Trophy className="w-3 h-3 mr-1" />
            {t.predictions.badge}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gold-shimmer">{t.predictions.heading.split(".")[0]}</span>{" "}
            <span className="text-foreground">{t.predictions.heading.split(".")[1] || ""}</span>
            <span className="text-foreground"> </span>
            <span className="text-gold">{t.predictions.heading.split(".")[2] || ""}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base mb-2">
            {t.predictions.subtitle.replace("{token}", "$MUNDIAL")}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3 text-gold" />
            <span>
              <span className="text-gold font-bold">
                {totalPreds.toLocaleString()}
              </span>{" "}
              {t.predictions.totalPredictions}
            </span>
          </div>
        </motion.div>

        {/* Group Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedGroup("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                selectedGroup === "ALL"
                  ? groupFilterColors["ALL"]
                  : "border-gold/10 text-muted-foreground hover:border-gold/25 hover:text-foreground"
              }`}
            >
              {t.predictions.all} ({allMatches.length})
            </button>
            {groupLetters.map((letter) => {
              const count = allMatches.filter((m) => m.group === letter).length;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedGroup(letter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                    selectedGroup === letter
                      ? groupFilterColors["ALL"]
                      : "border-gold/10 text-muted-foreground hover:border-gold/25 hover:text-foreground"
                  }`}
                >
                  {t.predictions.group} {letter} ({count})
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredMatches.map((match, index) => (
            <PredictionCard key={match.id} match={match} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-gold font-bold">{t.predictions.groupStage}</span>{" "}
            <span className="text-gold">&#183;</span>{" "}
            {t.predictions.groupsInfo}{" "}
            <span className="text-gold">&#183;</span>{" "}
            {t.predictions.teamsInfo}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {t.predictions.knockoutNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PredictionsSection;
