import mongoose, { type InferSchemaType, type Model } from "mongoose";

import type { InterestedClientStatus } from "@/types/domain";

const interestedStatuses: InterestedClientStatus[] = [
  "new",
  "contacted",
  "closed",
  "archived",
];

const interestedClientSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      required: true,
      enum: interestedStatuses,
      default: "new",
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

interestedClientSchema.index({ ownerId: 1, status: 1, createdAt: -1 });

export type InterestedClientDoc = InferSchemaType<
  typeof interestedClientSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const InterestedClientModel: Model<InterestedClientDoc> =
  mongoose.models.InterestedClient ??
  mongoose.model<InterestedClientDoc>(
    "InterestedClient",
    interestedClientSchema,
  );
