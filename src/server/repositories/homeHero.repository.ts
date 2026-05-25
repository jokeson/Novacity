import { connectDB } from "@/server/db/connect";
import { HOME_HERO_CONFIG_KEY } from "@/features/home/utils/homeHeroDefaults";
import { HomeHeroConfigModel } from "@/server/models/HomeHeroConfig";

export type UpsertHomeHeroInput = {
  eyebrow: string;
  heading: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
};

export type HomeHeroConfigFields = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export const findHomeHeroConfigByKey = async (
  key: typeof HOME_HERO_CONFIG_KEY,
): Promise<HomeHeroConfigFields | null> => {
  await connectDB();
  return HomeHeroConfigModel.findOne({ key }).lean<HomeHeroConfigFields | null>();
};

export const upsertHomeHeroConfig = async (input: UpsertHomeHeroInput): Promise<void> => {
  await connectDB();
  const doc = await HomeHeroConfigModel.findOneAndUpdate(
    { key: HOME_HERO_CONFIG_KEY },
    {
      $set: {
        key: HOME_HERO_CONFIG_KEY,
        eyebrow: input.eyebrow,
        heading: input.heading,
        body: input.body,
        imageUrl: input.imageUrl,
        imageAlt: input.imageAlt,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).exec();

  if (!doc) {
    throw new Error("Failed to persist home hero configuration.");
  }
};
