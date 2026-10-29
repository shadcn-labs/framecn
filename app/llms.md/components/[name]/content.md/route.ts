import { notFound } from "next/navigation";

import { markdownResponse } from "@/lib/api";
import { CATALOG } from "@/lib/catalog";
import { getComponentMarkdown } from "@/lib/component-docs";

export const revalidate = false;

interface RouteContext {
  params: Promise<{ name: string }>;
}

const componentMarkdown = async (
  { params }: RouteContext,
  includeBody: boolean
) => {
  const { name } = await params;
  const markdown = await getComponentMarkdown(name);
  if (!markdown) {
    notFound();
  }

  return markdownResponse(markdown, includeBody);
};

export const GET = (_req: Request, context: RouteContext) =>
  componentMarkdown(context, true);

export const HEAD = (_req: Request, context: RouteContext) =>
  componentMarkdown(context, false);

export const generateStaticParams = () =>
  CATALOG.map((item) => ({ name: item.id }));
