import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/Tenant";
import SiteConfigModel from "@/models/SiteConfig";
import Image from "@/models/Image";
import { requireSuperAdmin } from "@/lib/superadmin";
import { hashPassword } from "@/lib/password";

type Params = { params: Promise<{ slug: string }> };

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  enabled: z.boolean().optional(),
});

type TenantRow = { name: string; adminUsername: string; enabled?: boolean } | null;

export async function PATCH(req: Request, { params }: Params) {
  const blocked = requireSuperAdmin(req);
  if (blocked) return blocked;

  const { slug } = await params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid update payload" },
      { status: 400 }
    );
  }

  const set: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) set.name = parsed.data.name;
  if (parsed.data.username !== undefined) set.adminUsername = parsed.data.username;
  if (parsed.data.password !== undefined)
    set.adminPasswordHash = hashPassword(parsed.data.password);
  if (parsed.data.enabled !== undefined) set.enabled = parsed.data.enabled;

  if (Object.keys(set).length === 0) {
    return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
  }

  await dbConnect();
  const updated = await Tenant.findByIdAndUpdate(slug, { $set: set }, { new: true })
    .select("name adminUsername enabled")
    .lean<TenantRow>();

  if (!updated) {
    return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      slug,
      name: updated.name,
      adminUsername: updated.adminUsername,
      enabled: updated.enabled !== false,
    },
  });
}

export async function DELETE(req: Request, { params }: Params) {
  const blocked = requireSuperAdmin(req);
  if (blocked) return blocked;

  const { slug } = await params;

  await dbConnect();
  const deleted = await Tenant.findByIdAndDelete(slug);
  if (!deleted) {
    return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
  }

  // Remove the tenant's site content too (Cloudinary assets are left as-is).
  await SiteConfigModel.findByIdAndDelete(slug);
  await Image.deleteMany({ tenant: slug });

  return NextResponse.json({ success: true });
}
