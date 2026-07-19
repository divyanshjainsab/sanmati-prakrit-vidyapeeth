import { describe, it, expect } from "vitest";
import { localizeSiteConfig, buildContentTranslations, contentSourceLocale } from "./localize";
import type { TranslationProvider } from "./translate";
import type { SiteConfig } from "@/types/site-config";

const baseSite: SiteConfig = {
  _id: "acme",
  meta: { name: "Acme", logo: { src: "/l.png", alt: "logo" } },
  contact: { phone: "1", whatsapp: { url: "", label: "WA" } },
  hero: { mobile: [], desktop: [], interval: 2500 },
  video: { url: "", title: "Story", description: "About us" },
  navigation: [{ label: "Home", href: "/" }],
  textSections: [{ heading: "Welcome", paragraph: "Hello" }],
  socials: [],
  preferences: {},
};

// A fake provider that tags text with the target locale, so tests are deterministic.
const fakeProvider: TranslationProvider = {
  async translate(text, _source, target) {
    return `[${target}] ${text}`;
  },
};

describe("contentSourceLocale", () => {
  it("defaults to hi when unset", () => {
    expect(contentSourceLocale(baseSite)).toBe("hi");
  });
  it("reads the tenant's chosen locale", () => {
    expect(contentSourceLocale({ preferences: { locale: "en" } })).toBe("en");
  });
});

describe("buildContentTranslations", () => {
  it("translates every localizable field into non-source locales", async () => {
    const overlays = await buildContentTranslations(baseSite, "hi", fakeProvider);
    // source is hi → only en overlay produced
    expect(overlays.hi).toBeUndefined();
    expect(overlays.en?.metaName).toBe("[en] Acme");
    expect(overlays.en?.nav?.[0]).toBe("[en] Home");
    expect(overlays.en?.textSections?.[0]?.heading).toBe("[en] Welcome");
    expect(overlays.en?.video?.title).toBe("[en] Story");
  });
});

describe("localizeSiteConfig", () => {
  it("returns the base config for the source locale", () => {
    const localized = localizeSiteConfig(baseSite, "hi");
    expect(localized.meta.name).toBe("Acme");
  });

  it("overlays translated content for a non-source locale", () => {
    const site: SiteConfig = {
      ...baseSite,
      preferences: {
        locale: "hi",
        i18n: {
          en: {
            metaName: "Acme (EN)",
            nav: ["Home (EN)"],
            textSections: [{ heading: "Welcome (EN)" }],
            video: { title: "Story (EN)" },
          },
        },
      },
    };
    const localized = localizeSiteConfig(site, "en");
    expect(localized.meta.name).toBe("Acme (EN)");
    expect(localized.navigation[0].label).toBe("Home (EN)");
    expect(localized.textSections[0].heading).toBe("Welcome (EN)");
    expect(localized.textSections[0].paragraph).toBe("Hello"); // untranslated field falls back
    expect(localized.video?.title).toBe("Story (EN)");
  });

  it("falls back to base content when no overlay exists for the locale", () => {
    const localized = localizeSiteConfig({ ...baseSite, preferences: { locale: "hi" } }, "en");
    expect(localized.meta.name).toBe("Acme");
  });
});
