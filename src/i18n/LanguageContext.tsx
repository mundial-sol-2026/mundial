"use client";

import { FC, ReactNode, createContext, useContext, useState, useCallback, useMemo } from "react";

// ── Types ──
export type Locale = "en" | "es" | "pt" | "de" | "fr" | "vi" | "id" | "fil" | "pcm";

export interface TranslationData {
  nav: Record<string, string>;
  hero: {
    badge: string;
    badgeHosts: string;
    heading: string;
    subtitle: string;
    cta: string;
    stats: Record<string, string>;
    trust: Record<string, string>;
  };
  predictions: {
    badge: string;
    heading: string;
    subtitle: string;
    totalPredictions: string;
    all: string;
    group: string;
    difficulty: Record<string, string>;
    reward: string;
    live: string;
    draw: string;
    confirm: string;
    selectHint: string;
    connectWallet: string;
    groupStage: string;
    groupsInfo: string;
    teamsInfo: string;
    knockoutNote: string;
  };
  ranking: {
    badge: string;
    heading: string;
    subtitle: string;
    table: Record<string, string>;
    precision: string;
    rewards: {
      first: { place: string; reward: string; extra: string };
      second: { place: string; reward: string; extra: string };
      third: { place: string; reward: string; extra: string };
    };
  };
  token: {
    badge: string;
    heading: string;
    subtitle: string;
    network: string;
    price: string;
    buyButton: string;
    features: {
      security: { title: string; description: string };
      community: { title: string; description: string };
      deflationary: { title: string; description: string };
    };
    howToWin: {
      title: string;
      steps: { title: string; description: string }[];
    };
  };
  footer: {
    brand: string;
    builtOn: string;
    liveOn: string;
    navigation: string;
    links: Record<string, string>;
    community: string;
    social: Record<string, string>;
    copyright: string;
    madeWith: string;
  };
  loading: string;
  languageSwitcher: Record<string, string>;
}

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  fr: "Français",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  fil: "Filipino",
  pcm: "Nigerian Pidgin",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  pt: "🇧🇷",
  de: "🇩🇪",
  fr: "🇫🇷",
  vi: "🇻🇳",
  id: "🇮🇩",
  fil: "🇵🇭",
  pcm: "🇳🇬",
};

const ALL_LOCALES: Locale[] = ["en", "es", "pt", "de", "fr", "vi", "id", "fil", "pcm"];

// ── Import translations ──
import en from "./translations/en.json";
import es from "./translations/es.json";
import pt from "./translations/pt.json";
import de from "./translations/de.json";
import fr from "./translations/fr.json";
import vi from "./translations/vi.json";
import id from "./translations/id.json";
import fil from "./translations/fil.json";
import pcm from "./translations/pcm.json";

const translations: Record<Locale, TranslationData> = {
  en: en as TranslationData,
  es: es as TranslationData,
  pt: pt as TranslationData,
  de: de as TranslationData,
  fr: fr as TranslationData,
  vi: vi as TranslationData,
  id: id as TranslationData,
  fil: fil as TranslationData,
  pcm: pcm as TranslationData,
};

// ── Context ──
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationData;
  locales: Locale[];
  localeName: (locale: Locale) => string;
  localeFlag: (locale: Locale) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ── Provider ──
interface LanguageProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({
  children,
  defaultLocale = "en",
}) => {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      document.documentElement.lang = newLocale;
      localStorage.setItem("mundial-locale", newLocale);
    }
  }, []);

  // Restore saved locale on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mundial-locale") as Locale | null;
      if (saved && ALL_LOCALES.includes(saved)) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    }
  });

  const t = useMemo(() => translations[locale], [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      locales: ALL_LOCALES,
      localeName: (l: Locale) => LOCALE_NAMES[l],
      localeFlag: (l: Locale) => LOCALE_FLAGS[l],
    }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// ── Hook ──
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
