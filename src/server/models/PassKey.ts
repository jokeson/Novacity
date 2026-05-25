import mongoose, { type InferSchemaType, type Model } from "mongoose";

const passKeySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, index: true },
    /** When null, the key is in the pool until a user redeems it with the code. */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    duration: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

passKeySchema.index({ userId: 1, isActive: 1 });

export type PassKeyDoc = InferSchemaType<typeof passKeySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PassKeyModel: Model<PassKeyDoc> =
  mongoose.models.PassKey ??
  mongoose.model<PassKeyDoc>("PassKey", passKeySchema);
