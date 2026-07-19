import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/Tenant";
import SiteConfigModel from "@/models/SiteConfig";
import { requireSuperAdmin } from "@/lib/superadmin";
import { isValidTenantSlug } from "@/lib/tenant";
import { hashPassword } from "@/lib/password";
import { buildDefaultSiteConfig } from "@/lib/site-config";

type TenantRow = {
  _id: string;
  name: string;
  adminUsername: string;
  enabled?: boolean;
  createdAt?: Date;
};

export async function GET(req: Request) {
  const blocked = requireSuperAdmin(req);
  if (blocked) return blocked;

  await dbConnect();
  const tenants = await Tenant.find()
    .select("name adminUsername enabled createdAt")
    .sort({ _id: 1 })
    .lean<TenantRow[]>();

  return NextResponse.json({
    success: true,
    data: tenants.map((t) => ({
      slug: t._id,
      name: t.name,
      adminUsername: t.adminUsername,
      enabled: t.enabled !== false,
      createdAt: t.createdAt,
    })),
  });
}

const createSchema = z.object({
  slug: z.string(),
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const blocked = requireSuperAdmin(req);
  if (blocked) return blocked;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid tenant payload" },
      { status: 400 }
    );
  }

  const { slug, name, username, password } = parsed.data;
  if (!isValidTenantSlug(slug)) {
    return NextResponse.json(
      { success: false, message: "Invalid slug (must be a DNS-safe, non-reserved subdomain)" },
      { status: 400 }
    );
  }

  await dbConnect();
  if (await Tenant.findById(slug)) {
    return NextResponse.json({ success: false, message: "Tenant already exists" }, { status: 409 });
  }

  await Tenant.create({
    _id: slug,
    name,
    adminUsername: username,
    adminPasswordHash: hashPassword(password),
    enabled: true,
  });

  if (!(await SiteConfigModel.findById(slug))) {
    await SiteConfigModel.create(buildDefaultSiteConfig(slug, name));
  }

  return NextResponse.json(
    { success: true, data: { slug, name, adminUsername: username, enabled: true } },
    { status: 201 }
  );
}
