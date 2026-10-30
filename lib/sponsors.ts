/**
 * Where a sponsor's logo shows up. Docs and component pages are left alone:
 * Carbon is the only ad allowed there.
 */
export type PlacementSlug = "sidebar" | "home" | "listing";

export const PLACEMENTS: {
  slug: PlacementSlug;
  title: string;
  description: string;
}[] = [
  {
    description: "Your logo displayed at the bottom of the main site navigation.",
    slug: "sidebar",
    title: "In the sidebar",
  },
  {
    description: "Your logo featured in the “Backed by” section on our homepage.",
    slug: "home",
    title: "On the homepage",
  },
  {
    description: "Your logo and name featured on this page and in the GitHub README.",
    slug: "listing",
    title: "Sponsor page and README",
  },
];

/** Published GitHub Sponsors tiers, highest first. */
export const SPONSOR_TIERS = [
  {
    name: "Gold",
    perks: [
      "Logo in the sidebar",
      "Largest logo on the homepage",
      "Largest logo on this page",
      "Largest logo in the README",
      "Shoutout from @shadcnlabs on X",
      "Direct line for feedback and requests",
    ],
    placements: ["sidebar", "home", "listing"],
    price: 100,
    slug: "gold",
    tierId: 654_510,
  },
  {
    name: "Silver",
    perks: [
      "Logo on the homepage",
      "Logo on this page",
      "Logo in the README",
      "Shoutout from @shadcnlabs on X",
    ],
    placements: ["home", "listing"],
    price: 50,
    slug: "silver",
    tierId: 585_116,
  },
  {
    name: "Bronze",
    perks: ["Logo on this page", "Logo in the README"],
    placements: ["listing"],
    price: 20,
    slug: "bronze",
    tierId: 585_115,
  },
] as const;

export type SponsorTierSlug = (typeof SPONSOR_TIERS)[number]["slug"];

export const ONE_TIME_SPONSOR_TIERS = [
  { name: "Coffee", price: 10, tierId: 622_211 },
  { name: "Dinner", price: 100, tierId: 622_212 },
] as const;

export interface PlacedSponsor {
  name: string;
  href: string;
  logo: string;
  tier: SponsorTierSlug;
}

/** Sponsors whose logo is placed on the site, highest tier first. Add one when a logo arrives. */
export const PLACED_SPONSORS: PlacedSponsor[] = [];

export const sponsorsFor = (placement: PlacementSlug) =>
  PLACED_SPONSORS.filter((sponsor) =>
    SPONSOR_TIERS.some(
      (tier) =>
        tier.slug === sponsor.tier &&
        (tier.placements as readonly PlacementSlug[]).includes(placement)
    )
  );

/** People sponsoring Aniket on GitHub (not a framecn tier); listed under "Individual sponsors". */
export const INDIVIDUAL_SPONSORS = [
  {
    avatar: "https://avatars.githubusercontent.com/u/29006102?v=4",
    login: "bokvi",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/144938685?v=4",
    login: "askadityapandey",
  },
] as const;
