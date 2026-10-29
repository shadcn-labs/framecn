/** Pro plans; isomorphic so client UI (pricing, unlock dialog) can show prices. Product ids come from server env. */
export const PLANS = [
  {
    env: "DODO_PRODUCT_PRO_ANNUAL",
    interval: "/ year",
    kind: "subscription",
    name: "Pro Annual",
    note: "Per year. Cancel anytime.",
    price: "$129",
    slug: "annual",
  },
  {
    env: "DODO_PRODUCT_PRO_LIFETIME",
    interval: "once",
    kind: "one_time",
    name: "Lifetime",
    note: "One-time payment. No renewal.",
    price: "$249",
    slug: "lifetime",
  },
  {
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
