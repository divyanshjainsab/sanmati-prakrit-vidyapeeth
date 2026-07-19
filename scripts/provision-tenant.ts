/**
 * Provision (create or update) a tenant: its admin login + a default site
 * config so the subdomain renders immediately.
 *
 *   npm run provision-tenant -- --slug=acme --name="Acme Jain Sangh" \
 *     --username=admin --password='a-strong-password'
 *
 * Flags may also be supplied via env: TENANT_SLUG, TENANT_NAME,
 * TENANT_USERNAME, TENANT_PASSWORD.
 */
import mongoose from "mongoose";
import Tenant from "@/models/Tenant";
import SiteConfigModel from "@/models/SiteConfig";
import { hashPassword } from "@/lib/password";
import { isValidTenantSlug } from "@/lib/tenant";
import { buildDefaultSiteConfig } from "@/lib/site-config";

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = "true";
      }
    }
  }
  return out;
}

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const slug = args.slug ?? process.env.TENANT_SLUG ?? "";
  const name = args.name ?? process.env.TENANT_NAME ?? slug;
  const username = args.username ?? process.env.TENANT_USERNAME ?? "";
  const password = args.password ?? process.env.TENANT_PASSWORD ?? "";

  if (!slug || !username || !password) {
    console.error("Required: --slug, --username, --password (see script header).");
    process.exit(1);
  }
  if (!isValidTenantSlug(slug)) {
    console.error(`Invalid tenant slug "${slug}" (must be a DNS-safe, non-reserved subdomain).`);
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  await Tenant.findByIdAndUpdate(
    slug,
    { $set: { name, adminUsername: username, adminPasswordHash: hashPassword(password) } },
    { upsert: true, new: true }
  );
  console.log(`Provisioned tenant "${slug}" (admin: ${username}).`);

  const existingConfig = await SiteConfigModel.findById(slug);
  if (existingConfig) {
    console.log(`SiteConfig for "${slug}" already exists — left unchanged.`);
  } else {
    await SiteConfigModel.create(buildDefaultSiteConfig(slug, name));
    console.log(`Created default SiteConfig for "${slug}".`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Provisioning failed:", err);
  process.exit(1);
});
