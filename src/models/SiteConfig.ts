import mongoose, { Schema } from "mongoose";

const ImageSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true }
  },
  { _id: false }
);

const SiteConfigSchema = new Schema(
  {
    _id: { type: String, required: true },

    meta: {
      name: { type: String, required: true },
      logo: { type: ImageSchema, required: true }
    },

    contact: {
      phone: { type: String, required: true },
      whatsapp: {
        url: { type: String, required: true },
        label: { type: String, required: true }
      }
    },

    hero: {
      mobile: [ImageSchema],
      desktop: [ImageSchema],
      interval: { type: Number, default: 2500 }
    },

    navigation: [
      {
        label: String,
        href: String,
        icon: String,
        external: Boolean
      }
    ],

    textSections: [
      {
        heading: String,
        paragraph: String,
        bgColor: String,
        textColor: String,
        buttonText: String,
        buttonLink: String,
        className: String,
        boldText: String
      }
    ],

    socials: [
      {
        type: {
          type: String,
          enum: ["instagram", "facebook", "youtube"]
        },
        url: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", SiteConfigSchema);
