import { ROUTES } from "@/constants/routes";

export const AGENT_DOCS_DIRECTIVE_TEXT =
  `For the complete documentation index, see llms.txt. Markdown variants are available by appending .md to any URL or sending an Accept: text/markdown header. An agent skill is available at ${ROUTES.AGENT_SKILLS_SITE_SKILL}.` as const;

export const AGENT_DOCS_DIRECTIVE_MARKDOWN =
  `> For the complete documentation index, see [llms.txt](${ROUTES.LLMS}). Markdown variants are available by appending \`.md\` to any URL or sending an \`Accept: text/markdown\` header. An agent skill is available at [${ROUTES.AGENT_SKILLS_SITE_SKILL}](${ROUTES.AGENT_SKILLS_SITE_SKILL}).` as const;
