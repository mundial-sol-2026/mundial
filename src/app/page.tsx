"use client";

import { FC, Suspense } from "react";
import dynamic from "next/dynamic";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PredictionsSection from "@/components/PredictionsSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import TokenSection from "@/components/TokenSection";
import Footer from "@/components/Footer";
// Loading spinner component (no i18n - shown before providers mount)
const LoadingSpinner: FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <img
          src="/token-icon.png"
          alt="Loading"
          className="w-16 h-16 rounded-full animate-spin"
          style={{ animationDuration: "3s", filter: "drop-shadow(0 0 20px rgba(212, 160, 23, 0.5))" }}
        />
      </div>
      <p className="text-gold text-sm font-medium animate-pulse">
        Loading $MUNDIAL...
      </p>
    </div>
  </div>
);

// Home page component
const HomeContent: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PredictionsSection />
        <LeaderboardSection />
        <TokenSection />
      </main>
      <Footer />
    </div>
  );
};

// Main page with providers
const HomePage: FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Providers>
        <HomeContent />
      </Providers>
    </Suspense>
  );
};

export default HomePage;
