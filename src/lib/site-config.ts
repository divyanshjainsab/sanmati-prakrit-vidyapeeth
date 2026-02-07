import dbConnect from "@/lib/mongoose";
import SiteConfig from "@/models/SiteConfig";
import type { SiteConfig as SiteConfigType } from "@/types/site-config";

let cached: SiteConfigType | null = null;

export async function getSiteConfig(): Promise<SiteConfigType> {
  if (cached) return cached;

  await dbConnect();

  const doc = await SiteConfig.findById("main").lean();

  if (!doc) {
    throw new Error("SiteConfig document not found");
  }

  cached = doc as SiteConfigType;
  return cached;
}
