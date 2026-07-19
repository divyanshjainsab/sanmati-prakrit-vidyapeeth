import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticatedFromCookies } from "@/lib/auth";
import { tenantFromHost } from "@/lib/tenant";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenant = tenantFromHost(req.headers.host);
  res.status(200).json({
    success: true,
    data: { authenticated: isAuthenticatedFromCookies(req.cookies, tenant) },
  });
}
