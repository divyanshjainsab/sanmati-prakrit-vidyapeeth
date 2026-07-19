import { z } from "zod";
import dbConnect from "@/lib/mongoose";
import PlatformSettingsModel from "@/models/PlatformSettings";

export const PLATFORM_ID = "platform";

export type PlatformSettings = {
  copyright: string;
  enrollNote: string;
};

export const platformSettingsSchema = z.object({
  copyright: z.string().max(500).optional(),
  enrollNote: z.string().max(500).optional(),
});

type PlatformDoc = { copyright?: string; enrollNote?: string } | null;

function normalize(doc: PlatformDoc): PlatformSettings {
  return { copyright: doc?.copyright ?? "", enrollNote: doc?.enrollNote ?? "" };
}

/** The shared platform settings, with empty-string defaults when unset. */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  await dbConnect();
  const doc = await PlatformSettingsModel.findById(PLATFORM_ID).lean<PlatformDoc>();
  return normalize(doc);
}

export { normalize as normalizePlatformSettings };
