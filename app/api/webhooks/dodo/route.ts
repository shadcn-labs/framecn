import { applyBillingEvent, getDodo } from "@/lib/billing";
import type { BillingEvent } from "@/lib/billing";

export const runtime = "nodejs";

const signingKey = () =>
  process.env.DODO_PAYMENTS_WEBHOOK_KEY ||
  (process.env.NODE_ENV !== "production" &&
  process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
    ? process.env.FRAMECN_LOCAL_WEBHOOK_KEY
    : undefined);

export const GET = () =>
  Response.json(
    {
      configured: Boolean(process.env.DODO_PAYMENTS_WEBHOOK_KEY),
      endpoint: "framecn Dodo webhook",
    },
    { headers: { "Cache-Control": "no-store", "x-framecn-webhook": "dodo" } }
  );

export const POST = async (request: Request) => {
  const key = signingKey();
  if (!key || !process.env.DODO_PAYMENTS_API_KEY) {
    return Response.json(
      { error: "Dodo webhook verification is not configured." },
      { status: 503 }
    );
  }
  const webhookId = request.headers.get("webhook-id");
  if (!webhookId) {
    return Response.json({ error: "Missing webhook-id." }, { status: 400 });
  }
  const raw = await request.text();
  let event: BillingEvent;
  try {
    event = getDodo().webhooks.unwrap(raw, {
      headers: Object.fromEntries(request.headers),
      key,
    });
  } catch {
    return Response.json(
      { error: "Invalid webhook signature." },
      { status: 401 }
    );
  }
  try {
    await applyBillingEvent(webhookId, event);
    return Response.json({ received: true });
  } catch {
    return Response.json(
      { error: "Webhook could not be persisted. Delivery should be retried." },
      { status: 503 }
    );
  }
};
