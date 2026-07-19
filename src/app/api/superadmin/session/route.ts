import { NextResponse } from "next/server";
import { isSuperAdminFromCookieHeader } from "@/lib/superadmin";
import { isAdminHost } from "@/lib/tenant";

export async function GET(req: Request) {
  if (!isAdminHost(req.headers.get("host"))) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    data: { authenticated: isSuperAdminFromCookieHeader(req.headers.get("cookie")) },
  });
}
