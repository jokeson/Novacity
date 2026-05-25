import { ROUTES } from "@/constants/routes";
import { getAppBaseUrl } from "@/lib/app-url";

const OWNER_POLICY_HIGHLIGHTS = [
  "List only properties you are authorized to market and keep listing details accurate.",
  "Match each listing to the correct state or region you verified during onboarding.",
  "Independent owners need a valid PassKey before publishing; company and admin accounts follow separate rules.",
  "Use clear photos and honest pricing — misleading or duplicate listings may be removed.",
  "Respond professionally to interested clients and respect Novacity community standards.",
  "Repeated violations of platform policies can lead to suspension or removal from the owner program.",
] as const;

export const buildOwnerVerificationApprovedEmail = (params: {
  ownerName: string;
}): { subject: string; html: string; text: string } => {
  const greetingName = params.ownerName.trim() || "there";
  const origin = getAppBaseUrl();
  const createListingUrl = `${origin}${ROUTES.dashboardListingsCreate}`;
  const dashboardUrl = `${origin}${ROUTES.dashboard}`;
  const policyListHtml = OWNER_POLICY_HIGHLIGHTS.map(
    (item) => `<li style="margin-bottom:8px;">${item}</li>`,
  ).join("");
  const policyListText = OWNER_POLICY_HIGHLIGHTS.map((item) => `• ${item}`).join("\n");

  const subject = "Welcome to Novacity — you are approved to list as an owner";

  const text = [
    `Hello ${greetingName},`,
    "",
    "Congratulations! Your owner verification application has been approved. You are now part of the Novacity owner community and may start creating listings from your dashboard.",
    "",
    "Before you publish, please review these owner policies:",
    policyListText,
    "",
    `Create your first listing: ${createListingUrl}`,
    `Open your dashboard: ${dashboardUrl}`,
    "",
    "Thank you for building with Novacity.",
    "— The Novacity Team",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="font-family: Inter, system-ui, sans-serif; line-height: 1.6; color: #111827; max-width: 560px; margin: 0 auto; padding: 24px;">
    <p style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Novacity</p>
    <h1 style="font-size: 22px; margin: 0 0 16px; color: #0F172A;">Congratulations, ${greetingName}!</h1>
    <p style="margin: 0 0 16px;">Your owner verification application has been <strong>approved</strong>. You are now welcome to join Novacity as a verified property owner and can start listing from your dashboard.</p>
    <p style="margin: 0 0 12px; font-weight: 600; color: #0F172A;">Owner policies &amp; community rules</p>
    <ul style="margin: 0 0 20px; padding-left: 20px; color: #334155;">${policyListHtml}</ul>
    <p style="margin: 0 0 24px;">
      <a href="${createListingUrl}" style="display: inline-block; background: #0F172A; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 12px; font-weight: 600;">Create your first listing</a>
    </p>
    <p style="margin: 0; font-size: 13px; color: #64748b;">Dashboard: <a href="${dashboardUrl}" style="color: #D4A017;">${dashboardUrl}</a></p>
  </body>
</html>`.trim();

  return { subject, html, text };
};
