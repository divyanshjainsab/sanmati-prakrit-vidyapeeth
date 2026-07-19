import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoose";
import SiteConfig from "@/models/SiteConfig";
import { isAuthenticatedFromCookies } from "@/lib/auth";
import { siteConfigInputSchema } from "@/lib/site-config";
import { tenantFromHost } from "@/lib/tenant";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { buildContentTranslations } from "@/lib/localize";
import { getTranslationProvider, isTranslationConfigured } from "@/lib/translate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenant = tenantFromHost(req.headers.host);

  if (!isAuthenticatedFromCookies(req.cookies, tenant)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  await dbConnect();

  if (req.method === "GET") {
    const config = await SiteConfig.findById(tenant).lean();

    if (!config) {
      return res.status(404).json({ success: false, message: "SiteConfig not found" });
    }

    return res.status(200).json({ success: true, data: config });
  }

  if (req.method === "POST") {
    const parsed = siteConfigInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid config payload",
        issues: parsed.error.issues,
      });
    }

    const data = parsed.data;

    // Auto-translate the tenant's text content into the other locales on save
    // (only when a translation provider is configured; otherwise the site falls
    // back to the source language). Stored under preferences.i18n as an overlay.
    if (isTranslationConfigured()) {
      const prefLocale = (data.preferences as { locale?: unknown } | undefined)?.locale;
      const source = isLocale(prefLocale) ? prefLocale : DEFAULT_LOCALE;
      try {
        const i18n = await buildContentTranslations(data, source, getTranslationProvider());
        data.preferences = { ...(data.preferences ?? {}), i18n };
      } catch (err) {
        console.error("Auto-translation failed; saving without translations", err);
      }
    }

    // The tenant (subdomain) is the config id — never trust a client-supplied _id.
    const config = await SiteConfig.findByIdAndUpdate(
      tenant,
      { $set: data },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: config });
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}
