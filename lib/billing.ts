import "server-only";
import { randomUUID } from "node:crypto";

import DodoPayments, { APIError } from "dodopayments";
import type { Payment } from "dodopayments/resources/payments";
import type { Subscription } from "dodopayments/resources/subscriptions";
import {
  and,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lte,
  notExists,
  or,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

import { getDb } from "@/lib/db";
import type { Db } from "@/lib/db";
import {
  billingDispute,
  billingEntitlement,
  billingPayment,
  billingWebhook,
} from "@/lib/db/schema";
import { EARLY_BIRD_LIMIT, findPlan, PLANS } from "@/lib/plans";
import type { Plan, PlanOffers, PlanSlug } from "@/lib/plans";

/** Dodo product ids that sell these plans, regular and early bird. */
const productIdsFor = (plans: readonly Plan[]) =>
  plans
    .flatMap((plan) =>
      plan.earlyBird ? [plan.env, plan.earlyBird.env] : [plan.env]
    )
    .flatMap((name) => process.env[name] || []);

/**
 * Early-bird seats left per plan slug. A seat is used by every unrefunded
 * early-bird purchase, including subscriptions that later lapsed. Checkouts in
 * flight are not counted, so the last seats can oversell by a few.
 */
const earlyBirdSeatsLeft = async () => {
  const products = new Map(
    PLANS.flatMap((plan) => {
      const id = plan.earlyBird && process.env[plan.earlyBird.env];
      return id ? [[id, plan.slug] as const] : [];
    })
  );
  const left = new Map<PlanSlug, number>();
  if (products.size === 0) {
    return left;
  }
  for (const slug of products.values()) {
    left.set(slug, EARLY_BIRD_LIMIT);
  }
  const rows = await getDb()
    .select({ productId: billingEntitlement.productId, sold: count() })
    .from(billingEntitlement)
    .where(
      and(
        inArray(billingEntitlement.productId, [...products.keys()]),
        isNull(billingEntitlement.refundedAt)
      )
    )
    .groupBy(billingEntitlement.productId);
  for (const row of rows) {
    const slug = products.get(row.productId);
    if (slug) {
      left.set(slug, Math.max(0, EARLY_BIRD_LIMIT - row.sold));
    }
  }
  return left;
};

/** Current price of every plan, early bird while seats remain. */
export const getPlanOffers = async (): Promise<PlanOffers> => {
  const left = await earlyBirdSeatsLeft();
  const offers = {} as PlanOffers;
  for (const plan of PLANS) {
    const seats = left.get(plan.slug) ?? 0;
    offers[plan.slug] = {
      earlyBirdLeft: plan.earlyBird && seats > 0 ? seats : null,
      price: plan.earlyBird && seats > 0 ? plan.earlyBird.price : plan.price,
      regularPrice: plan.price,
    };
  }
  return offers;
};

/** Purchases are keyed by email; compare them case-insensitively. */
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const getBillingConfigurationError = () => {
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    return "Billing is not configured: DODO_PAYMENTS_API_KEY is missing.";
  }
  if (
    process.env.DODO_PAYMENTS_ENVIRONMENT !== "test_mode" &&
    process.env.DODO_PAYMENTS_ENVIRONMENT !== "live_mode"
  ) {
    return "Billing is not configured: DODO_PAYMENTS_ENVIRONMENT must be test_mode or live_mode.";
  }
  if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    return "Billing is not ready: configure a verified Dodo webhook and DODO_PAYMENTS_WEBHOOK_KEY before taking payments.";
  }
  return null;
};

let dodo: DodoPayments | undefined;

export const getDodo = () => {
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    throw new Error("Dodo API key is not configured");
  }
  const environment = process.env.DODO_PAYMENTS_ENVIRONMENT;
  if (environment !== "live_mode" && environment !== "test_mode") {
    throw new Error("Dodo environment is not configured");
  }
  dodo ??= new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment,
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
  });
  return dodo;
};

export const appOrigin = () => {
  if (!process.env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL is not configured");
  }
  return new URL(process.env.BETTER_AUTH_URL).origin;
};

export const isSameOrigin = (request: Request) =>
  request.headers.get("origin") === appOrigin();

/** The signed-in account starting checkout, if any. */
export interface Buyer {
  id: string;
  email: string;
}

/**
 * Guests check out too: Dodo then collects the email, and whoever signs in
 * with it gets Pro. Signed-in buyers have their account email preset.
 */
