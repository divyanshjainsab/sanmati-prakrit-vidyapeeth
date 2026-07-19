import { NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/cloudinary";
import { validateImageFile } from "@/lib/upload-validation";
import { apiOk, apiError, requireSession } from "@/lib/api-response";

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

    const buffer = Buffer.from(await validation.file.arrayBuffer());

    // Site-config assets (logo, hero images, …) namespaced per tenant.
    const uploadResult = await uploadBuffer(buffer, `siteconfig/${tenant}`);

    return apiOk({ data: { url: uploadResult.secure_url } });
  } catch (error) {
    console.error(error);
    return apiError("Upload failed", 500);
  }
}
