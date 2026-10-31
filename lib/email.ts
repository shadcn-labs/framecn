import "server-only";
import { LINK } from "@/constants/links";
import type { EmailContent } from "@/lib/email-templates";

/** All transactional mail uses the same verified address and personal sender. */
export const sendEmail = async ({
  to,
  content,
  idempotencyKey,
}: {
  to: string;
  content: EmailContent;
  idempotencyKey?: string;
}): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !sender) {
    throw new Error(
      "Transactional email is not configured: set RESEND_API_KEY and EMAIL_FROM."
    );
  }

  // Keep the verified mailbox even when an existing deployment still names it framecn.
  const address =
    sender.match(/<(?<address>[^<>]+)>$/u)?.groups?.address?.trim() ?? sender;
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: `Aniket from Shadcn Labs <${address}>`,
      html: content.html,
      reply_to: LINK.EMAIL,
      subject: content.subject,
      text: content.text,
      to: [to],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    method: "POST",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    // Provider response bodies can contain customer data; do not expose them or codes.
    throw new Error(
      "The email provider could not deliver your email. Check the configured sender and try again."
    );
  }
};
