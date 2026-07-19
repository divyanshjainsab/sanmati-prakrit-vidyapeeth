import { describe, it, expect, beforeEach, vi } from "vitest";
import { hashPassword } from "./password";

const findById = vi.fn();

vi.mock("@/lib/mongoose", () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/models/Tenant", () => ({
  default: { findById: (...args: unknown[]) => ({ lean: () => findById(...args) }) },
}));

import {
  authenticateTenant,
  loginCookie,
  logoutCookie,
  isAuthenticatedFromCookies,
  isAuthenticatedFromCookieHeader,
} from "./auth";

describe("auth", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret";
    findById.mockReset();
  });

  describe("authenticateTenant", () => {
    it("accepts the correct username + password for the tenant", async () => {
      findById.mockResolvedValue({ adminUsername: "admin", adminPasswordHash: hashPassword("pw") });
      expect(await authenticateTenant("acme", "admin", "pw")).toBe(true);
    });

    it("rejects a wrong password", async () => {
      findById.mockResolvedValue({ adminUsername: "admin", adminPasswordHash: hashPassword("pw") });
      expect(await authenticateTenant("acme", "admin", "nope")).toBe(false);
    });

    it("rejects a wrong username", async () => {
      findById.mockResolvedValue({ adminUsername: "admin", adminPasswordHash: hashPassword("pw") });
      expect(await authenticateTenant("acme", "someoneelse", "pw")).toBe(false);
    });

    it("rejects when the tenant does not exist", async () => {
      findById.mockResolvedValue(null);
      expect(await authenticateTenant("ghost", "admin", "pw")).toBe(false);
    });
  });

  describe("session cookies", () => {
    it("loginCookie mints a session accepted only for its own tenant", () => {
      const setCookie = loginCookie("acme");
      expect(setCookie).toContain("session=");
      expect(setCookie).toContain("HttpOnly");

      const token = setCookie.split(";")[0].split("=").slice(1).join("=");
      expect(isAuthenticatedFromCookies({ session: token }, "acme")).toBe(true);
      // Same cookie must NOT authenticate a different tenant.
      expect(isAuthenticatedFromCookies({ session: token }, "other")).toBe(false);
    });

    it("isAuthenticatedFromCookieHeader validates the raw Cookie header", () => {
      const token = loginCookie("acme").split(";")[0].split("=").slice(1).join("=");
      expect(isAuthenticatedFromCookieHeader(`session=${token}`, "acme")).toBe(true);
      expect(isAuthenticatedFromCookieHeader(`session=${token}`, "other")).toBe(false);
      expect(isAuthenticatedFromCookieHeader(null, "acme")).toBe(false);
      expect(isAuthenticatedFromCookieHeader("session=garbage", "acme")).toBe(false);
    });

    it("logoutCookie clears the session", () => {
      expect(logoutCookie()).toContain("Max-Age=0");
    });
  });
});
