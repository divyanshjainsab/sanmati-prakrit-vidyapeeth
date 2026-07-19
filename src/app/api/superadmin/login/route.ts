import { NextResponse } from "next/server";
import { verifySuperCredentials, superLoginCookie, superAdminHostAllowed } from "@/lib/superadmin";
import { credentialsSchema } from "@/lib/auth";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";
import { clientIpFromRequest } from "@/lib/request-ip";

export async function POST(req: Request) {
  if (!superAdminHostAllowed(req)) {
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