export const createCheckout = async (buyer: Buyer | null, slug: PlanSlug) => {
  const error = getBillingConfigurationError();
  if (error) {
    throw new Error(error);
  }
  const plan = findPlan(slug);
  if (!plan) {
    throw new Error(`Unknown plan: ${slug}`);
  }
  const seatsLeft = await earlyBirdSeatsLeft();
  const productId =
    plan.earlyBird && (seatsLeft.get(plan.slug) ?? 0) > 0
      ? process.env[plan.earlyBird.env]
      : process.env[plan.env];
  if (!productId) {
    throw new Error(`Billing is not configured: ${plan.env} is missing.`);
  }
  const session = await getDodo().checkoutSessions.create(
    {
      cancel_url: `${appOrigin()}/pricing`,
      customer: buyer ? { email: buyer.email } : undefined,
      customization: {
        theme: "light",
        theme_config: {
          light: {
            bg_primary: "#f5f4ef",
            button_primary: "#111111",
            text_primary: "#18181b",
          },
          radius: "10px",
        },
      },
      metadata: {
        framecn_plan: slug,
        ...(buyer ? { user_id: buyer.id } : {}),
      },
      product_cart: [{ product_id: productId, quantity: 1 }],
      // Dodo appends `payment_id`.
      return_url: `${appOrigin()}/checkout/return`,
    },
    { idempotencyKey: randomUUID() }
  );
  if (!session.checkout_url) {
    throw new Error("The payment provider did not return a checkout URL.");
  }
  return session.checkout_url;
};

export interface CheckoutPayment {
  /** Lowercased email the buyer paid with. */
  email: string;
  /** False while Dodo is still confirming the payment. */
  succeeded: boolean;
}

/**
 * Looks a checkout return's `payment_id` up at Dodo. Null for unknown ids and
 * payments for anything but a framecn plan. This only drives the return page;
 * access itself comes from webhook-written entitlements.
 */
export const getCheckoutPayment = async (
  paymentId: string
): Promise<CheckoutPayment | null> => {
  if (!/^[\w-]{1,128}$/u.test(paymentId)) {
    return null;
  }
  let payment: Payment;
  try {
    payment = await getDodo().payments.retrieve(paymentId);
  } catch (error) {
    if (
      error instanceof APIError &&
      error.status !== undefined &&
      error.status < 500
    ) {
      return null;
    }
    throw error;
  }
  const products = new Set(productIdsFor(PLANS));
  let ours =
    payment.product_cart?.some((item) => products.has(item.product_id)) ??
    false;
  if (!ours && payment.subscription_id) {
    const subscription = await getDodo().subscriptions.retrieve(
      payment.subscription_id
    );
    ours = products.has(subscription.product_id);
  }
  if (!ours) {
    return null;
  }
  return {
    email: normalizeEmail(payment.customer.email),
    succeeded: payment.status === "succeeded",
  };
};

/** Active, unrefunded, unexpired Pro for this email. */
export const hasProAccess = async (email: string) => {
  const [row] = await getDb()
    .select({ sourceId: billingEntitlement.sourceId })
    .from(billingEntitlement)
    .where(
      and(
        eq(billingEntitlement.email, normalizeEmail(email)),
        eq(billingEntitlement.status, "active"),
        isNull(billingEntitlement.refundedAt),
        or(
          isNull(billingEntitlement.expiresAt),
          gt(billingEntitlement.expiresAt, Date.now())
        )
      )
    )
    .limit(1);
  return Boolean(row);
};

/** The Dodo customer behind this email's latest purchase, for the billing portal. */
export const billingCustomerId = async (email: string) => {
  const [row] = await getDb()
    .select({ customerId: billingEntitlement.customerId })
    .from(billingEntitlement)
    .where(eq(billingEntitlement.email, normalizeEmail(email)))
    .orderBy(desc(billingEntitlement.eventAt))
    .limit(1);
  return row?.customerId ?? null;
};

// Payments are stamped with a little slack around the billing period start.
const PERIOD_SLACK_MS = 300_000;

