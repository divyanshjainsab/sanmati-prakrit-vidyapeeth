import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/mongoose";

import Image from "@/models/Image";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await dbConnect();

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "gallery" }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    const saved = await Image.create({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
