/**
 * Where a sponsor's logo shows up. The sidebar slot renders on every page,
 * including docs and components, alongside Carbon.
 */
export type PlacementSlug = "sidebar" | "home" | "listing";

export const PLACEMENTS: {
  slug: PlacementSlug;
  title: string;
  description: string;
}[] = [
  {
    description:
      "Your logo at the bottom of the sidebar, on every page of the site.",
    slug: "sidebar",
    title: "In the sidebar",
  },
  {
    description:
      "Your logo featured in the “Backed by” section on our homepage.",
    slug: "home",
    title: "On the homepage",
  },
  {
    description:
      "Your logo and name featured on this page and in the GitHub README.",
    slug: "listing",
    title: "Sponsor page and README",
  },
];

/** framecn placement packages, highest first; shared Dodo products identify the project at checkout. */
export const SPONSOR_TIERS = [
  {
    dodoProductId: "pdt_0NqsoNh1AhNlpLHUl1iVC",
    githubTierId: 675_848,
    name: "Diamond",
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
    slug: "diamond",
  },
  {
    dodoProductId: "pdt_0NqsoNgFblP1mEKOoU9RU",
    githubTierId: 675_847,
    name: "Gold",
    perks: [
      "Larger logo on the homepage",
      "Larger logo on this page",
      "Larger logo in the README",
      "Shoutout from @shadcnlabs on X",
    ],
    placements: ["home", "listing"],
    price: 50,
    slug: "gold",
  },
  {
    dodoProductId: "pdt_0NqsoNeoSItETZxEyHYjs",
    githubTierId: 675_837,
    name: "Silver",
    perks: ["Logo on this page", "Logo in the README"],
    placements: ["listing"],
    price: 20,
    slug: "silver",
  },
] as const;

export type SponsorTierSlug = (typeof SPONSOR_TIERS)[number]["slug"];

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

/** Individual supporters of the organization, not the maintainer's personal profile. */
export const INDIVIDUAL_SPONSORS: { avatar: string; login: string }[] = [];
