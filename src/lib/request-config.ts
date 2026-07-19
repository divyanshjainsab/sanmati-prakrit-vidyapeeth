import { notFound } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant-context";
import { getSiteConfig, SiteConfigNotFoundError } from "@/lib/site-config";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/Tenant";
import type { SiteConfig } from "@/types/site-config";

/**
 * Resolve the current request's tenant and load its config. Renders the
 * not-found page (instead of crashing) when the subdomain is unprovisioned or
 * the tenant has been suspended by the super-admin.
 */
export async function getRequestSiteConfig(): Promise<{ tenant: string; site: SiteConfig }> {
  const tenant = await getCurrentTenant();

  // Suspended tenants (enabled === false) are treated as not-found. A tenant
  // with no login document (e.g. a seeded default site) is allowed.
  await dbConnect();
  const status = await Tenant.findById(tenant)
    .select("enabled")
    .lean<{ enabled?: boolean } | null>();
  if (status && status.enabled === false) notFound();

  try {
    const site = await getSiteConfig(tenant);
    return { tenant, site };
  } catch (err) {
    if (err instanceof SiteConfigNotFoundError) notFound();
    throw err;
  }
}
