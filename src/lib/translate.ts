import type { Locale } from "@/lib/i18n";

/**
 * Pluggable machine-translation. Kept behind an interface so the engine can be
 * swapped without touching callers. Default is a no-op (returns source text
 * unchanged) so the app runs with zero external dependencies; set
 * TRANSLATION_PROVIDER=libretranslate + TRANSLATION_URL to enable real
 * translation (any LibreTranslate-compatible endpoint, self-hosted or hosted).
 */
export interface TranslationProvider {
  translate(text: string, source: Locale, target: Locale): Promise<string>;
}

const noopProvider: TranslationProvider = {
  async translate(text) {
    return text;
  },
};

function libreTranslateProvider(url: string, apiKey?: string): TranslationProvider {
  const endpoint = `${url.replace(/\/$/, "")}/translate`;
  return {
    async translate(text, source, target) {
      if (!text.trim() || source === target) return text;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source,
          target,
          format: "text",
          ...(apiKey ? { api_key: apiKey } : {}),
        }),
      });
      if (!res.ok) throw new Error(`Translation request failed: ${res.status}`);
      const data = await res.json();
      return typeof data?.translatedText === "string" ? data.translatedText : text;
    },
  };
}

export function isTranslationConfigured(): boolean {
  return process.env.TRANSLATION_PROVIDER === "libretranslate" && !!process.env.TRANSLATION_URL;
}

export function getTranslationProvider(): TranslationProvider {
  if (isTranslationConfigured()) {
    return libreTranslateProvider(
      process.env.TRANSLATION_URL as string,
      process.env.TRANSLATION_API_KEY
    );
  }
  return noopProvider;
}
