/** Pro plans; isomorphic so client UI (pricing, unlock dialog) can show prices. Product ids come from server env. */
export const PLANS = [
  {
    earlyBird: { env: "DODO_PRODUCT_PRO_ANNUAL_EARLY", price: "$149" },
    env: "DODO_PRODUCT_PRO_ANNUAL",
    interval: "/ year",
    kind: "subscription",
    name: "Pro Annual",
    note: "Per year. Cancel anytime.",
    price: "$179",
    slug: "annual",
  },
  {
    earlyBird: { env: "DODO_PRODUCT_PRO_LIFETIME_EARLY", price: "$199" },
    env: "DODO_PRODUCT_PRO_LIFETIME",
    interval: "once",
    kind: "one_time",
    name: "Lifetime",
    note: "One-time payment. No renewal.",
    price: "$249",
    slug: "lifetime",
  },
  {
    earlyBird: null,
    env: "DODO_PRODUCT_PRO_TEAM",
    interval: "once",
    kind: "one_time",
    name: "Team",
    note: "One-time payment. No renewal.",
    price: "$499",
    slug: "team",
  },
] as const;
export type Plan = (typeof PLANS)[number];
export type PlanSlug = Plan["slug"];

/** Early-bird prices go to this many buyers per plan, then the regular price applies. */
export const EARLY_BIRD_LIMIT = 50;

/** What a plan costs right now; `earlyBirdLeft` is set while the early-bird price applies. */
export interface PlanOffer {
  earlyBirdLeft: number | null;
  price: string;
  regularPrice: string;
}
export type PlanOffers = Record<PlanSlug, PlanOffer>;

export const findPlan = (slug: unknown) =>
  PLANS.find((plan) => plan.slug === slug);