/** A dispute in this period counts unless a later payment went through. */
const isPeriodDisputed = async (
  db: Db,
  subscriptionId: string,
  periodStart: number
) => {
  const newer = alias(billingPayment, "newer");
  const [disputed] = await db
    .select({ paymentId: billingPayment.paymentId })
    .from(billingPayment)
    .innerJoin(
      billingDispute,
      eq(billingDispute.paymentId, billingPayment.paymentId)
    )
    .where(
      and(
        eq(billingPayment.subscriptionId, subscriptionId),
        gte(billingPayment.createdAt, periodStart),
        notExists(
          db
            .select({ paymentId: newer.paymentId })
            .from(newer)
            .where(
              and(
                eq(newer.subscriptionId, billingPayment.subscriptionId),
                gt(newer.createdAt, billingPayment.createdAt),
                eq(newer.refunded, false)
              )
            )
        )
      )
    )
    .limit(1);
  return Boolean(disputed);
};

/** Entitlement status for a subscription event; only our plans grant access. */
const subscriptionStatus = (subscription: Subscription, disputed: boolean) => {
  if (disputed) {
    return "disputed";
  }
  const plan = productIdsFor(
    PLANS.filter((item) => item.kind === "subscription")
  ).includes(subscription.product_id);
  // A cancellation scheduled for the period end keeps access until then.
  const scheduledCancellation =
    subscription.status === "cancelled" &&
    subscription.cancel_at_next_billing_date;
  if (plan && (subscription.status === "active" || scheduledCancellation)) {
    return "active";
  }
  return subscription.status === "active" ? "inactive" : subscription.status;
};

const writeSubscription = async (
  db: Db,
  subscription: Subscription,
  eventType: string,
  eventAt: number
) => {
  const id = subscription.subscription_id;
  const [previous] = await db
    .select({
      eventAt: billingEntitlement.eventAt,
      refundedAt: billingEntitlement.refundedAt,
    })
    .from(billingEntitlement)
    .where(eq(billingEntitlement.sourceId, id))
    .limit(1);
  if (previous && previous.eventAt > eventAt) {
    return;
  }
  const expiry = Date.parse(subscription.next_billing_date);
  if (!Number.isFinite(expiry)) {
    throw new TypeError("Subscription has no valid expiry");
  }
  const [latestPayment] = await db
    .select({
      createdAt: billingPayment.createdAt,
      refunded: billingPayment.refunded,
    })
    .from(billingPayment)
    .where(eq(billingPayment.subscriptionId, id))
    .orderBy(desc(billingPayment.createdAt))
    .limit(1);
  const periodStart =
    Date.parse(subscription.previous_billing_date) - PERIOD_SLACK_MS;
  const currentPeriodRefunded = Boolean(
    latestPayment?.refunded && latestPayment.createdAt >= periodStart
  );
  // Persisted refunds also cover delivery before the first subscription
  // event. Only a later renewed period can clear a prior period's refund.
  const renewedAfterRefund =
    eventType === "subscription.renewed" &&
    previous?.refundedAt &&
    eventAt > previous.refundedAt &&
    !currentPeriodRefunded;
  let refundedAt = previous?.refundedAt ?? null;
  if (currentPeriodRefunded) {
    refundedAt = previous?.refundedAt ?? eventAt;
  } else if (renewedAfterRefund) {
    refundedAt = null;
  }
  const status = subscriptionStatus(
    subscription,
    await isPeriodDisputed(db, id, periodStart)
  );
  const values = {
    customerId: subscription.customer.customer_id,
    email: normalizeEmail(subscription.customer.email),
    eventAt,
    expiresAt: expiry,
    productId: subscription.product_id,
    refundedAt,
    status,
  };
  await db
    .insert(billingEntitlement)
    .values({ ...values, kind: "subscription", sourceId: id })
    .onConflictDoUpdate({
      set: values,
      setWhere: lte(billingEntitlement.eventAt, eventAt),
      target: billingEntitlement.sourceId,
    });
};

