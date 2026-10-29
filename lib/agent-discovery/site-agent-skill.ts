import { createHash } from "node:crypto";

import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { componentContentRoute } from "@/lib/docs";

export const SITE_AGENT_SKILL_MD = `# ${SITE.NAME}

## Summary

Help users discover, preview, and install framecn video components. The public catalog includes 27 typography components, 14 transitions, and 15 captions. Node Reveal is the only Pro composition.

## Registry

- Free registry JSON: \`${ROUTES.REGISTRY}\`
- Components: /components (category galleries at /components/<category>, detail pages at /components/<category>/<id>)
- Component markdown (install command, source, usage, API): ${componentContentRoute}/<id>/content.md
- Compositions: /components/compositions (detail pages at /components/compositions/<id>)
- Docs: ${ROUTES.DOCS}
- Node Reveal preview: /components/compositions/node-reveal. Its source requires a signed-in account with Pro access and is not included in the public registry or markdown exports.

## MCP

This site is a shadcn-compatible registry. For MCP workflows, use the maintained shadcn MCP server documentation: ${LINK.SHADCN_MCP_DOCS}

## Install

\`\`\`bash
npx shadcn@latest add ${SITE.URL}/r/blur-reveal.json
\`\`\`

Prefer following the on-site installation guide: ${ROUTES.DOCS_INSTALLATION}
`;

export const siteAgentSkillDigest = (): string => {
  const hex = createHash("sha256")
    .update(SITE_AGENT_SKILL_MD, "utf-8")
    .digest("hex");

  return `sha256:${hex}`;
};
