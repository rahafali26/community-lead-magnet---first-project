"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Dictionary, Locale } from "@/lib/i18n/types";

const STORAGE_KEY = "audit_locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyDocumentDirection(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "ar" || stored === "en") {
        setLocaleState(stored);
        applyDocumentDirection(stored);
      }
    } catch {
      // localStorage unavailable — silently keep the default locale
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    applyDocumentDirection(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict: getDictionary(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
