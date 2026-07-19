"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { LOCALES, type Locale } from "@/lib/i18n";
import { setLocaleCookie } from "@/lib/locale-cookie";

export default function LanguageToggle() {
  const { locale, messages } = useI18n();
  const router = useRouter();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    setLocaleCookie(next);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label={messages.language.switch}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          className={
            l === locale
              ? "rounded px-2 py-1 text-xs font-semibold bg-saffron-100 text-maroon-900"
              : "rounded px-2 py-1 text-xs font-medium text-maroon-700 hover:bg-saffron-50"
          }
        >
          {messages.language[l]}
        </button>
      ))}
    </div>
  );
}
