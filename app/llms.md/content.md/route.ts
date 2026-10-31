import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { AGENT_DOCS_DIRECTIVE_MARKDOWN } from "@/lib/agent-discovery/directive";
import { requestOrigin } from "@/lib/agent-discovery/request-origin";
import { markdownResponse } from "@/lib/api";
import { CATALOG } from "@/lib/catalog";
import { componentMarkdownUrl } from "@/lib/docs";

export const revalidate = false;

const homepageMarkdown = (origin: string): string => {
  const base = origin.replace(/\/$/u, "");

  return `# ${SITE.NAME}

Beautiful videos, made simple

${AGENT_DOCS_DIRECTIVE_MARKDOWN}

## Quick links

- [Get started](${base}${ROUTES.DOCS_INSTALLATION}.md)
- [Browse components](${base}/components)
- [Documentation](${base}${ROUTES.DOCS}.md)
- [LLM index (llms.txt)](${base}${ROUTES.LLMS})
- [API catalog](${base}${ROUTES.API_CATALOG})
- [OpenAPI description](${base}${ROUTES.OPENAPI})
- [Agent skills index](${base}${ROUTES.AGENT_SKILLS_INDEX})

## Components

${CATALOG.map(
  (item) => `- [${item.name}](${base}${componentMarkdownUrl(item.id)})`
).join("\n")}
`;
};

export const GET = (request: Request) => {
  const body = homepageMarkdown(requestOrigin(request));

  return markdownResponse(body, true);
};

export const HEAD = (request: Request) => {
  const body = homepageMarkdown(requestOrigin(request));

  return markdownResponse(body, false);
};
