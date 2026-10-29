import { getSession } from "@/lib/auth";
import {
  appOrigin,
  billingCustomerId,
  getDodo,
  isSameOrigin,
} from "@/lib/billing";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const session = await getSession();
  if (!session?.user.emailVerified) {
    return Response.json(
      { error: "Sign in to manage billing." },
      { status: 401 }
    );
  }
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const customerId = await billingCustomerId(session.user.email);
  if (!customerId) {
    return Response.json(
      { error: "No purchase exists for this email yet. Choose a plan first." },
      { status: 404 }
    );
  }
  try {
    const portal = await getDodo().customers.customerPortal.create(customerId, {
      return_url: `${appOrigin()}/pricing`,
    });
    return Response.json(
      { url: portal.link },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { error: "The billing portal is unavailable. Please try again." },
      { status: 502 }
    );
  }
};
