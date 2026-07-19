import { headers } from "next/headers";
import { tenantFromHost } from "@/lib/tenant";

/**
 * The tenant for the current App Router request, derived from the Host header.
 * Server-only (uses next/headers). Pages Router handlers resolve the tenant
 * from `req.headers.host` via `tenantFromHost` instead.
 */
export async function getCurrentTenant(): Promise<string> {
  const h = await headers();
  return tenantFromHost(h.get("host"));
}
