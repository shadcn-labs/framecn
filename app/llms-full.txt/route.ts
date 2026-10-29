import { CATALOG } from "@/lib/catalog";
import { getComponentMarkdown } from "@/lib/component-docs";
import { getLLMText, source } from "@/lib/source";

export const revalidate = false;

export const GET = async () => {
  const scanned = await Promise.all([
    ...source.getPages().map(getLLMText),
    ...CATALOG.map((item) => getComponentMarkdown(item.id)),
  ]);

  return new Response(scanned.filter(Boolean).join("\n\n"));
};
