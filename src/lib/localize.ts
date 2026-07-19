import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import type { TranslationProvider } from "@/lib/translate";
import type { SiteConfig } from "@/types/site-config";

/** Per-locale translated copies of a tenant's text content, aligned by index. */
export type ContentOverlay = {
  metaName?: string;
  nav?: string[];
  textSections?: { heading?: string; paragraph?: string; boldText?: string; buttonText?: string }[];
  video?: { title?: string; description?: string };
};

export type TenantPreferences = {
  locale?: Locale;
  i18n?: Partial<Record<Locale, ContentOverlay>>;
  [key: string]: unknown;
};

export function getPreferences(site: Pick<SiteConfig, "preferences">): TenantPreferences {
  return (site.preferences ?? {}) as TenantPreferences;
}

/** The language a tenant authors content in (their default locale). */
export function contentSourceLocale(site: Pick<SiteConfig, "preferences">): Locale {
  const { locale } = getPreferences(site);
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

type LocalizableContent = {
  meta: { name: string };
  navigation: { label: string }[];
  textSections: { heading?: string; paragraph?: string; boldText?: string; buttonText?: string }[];
  video?: { title?: string; description?: string };
};

async function translateOverlay(
  content: LocalizableContent,
  source: Locale,
  target: Locale,
  provider: TranslationProvider
): Promise<ContentOverlay> {
  const tr = (text?: string) =>
    text && text.trim() ? provider.translate(text, source, target) : Promise.resolve(text ?? "");

  return {
    metaName: await tr(content.meta.name),
    nav: await Promise.all(content.navigation.map((n) => tr(n.label))),
    textSections: await Promise.all(
      content.textSections.map(async (s) => ({
        heading: await tr(s.heading),
        paragraph: await tr(s.paragraph),
        boldText: await tr(s.boldText),
        buttonText: await tr(s.buttonText),
      }))
    ),
    video: content.video
      ? { title: await tr(content.video.title), description: await tr(content.video.description) }
      : undefined,
  };
}

/** Build translation overlays for every locale other than the source. */
export async function buildContentTranslations(
  content: LocalizableContent,
  source: Locale,
  provider: TranslationProvider
): Promise<Partial<Record<Locale, ContentOverlay>>> {
  const out: Partial<Record<Locale, ContentOverlay>> = {};
  for (const target of LOCALES) {
    if (target === source) continue;
    out[target] = await translateOverlay(content, source, target, provider);
  }
  return out;
}

/** Return a copy of the config with content overlaid for `locale` (falls back to source). */
export function localizeSiteConfig(site: SiteConfig, locale: Locale): SiteConfig {
  const prefs = getPreferences(site);
  const source = contentSourceLocale(site);
  if (locale === source) return site;

  const overlay = prefs.i18n?.[locale];
  if (!overlay) return site;

  return {
    ...site,
    meta: { ...site.meta, name: overlay.metaName || site.meta.name },
    navigation: site.navigation.map((n, i) => ({ ...n, label: overlay.nav?.[i] || n.label })),
    textSections: site.textSections.map((s, i) => ({
      ...s,
      heading: overlay.textSections?.[i]?.heading || s.heading,
      paragraph: overlay.textSections?.[i]?.paragraph || s.paragraph,
      boldText: overlay.textSections?.[i]?.boldText || s.boldText,
      buttonText: overlay.textSections?.[i]?.buttonText || s.buttonText,
    })),
    video: site.video
      ? {
          ...site.video,
          title: overlay.video?.title || site.video.title,
          description: overlay.video?.description || site.video.description,
        }
      : site.video,
  };
}
