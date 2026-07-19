import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  verifySuperCredentials,
  superLoginCookie,
  superLogoutCookie,
  isSuperAdminFromCookieHeader,
  isSuperAdminFromCookies,
  superAdminHostAllowed,
} from "./superadmin";

describe("superadmin", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret";
    process.env.SUPERADMIN_USERNAME = "root";
    process.env.SUPERADMIN_PASSWORD = "platform-pass";
  });

  it("accepts the configured super credentials", () => {
    expect(verifySuperCredentials("root", "platform-pass")).toBe(true);
  });

  it("rejects wrong credentials", () => {
    expect(verifySuperCredentials("root", "nope")).toBe(false);
    expect(verifySuperCredentials("someone", "platform-pass")).toBe(false);
  });

  it("refuses login when not configured", () => {
    delete process.env.SUPERADMIN_USERNAME;
    delete process.env.SUPERADMIN_PASSWORD;
    expect(verifySuperCredentials("", "")).toBe(false);
  });

  it("mints a super session recognized by the cookie helpers", () => {
    const setCookie = superLoginCookie();
    expect(setCookie).toContain("super=");
    const token = setCookie.split(";")[0].split("=").slice(1).join("=");

    expect(isSuperAdminFromCookies({ super: token })).toBe(true);
    expect(isSuperAdminFromCookieHeader(`super=${token}`)).toBe(true);
  });

  it("does not accept a tenant session as super-admin", () => {
    // A tenant 'session' cookie must not grant super access.
    expect(isSuperAdminFromCookieHeader("session=whatever")).toBe(false);
    expect(isSuperAdminFromCookies({})).toBe(false);
  });

  it("logoutCookie clears the super cookie", () => {
    expect(superLogoutCookie()).toContain("Max-Age=0");
  });
});

describe("superAdminHostAllowed", () => {
  const reqWithHost = (host: string) => new Request("http://x/", { headers: { host } });

  beforeEach(() => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = "example.com";
    delete process.env.SUPERADMIN_PATH_ACCESS;
  });
  afterEach(() => {
    delete process.env.SUPERADMIN_PATH_ACCESS;
  });

  it("allows the admin subdomain and rejects other hosts by default", () => {
    expect(superAdminHostAllowed(reqWithHost("admin.example.com"))).toBe(true);
    expect(superAdminHostAllowed(reqWithHost("acme.example.com"))).toBe(false);
  });

  it("allows any host when SUPERADMIN_PATH_ACCESS is enabled", () => {
    process.env.SUPERADMIN_PATH_ACCESS = "1";
    expect(superAdminHostAllowed(reqWithHost("acme.example.com"))).toBe(true);
    expect(superAdminHostAllowed(reqWithHost("sanmati-prakrit-vidyapeeth.vercel.app"))).toBe(true);
  });
});
