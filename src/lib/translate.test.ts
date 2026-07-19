import { describe, it, expect, beforeEach } from "vitest";
import { getTranslationProvider, isTranslationConfigured } from "./translate";

describe("translate provider selection", () => {
  beforeEach(() => {
    delete process.env.TRANSLATION_PROVIDER;
    delete process.env.TRANSLATION_URL;
  });

  it("is not configured by default and returns a no-op provider", async () => {
    expect(isTranslationConfigured()).toBe(false);
    const provider = getTranslationProvider();
    // no-op returns the source text unchanged
    expect(await provider.translate("नमस्ते", "hi", "en")).toBe("नमस्ते");
  });

  it("reports configured when libretranslate + URL are set", () => {
    process.env.TRANSLATION_PROVIDER = "libretranslate";
    process.env.TRANSLATION_URL = "http://localhost:5000";
    expect(isTranslationConfigured()).toBe(true);
  });

  it("stays unconfigured if URL is missing", () => {
    process.env.TRANSLATION_PROVIDER = "libretranslate";
    expect(isTranslationConfigured()).toBe(false);
  });
});
