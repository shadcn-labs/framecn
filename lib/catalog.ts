import { PRO_CATALOG } from "./pro-catalog";

export type CatalogCategory =
  | "text"
  | "captions"
  | "carousels"
  | "globes"
  | "collages"
  | "charts"
  | "scroll-animations"
  | "compositions";

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: CatalogCategory;
  pro: boolean;
}

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  captions: "Captions",
  carousels: "Carousels",
  charts: "Charts",
  collages: "Collages",
  compositions: "Compositions",
  globes: "3D & Globes",
  "scroll-animations": "Scroll Animations",
  text: "Text",
};

export const COMPONENT_CATEGORIES: CatalogCategory[] = [
  "text",
  "captions",
  "carousels",
  "globes",
  "collages",
  "charts",
  "scroll-animations",
  "compositions",
];

/** The free components: every caption style. */
const FREE_CATALOG: CatalogItem[] = [
  {
    category: "captions",
    description:
      "Words reveal left-to-right via clip-path; keywords turn gold on speak; the group exits with a wipe.",
    id: "caption-clip-wipe",
    name: "Clip Wipe",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Editorial two-font layout — normal Inter text with oversized italic Playfair Display for key words.",
    id: "caption-editorial-emphasis",
    name: "Editorial Emphasis",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Outlined uppercase phrases with contextual emoji, deterministic accent colors, and horizontal squeeze entrances.",
    id: "caption-emoji-pop",
    name: "Emoji Pop",
    pro: false,
  },
  {
    category: "captions",
    description:
      "RGB channel separation red+cyan text-shadow glitch effect on each word entry.",
    id: "caption-glitch-rgb",
    name: "Glitch RGB",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Siri-style gradient sweeps across text via background-clip on each word speaking window.",
    id: "caption-gradient-fill",
    name: "Gradient Fill",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Word-by-word captions with an accent-colored highlight background that sweeps in behind each spoken word.",
    id: "caption-highlight",
    name: "Highlight",
    pro: false,
  },
  {
    category: "captions",
    description:
      "One word at a time, uppercase and centered, alternating vertical slams, side slides, and scale pops.",
    id: "caption-kinetic-slam",
    name: "Kinetic Slam",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Matrix-style green captions resolve from seeded scrambled characters into spoken words.",
    id: "caption-matrix-decode",
    name: "Matrix Decode",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Normal words with accent keywords at 1.5x size and a neon glow text-shadow.",
    id: "caption-neon-accent",
    name: "Neon Accent",
    pro: false,
  },
  {
    category: "captions",
    description:
      "All words start at 14% opacity neon; they burst to full glow when spoken.",
    id: "caption-neon-glow",
    name: "Neon Glow",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Two depth layers — large translucent italic text behind, clean text in front.",
    id: "caption-parallax-layers",
    name: "Parallax Layers",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Spoken words emit seeded multicolored particles with outward motion, shrink, and fade.",
    id: "caption-particle-burst",
    name: "Particle Burst",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Lowercase captions in a rounded pill — spoken words darken cumulatively as the phrase is read.",
    id: "caption-pill-karaoke",
    name: "Pill Karaoke",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Moving textured fills with self-contained grain, warm glow, and word-timed slam entrances.",
    id: "caption-texture",
    name: "Texture",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Balanced lowercase lines hand emphasis between light and bold weights without reflow.",
    id: "caption-weight-shift",
    name: "Weight Shift",
    pro: false,
  },
];

/** Free captions plus the generated framecn Pro items, grouped by category. */
export const CATALOG: CatalogItem[] = [
  ...FREE_CATALOG,
  ...PRO_CATALOG,
].toSorted(
  (a, b) =>
    COMPONENT_CATEGORIES.indexOf(a.category) -
    COMPONENT_CATEGORIES.indexOf(b.category)
);

/** Number of Pro components, for copy that describes what Pro unlocks. */
export const PRO_COUNT = CATALOG.filter((item) => item.pro).length;

/** Gallery URL for a category. */
export const categoryHref = (category: CatalogCategory) =>
  `/components/${category}`;

/** Canonical detail URL: /components/<category>/<id>. */
export const catalogItemHref = (item: CatalogItem) =>
  `${categoryHref(item.category)}/${item.id}`;

/** Resolves a pathname to the catalog item whose detail panel it shows. */
export const findCatalogItemByPath = (pathname: string) =>
  CATALOG.find((item) => pathname === catalogItemHref(item));

/** Resolves a pathname to the gallery category it shows (undefined for "All"). */
export const findCategoryByPath = (pathname: string) =>
  findCatalogItemByPath(pathname)?.category ??
  COMPONENT_CATEGORIES.find((category) => pathname === categoryHref(category));
