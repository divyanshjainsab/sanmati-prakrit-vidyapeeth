import { describe, it, expect, vi, beforeEach } from "vitest";

const connect = vi.fn();

vi.mock("mongoose", () => ({
  default: { connect: (...args: unknown[]) => connect(...args) },
}));

describe("dbConnect", () => {
  beforeEach(() => {
    vi.resetModules();
    connect.mockReset();
    delete (global as { mongooseCache?: unknown }).mongooseCache;
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
  });

  it("retries after a failed connection instead of caching the rejection forever", async () => {
    connect.mockRejectedValueOnce(new Error("connection refused"));
    connect.mockResolvedValueOnce({ connection: "ok" });

    const { default: dbConnect } = await import("./mongoose");

    await expect(dbConnect()).rejects.toThrow("connection refused");
    await expect(dbConnect()).resolves.toEqual({ connection: "ok" });

    expect(connect).toHaveBeenCalledTimes(2);
  });

  it("reuses the cached connection on subsequent calls", async () => {
    connect.mockResolvedValueOnce({ connection: "ok" });

    const { default: dbConnect } = await import("./mongoose");

    await dbConnect();
    await dbConnect();

    expect(connect).toHaveBeenCalledTimes(1);
  });
});
