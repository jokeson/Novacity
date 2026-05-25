import mongoose, { type InferSchemaType, type Model } from "mongoose";

import { HOME_HERO_CONFIG_KEY } from "@/features/home/utils/homeHeroDefaults";

const homeHeroConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: HOME_HERO_CONFIG_KEY,
      enum: [HOME_HERO_CONFIG_KEY],
    },
    eyebrow: { type: String, trim: true, default: "" },
    heading: { type: String, trim: true, default: "" },
    body: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    imageAlt: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export type HomeHeroConfigDoc = InferSchemaType<typeof homeHeroConfigSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const HomeHeroConfigModel: Model<HomeHeroConfigDoc> =
  mongoose.models.HomeHeroConfig ??
  mongoose.model<HomeHeroConfigDoc>("HomeHeroConfig", homeHeroConfigSchema);
