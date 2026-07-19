import { describe, it, expect, vi, beforeEach } from "vitest";

const findById = vi.fn();

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/SiteConfig", () => ({
  default: { findById: (...args: unknown[]) => findById(...args) },
}));

describe("getSiteConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    findById.mockReset();
  });

  it("always reflects the latest document — no stale in-memory cache across calls", async () => {
    const lean = vi.fn();
    findById.mockReturnValue({ lean });
    lean.mockResolvedValueOnce({ _id: "main", meta: { name: "Old Name" } });
    lean.mockResolvedValueOnce({ _id: "main", meta: { name: "New Name" } });

    const { getSiteConfig } = await import("./site-config");

    const first = await getSiteConfig();
    expect(first.meta.name).toBe("Old Name");

    // No explicit invalidation call — a second call must still hit the DB
    // and reflect whatever was written in between (e.g. an admin save from
    // a different Next.js router layer), not a cached copy from the first call.
    const second = await getSiteConfig();
    expect(second.meta.name).toBe("New Name");
    expect(findById).toHaveBeenCalledTimes(2);
  });

  it("throws SiteConfigNotFoundError when the document doesn't exist", async () => {
    const lean = vi.fn().mockResolvedValue(null);
    findById.mockReturnValue({ lean });

    const { getSiteConfig, SiteConfigNotFoundError } = await import("./site-config");

    await expect(getSiteConfig("ghost")).rejects.toBeInstanceOf(SiteConfigNotFoundError);
  });
});
