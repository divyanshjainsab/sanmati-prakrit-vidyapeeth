import { describe, it, expect, vi, beforeEach } from "vitest";

const findById = vi.fn();

vi.mock("@/lib/mongoose", () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/models/PlatformSettings", () => ({
  default: { findById: (...args: unknown[]) => ({ lean: () => findById(...args) }) },
}));

import { getPlatformSettings, platformSettingsSchema } from "./platform-settings";

describe("platform-settings", () => {
  beforeEach(() => findById.mockReset());

  it("returns empty-string defaults when no document exists", async () => {
    findById.mockResolvedValue(null);
    expect(await getPlatformSettings()).toEqual({ copyright: "", enrollNote: "" });
  });

  it("returns stored values when present", async () => {
    findById.mockResolvedValue({ copyright: "© Trust", enrollNote: "Call to enroll" });
    expect(await getPlatformSettings()).toEqual({
      copyright: "© Trust",
      enrollNote: "Call to enroll",
    });
  });

  it("validates the update payload", () => {
    expect(platformSettingsSchema.safeParse({ copyright: "x", enrollNote: "y" }).success).toBe(
      true
    );
    expect(platformSettingsSchema.safeParse({ copyright: 123 }).success).toBe(false);
  });
});
