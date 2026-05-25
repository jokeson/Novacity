type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SendEmailResult = { sent: true } | { sent: false; reason: string };

const resolveFromAddress = (): string | null => {
  const from = process.env.EMAIL_FROM?.trim();
  if (from && from.length > 0) {
    return from;
  }
  return null;
};

/**
 * Sends transactional email via Resend when `RESEND_API_KEY` is configured.
 * In development without credentials, logs the payload and returns success so flows are not blocked.
 */
export const sendTransactionalEmail = async (
  input: SendEmailInput,
): Promise<SendEmailResult> => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = resolveFromAddress();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email:dev]", {
        to: input.to,
        subject: input.subject,
        preview: input.text.slice(0, 240),
      });
      return { sent: true };
    }
    return {
      sent: false,
      reason: "Email is not configured (set RESEND_API_KEY and EMAIL_FROM).",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        sent: false,
        reason: `Resend API error (${response.status}): ${body.slice(0, 200)}`,
      };
    }

    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    return { sent: false, reason: message };
  }
};
