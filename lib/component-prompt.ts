import { SITE } from "@/constants/site";
import { catalogItemHref } from "@/lib/catalog";
import type { CatalogItem } from "@/lib/catalog";
import { componentMarkdownUrl } from "@/lib/docs";
import { installCommand, PRO_API_KEY_ENV } from "@/lib/pro-install";

/** Agent-ready prompt for installing and using a catalog item; `usage` overrides the generic render hint. */
export const componentPrompt = (item: CatalogItem, usage?: string) =>
  [
    `Add the "${item.name}" video component from framecn (${SITE.URL}${catalogItemHref(item)}) to my React project. ${item.description}`,
    item.pro
      ? `It is a framecn Pro component. Make sure the ${SITE.REGISTRY} registry in components.json sends the ${PRO_API_KEY_ENV} env var as a Bearer token, then run \`${installCommand(item.id)}\`.`
      : `Install it with \`${installCommand(item.id)}\`.`,
    `Read the docs first: ${SITE.URL}${componentMarkdownUrl(item.id)}`,
    usage ??
      "Render it inside an Editframe composition and adjust its props to match my brand.",
  ].join("\n\n");
