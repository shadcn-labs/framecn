/**
 * Team checkout is a base license plus one line per seat, so two seats never
 * undercut a single Lifetime license and ten seats stay at $499.
 */
export const TEAM = {
  basePrice: 199,
  defaultSeats: 10,
  maxSeats: 25,
  minSeats: 2,
  seatEnv: "DODO_PRODUCT_PRO_TEAM_SEAT",
  seatPrice: 30,
} as const;

export const isTeamSeatCount = (value: unknown): value is number =>
  Number.isInteger(value) &&
  (value as number) >= TEAM.minSeats &&
  (value as number) <= TEAM.maxSeats;

/** Whole-dollar team total for a seat count. */
export const teamPrice = (seats: number) =>
  TEAM.basePrice + TEAM.seatPrice * seats;

export const formatUsd = (dollars: number) =>
  `$${dollars.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
  })}`;
/** Team list price shown before a seat count is chosen. */
const TEAM_DEFAULT_PRICE = formatUsd(teamPrice(TEAM.defaultSeats));

/** Pro plans; isomorphic so client UI (pricing, unlock dialog) can show prices. Product ids come from server env. */
export const PLANS = [
  {
    earlyBird: { env: "DODO_PRODUCT_PRO_ANNUAL_EARLY", price: "$149" },
    env: "DODO_PRODUCT_PRO_ANNUAL",
    interval: "/ year",
    kind: "subscription",
    name: "Pro",
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
    price: TEAM_DEFAULT_PRICE,
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
