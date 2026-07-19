import mongoose from "mongoose";
import SiteConfigModel from "@/models/SiteConfig";
import { DEFAULT_TENANT } from "@/lib/tenant";
import { buildDefaultSiteConfig } from "@/lib/site-config";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Define it in .env.local before seeding.");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI as string);

  const existing = await SiteConfigModel.findById(DEFAULT_TENANT);
  if (existing) {
    console.log(
      `SiteConfig for default tenant "${DEFAULT_TENANT}" already exists — skipping seed.`
    );
  } else {
    await SiteConfigModel.create(buildDefaultSiteConfig(DEFAULT_TENANT));
    console.log(`Seeded initial SiteConfig for default tenant "${DEFAULT_TENANT}".`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
