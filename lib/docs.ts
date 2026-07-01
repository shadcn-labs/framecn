import { ROUTES } from "@/constants/routes";

import type { PageTreeFolder } from "./page-tree";
import { formatLabelFromSlug } from "./utils";

export const DOCS_DIR = `content${ROUTES.DOCS}`;

export const EXCLUDED_SECTIONS = new Set(["installation", "(root)"]);

export const isComponentsFolder = (folder: PageTreeFolder) =>
  folder.$id === "components" || folder.name === "Components";

export const isShadersFolder = (folder: PageTreeFolder) =>
  folder.$id === "shaders" || folder.name === "Shaders";

export type DocsSidebarPanel = "components" | "shaders";

export const getDocsSidebarPanel = (pathname: string): DocsSidebarPanel =>
  pathname.startsWith(ROUTES.DOCS_SHADERS) ? "shaders" : "components";

export const isCatalogFolder = (folder: PageTreeFolder) =>
  isComponentsFolder(folder) || isShadersFolder(folder);

const TITLE_OVERRIDES: Record<string, string> = {
  json: "JSON",
  "qr-code": "QR Code",
};

export const formatTitleFromSlug = (slug: string): string =>
  TITLE_OVERRIDES[slug] ?? formatLabelFromSlug(slug);

export const homeContentRoute = `${ROUTES.LLMS_MD}/content.md`;
export const docsContentRoute = `${ROUTES.LLMS_MD}${ROUTES.DOCS}`;
export const docsImageRoute = `${ROUTES.OG}${ROUTES.DOCS}`;

export const PAGES_NEW: string[] = [
  ROUTES.DOCS_CHANGELOG,
  `${ROUTES.DOCS_COMPONENTS}/primitives/backdrop`,
  `${ROUTES.DOCS_COMPONENTS}/primitives/confetti`,
  `${ROUTES.DOCS_COMPONENTS}/primitives/logo-enter`,
  `${ROUTES.DOCS_COMPONENTS}/transitions/fade-through`,
  `${ROUTES.DOCS_COMPONENTS}/transitions/per-word-crossfade`,
  `${ROUTES.DOCS_COMPONENTS}/transitions/shared-axis-y`,
  `${ROUTES.DOCS_COMPONENTS}/transitions/shared-axis-z`,
  `${ROUTES.DOCS_COMPONENTS}/typography/blur-out-up`,
  `${ROUTES.DOCS_COMPONENTS}/typography/bottom-up-letters`,
  `${ROUTES.DOCS_COMPONENTS}/typography/focus-blur-resolve`,
  `${ROUTES.DOCS_COMPONENTS}/typography/line-by-line-slide`,
  `${ROUTES.DOCS_COMPONENTS}/typography/mask-reveal-up`,
  `${ROUTES.DOCS_COMPONENTS}/typography/micro-scale-fade`,
  `${ROUTES.DOCS_COMPONENTS}/typography/per-character-rise`,
  `${ROUTES.DOCS_COMPONENTS}/typography/scale-down-fade`,
  `${ROUTES.DOCS_COMPONENTS}/typography/short-slide-right`,
  `${ROUTES.DOCS_COMPONENTS}/typography/soft-blur-in`,
  `${ROUTES.DOCS_COMPONENTS}/typography/spring-scale-in`,
  `${ROUTES.DOCS_COMPONENTS}/typography/top-down-letters`,
];
