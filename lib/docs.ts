import { ROUTES } from "@/constants/routes";

import { formatLabelFromSlug } from "./utils";

export const DOCS_DIR = `content${ROUTES.DOCS}`;
export const COMPONENT_DOCS_DIR = `content${ROUTES.COMPONENTS}`;

export const EXCLUDED_SECTIONS = new Set(["installation", "(root)"]);

const TITLE_OVERRIDES: Record<string, string> = {
  json: "JSON",
  "qr-code": "QR Code",
};

export const formatTitleFromSlug = (slug: string): string =>
  TITLE_OVERRIDES[slug] ?? formatLabelFromSlug(slug);

export const homeContentRoute = `${ROUTES.LLMS_MD}/content.md`;
export const docsContentRoute = `${ROUTES.LLMS_MD}${ROUTES.DOCS}`;
export const componentContentRoute = `${ROUTES.LLMS_MD}${ROUTES.COMPONENTS}`;

export const componentMarkdownUrl = (id: string) =>
  `${componentContentRoute}/${id}/content.md`;

export const PAGES_NEW: string[] = [ROUTES.DOCS_CHANGELOG];
