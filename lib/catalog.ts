export type CatalogCategory =
  | "typography"
  | "transitions"
  | "captions"
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
  compositions: "Compositions",
  transitions: "Transitions",
  typography: "Typography",
};

export const COMPONENT_CATEGORIES: CatalogCategory[] = [
  "typography",
  "transitions",
  "captions",
  "compositions",
];

export const CATALOG: CatalogItem[] = [
  {
    category: "typography",
    description: "Text fades in from a heavy blur into sharp focus.",
    id: "blur-reveal",
    name: "Blur Reveal",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Character-by-character text reveal with a deterministic blinking cursor.",
    id: "typewriter",
    name: "Typewriter",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Animates one word inside a sentence from a base color to a brand color.",
    id: "inline-highlight",
    name: "Inline Highlight",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Cross-fades between two strings on the same line. Includes a Strikethrough variant.",
    id: "text-fade-replace",
    name: "Text Fade Replace",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Text gets crossed out and replaced with new text in a single motion.",
    id: "strikethrough-replace",
    name: "Strikethrough Replace",
    pro: false,
  },
  {
    category: "typography",
    description: "Words rise from below with a soft cascading delay.",
    id: "staggered-fade-up",
    name: "Staggered Fade Up",
    pro: false,
  },
  {
    category: "typography",
    description: "Lines grow out from behind an invisible horizontal mask.",
    id: "masked-slide-reveal",
    name: "Masked Slide Reveal",
    pro: false,
  },
  {
    category: "typography",
    description: "Numbers and characters roll into place like a casino reel.",
    id: "slot-machine-roll",
    name: "Slot Machine Roll",
    pro: false,
  },
  {
    category: "typography",
    description: "Bright gradient sweeps across dim text, lighting it up.",
    id: "shimmer-sweep",
    name: "Shimmer Sweep",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Random characters scramble and resolve into the target string.",
    id: "matrix-decode",
    name: "Matrix Decode",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Letter-spacing collapses from wide to normal with a spring snap.",
    id: "tracking-in",
    name: "Tracking In",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Marker bar sweeps in behind a phrase, optionally inverting the text color.",
    id: "marker-highlight",
    name: "Marker Highlight",
    pro: false,
  },
  {
    category: "typography",
    description: "Three-channel RGB split with a brief horizontal jitter.",
    id: "rgb-glitch-text",
    name: "RGB Glitch Text",
    pro: false,
  },
  {
    category: "typography",
    description: "Endlessly scrolling horizontal text band.",
    id: "infinite-marquee",
    name: "Infinite Marquee",
    pro: false,
  },
  {
    category: "typography",
    description: "Marquee tilted into 3D space with depth fade.",
    id: "perspective-marquee",
    name: "Perspective Marquee",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Words blur and drift upward on exit, with a smooth fade-in entrance.",
    id: "blur-out-up",
    name: "Blur Out Up",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Each letter rises from below with a staggered fade-in cascade.",
    id: "bottom-up-letters",
    name: "Bottom Up Letters",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Text resolves into focus from a blurred, shifted state, then blurs back out on exit.",
    id: "focus-blur-resolve",
    name: "Focus Blur Resolve",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Multi-line text slides in from the left line by line, then slides out to the right.",
    id: "line-by-line-slide",
    name: "Line by Line Slide",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Lines rise up from below through a blur, then exit upward with a blur on each line.",
    id: "mask-reveal-up",
    name: "Mask Reveal Up",
    pro: false,
  },
  {
    category: "typography",
    description:
      "The entire text scales in from a subtle size with a smooth fade, perfect for clean entrances.",
    id: "micro-scale-fade",
    name: "Micro Scale Fade",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Characters rise from below with a smooth spring-like easing, staggered one frame apart.",
    id: "per-character-rise",
    name: "Per Character Rise",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Text enters scaling down into place with a fade, then shrinks and fades out.",
    id: "scale-down-fade",
    name: "Scale Down Fade",
    pro: false,
  },
  {
    category: "typography",
    description:
      "The text group slides in from the left while individual words fade in with a stagger.",
    id: "short-slide-right",
    name: "Short Slide Right",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Characters fade in through a soft blur and upward drift, staggered one frame apart.",
    id: "soft-blur-in",
    name: "Soft Blur In",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Words pop in one by one with an overshoot spring scale effect.",
    id: "spring-scale-in",
    name: "Spring Scale In",
    pro: false,
  },
  {
    category: "typography",
    description:
      "Each letter falls from above with a staggered fade-in cascade.",
    id: "top-down-letters",
    name: "Top Down Letters",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "An ultra-fast slide transition with an RGB glitch on the peak frames.",
    id: "chromatic-aberration-wipe",
    name: "Chromatic Aberration Wipe",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "Pull back from a UI to reveal it inside a phone or laptop frame.",
    id: "device-mockup-zoom",
    name: "Device Mockup Zoom",
    pro: false,
  },
  {
    category: "transitions",
    description: "Slide one scene in while pushing the other out.",
    id: "directional-wipe",
    name: "Directional Wipe",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "One text fades out while a new one fades in with a slight blur and motion offset.",
    id: "fade-through",
    name: "Fade Through",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "Elegant scene transition through a sliding pane of frosted glass.",
    id: "frosted-glass-wipe",
    name: "Frosted Glass Wipe",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "Dissolve from one scene to the next through a deterministic grid of mask cells.",
    id: "grid-pixelate-wipe",
    name: "Grid Pixelate Wipe",
    pro: false,
  },
  {
    category: "transitions",
    description: "Use giant typography as a window into the next scene.",
    id: "kinetic-type-mask",
    name: "Kinetic Type Mask",
    pro: false,
  },
  {
    category: "transitions",
    description: "Card lifts off a grid and expands into a full-screen modal.",
    id: "morphing-modal",
    name: "Morphing Modal",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "Words exit one by one, then new words enter word by word with a slight stagger.",
    id: "per-word-crossfade",
    name: "Per Word Crossfade",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "A snappy word-by-word opacity flip using stepped easing for a punchy snap effect.",
    id: "shared-axis-y",
    name: "Shared Axis Y",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "Text scales up and fades out while new text scales in from small, simulating depth on the Z axis.",
    id: "shared-axis-z",
    name: "Shared Axis Z",
    pro: false,
  },
  {
    category: "transitions",
    description:
      "A new scene physically presses the old one back into the frame.",
    id: "spatial-push",
    name: "Spatial Push",
    pro: false,
  },
  {
    category: "transitions",
    description: "Quick swipe transition between scenes.",
    id: "swipe-transition-wipe",
    name: "Swipe Transition Wipe",
    pro: false,
  },
  {
    category: "transitions",
    description: "Aggressive scale-in through an element to the next scene.",
    id: "zoom-through-transition",
    name: "Zoom Through Transition",
    pro: false,
  },
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
      "Word groups with a contextual emoji above, spring scale-in/out animation.",
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
      "One word at a time, uppercase centered, slams in from above and scales down to rest.",
    id: "caption-kinetic-slam",
    name: "Kinetic Slam",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Matrix-style green monospace text that decodes from blurry/bright to sharp using a stepped animation.",
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
      "Words dim at 40% opacity; a colored burst ring expands outward when each word is spoken.",
    id: "caption-particle-burst",
    name: "Particle Burst",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Karaoke-style captions in a rounded pill container — active word snaps to full contrast, others stay dimmed.",
    id: "caption-pill-karaoke",
    name: "Pill Karaoke",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Lava-texture fill via layered radial-gradients and background-clip: text, kinetic-slam style.",
    id: "caption-texture",
    name: "Texture",
    pro: false,
  },
  {
    category: "captions",
    description:
      "Font weight animates from 100 to 900 when each word is spoken, back to thin after.",
    id: "caption-weight-shift",
    name: "Weight Shift",
    pro: false,
  },
  {
    category: "compositions",
    description:
      "A wordmark splits apart as a design node scales up from nothing between the two words.",
    id: "node-reveal",
    name: "Node Reveal",
    pro: true,
  },
];

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
