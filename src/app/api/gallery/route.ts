import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Image from "@/models/Image";

export async function GET() {
  try {
    await dbConnect();

    const images = await Image.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: images });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
