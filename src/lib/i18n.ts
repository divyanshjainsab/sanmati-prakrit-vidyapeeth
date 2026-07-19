import type { Messages } from "@/lib/messages/types";
import hi from "@/lib/messages/hi";
import en from "@/lib/messages/en";

export const LOCALES = ["hi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

// Hindi is the platform default until a tenant chooses otherwise.
export const DEFAULT_LOCALE: Locale = "hi";
export const LOCALE_COOKIE = "locale";

const CATALOG: Record<Locale, Messages> = { hi, en };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return CATALOG[locale];
}

/** Locale precedence: explicit cookie override → tenant default → Hindi. */
export function resolveLocale(cookieValue?: string | null, tenantLocale?: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  if (isLocale(tenantLocale)) return tenantLocale;
  return DEFAULT_LOCALE;
}
