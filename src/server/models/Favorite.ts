import mongoose, { type InferSchemaType, type Model } from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, createdAt: -1 });

export type FavoriteDoc = InferSchemaType<typeof favoriteSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FavoriteModel: Model<FavoriteDoc> =
  mongoose.models.Favorite ??
  mongoose.model<FavoriteDoc>("Favorite", favoriteSchema);
