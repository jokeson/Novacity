import mongoose, { type InferSchemaType, type Model } from "mongoose";

import type { UserRole } from "@/types/user";

const userRoles: UserRole[] = ["user", "admin", "company"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    /** Bcrypt hash — never store a plaintext password. */
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
      default: "user",
      index: true,
    },
    phone: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    /** When set, the account cannot sign in until cleared by an admin. */
    suspendedAt: { type: Date, default: null, index: true },
    savedListings: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
      default: [],
    },
    /**
     * Independent owners (`user`) must be `approved` before listing create/publish.
     * `company` / `admin` should remain `approved` (set on create / migration).
     */
    ownerVerificationStatus: {
      type: String,
      enum: ["unsubmitted", "pending", "approved", "rejected"],
      default: "unsubmitted",
      index: true,
    },
    ownerVerificationRejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        const safe = { ...(ret as Record<string, unknown>) };
        delete safe.passwordHash;
        return safe;
      },
    },
  },
);

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const UserModel: Model<UserDoc> =
  mongoose.models.User ?? mongoose.model<UserDoc>("User", userSchema);
