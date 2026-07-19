import mongoose, { Schema } from "mongoose";

/**
 * Platform-wide settings (a single document, shared across all tenants).
 * Managed only from the super-admin panel. Currently holds the common footer
 * note — copyright line + an enrollment/contact blurb shown on every site.
 */
const PlatformSettingsSchema = new Schema(
  {
    _id: { type: String, required: true }, // always "platform"
    copyright: { type: String, default: "" },
    enrollNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.PlatformSettings ||
  mongoose.model("PlatformSettings", PlatformSettingsSchema);
