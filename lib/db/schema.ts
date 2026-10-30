import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Better Auth tables (user, session, account, verification, rate_limit), in
// Better Auth's SQLite shape with snake_case columns. Regenerate with the
// Better Auth CLI when adding auth plugins that need new fields.

const now = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

export const user = sqliteTable("user", {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(now)
    .notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  id: text("id").primaryKey(),
  image: text("image"),
  name: text("name").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(now)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(now)
      .notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    id: text("id").primaryKey(),
    ipAddress: text("ip_address"),
    token: text("token").notNull().unique(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = sqliteTable(
  "account",
  {
    accessToken: text("access_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    accountId: text("account_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(now)
      .notNull(),
    id: text("id").primaryKey(),
    idToken: text("id_token"),
    password: text("password"),
    providerId: text("provider_id").notNull(),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = sqliteTable(
  "verification",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(now)
      .notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(now)
      .$onUpdate(() => new Date())
      .notNull(),
    value: text("value").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const rateLimit = sqliteTable("rate_limit", {
  count: integer("count").notNull(),
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  lastRequest: integer("last_request").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// Billing. Buyers can check out as guests, so purchases are keyed by the
// lowercased email Dodo collected; whoever signs in with that email has Pro.
// Times are epoch milliseconds.

/** Pro access per Dodo subscription or one-time payment (`source_id`). */
export const billingEntitlement = sqliteTable(
  "billing_entitlement",
  {
    customerId: text("customer_id").notNull(),
    email: text("email").notNull(),
    eventAt: integer("event_at").notNull(),
    expiresAt: integer("expires_at"),
    kind: text("kind", { enum: ["subscription", "lifetime"] }).notNull(),
    productId: text("product_id").notNull(),
    refundedAt: integer("refunded_at"),
    /** Team seats bought; null for single-seat plans and pre-seat Team sales. */
    seats: integer("seats"),
    sourceId: text("source_id").primaryKey(),
    status: text("status").notNull(),
  },
  (table) => [index("billing_entitlement_email_idx").on(table.email)]
);

/** Every succeeded payment, so refunds and disputes can find their period. */
export const billingPayment = sqliteTable(
  "billing_payment",
  {
    createdAt: integer("created_at").notNull(),
    email: text("email").notNull(),
    paymentId: text("payment_id").primaryKey(),
    refunded: integer("refunded", { mode: "boolean" }).default(false).notNull(),
    subscriptionId: text("subscription_id"),
  },
  (table) => [
    index("billing_payment_subscription_idx").on(table.subscriptionId),
  ]
);

export const billingDispute = sqliteTable("billing_dispute", {
  openedAt: integer("opened_at").notNull(),
  paymentId: text("payment_id").primaryKey(),
});

/** Processed webhook ids; Dodo retries deliveries. */
export const billingWebhook = sqliteTable("billing_webhook", {
  eventType: text("event_type").notNull(),
  receivedAt: integer("received_at").notNull(),
  webhookId: text("webhook_id").primaryKey(),
});

/** One Pro registry API key per user; only its SHA-256 hash is stored. */
export const apiKey = sqliteTable("api_key", {
  createdAt: integer("created_at").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  prefix: text("prefix").notNull(),
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
});
