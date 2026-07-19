import dbConnect from "@/lib/mongoose";
import Image from "@/models/Image";

export type GalleryImage = {
  url: string;
  alt: string;
  publicId?: string;
};

/** Latest gallery images for a tenant, newest first. */
export async function getRecentImages(tenant: string, limit = 8): Promise<GalleryImage[]> {
  await dbConnect();

  const docs = await Image.find({ tenant })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("url alt publicId")
    .lean<GalleryImage[]>();

  return docs.map((d) => ({ url: d.url, alt: d.alt ?? "", publicId: d.publicId }));
}