const writePayment = async (db: Db, payment: Payment, eventAt: number) => {
  const email = normalizeEmail(payment.customer.email);
  const refunded = payment.refund_status === "full";
  await db
    .insert(billingPayment)
    .values({
      createdAt: Date.parse(payment.created_at),
      email,
      paymentId: payment.payment_id,
      refunded,
      subscriptionId: payment.subscription_id ?? null,
    })
    .onConflictDoUpdate({
      set: {
        refunded: sql`max(${billingPayment.refunded}, excluded.refunded)`,
      },
      target: billingPayment.paymentId,
    });
  // One-time plans (lifetime, team) grant access with no expiry.
  const lifetime = productIdsFor(
    PLANS.filter((plan) => plan.kind === "one_time")
  ).find((productId) =>
    payment.product_cart?.some((item) => item.product_id === productId)
  );
  if (!lifetime) {
    return;
  }
  const [existing] = await db
    .select({
      eventAt: billingEntitlement.eventAt,
      refundedAt: billingEntitlement.refundedAt,
    })
    .from(billingEntitlement)
    .where(eq(billingEntitlement.sourceId, payment.payment_id))
    .limit(1);
  if (existing && existing.eventAt > eventAt) {
    return;
  }
  const [disputed] = await db
    .select({ paymentId: billingDispute.paymentId })
    .from(billingDispute)
    .where(eq(billingDispute.paymentId, payment.payment_id))
    .limit(1);
  let status = payment.status === "succeeded" ? "active" : "inactive";
  if (disputed) {
    status = "disputed";
  }
  const values = {
    email,
    eventAt,
    refundedAt: existing?.refundedAt ?? (refunded ? eventAt : null),
    status,
  };
  await db
    .insert(billingEntitlement)
    .values({
      ...values,
      customerId: payment.customer.customer_id,
      expiresAt: null,
      kind: "lifetime",
      productId: lifetime,
      sourceId: payment.payment_id,
    })
    .onConflictDoUpdate({
      set: values,
      setWhere: lte(billingEntitlement.eventAt, eventAt),
      target: billingEntitlement.sourceId,
    });
};

/** A full refund or a dispute: revoke what that payment paid for. */
const writeAdversePayment = async (
  db: Db,
  payment: Payment,
  dispute: boolean,
  eventAt: number
) => {
  if (dispute) {
    await db
      .insert(billingDispute)
      .values({ openedAt: eventAt, paymentId: payment.payment_id })
      .onConflictDoNothing();
  }
  await writePayment(db, payment, eventAt);
  if (!payment.subscription_id) {
    return;
  }
  // An adverse event for an old invoice must not revoke a newer period.
  const newerPaid = db
    .select({ paymentId: billingPayment.paymentId })
    .from(billingPayment)
    .where(
      and(
        eq(billingPayment.subscriptionId, payment.subscription_id),
        eq(billingPayment.refunded, false),
        gt(billingPayment.createdAt, Date.parse(payment.created_at))
      )
    );
  const latestEvent = sql`max(${billingEntitlement.eventAt}, ${eventAt})`;
  await db
    .update(billingEntitlement)
    .set(
      dispute
        ? { eventAt: latestEvent, status: "disputed" }
        : { eventAt: latestEvent, refundedAt: eventAt }
    )
    .where(
      and(
        eq(billingEntitlement.sourceId, payment.subscription_id),
        eq(billingEntitlement.email, normalizeEmail(payment.customer.email)),
        notExists(newerPaid)
      )
    );
};

export interface BillingEvent {
  type: string;
  timestamp: string;
  data: unknown;
}

/**
 * Applies a signature-verified Dodo webhook. D1 over HTTP has no interactive
 * transactions, so every write is an idempotent upsert and the webhook id is
 * recorded last: a delivery that fails midway is retried by Dodo and
 * re-applied in full, and a recorded delivery is skipped.
 */
export const applyBillingEvent = async (
  webhookId: string,
  event: BillingEvent
) => {
  const db = getDb();
  const [seen] = await db
    .select({ webhookId: billingWebhook.webhookId })
    .from(billingWebhook)
    .where(eq(billingWebhook.webhookId, webhookId))
    .limit(1);
  if (seen) {
    return;
  }
  const eventAt = Date.parse(event.timestamp);
  if (!Number.isFinite(eventAt)) {
    throw new TypeError("Invalid event timestamp");
  }
  const dispute = event.type === "dispute.opened";
  if (event.type.startsWith("subscription.")) {
    await writeSubscription(
      db,
      event.data as Subscription,
      event.type,
      eventAt
    );
  } else if (event.type === "payment.succeeded") {
    await writePayment(db, event.data as Payment, eventAt);
  } else if (event.type === "refund.succeeded" || dispute) {
    // Refund/dispute events lack product ownership; use the authoritative
    // payment, including cumulative refund status, before changing access.
    const { payment_id: paymentId } = event.data as { payment_id: string };
    const payment = await getDodo().payments.retrieve(paymentId);
    if (payment.refund_status === "full" || dispute) {
      await writeAdversePayment(db, payment, dispute, eventAt);
    }
  }
  await db
    .insert(billingWebhook)
    .values({ eventType: event.type, receivedAt: Date.now(), webhookId })
    .onConflictDoNothing();
};
