/** Pro plans; isomorphic so client UI (pricing, unlock dialog) can show prices. Product ids come from server env. */
export const PLANS = [
  {
    description: "Every Pro composition, renewed yearly.",
    env: "DODO_PRODUCT_PRO_ANNUAL",
    interval: "/ year",
    kind: "subscription",
    name: "Pro Annual",
    note: "Billed $129 yearly. Cancel anytime.",
    price: "$129",
    slug: "annual",
  },
  {
    description: "Pay once, keep Pro forever.",
    env: "DODO_PRODUCT_PRO_LIFETIME",
    interval: "once",
    kind: "one_time",
    name: "Lifetime",
    note: "One-time payment. No renewal.",
    price: "$249",
    slug: "lifetime",
  },
  {
    description: "Lifetime Pro for a team of up to 10.",
    env: "DODO_PRODUCT_PRO_TEAM",
    interval: "once",
    kind: "one_time",
    name: "Team",
    note: "One-time payment. No renewal.",
    price: "$499",
    slug: "team",
  },
] as const;
export type PlanSlug = (typeof PLANS)[number]["slug"];

export const findPlan = (slug: unknown) =>
  PLANS.find((plan) => plan.slug === slug);
