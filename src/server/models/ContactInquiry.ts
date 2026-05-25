import mongoose, { type InferSchemaType, type Model } from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

contactInquirySchema.index({ createdAt: -1 });

export type ContactInquiryDoc = InferSchemaType<typeof contactInquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactInquiryModel: Model<ContactInquiryDoc> =
  mongoose.models.ContactInquiry ??
  mongoose.model<ContactInquiryDoc>("ContactInquiry", contactInquirySchema);
