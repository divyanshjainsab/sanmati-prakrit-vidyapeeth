import { z } from "zod";
import dbConnect from "@/lib/mongoose";
import SiteConfigModel from "@/models/SiteConfig";
import { DEFAULT_TENANT } from "@/lib/tenant";
import { SITE_NAME } from "@/lib/site";
import type { SiteConfig as SiteConfigType } from "@/types/site-config";

/** Thrown when a tenant has no SiteConfig document (e.g. an unprovisioned subdomain). */
export class SiteConfigNotFoundError extends Error {
  constructor(public readonly tenant: string) {
    super(`SiteConfig not found for tenant "${tenant}"`);
    this.name = "SiteConfigNotFoundError";
  }
}

const imageAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
});

export const siteConfigInputSchema = z.object({
  meta: z.object({
    name: z.string().min(1),
    logo: imageAssetSchema,
  }),
  contact: z.object({
    phone: z.string().min(1),
    whatsapp: z.object({
      url: z.string(),
      label: z.string(),
    }),
  }),
  hero: z.object({
    mobile: z.array(imageAssetSchema).default([]),
    desktop: z.array(imageAssetSchema).default([]),
    interval: z.number().positive().optional(),
  }),
  video: z
    .object({
      url: z.string().default(""),
      title: z.string().default(""),
      description: z.string().default(""),
    })
    .optional(),
  navigation: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        icon: z.string().optional(),
        external: z.boolean().optional(),
      })
    )
    .default([]),
  textSections: z
    .array(
      z.object({
        heading: z.string(),
        paragraph: z.string(),
        bgColor: z.string().optional(),
        textColor: z.string().optional(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        className: z.string().optional(),
        boldText: z.string().optional(),
      })
    )
    .default([]),
  socials: z
    .array(
      z.object({
        type: z.enum(["instagram", "facebook", "youtube"]),
        url: z.string(),
      })
    )
    .default([]),
  // Free-form long-tail settings that don't warrant a typed field yet.
  preferences: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Load a tenant's site configuration. Uncached: Next.js compiles the Pages and
 * App routers into separate module layers, so a shared in-memory cache can't be
 * reliably invalidated across them (confirmed in earlier testing). A single
 * indexed findById per render is cheap.
 */
export async function getSiteConfig(tenant: string = DEFAULT_TENANT): Promise<SiteConfigType> {
  await dbConnect();

  const doc = await SiteConfigModel.findById(tenant).lean();
  if (!doc) throw new SiteConfigNotFoundError(tenant);

  return doc as SiteConfigType;
}

/** A minimal valid config for a freshly provisioned tenant. */
export function buildDefaultSiteConfig(tenant: string, name: string = SITE_NAME): SiteConfigType {
  return {
    _id: tenant,
    meta: {
      name,
      logo: { src: "/placeholder-logo.png", alt: "Logo" },
    },
    contact: {
      phone: "+91-0000000000",
      whatsapp: { url: "https://wa.me/910000000000", label: "WhatsApp" },
    },
    hero: { mobile: [], desktop: [], interval: 2500 },
    video: { url: "", title: "", description: "" },
    navigation: [],
    textSections: [],
    socials: [],
    preferences: {},
  };
}
