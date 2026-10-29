import { SITE } from "@/constants/site";
import { catalogItemHref } from "@/lib/catalog";
import type { CatalogItem } from "@/lib/catalog";
import { componentMarkdownUrl } from "@/lib/docs";
import {
  PRO_API_KEY_ENV,
  PRO_REGISTRY_NAMESPACE,
  proInstallCommand,
} from "@/lib/pro-install";

/** Agent-ready prompt for installing and using a catalog item; `usage` overrides the generic render hint. */
export const componentPrompt = (item: CatalogItem, usage?: string) =>
  [
    `Add the "${item.name}" video component from framecn (${SITE.URL}${catalogItemHref(item)}) to my React project. ${item.description}`,
    item.pro
      ? `It is a framecn Pro component. Make sure components.json has the ${PRO_REGISTRY_NAMESPACE} registry configured with the ${PRO_API_KEY_ENV} env var, then run \`${proInstallCommand(item.id)}\`.`
      : `Install it with \`npx shadcn@latest add ${SITE.REGISTRY}/${item.id}\`.`,
    `Read the docs first: ${SITE.URL}${componentMarkdownUrl(item.id)}`,
    usage ??
      "Render it inside an Editframe composition and adjust its props to match my brand.",
  ].join("\n\n");
