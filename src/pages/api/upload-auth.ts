import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.setHeader(
      "Set-Cookie",
      "upload_auth=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400"
    );
    return res.status(200).json({ success: true });
  }

  res.status(401).json({ error: "Invalid credentials" });
}
