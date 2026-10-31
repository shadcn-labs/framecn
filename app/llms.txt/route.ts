import { llms } from "fumadocs-core/source";

import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { requestOrigin } from "@/lib/agent-discovery/request-origin";
import { CATALOG, CATEGORY_LABELS } from "@/lib/catalog";
import { componentMarkdownUrl } from "@/lib/docs";
import { source } from "@/lib/source";

export const revalidate = false;

const documentationIndex = (base: string) =>
  llms(source)
    .index()
    .replace(/^#\s+(?<title>.+)$/mu, "## $<title>")
    .replaceAll(
      /\]\((?<pathname>\/docs(?:\/[^)#\s]+)?)(?<hash>#[^)]+)?\)/gu,
      (_, pathname, hash = "") => `](${base}${pathname}.md${hash})`
    )
    .trim();

const componentsIndex = (base: string) =>
  Object.entries(CATEGORY_LABELS)
    .map(([category, label]) => {
      const links = CATALOG.filter((item) => item.category === category).map(
        (item) =>
          `- [${item.name}](${base}${componentMarkdownUrl(item.id)}): ${item.description}`
      );

      return `### ${label}\n\n${links.join("\n")}`;
    })
    .join("\n\n");

const docsIndex = (origin: string) => {
  const base = origin.replace(/\/$/u, "");

  return `# ${SITE.NAME}

> ${SITE.DESCRIPTION.LONG} Use this index to discover the available documentation pages, markdown mirrors, and registry resources before browsing.

${documentationIndex(base)}

## Components

${componentsIndex(base)}

## Machine-readable Resources

- [Full documentation](${base}${ROUTES.LLMS_FULL})
- [Homepage markdown](${base}${ROUTES.LLMS_MD}/content.md)
- [OpenAPI description](${base}${ROUTES.OPENAPI})
- [API catalog](${base}${ROUTES.API_CATALOG})
- [Agent skill](${base}${ROUTES.AGENT_SKILLS_SITE_SKILL})
- [shadcn MCP server documentation](${LINK.SHADCN_MCP_DOCS})
`;
};

export const GET = (request: Request) =>
  new Response(docsIndex(requestOrigin(request)), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
