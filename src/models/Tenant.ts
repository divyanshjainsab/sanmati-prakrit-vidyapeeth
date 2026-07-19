import mongoose, { Schema } from "mongoose";

/**
 * A tenant = one subdomain-hosted site with its own admin login.
 * `_id` is the tenant slug (subdomain). Credentials are per-tenant; the
 * password is stored only as a scrypt hash (see src/lib/password.ts).
 */
const TenantSchema = new Schema(
  {
    _id: { type: String, required: true }, // slug / subdomain
    name: { type: String, required: true },
    adminUsername: { type: String, required: true },
    adminPasswordHash: { type: String, required: true },
    // When false the tenant is suspended: its site shows "not available" and
    // its admin can't act. Toggled by the super-admin.
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);
