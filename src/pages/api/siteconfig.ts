import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoose";
import SiteConfig from "@/models/SiteConfig";

function checkAuth(req: NextApiRequest) {
  return req.cookies?.admin === "1";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAuth(req)) return res.status(401).json({ error: "Unauthorized" });

  await dbConnect();

  if (req.method === "GET") {
    const config = await SiteConfig.findOne({});
    return res.json(config);
  }

  if (req.method === "POST") {
    const data = req.body;
    const config = await SiteConfig.findOneAndUpdate(
      { _id: data._id || "default" },
      data,
      { new: true, upsert: true }
    );
    return res.json(config);
  }

  res.status(405).json({ error: "Method not allowed" });
}
