import dbConnect from "@/lib/mongoose";
import Image from "@/models/Image";
import { apiOk, apiError } from "@/lib/api-response";
import { tenantFromHost } from "@/lib/tenant";

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 100;

export async function GET(req: Request) {
  try {
    await dbConnect();

    const tenant = tenantFromHost(req.headers.get("host"));
    const { searchParams } = new URL(req.url);
    const page = Math.max(0, Number(searchParams.get("page")) || 0);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE)
    );

    const images = await Image.find({ tenant })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit + 1)
      .lean();

    const hasMore = images.length > limit;
    const data = hasMore ? images.slice(0, limit) : images;

    return apiOk({ data, page, hasMore });
  } catch (err) {
    console.error(err);
    return apiError("Failed to fetch images", 500);
  }
}
