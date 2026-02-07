import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.cookies;
  const authenticated = cookies.upload_auth === "1";
  res.status(200).json({ authenticated });
}
