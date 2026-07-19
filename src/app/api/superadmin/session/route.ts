import { NextResponse } from "next/server";
import { isSuperAdminFromCookieHeader, superAdminHostAllowed } from "@/lib/superadmin";

export async function GET(req: Request) {
  if (!superAdminHostAllowed(req)) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    data: { authenticated: isSuperAdminFromCookieHeader(req.headers.get("cookie")) },
  });
}
