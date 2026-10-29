import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { LINK } = await jiti.import("./constants/links");
const { ROUTES } = await jiti.import("./constants/routes");
const { CATALOG, catalogItemHref, categoryHref } =
  await jiti.import("./lib/catalog");

/**
 * Legacy `/docs/components/<category>/<slug>` pages, now served at their
 * catalog detail URL. Caption ids are prefixed with `caption-`.
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

const legacyComponentDocRedirects = Object.entries(
  LEGACY_COMPONENT_DOCS
).flatMap(([category, slugs]) =>
  slugs.flatMap((slug) => {
    const id = category === "captions" ? `caption-${slug}` : slug;
    const item = CATALOG.find((entry) => entry.id === id);
    const destination = item ? catalogItemHref(item) : categoryHref(category);
    const source = `/docs/components/${category}/${slug}`;

    return [
      { destination, permanent: true, source },
      {
        destination: item ? `${destination}.md` : destination,
        permanent: true,
        source: `${source}.md`,
      },
    ];
  })
);

/** Previous canonical `/components/<id>` detail URLs, one explicit entry per item. */
const previousComponentRedirects = CATALOG.flatMap((item) => [
  {
    destination: catalogItemHref(item),
    permanent: true,
    source: `${ROUTES.COMPONENTS}/${item.id}`,
  },
  {
    destination: `${catalogItemHref(item)}.md`,
    permanent: true,
    source: `${ROUTES.COMPONENTS}/${item.id}.md`,
  },
]);

/** The former Templates section and its `/templates/<id>` detail URLs; compositions now live under /components. */
const LEGACY_TEMPLATES = "/templates";
const previousTemplateRedirects = [
  { destination: "/components/compositions", permanent: true, source: LEGACY_TEMPLATES },
  ...CATALOG.filter((item) => item.category === "compositions").flatMap((item) => [
    {
      destination: catalogItemHref(item),
      permanent: true,
      source: `${LEGACY_TEMPLATES}/${item.id}`,
    },
    {
      destination: `${catalogItemHref(item)}.md`,
      permanent: true,
      source: `${LEGACY_TEMPLATES}/${item.id}.md`,
    },
  ]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
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
        destination: "/components",
        permanent: true,
        source: "/docs/components",
      },
      ...["typography", "transitions", "captions"].map((category) => ({
        destination: categoryHref(category),
        permanent: true,
        source: `/docs/components/${category}`,
      })),
      {
        destination: categoryHref("compositions"),
        permanent: true,
        source: "/docs/components/compositions",
      },
      ...previousTemplateRedirects,
      ...legacyComponentDocRedirects,
      ...previousComponentRedirects,
      {
        destination: "/components",
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
