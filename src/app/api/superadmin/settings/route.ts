import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PlatformSettingsModel from "@/models/PlatformSettings";
import { requireSuperAdmin } from "@/lib/superadmin";
import {
  PLATFORM_ID,
  platformSettingsSchema,
  normalizePlatformSettings,
} from "@/lib/platform-settings";

type PlatformDoc = { copyright?: string; enrollNote?: string } | null;

export async function GET(req: Request) {
  const blocked = requireSuperAdmin(req);
  if (blocked) return blocked;

  await dbConnect();
  const doc = await PlatformSettingsModel.findById(PLATFORM_ID).lean<PlatformDoc>();
  return NextResponse.json({ success: true, data: normalizePlatformSettings(doc) });
}

export async function PATCH(req: Request) {
  const blocked = requireSuperAdmin(req);
  if (blocked) return blocked;

  const parsed = platformSettingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid settings" }, { status: 400 });
  }

  await dbConnect();
  const doc = await PlatformSettingsModel.findByIdAndUpdate(
    PLATFORM_ID,
    { $set: parsed.data },
    { new: true, upsert: true }
  ).lean<PlatformDoc>();

  return NextResponse.json({ success: true, data: normalizePlatformSettings(doc) });
}
