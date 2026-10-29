import "server-only";
import { loader } from "fumadocs-core/source";
import type { InferPageType } from "fumadocs-core/source";

import { componentDocs } from "@/.source/server";
import { ROUTES } from "@/constants/routes";
import { CATALOG } from "@/lib/catalog";
import { componentMarkdownUrl } from "@/lib/docs";
import { componentSourceMarkdown, processMdxForLLMs } from "@/lib/llm";
import { PRO_API_KEY_ENV, proInstallCommand } from "@/lib/pro-install";

const componentSource = loader({
  baseUrl: ROUTES.COMPONENTS,
  source: componentDocs.toFumadocsSource(),
});

type ComponentDocPage = InferPageType<typeof componentSource>;

export interface ComponentDoc {
  title: string;
  description?: string;
  Body: ComponentDocPage["data"]["body"];
  markdownUrl: string;
}

export const getComponentDoc = (id: string): ComponentDoc | undefined => {
  const page = componentSource.getPage([id]);
  if (!page) {
    return undefined;
  }

  return {
    Body: page.data.body,
    description: page.data.description,
    markdownUrl: componentMarkdownUrl(id),
    title: page.data.title,
  };
};

const installMarkdown = (id: string, pro: boolean) =>
  pro
    ? `## Installation

\`\`\`bash
${proInstallCommand(id)}
\`\`\`

This component requires framecn Pro. Create an API key from your account, expose it as \`${PRO_API_KEY_ENV}\`, and register the \`@framecn-pro\` registry in \`components.json\` before installing.`
    : `## Installation

\`\`\`bash
npx shadcn@latest add @framecn/${id}
\`\`\``;

export const getComponentMarkdown = async (
  id: string
): Promise<string | undefined> => {
  const item = CATALOG.find((entry) => entry.id === id);
  const page = componentSource.getPage([id]);
  if (!item || !page) {
    return undefined;
  }

  const [source, body] = await Promise.all([
    item.pro ? "" : componentSourceMarkdown(id),
    // Pro usage, API reference and notes are part of the paid product, like the source.
    item.pro ? "" : page.data.getText("raw").then(processMdxForLLMs),
  ]);

  const sections = [
    page.data.description ?? item.description,
    installMarkdown(id, item.pro),
    source && `## Source\n\n${source}`,
    body,
  ].filter(Boolean);

  return `# ${page.data.title}

${sections.join("\n\n")}
`;
};
