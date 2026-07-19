import { describe, it, expect } from "vitest";
import { setIn, pushIn, removeIn } from "./set-in";

describe("setIn", () => {
  it("does not mutate the original object or any nested object/array along the path", () => {
    const original = { hero: { desktop: [{ src: "a" }, { src: "b" }], interval: 2500 } };

    const updated = setIn(original, ["hero", "desktop", "0", "src"], "changed");

    expect(updated.hero.desktop[0].src).toBe("changed");
    // Original must be completely untouched — this is the exact bug that was
    // previously in admin.tsx (mutating prev.hero.desktop in place).
    expect(original.hero.desktop[0].src).toBe("a");
    expect(updated).not.toBe(original);
    expect(updated.hero).not.toBe(original.hero);
    expect(updated.hero.desktop).not.toBe(original.hero.desktop);
  });

  it("sets a value at a single-element array index path (the mobile hero image bug)", () => {
    const original = { hero: { mobile: [{ src: "old", alt: "" }] } };

    const updated = setIn(original, ["hero", "mobile", "0", "src"], "new-url");

    expect(updated.hero.mobile[0].src).toBe("new-url");
    expect(original.hero.mobile[0].src).toBe("old");
  });
});

describe("pushIn", () => {
  it("appends to an array at a path without mutating the original", () => {
    const original = { hero: { desktop: [{ src: "a" }] } };

    const updated = pushIn(original, ["hero", "desktop"], { src: "b" });

    expect(updated.hero.desktop).toHaveLength(2);
    expect(original.hero.desktop).toHaveLength(1);
  });

  it("initializes an empty array when adding the first item (mobile image recovery path)", () => {
    const original = { hero: { mobile: [] as { src: string }[] } };

    const updated = pushIn(original, ["hero", "mobile"], { src: "first" });

    expect(updated.hero.mobile).toEqual([{ src: "first" }]);
  });
});

describe("removeIn", () => {
  it("removes by index without mutating the original array", () => {
    const original = { navigation: [{ label: "A" }, { label: "B" }, { label: "C" }] };

    const updated = removeIn(original, ["navigation"], 1);

    expect(updated.navigation).toEqual([{ label: "A" }, { label: "C" }]);
    expect(original.navigation).toHaveLength(3);
  });
});
