import { NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/cloudinary";
import dbConnect from "@/lib/mongoose";
import { validateImageFile } from "@/lib/upload-validation";
import { apiOk, apiError, requireSession } from "@/lib/api-response";

import Image from "@/models/Image";

export async function POST(req: Request) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;
  const { tenant } = auth;

  try {
    const formData = await req.formData();
    const validation = validateImageFile(formData.get("file"));

    if (!validation.ok) {
      return apiError(validation.message, 400);
    }

    const alt = formData.get("alt");
    const buffer = Buffer.from(await validation.file.arrayBuffer());

    await dbConnect();

    // Namespace assets per tenant so uploads never mix across sites.
    const uploadResult = await uploadBuffer(buffer, `gallery/${tenant}`);

    const saved = await Image.create({
      tenant,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      alt: typeof alt === "string" ? alt : "",
    });

    return apiOk({ data: saved });
  } catch (error) {
    console.error(error);
    return apiError("Upload failed", 500);
  }
}
