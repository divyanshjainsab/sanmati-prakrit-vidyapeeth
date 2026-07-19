/**
 * Tenant resolution — pure, dependency-free so it can run anywhere and be
 * unit-tested. A tenant is identified by its subdomain slug; the apex domain
 * (and localhost, IPs, preview hosts) resolve to the DEFAULT_TENANT so the app
 * keeps working as a single-tenant site until real subdomains are configured.
 *
 * The root domain is configured via NEXT_PUBLIC_ROOT_DOMAIN (e.g. "example.com"
 * in prod, "lvh.me" for local subdomain testing). When unset it falls back to
 * "localhost", which still supports `acme.localhost` in Chromium browsers.
 */
export const DEFAULT_TENANT = "main";

/** The subdomain that serves the platform-wide super-admin panel. */
export const ADMIN_SUBDOMAIN = "admin";

/** Subdomains that must never be treated as a tenant. */
export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  ADMIN_SUBDOMAIN,
  "mail",
  "static",
  "assets",
  "cdn",
]);

// DNS label rules: 1–63 chars, alphanumeric + hyphen, no leading/trailing hyphen.
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function isValidTenantSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && !RESERVED_SUBDOMAINS.has(slug);
}

function rootDomain(): string {
  return (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost").toLowerCase();
}

/**
 * Resolve a tenant slug from a Host header value (with or without a port).
 * Anything that isn't a clean `<slug>.<root>` maps to DEFAULT_TENANT.
 */
export function tenantFromHost(host: string | null | undefined): string {
  if (!host) return DEFAULT_TENANT;

  const hostname = host.split(":")[0].trim().toLowerCase();
  if (!hostname) return DEFAULT_TENANT;

  const root = rootDomain();

  // Apex or www → default site.
  if (hostname === root || hostname === `www.${root}`) return DEFAULT_TENANT;

  // Must be a direct subdomain of the configured root.
  if (!hostname.endsWith(`.${root}`)) return DEFAULT_TENANT;

  const sub = hostname.slice(0, -(root.length + 1));

  // Reject empty, nested (a.b.root), reserved, or malformed subdomains.
  if (!sub || sub.includes(".") || !isValidTenantSlug(sub)) return DEFAULT_TENANT;

  return sub;
}

/** True when the host is the super-admin subdomain (admin.<root>). */
export function isAdminHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const hostname = host.split(":")[0].trim().toLowerCase();
  return hostname === `${ADMIN_SUBDOMAIN}.${rootDomain()}`;
}
