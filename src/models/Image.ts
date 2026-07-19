import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    tenant: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { timestamps: true }
);

// Gallery queries always filter by tenant and sort newest-first.
ImageSchema.index({ tenant: 1, createdAt: -1 });

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
