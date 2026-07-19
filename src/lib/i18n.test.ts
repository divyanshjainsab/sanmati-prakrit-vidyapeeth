import { describe, it, expect } from "vitest";
import { resolveLocale, isLocale, getMessages, DEFAULT_LOCALE } from "./i18n";

describe("i18n", () => {
  it("defaults to Hindi", () => {
    expect(DEFAULT_LOCALE).toBe("hi");
  });

  it("resolveLocale precedence: cookie override → tenant default → hi", () => {
    expect(resolveLocale("en", "hi")).toBe("en"); // cookie wins
    expect(resolveLocale(undefined, "en")).toBe("en"); // tenant default
    expect(resolveLocale(undefined, undefined)).toBe("hi"); // fallback
    expect(resolveLocale("xx", "yy")).toBe("hi"); // invalid values ignored
  });

  it("isLocale validates supported locales", () => {
    expect(isLocale("hi")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it("getMessages returns the right catalog", () => {
    expect(getMessages("hi").gallery.loadMore).toBe("और देखें");
    expect(getMessages("en").gallery.loadMore).toBe("Load more");
  });
});
