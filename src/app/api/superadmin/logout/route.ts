import { NextResponse } from "next/server";
import { superLogoutCookie } from "@/lib/superadmin";
import { isAdminHost } from "@/lib/tenant";

export async function POST(req: Request) {
  if (!isAdminHost(req.headers.get("host"))) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  const res = NextResponse.json({ success: true });
  res.headers.set("Set-Cookie", superLogoutCookie());
  return res;
}
