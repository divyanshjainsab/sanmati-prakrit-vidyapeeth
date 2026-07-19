import { NextResponse } from "next/server";
import { verifySuperCredentials, superLoginCookie } from "@/lib/superadmin";
import { isAdminHost } from "@/lib/tenant";
import { credentialsSchema } from "@/lib/auth";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";
import { clientIpFromRequest } from "@/lib/request-ip";

export async function POST(req: Request) {
  if (!isAdminHost(req.headers.get("host"))) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const rateKey = `super:${clientIpFromRequest(req)}`;
  if (isRateLimited(rateKey)) {
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  if (verifySuperCredentials(parsed.data.username, parsed.data.password)) {
    clearAttempts(rateKey);
    const res = NextResponse.json({ success: true });
    res.headers.set("Set-Cookie", superLoginCookie());
    return res;
  }

  recordFailedAttempt(rateKey);
  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
