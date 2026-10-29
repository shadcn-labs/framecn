import { findNeighbour } from "fumadocs-core/page-tree";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsCopyPage } from "@/components/docs-copy-page";
import { DocsKeyboardShortcuts } from "@/components/docs-keyboard-shortcuts";
import { DocsNavLink } from "@/components/docs-nav-link";
import { DocsPager } from "@/components/docs-pager";
import type { DocsPagerItem } from "@/components/docs-pager";
import { DocsShareMenu } from "@/components/docs-share-menu";
import { DocsSidebar } from "@/components/docs-sidebar";
import { PageTransition } from "@/components/page-transition";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { DOCS_DIR, formatTitleFromSlug } from "@/lib/docs";
import { getPageMarkdownUrl, source } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";
import { mdxComponents } from "@/mdx-components";
import { BreadcrumbJsonLd } from "@/seo/json-ld";
import { createPageMetadata } from "@/seo/metadata";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>;
}) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const doc = page.data;

  return createPageMetadata({
    description: doc.description,
    ogType: "article",
    path: page.url,
    title: doc.title,
  });
};

const buildBreadcrumbs = (
  slugs: string[],
  pageTitle: string,
  pageUrl: string
) => {
  const items: { name: string; path: string }[] = [{ name: "Home", path: "/" }];

  if (slugs.length === 0) {
    items.push({ name: pageTitle, path: pageUrl });
    return items;
  }

  items.push({ name: "Docs", path: ROUTES.DOCS });

  let currentPath = ROUTES.DOCS;
  for (let i = 0; i < slugs.length - 1; i += 1) {
    currentPath += `/${slugs[i]}`;
    items.push({ name: formatTitleFromSlug(slugs[i]), path: currentPath });
  }

  items.push({ name: pageTitle, path: pageUrl });
  return items;
};

const toPagerItem = (
  node: { url: string; name: React.ReactNode } | undefined
): DocsPagerItem | undefined => {
  if (!node) {
    return undefined;
  }
  const target = source.getPages().find((p) => p.url === node.url);
  return {
    description: target?.data.description,
    title: target?.data.title ?? String(node.name),
    url: node.url,
  };
};

const Page = async (props: { params: Promise<{ slug?: string[] }> }) => {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const doc = page.data;
  const MdxContent = doc.body;
  const neighbours = findNeighbour(source.pageTree, page.url);
  const markdownUrl = getPageMarkdownUrl(page).url;

  const { links } = doc as { links?: { doc?: string; api?: string } };
  const breadcrumbs = buildBreadcrumbs(params.slug ?? [], doc.title, page.url);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <DocsKeyboardShortcuts
        previous={neighbours.previous ? neighbours.previous.url : null}
        next={neighbours.next ? neighbours.next.url : null}
      />

      <PageTransition>
        <div
          data-slot="docs"
          className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="h-(--top-spacing) shrink-0" />
            <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-8 px-6 py-8 md:px-10 lg:py-12">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                      {doc.title}
                    </h1>
                    <div className="docs-nav -mt-0.5 flex shrink-0 items-start gap-2">
                      <div className="hidden sm:block">
                        <DocsCopyPage
                          markdownUrl={absoluteUrl(markdownUrl)}
                          url={absoluteUrl(page.url)}
                        />
                      </div>
                      <div className="ml-auto flex gap-2">
                        <DocsShareMenu
                          title={doc.title}
                          url={absoluteUrl(page.url)}
                        />
                        {neighbours.previous && (
                          <DocsNavLink
                            href={neighbours.previous.url}
                            transitionTypes={["nav-back"]}
                            className="extend-touch-target size-8 md:size-7"
                            tooltip={{
                              icon: <ArrowLeftIcon />,
                              title: "Previous Page",
                            }}
                          >
                            <span className="sr-only">Previous</span>
                          </DocsNavLink>
                        )}
                        {neighbours.next && (
                          <DocsNavLink
                            href={neighbours.next.url}
                            transitionTypes={["nav-forward"]}
                            className="extend-touch-target size-8 md:size-7"
                            tooltip={{
                              icon: <ArrowRightIcon />,
                              title: "Next Page",
                            }}
                          >
                            <span className="sr-only">Next</span>
                          </DocsNavLink>
                        )}
                      </div>
                    </div>
                  </div>
                  {doc.description && (
                    <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                      {doc.description}
                    </p>
                  )}
                </div>
                {links ? (
                  <div className="flex items-center space-x-2 pt-4">
                    {links?.doc && (
                      <Badge
                        variant="secondary"
                        render={
                          <Link
                            href={links.doc}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        Docs <ArrowUpRightIcon />
                      </Badge>
                    )}
                    {links?.api && (
                      <Badge
                        variant="secondary"
                        render={
                          <Link
                            href={links.api}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        API Reference <ArrowUpRightIcon />
                      </Badge>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
                <MdxContent components={mdxComponents} />
              </div>
            </div>
            <div className="mx-auto w-full max-w-3xl px-6 pb-24 md:px-10">
              <DocsPager
                previous={toPagerItem(neighbours.previous)}
                next={toPagerItem(neighbours.next)}
              />
            </div>
          </div>
          <DocsSidebar toc={doc.toc} filePath={`${DOCS_DIR}/${page.path}`} />
        </div>
      </PageTransition>
    </>
  );
};

export default Page;
