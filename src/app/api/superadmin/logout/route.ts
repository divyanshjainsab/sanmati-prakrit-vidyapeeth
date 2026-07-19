import { NextResponse } from "next/server";
import { superLogoutCookie, superAdminHostAllowed } from "@/lib/superadmin";

export async function POST(req: Request) {
  if (!superAdminHostAllowed(req)) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  const res = NextResponse.json({ success: true });
  res.headers.set("Set-Cookie", superLogoutCookie());
  return res;
}
