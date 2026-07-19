/**
 * When enabled, the super-admin panel is reachable at `/superadmin` (and
 * `/api/superadmin/*`) on ANY host, not only the `admin.<root>` subdomain —
 * useful where you can't have an admin subdomain (e.g. a *.vercel.app URL).
 * Access is still gated by the super-admin login; this only lifts the
 * host/path restriction.
 *
 * Edge-safe (no imports) so it can be used from middleware. Because middleware
 * runs in the Edge runtime, this value is read at BUILD time — set it in the
 * environment before building/deploying.
 */
export function isSuperAdminPathAccessEnabled(): boolean {
  const value = process.env.SUPERADMIN_PATH_ACCESS;
  return value === "1" || value === "true";
}
