import { connectDB } from "@/server/db/connect";
import {
  ContactInquiryModel,
  type ContactInquiryDoc,
} from "@/server/models/ContactInquiry";

export type CreateContactInquiryInput = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export const createContactInquiry = async (
  input: CreateContactInquiryInput,
): Promise<ContactInquiryDoc> => {
  await connectDB();
  return ContactInquiryModel.create(input);
};
