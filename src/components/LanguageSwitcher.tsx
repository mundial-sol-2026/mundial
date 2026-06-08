"use client";

import { FC, useState, useRef, useEffect } from "react";
import { useLanguage, type Locale, LOCALE_FLAGS, LOCALE_NAMES } from "@/i18n/LanguageContext";
import { ChevronDown, Globe } from "lucide-react";

const LanguageSwitcher: FC = () => {
  const { locale, setLocale, locales } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentFlag = LOCALE_FLAGS[locale];
  const currentName = LOCALE_NAMES[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
                   border border-gold/15 bg-gold/5 text-muted-foreground
                   hover:border-gold/30 hover:text-foreground hover:bg-gold/10
                   transition-all duration-300 cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-gold" />
        <span className="text-[13px] leading-none">{currentFlag}</span>
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider">{locale}</span>
        <ChevronDown
          className={`w-3 h-3 text-gold/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 min-w-[180px] max-h-[340px] overflow-y-auto rounded-xl
                     glass-card premium-border border-gold/20 z-[100]
                     animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#a67c00 transparent" }}
        >
          {locales.map((l: Locale) => {
            const isActive = l === locale;
            return (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm
                           transition-all duration-200 cursor-pointer
                           ${isActive
                             ? "bg-gold/15 text-gold font-bold"
                             : "text-muted-foreground hover:text-foreground hover:bg-gold/5"
                           }`}
              >
                <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
                <span className="flex-1 text-left text-[13px]">{LOCALE_NAMES[l]}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
