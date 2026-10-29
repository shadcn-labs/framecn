// framecn's isolated Dodo catalog. Requires Node.js 22+ and `dodopayments`.
//
//   node scripts/setup-dodo.mjs
//     Provision/reuse the test catalog; write active DODO_* vars to .env.local.
//   node scripts/setup-dodo.mjs --live
//     Provision/reuse live catalog; keep development in test mode and save live
//     values as DODO_LIVE_* plus DODO_PAYMENTS_LIVE_API_KEY in .env.local.
//   node scripts/setup-dodo.mjs --credentials-from=/secure/account.env
//     Bootstrap ONLY the relevant Dodo API key from an existing account env file.
//   node scripts/setup-dodo.mjs [--live] --webhook-url=https://<host>/api/webhooks/dodo
//     Register only after the deployed handler's GET health response identifies
//     itself with x-framecn-webhook: dodo. No endpoint or fake secret is generated
//     by default. Registration is not evidence of successful webhook delivery.
//
// For production, map DODO_PAYMENTS_LIVE_API_KEY to DODO_PAYMENTS_API_KEY,
// DODO_LIVE_BRAND_ID to DODO_BRAND_ID, DODO_LIVE_PRODUCT_* to DODO_PRODUCT_*,
// and DODO_LIVE_PAYMENTS_WEBHOOK_KEY to DODO_PAYMENTS_WEBHOOK_KEY, and set
// DODO_PAYMENTS_ENVIRONMENT=live_mode. Never publish .env.local.
// No secrets or account IDs are printed; unrelated brands/products are untouched.
import { chmodSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

import DodoPayments from "dodopayments";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const ENV_FILE = `${ROOT}.env.local`;
// Names were once capitalised differently; match existing Dodo resources regardless of case.
const sameName = (a, b) =>
  typeof a === "string" && a.toLowerCase() === b.toLowerCase();

const SITE_URL = "https://framecn.dev";
const BRAND = {
  name: "framecn",
  description:
    "framecn by Shadcn Labs: beautifully designed video components and compositions built on Editframe. framecn Pro unlocks the Node Reveal composition.",
  statement_descriptor: "FRAMECN",
  // Shadcn Labs' existing support inbox (shadcn-labs.com/src/constants/links.ts).
  support_email: "hello@shadcn-labs.com",
  url: SITE_URL,
};
const SUMMARY =
  "framecn Pro: access to the Node Reveal composition and its copy-ready source.";
const recurringPrice = (price, interval) => ({
  currency: "USD",
  payment_frequency_count: 1,
  payment_frequency_interval: interval,
  price,
  subscription_period_count: 20,
  subscription_period_interval: "Year",
  tax_inclusive: false,
  type: "recurring_price",
});
const oneTimePrice = (price) => ({
  currency: "USD",
  price,
  tax_inclusive: false,
  type: "one_time_price",
});
// Product names carry a "(2026)" suffix: products from the earlier catalog
// (including the retired recurring plan) keep their old names and prices, so the
// "differs from expected price" guard below never trips on them and they are
// never modified. Archive the old products in the Dodo dashboard once unused.
const PRODUCTS = [
  {
    description: `${SUMMARY} Billed annually; cancel anytime.`,
    key: "DODO_PRODUCT_PRO_ANNUAL",
    name: "framecn Pro — Annual (2026)",
    price: recurringPrice(12900, "Year"),
  },
  {
    description: `${SUMMARY} One-time payment; nothing renews.`,
    key: "DODO_PRODUCT_PRO_LIFETIME",
    name: "framecn Pro — Lifetime (2026)",
    price: oneTimePrice(24900),
  },
  {
    description: `${SUMMARY} Lifetime license for up to 10 team members sharing one team API key. One-time payment; nothing renews.`,
    key: "DODO_PRODUCT_PRO_TEAM",
    name: "framecn Pro — Team (2026)",
    price: oneTimePrice(49900),
  },
];
const WEBHOOK_EVENTS = [
  "payment.succeeded",
  "refund.succeeded",
  "dispute.opened",
  "subscription.active",
  "subscription.renewed",
  "subscription.updated",
  "subscription.plan_changed",
  "subscription.on_hold",
  "subscription.past_due",
  "subscription.paused",
  "subscription.unpaused",
  "subscription.cancelled",
  "subscription.expired",
  "subscription.failed",
];
class SetupError extends Error {}
const log = (message) => console.error(message);
const readEnv = (path) =>
  existsSync(path) ? parseEnv(readFileSync(path, "utf-8")) : {};
const privateKey = (key, live) =>
  live ? key.replace(/^DODO_/u, "DODO_LIVE_") : key;

// Re-read at write time so auth configuration added by another setup step survives.
function saveEnv(values) {
  let content = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf-8") : "";
  for (const [key, value] of Object.entries(values)) {
    if (!key.startsWith("DODO_"))
      {throw new SetupError("Refusing non-Dodo env write.");}
    const line = `${key}=${JSON.stringify(value)}`;
    const pattern = new RegExp(`^${key}=.*$`, "mu");
    content = pattern.test(content)
      ? content.replace(pattern, () => line)
      : `${content.replace(/\n*$/u, "\n")}${line}\n`;
  }
  writeFileSync(ENV_FILE, content, { mode: 0o600 });
  chmodSync(ENV_FILE, 0o600);
}

async function setup() {
  const args = process.argv.slice(2);
  const live = args.includes("--live");
  const credentialFiles = [];
  let webhookUrl;
  for (const arg of args) {
    if (arg === "--live") {continue;}
    if (arg.startsWith("--credentials-from=")) {
      credentialFiles.push(arg.slice("--credentials-from=".length));
    } else if (arg.startsWith("--webhook-url=")) {
      webhookUrl = arg.slice("--webhook-url=".length);
    } else {
      throw new SetupError(
        "Use --live, --credentials-from=<env file>, or --webhook-url=<HTTPS URL>."
      );
    }
  }
  const local = readEnv(ENV_FILE);
  const sources = [
    process.env,
    local,
    ...credentialFiles.map((path) => {
      if (!existsSync(path))
        {throw new SetupError("The supplied credentials file does not exist.");}
      return readEnv(path);
    }),
  ];
  const apiKeyName = live
    ? "DODO_PAYMENTS_LIVE_API_KEY"
    : "DODO_PAYMENTS_API_KEY";
  const apiKey = sources
    .map((source) => {
      if (source[apiKeyName]) {return source[apiKeyName];}
      if (live && source.DODO_PAYMENTS_ENVIRONMENT === "live_mode") {
        return source.DODO_PAYMENTS_API_KEY;
      }
      return;
    })
    .find(Boolean);
  if (!apiKey)
    {throw new SetupError(
      `Set ${apiKeyName} in .env.local or provide --credentials-from=<env file>.`
    );}
  const environment = live ? "live_mode" : "test_mode";
  if (
    (!live && apiKey.startsWith("dodo_live_")) ||
    (live && apiKey.startsWith("dodo_test_"))
  ) {
    throw new SetupError(
      "The API key prefix does not match the selected environment."
    );
  }
  if (
    !live &&
    sources.find((source) => source.DODO_PAYMENTS_API_KEY === apiKey)
      ?.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
  ) {
    throw new SetupError(
      "The active API key belongs to live mode; supply a test-mode key."
    );
  }
  const dodo = new DodoPayments({ bearerToken: apiKey, environment });
  log(`framecn Dodo setup (${environment}).`);
  const { items: brands } = await dodo.brands.list();
  const matches = brands.filter(
    (brand) => sameName(brand.name, BRAND.name) && brand.url === SITE_URL
  );
  if (matches.length > 1)
    {throw new SetupError(
      "Multiple framecn brands match; resolve the duplicate in Dodo before setup."
    );}
  if (
    !matches.length &&
    brands.some((brand) => sameName(brand.name, BRAND.name))
  ) {
    throw new SetupError(
      "An existing framecn brand has a different URL; refusing to modify it."
    );
  }
  const brand = matches[0] ?? (await dodo.brands.create(BRAND));
  log(
    `framecn brand ${matches.length ? "reused" : "created"}; enabled=${brand.enabled}; verification=${brand.verification_status}.`
  );
  const values = {
    [apiKeyName]: apiKey,
    [privateKey("DODO_BRAND_ID", live)]: brand.brand_id,
  };
  if (!live) {values.DODO_PAYMENTS_ENVIRONMENT = "test_mode";}
  // Persist successful provisioning before a later API call can fail.
  saveEnv(values);
  const existing = [];
  for await (const product of dodo.products.list({
    archived: false,
    brand_id: brand.brand_id,
  })) {
    existing.push(product);
  }
  for (const spec of PRODUCTS) {
    const candidates = existing.filter((product) =>
      sameName(product.name, spec.name)
    );
    if (candidates.length > 1)
      {throw new SetupError(
        `Duplicate ${spec.name} products require dashboard review.`
      );}
    let product;
    if (candidates.length) {
      product = await dodo.products.retrieve(candidates[0].product_id);
      if (product.brand_id !== brand.brand_id)
        {throw new SetupError(
          "Product brand isolation failed; no product was changed."
        );}
      const samePrice = Object.entries(spec.price).every(
        ([key, value]) => product.price[key] === value
      );
      if (!samePrice || product.tax_category !== "digital_products") {
        throw new SetupError(
          `${spec.name} differs from the expected price/tax configuration; no existing product was changed.`
        );
      }
    } else {
      product = await dodo.products.create({
        brand_id: brand.brand_id,
        description: spec.description,
        metadata: {
          application: "framecn",
          plan: spec.key.replace("DODO_PRODUCT_PRO_", "").toLowerCase(),
        },
        name: spec.name,
        price: spec.price,
        tax_category: "digital_products",
      });
    }
    values[privateKey(spec.key, live)] = product.product_id;
    saveEnv(values);
    log(`${spec.name} ${candidates.length ? "reused" : "created"}.`);
  }
  const webhookKeyName = privateKey("DODO_PAYMENTS_WEBHOOK_KEY", live);
  if (webhookUrl) {
    let url;
    try {
      url = new URL(webhookUrl);
    } catch {
      throw new SetupError("Webhook URL must be an absolute HTTPS URL.");
    }
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/api/webhooks/dodo" ||
      url.search ||
      url.hash
    ) {
      throw new SetupError(
        "Webhook URL must be HTTPS with path /api/webhooks/dodo and no credentials, query, or fragment."
      );
    }
    let response;
    try {
      response = await fetch(url, {
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new SetupError(
        "Webhook health check failed; deploy the route directly at the supplied HTTPS URL first."
      );
    }
    if (!response.ok || response.headers.get("x-framecn-webhook") !== "dodo") {
      throw new SetupError(
        "Webhook route is not deployed: GET must succeed with x-framecn-webhook: dodo."
      );
    }
    let hook;
    for await (const candidate of dodo.webhooks.list()) {
      if (candidate.url === url.href) {
        if (!sameName(candidate.description, "framecn"))
          {throw new SetupError(
            "This URL belongs to a non-framecn webhook; refusing to modify it."
          );}
        hook = candidate;
      }
    }
    if (hook) {
      const filter = hook.filter_types ?? [];
      if (
        hook.disabled ||
        (filter.length &&
          WEBHOOK_EVENTS.some((event) => !filter.includes(event)))
      ) {
        hook = await dodo.webhooks.update(hook.id, {
          disabled: false,
          filter_types: filter.length
            ? [...new Set([...filter, ...WEBHOOK_EVENTS])]
            : undefined,
        });
      }
    } else {
      hook = await dodo.webhooks.create({
        description: "framecn",
        filter_types: WEBHOOK_EVENTS,
        url: url.href,
      });
    }
    const { secret } = await dodo.webhooks.retrieveSecret(hook.id);
    values[webhookKeyName] = secret;
    values[privateKey("DODO_WEBHOOK_ID", live)] = hook.id;
    log(
      "framecn webhook registered/reused. Signed delivery has not been exercised."
    );
  } else {
    values[webhookKeyName] = readEnv(ENV_FILE)[webhookKeyName] ?? "";
    log(
      "Webhook registration skipped. Deploy /api/webhooks/dodo on public HTTPS, then rerun with --webhook-url=<URL>. No signing key was fabricated."
    );
  }
  saveEnv(values);
  log(
    `Saved ${live ? "inactive live" : "active test"} Dodo values privately to .env.local; non-Dodo variables preserved.`
  );
}

setup().catch((error) => {
  if (error instanceof SetupError) {log(error.message);}
  else if (error instanceof DodoPayments.APIError)
    {log(
      `Dodo API request failed (HTTP ${error.status ?? "unknown"}); no API response or secrets printed.`
    );}
  else
    {log(
      "Dodo setup failed; inspect local configuration and network access. Error details suppressed to protect credentials."
    );}
  process.exitCode = 1;
});
