import { buildOwnerVerificationApprovedEmail } from "@/features/verification/emails/ownerVerificationApprovedEmail";
import { sendTransactionalEmail } from "@/server/services/email.service";

export const sendOwnerVerificationApprovedEmail = async (params: {
  to: string;
  ownerName: string;
}): Promise<{ sent: boolean; reason?: string }> => {
  const to = params.to.trim().toLowerCase();
  if (!to || !to.includes("@")) {
    return { sent: false, reason: "Invalid recipient email." };
  }

  const { subject, html, text } = buildOwnerVerificationApprovedEmail({
    ownerName: params.ownerName,
  });

  const result = await sendTransactionalEmail({ to, subject, html, text });
  if (!result.sent) {
    return { sent: false, reason: result.reason };
  }
  return { sent: true };
};
