import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import type { Dictionary, Locale } from "@/lib/i18n/types";

const DICTIONARIES: Record<Locale, Dictionary> = { ar, en };

/** Safe to call from both client and server code (no "use client" boundary). */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
