/** Published GitHub Sponsors tiers, verified against Aniket-508's listing on October 30, 2026. */
export const SPONSOR_TIERS = [
  {
    description: "Support the components and documentation you find useful.",
    name: "Bronze",
    price: 20,
    slug: "bronze",
    tierId: 585_115,
  },
  {
    description: "Help cover hosting and keep open-source work moving.",
    name: "Silver",
    price: 50,
    slug: "silver",
    tierId: 585_116,
  },
  {
    description: "Back ongoing maintenance, bug fixes, and new components.",
    name: "Gold",
    price: 100,
    slug: "gold",
    tierId: 654_510,
  },
] as const;

export const ONE_TIME_SPONSOR_TIERS = [
  { name: "Coffee", price: 10, tierId: 622_211 },
  { name: "Dinner", price: 100, tierId: 622_212 },
] as const;

/** Public active sponsors verified on October 30, 2026; GitHub does not expose their tiers publicly. */
export const SPONSORS = [
  {
    avatar: "https://avatars.githubusercontent.com/u/29006102?v=4",
    login: "bokvi",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/144938685?v=4",
    login: "askadityapandey",
  },
] as const;
