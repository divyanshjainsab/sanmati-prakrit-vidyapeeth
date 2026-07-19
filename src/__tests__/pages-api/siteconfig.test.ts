import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";

const findById = vi.fn();
const findByIdAndUpdate = vi.fn();

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/SiteConfig", () => ({
  default: {
    findById: (...args: unknown[]) => findById(...args),
    findByIdAndUpdate: (...args: unknown[]) => findByIdAndUpdate(...args),
  },
}));

import handler from "@/pages/api/siteconfig";
import { signSession } from "@/lib/session";

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
  return res;
}

// No host header on the mock req → default tenant "main"; a valid session for
// "main" authenticates these requests.
let AUTH_COOKIE: Record<string, string>;

const validConfig = {
  meta: { name: "Site", logo: { src: "/l.png", alt: "logo" } },
  contact: { phone: "123", whatsapp: { url: "https://wa.me/1", label: "WA" } },
  hero: { mobile: [], desktop: [], interval: 2500 },
  navigation: [],
  textSections: [],
  socials: [],
};

function req(
  method: string,
  opts: { cookies?: Record<string, string>; body?: unknown }
): NextApiRequest {
  return {
    method,
    headers: {},
    cookies: opts.cookies ?? {},
    body: opts.body,
  } as unknown as NextApiRequest;
}

describe("/api/siteconfig", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret";
    AUTH_COOKIE = { session: signSession("main") };
    findById.mockReset();
    findByIdAndUpdate.mockReset();
  });

  it("returns 401 without a session cookie", async () => {
    const res = mockRes();
    await handler(req("GET", {}), res);
    expect(res.statusCode).toBe(401);
  });

  it("GET returns the config document when it exists", async () => {
    findById.mockReturnValue({ lean: () => Promise.resolve({ _id: "main", ...validConfig }) });
    const res = mockRes();

    await handler(req("GET", { cookies: AUTH_COOKIE }), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: { _id: "main" } });
  });

  it("GET returns 404 when no config exists", async () => {
    findById.mockReturnValue({ lean: () => Promise.resolve(null) });
    const res = mockRes();

    await handler(req("GET", { cookies: AUTH_COOKIE }), res);

    expect(res.statusCode).toBe(404);
  });

  it("POST rejects an invalid payload with 400", async () => {
    const res = mockRes();

    await handler(req("POST", { cookies: AUTH_COOKIE, body: { meta: { name: "" } } }), res);

    expect(res.statusCode).toBe(400);
    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("POST upserts against the fixed 'main' id with $set, ignoring any client _id", async () => {
    findByIdAndUpdate.mockResolvedValue({ _id: "main", ...validConfig });
    const res = mockRes();

    await handler(
      req("POST", { cookies: AUTH_COOKIE, body: { _id: "attacker", ...validConfig } }),
      res
    );

    expect(res.statusCode).toBe(200);
    const [id, update] = findByIdAndUpdate.mock.calls[0];
    expect(id).toBe("main");
    expect(update).toHaveProperty("$set");
    expect((update.$set as { _id?: string })._id).toBeUndefined();
  });

  it("rejects unsupported methods with 405", async () => {
    const res = mockRes();
    await handler(req("DELETE", { cookies: AUTH_COOKIE }), res);
    expect(res.statusCode).toBe(405);
  });
});
