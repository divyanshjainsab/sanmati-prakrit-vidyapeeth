import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateTenant, loginCookie, credentialsSchema } from "@/lib/auth";
import { isRateLimited, recordFailedAttempt, clearAttempts, getClientIp } from "@/lib/rate-limit";
import { tenantFromHost } from "@/lib/tenant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const tenant = tenantFromHost(req.headers.host);
  // Rate-limit per tenant + IP so one tenant's traffic can't lock out another.
  const rateKey = `${tenant}:${getClientIp(req)}`;

  if (isRateLimited(rateKey)) {
    return res
      .status(429)
      .json({ success: false, message: "Too many login attempts. Try again later." });
  }

  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Invalid request body" });
  }

  const { username, password } = parsed.data;

  if (await authenticateTenant(tenant, username, password)) {
    clearAttempts(rateKey);
    res.setHeader("Set-Cookie", loginCookie(tenant));
    return res.status(200).json({ success: true });
  }

  recordFailedAttempt(rateKey);
  res.status(401).json({ success: false, message: "Invalid credentials" });
}
