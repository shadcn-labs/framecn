export const FALLBACK_SITE_ORIGIN = "https://framecn.dev" as const;

const getBaseUrl = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.SITE_URL ?? FALLBACK_SITE_ORIGIN;
};

const baseUrl = getBaseUrl();

export const SITE = {
  AUTHOR: {
    NAME: "Aniket Pawar",
    TWITTER: "@alaymanguy",
  },
  DESCRIPTION: {
    LONG: "A collection of beautifully designed, and customizable video components. Built on Editframe. Works with shadcn/ui.",
    SHORT: "Beautiful videos, made simple",
  },
  KEYWORDS: [
    "video",
    "video components",
    "editframe",
    "video editing",
    "mp4",
    "rendering",
    "shadcn",
    "shadcn registry",
    "component registry",
    "shadcn components",
    "next.js",
    "tailwindcss",
    "npx shadcn add",
  ] as const,
  NAME: "framecn",
  OG_IMAGE: `${baseUrl}/og.png`,
  REGISTRY: "@framecn",
  URL: baseUrl,
};

export const META_THEME_COLORS = {
  dark: "#09090b",
  light: "#ffffff",
};

export const UTM_PARAMS = {
  utm_source: new URL(baseUrl).hostname,
};
