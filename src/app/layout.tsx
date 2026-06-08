import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$MUNDIAL | Mundial Predict - Predict, Win & Conquer",
  description:
    "The World Cup prediction platform where every correct pick earns you $MUNDIAL tokens. Connect your Solana wallet, predict matches and win crypto rewards.",
  keywords: [
    "MUNDIAL",
    "Solana",
    "crypto",
    "pump.fun",
    "memecoin",
    "football",
    "soccer",
    "World Cup",
    "predictions",
    "token",
    "2026",
  ],
  icons: {
    icon: "/token-icon.png",
  },
  openGraph: {
    title: "$MUNDIAL | Mundial Predict",
    description: "Predict, Win & Conquer - The World Cup Token on Solana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "$MUNDIAL | Mundial Predict",
    description: "Predict, Win & Conquer - The World Cup Token on Solana",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#050a05", color: "#f0f5e8" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
