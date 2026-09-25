"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale, dict } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-text-primary hover:border-primary transition"
    >
      <Languages className="h-3.5 w-3.5" />
      {dict.common.languageToggleLabel}
    </button>
  );
}
