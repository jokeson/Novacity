import mongoose, { type InferSchemaType, type Model } from "mongoose";

import type { NotificationType } from "@/types/domain";

const notificationTypes: NotificationType[] = [
  "system",
  "listing",
  "expiration",
  "interest",
  "message",
  "verification",
];

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: notificationTypes,
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    relatedPropertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      index: true,
    },
    relatedPassKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PassKey",
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({
  userId: 1,
  type: 1,
  relatedPropertyId: 1,
  createdAt: -1,
});
notificationSchema.index({
  userId: 1,
  type: 1,
  relatedPassKeyId: 1,
  createdAt: -1,
});

export type NotificationDoc = InferSchemaType<typeof notificationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const NotificationModel: Model<NotificationDoc> =
  mongoose.models.Notification ??
  mongoose.model<NotificationDoc>("Notification", notificationSchema);
