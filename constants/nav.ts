import { ROUTES } from "./routes";

export interface LabsNavLink {
  href: string;
  name: string;
  description?: string;
}

export const LABS_LATEST = {
  description: "The latest from Shadcn Labs",
  href: "https://snapcn.dev",
  name: "snapcn",
} as const satisfies LabsNavLink;

export const LABS_REGISTRIES = [
  { href: "https://termcn.dev", name: "termcn" },
  { href: "https://ogimagecn.com", name: "ogimagecn" },
  { href: "https://agentcn.run", name: "agentcn" },
  { href: "https://mcpcn.dev", name: "mcpcn" },
  { href: "https://emailcn.run", name: "emailcn" },
  { href: "https://pdfcn.dev", name: "pdfcn" },
  { href: "https://editorcn.vercel.app", name: "editorcn" },
  { href: "https://shadercn.run", name: "shadercn" },
  { href: "https://mdxcn.dev", name: "mdxcn" },
] as const satisfies readonly LabsNavLink[];

export const LABS_TEMPLATES = [
  { href: "https://startercn.vercel.app", name: "startercn" },
] as const satisfies readonly LabsNavLink[];

export const LABS_PORTS = [
  { href: "https://shadcn-cssinjs.com", name: "shadcn-cssinjs" },
] as const satisfies readonly LabsNavLink[];

export const LABS_SKILLS = [
  {
    href: "https://skills.sh/shadcn-labs/skills/launch-shadcn-registry",
    name: "launch-shadcn-registry",
  },
  {
    href: "https://skills.sh/shadcn-labs/skills/tailwind-to-stylex",
    name: "tailwind-to-stylex",
  },
  {
    href: "https://skills.sh/shadcn-labs/skills/mastra-file-agents",
    name: "mastra-file-agents",
  },
] as const satisfies readonly LabsNavLink[];

export const LABS_NAV_SECTIONS = [
  { id: "registries", items: LABS_REGISTRIES, title: "Registries" },
  { id: "templates", items: LABS_TEMPLATES, title: "Templates" },
  { id: "ports", items: LABS_PORTS, title: "Ports" },
  { id: "skills", items: LABS_SKILLS, title: "Skills" },
] as const;

export const APP_NAV = [
  { href: ROUTES.COMPONENTS, name: "Components" },
  { href: ROUTES.DOCS, name: "Docs" },
  { href: ROUTES.PRICING, name: "Pricing" },
] as const;

export const TOP_LEVEL_SECTIONS = [
  { href: ROUTES.DOCS, name: "Introduction" },
  { href: ROUTES.DOCS_INSTALLATION, name: "Installation" },
  { href: ROUTES.DOCS_MCP, name: "MCP" },
  { href: ROUTES.DOCS_REGISTRY, name: "Registry" },
  { href: ROUTES.LLMS, name: "llms.txt" },
  { href: ROUTES.DOCS_CHANGELOG, name: "Changelog" },
] as const;

/** Products by the same author outside Shadcn Labs (the sidebar project switcher already lists the labs). */
export const OTHER_PRODUCTS = [
  { href: "https://heroicons-animated.com", name: "Heroicons Animated" },
  { href: "https://www.vercel-doctor.com", name: "Vercel Doctor" },
  { href: "https://www.ossperks.com", name: "OSS Perks" },
  { href: "https://motionvideo.xyz", name: "MotionVideo" },
  { href: "https://shadcnweekly.com", name: "Shadcn Weekly" },
] as const satisfies readonly LabsNavLink[];

export const FOOTER_COLUMNS = [
  {
    links: [
      { href: ROUTES.HOME, name: "Home" },
      { href: ROUTES.COMPONENTS, name: "Components" },
      { href: ROUTES.PRICING, name: "Pricing" },
    ],
    title: "Site",
  },
  {
    links: TOP_LEVEL_SECTIONS.filter((section) => section.href !== ROUTES.LLMS),
    title: "Docs",
  },
  {
    links: [
      { href: ROUTES.ABOUT, name: "About" },
      { href: ROUTES.BRAND, name: "Brand" },
      { href: ROUTES.CONTACT, name: "Contact" },
      { href: ROUTES.SPONSOR, name: "Sponsor" },
    ],
    title: "Company",
  },
  {
    links: [
      { href: ROUTES.TERMS, name: "Terms" },
      { href: ROUTES.PRIVACY, name: "Privacy" },
      { href: ROUTES.REFUNDS, name: "Refunds" },
      { href: ROUTES.LICENSE, name: "License" },
    ],
    title: "Legal",
  },
  { links: OTHER_PRODUCTS, title: "Other products" },
] as const;
