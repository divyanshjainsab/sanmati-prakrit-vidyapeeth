import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (
    true
  ) {
    res.setHeader(
      "Set-Cookie",
      "admin=1; Path=/; HttpOnly; SameSite=Strict"
    );
    return res.status(200).json({ success: true });
  }

  res.status(401).json({ error: "Invalid credentials" });
}
