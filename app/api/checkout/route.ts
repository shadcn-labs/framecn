import { getSession } from "@/lib/auth";
import {
  createCheckout,
  getBillingConfigurationError,
  isSameOrigin,
} from "@/lib/billing";
import { findPlan } from "@/lib/plans";

export const runtime = "nodejs";

/** Starts checkout for anyone; signed-in buyers get their email preset. */
export const POST = async (request: Request) => {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }
  const plan = findPlan(
    body && typeof body === "object" && "plan" in body ? body.plan : undefined
  );
  if (!plan) {
    return Response.json(
      { error: "Choose annual, lifetime, or team." },
      { status: 400 }
    );
  }
  const configurationError = getBillingConfigurationError();
  if (configurationError) {
    return Response.json({ error: configurationError }, { status: 503 });
  }
  if (!process.env[plan.env]) {
    return Response.json(
      { error: `Billing is not configured: ${plan.env} is missing.` },
      { status: 503 }
    );
  }
  const session = await getSession();
  try {
    const checkoutUrl = await createCheckout(
      session ? { email: session.user.email, id: session.user.id } : null,
      plan.slug
    );
    return Response.json(
      { checkoutUrl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      {
        error:
          "The payment provider could not start checkout. Please try again.",
      },
      { status: 502 }
    );
  }
};
