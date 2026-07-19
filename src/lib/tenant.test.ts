import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { tenantFromHost, isValidTenantSlug, DEFAULT_TENANT } from "./tenant";

describe("tenantFromHost", () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = "example.com";
  });
  afterEach(() => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = ORIGINAL;
  });

  it("resolves a subdomain to its slug", () => {
    expect(tenantFromHost("acme.example.com")).toBe("acme");
    expect(tenantFromHost("acme.example.com:3000")).toBe("acme");
  });

  it("maps apex and www to the default tenant", () => {
    expect(tenantFromHost("example.com")).toBe(DEFAULT_TENANT);
    expect(tenantFromHost("www.example.com")).toBe(DEFAULT_TENANT);
  });

  it("maps reserved subdomains to the default tenant", () => {
    expect(tenantFromHost("api.example.com")).toBe(DEFAULT_TENANT);
    expect(tenantFromHost("admin.example.com")).toBe(DEFAULT_TENANT);
  });

  it("rejects nested / foreign / malformed hosts", () => {
    expect(tenantFromHost("a.b.example.com")).toBe(DEFAULT_TENANT);
    expect(tenantFromHost("acme.otherdomain.com")).toBe(DEFAULT_TENANT);
    expect(tenantFromHost("192.168.0.1")).toBe(DEFAULT_TENANT);
    expect(tenantFromHost(null)).toBe(DEFAULT_TENANT);
    expect(tenantFromHost("")).toBe(DEFAULT_TENANT);
  });

  it("supports lvh.me-style local root domains", () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = "lvh.me";
    expect(tenantFromHost("acme.lvh.me:3000")).toBe("acme");
    expect(tenantFromHost("lvh.me:3000")).toBe(DEFAULT_TENANT);
  });
});

describe("isValidTenantSlug", () => {
  it("accepts DNS-safe slugs", () => {
    expect(isValidTenantSlug("acme")).toBe(true);
    expect(isValidTenantSlug("acme-jain-sangh")).toBe(true);
    expect(isValidTenantSlug("t1")).toBe(true);
  });

  it("rejects reserved, empty, and malformed slugs", () => {
    expect(isValidTenantSlug("www")).toBe(false);
    expect(isValidTenantSlug("api")).toBe(false);
    expect(isValidTenantSlug("-acme")).toBe(false);
    expect(isValidTenantSlug("acme-")).toBe(false);
    expect(isValidTenantSlug("ACME")).toBe(false);
    expect(isValidTenantSlug("a.b")).toBe(false);
    expect(isValidTenantSlug("")).toBe(false);
  });
});
