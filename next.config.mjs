import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { LINK } = await jiti.import("./constants/links");
const { ROUTES } = await jiti.import("./constants/routes");
const { CATALOG, catalogItemHref, categoryHref } =
  await jiti.import("./lib/catalog");

const ALL_COMPONENTS = "/components";

/**
 * Legacy `/docs/components/<category>/<slug>` pages, now served at their
 * catalog detail URL (or the gallery when the component was removed).
 * Caption ids are prefixed with `caption-`.
 */
const LEGACY_COMPONENT_DOCS = {
  captions: [
    "clip-wipe",
    "editorial-emphasis",
    "emoji-pop",
    "glitch-rgb",
    "gradient-fill",
    "highlight",
    "kinetic-slam",
    "matrix-decode",
    "neon-accent",
    "neon-glow",
    "parallax-layers",
    "particle-burst",
    "pill-karaoke",
    "texture",
    "weight-shift",
  ],
  compositions: ["node-reveal"],
  transitions: [
    "chromatic-aberration-wipe",
    "device-mockup-zoom",
    "directional-wipe",
    "fade-through",
    "frosted-glass-wipe",
    "grid-pixelate-wipe",
    "kinetic-type-mask",
    "morphing-modal",
    "per-word-crossfade",
    "shared-axis-y",
    "shared-axis-z",
    "spatial-push",
    "swipe-transition-wipe",
    "zoom-through-transition",
  ],
  typography: [
    "blur-reveal",
    "typewriter",
    "inline-highlight",
    "text-fade-replace",
    "strikethrough-replace",
    "staggered-fade-up",
    "masked-slide-reveal",
    "slot-machine-roll",
    "shimmer-sweep",
    "matrix-decode",
    "tracking-in",
    "marker-highlight",
    "rgb-glitch-text",
    "infinite-marquee",
    "perspective-marquee",
    "blur-out-up",
    "bottom-up-letters",
    "focus-blur-resolve",
    "line-by-line-slide",
    "mask-reveal-up",
    "micro-scale-fade",
    "per-character-rise",
    "scale-down-fade",
    "short-slide-right",
    "soft-blur-in",
    "spring-scale-in",
    "top-down-letters",
  ],
};

/**
 * Free typography and transition components that were removed; their URLs
 * (and the former `/components/transitions` gallery) go to the gallery.
 */
const REMOVED_COMPONENTS = {
  transitions: LEGACY_COMPONENT_DOCS.transitions,
  typography: LEGACY_COMPONENT_DOCS.typography,
};

const withMarkdown = ({ destination, source }) => [
  { destination, permanent: true, source },
  {
    destination:
      destination === ALL_COMPONENTS ? destination : `${destination}.md`,
    permanent: true,
    source: `${source}.md`,
  },
];

const legacyComponentDocRedirects = Object.entries(
  LEGACY_COMPONENT_DOCS
).flatMap(([category, slugs]) =>
  slugs.flatMap((slug) => {
    const id = category === "captions" ? `caption-${slug}` : slug;
    const item = CATALOG.find((entry) => entry.id === id);
    return withMarkdown({
      destination: item ? catalogItemHref(item) : ALL_COMPONENTS,
      source: `/docs/components/${category}/${slug}`,
    });
  })
);

const removedComponentRedirects = [
  {
    destination: ALL_COMPONENTS,
    permanent: true,
    source: `${ALL_COMPONENTS}/transitions/:path*`,
  },
  ...Object.entries(REMOVED_COMPONENTS).flatMap(([category, ids]) =>
    ids.flatMap((id) => [
      ...withMarkdown({
        destination: ALL_COMPONENTS,
        source: `${ALL_COMPONENTS}/${category}/${id}`,
      }),
      ...withMarkdown({
        destination: ALL_COMPONENTS,
        source: `${ALL_COMPONENTS}/${id}`,
      }),
    ])
  ),
  // The Typography category is now Text.
  {
    destination: categoryHref("text"),
    permanent: true,
    source: `${ALL_COMPONENTS}/typography`,
  },
  {
    destination: `${categoryHref("text")}/:id`,
    permanent: true,
    source: `${ALL_COMPONENTS}/typography/:id`,
  },
];

/** Previous canonical `/components/<id>` detail URLs, one explicit entry per item. */
const previousComponentRedirects = CATALOG.flatMap((item) =>
  withMarkdown({
    destination: catalogItemHref(item),
    source: `${ROUTES.COMPONENTS}/${item.id}`,
  })
);

/** The former Templates section and its `/templates/<id>` detail URLs; compositions now live under /components. */
const LEGACY_TEMPLATES = "/templates";
const previousTemplateRedirects = [
  {
    destination: categoryHref("compositions"),
    permanent: true,
    source: LEGACY_TEMPLATES,
  },
  ...CATALOG.filter((item) => item.category === "compositions").flatMap(
    (item) =>
      withMarkdown({
        destination: catalogItemHref(item),
        source: `${LEGACY_TEMPLATES}/${item.id}`,
      })
  ),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    // Next 16.3 caches Turbopack builds in .next/cache, which Vercel restores
    // between deployments; a stale cache shipped old CSS (missing new utilities).
    turbopackFileSystemCacheForBuild: false,
  },
  headers() {
    const link = [
      `<${ROUTES.API_CATALOG}>; rel="api-catalog"`,
      `<${ROUTES.OPENAPI}>; rel="service-desc"`,
      `<${ROUTES.DOCS}>; rel="service-doc"`,
      `<${LINK.SHADCN_MCP_DOCS}>; rel="service-doc"; title="shadcn MCP server"`,
      `<${ROUTES.AGENT_SKILLS_INDEX}>; rel="describedby"`,
    ].join(", ");

    return [{ headers: [{ key: "Link", value: link }], source: ROUTES.HOME }];
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*"],
  },
  redirects() {
    return [
      {
        destination: ALL_COMPONENTS,
        permanent: true,
        source: "/docs/components",
      },
      ...[
        ["typography", categoryHref("text")],
        ["transitions", ALL_COMPONENTS],
        ["captions", categoryHref("captions")],
        ["compositions", categoryHref("compositions")],
      ].map(([category, destination]) => ({
        destination,
        permanent: true,
        source: `/docs/components/${category}`,
      })),
      ...previousTemplateRedirects,
      ...legacyComponentDocRedirects,
      ...removedComponentRedirects,
      ...previousComponentRedirects,
      {
        destination: ALL_COMPONENTS,
        permanent: true,
        source: "/docs/components/:path*",
      },
      {
        destination: `${ROUTES.DOCS}.md`,
        permanent: true,
        source: `${ROUTES.DOCS}.mdx`,
      },
      {
        destination: `${ROUTES.DOCS}/:path*.md`,
        permanent: true,
        source: `${ROUTES.DOCS}/:path*.mdx`,
      },
    ];
  },
  rewrites() {
    return [
      {
        destination: `${ROUTES.LLMS_MD}${ROUTES.COMPONENTS}/:name/content.md`,
        source: `${ROUTES.COMPONENTS}/:category/:name.md`,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
