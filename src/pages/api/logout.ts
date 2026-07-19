import type { NextApiRequest, NextApiResponse } from "next";
import { logoutCookie } from "@/lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", logoutCookie());
  res.status(200).json({ success: true });
}
