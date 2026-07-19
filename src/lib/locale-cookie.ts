import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/** Persist the visitor's locale override (client-side). */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
