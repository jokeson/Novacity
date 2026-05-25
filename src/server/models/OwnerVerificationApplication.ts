import mongoose, { type InferSchemaType, type Model } from "mongoose";

const applicationStatuses = ["pending", "approved", "rejected"] as const;
const nationalities = ["south-sudanese", "international"] as const;
const idTypes = ["national_id", "drivers_license", "passport"] as const;

const ownerVerificationApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    residentialAddress: { type: String, required: true, trim: true },
    /** Canonical state label (matches `Property.state` / `SOUTH_SUDAN_STATE_OPTIONS`). */
    postingState: { type: String, required: true, trim: true },
    applicantNationality: {
      type: String,
      required: true,
      enum: nationalities,
    },
    idDocumentType: {
      type: String,
      required: true,
      enum: idTypes,
    },
    /** HTTPS URL or app-relative secure path from upload pipeline. */
    idDocumentUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: applicationStatuses,
      default: "pending",
      index: true,
    },
    rejectionReason: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

ownerVerificationApplicationSchema.index({ status: 1, createdAt: -1 });
ownerVerificationApplicationSchema.index({ userId: 1, createdAt: -1 });

export type OwnerVerificationApplicationDoc = InferSchemaType<
  typeof ownerVerificationApplicationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const OwnerVerificationApplicationModel: Model<OwnerVerificationApplicationDoc> =
  mongoose.models.OwnerVerificationApplication ??
  mongoose.model<OwnerVerificationApplicationDoc>(
    "OwnerVerificationApplication",
    ownerVerificationApplicationSchema,
  );
