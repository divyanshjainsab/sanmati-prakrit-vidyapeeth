import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/password";

const findById = vi.fn();
vi.mock("@/lib/mongoose", () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/models/Tenant", () => ({
  default: { findById: (...args: unknown[]) => ({ lean: () => findById(...args) }) },
}));

import handler from "@/pages/api/auth";
import { clearAttempts } from "@/lib/rate-limit";

type MockRes = NextApiResponse & { statusCode: number; body: unknown };

function mockRes(): MockRes {
  const res = {} as MockRes;
  res.statusCode = 200;
  res.status = vi.fn((code: number) => {
    res.statusCode = code;
    return res;
  }) as unknown as MockRes["status"];
  res.json = vi.fn((body: unknown) => {
    res.body = body;
    return res;
  }) as unknown as MockRes["json"];
  res.setHeader = vi.fn() as unknown as MockRes["setHeader"];
  return res;
}

// No host header → default tenant "main".
function req(body: unknown, ip: string): NextApiRequest {
  return {
    method: "POST",
    body,
    headers: { "x-forwarded-for": ip },
    socket: {},
  } as unknown as NextApiRequest;
}

describe("POST /api/auth (per-tenant, DB-backed)", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret";
    findById.mockReset();
    findById.mockResolvedValue({
      adminUsername: "admin",
      adminPasswordHash: hashPassword("s3cret"),
    });
  });

  it("sets a session cookie on valid credentials", async () => {
    const ip = "10.0.0.1";
    clearAttempts(`main:${ip}`);
    const res = mockRes();

    await handler(req({ username: "admin", password: "s3cret" }, ip), res);

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", expect.stringContaining("session="));
  });

  it("rejects invalid credentials with 401", async () => {
    const ip = "10.0.0.2";
    clearAttempts(`main:${ip}`);
    const res = mockRes();

    await handler(req({ username: "admin", password: "nope" }, ip), res);

    expect(res.statusCode).toBe(401);
    expect(res.setHeader).not.toHaveBeenCalled();
  });

  it("returns 400 on a malformed body", async () => {
    const ip = "10.0.0.3";
    clearAttempts(`main:${ip}`);
    const res = mockRes();

    await handler(req({ username: "admin" }, ip), res);

    expect(res.statusCode).toBe(400);
  });

  it("locks out with 429 after 5 failed attempts from the same IP", async () => {
    const ip = "10.0.0.4";
    clearAttempts(`main:${ip}`);

    for (let i = 0; i < 5; i++) {
      await handler(req({ username: "admin", password: "wrong" }, ip), mockRes());
    }

    const res = mockRes();
    await handler(req({ username: "admin", password: "s3cret" }, ip), res);

    expect(res.statusCode).toBe(429);
  });

  it("rejects non-POST methods with 405", async () => {
    const res = mockRes();
    const r = { method: "GET", headers: {}, socket: {} } as unknown as NextApiRequest;

    await handler(r, res);

    expect(res.statusCode).toBe(405);
  });
});
