import { RssIcon } from "lucide-react";
import Link from "next/link";

import { DocsSidebar } from "@/components/docs-sidebar";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { getChangelogPages } from "@/lib/changelog";
import type { ChangelogPageData } from "@/lib/changelog";
import { mdxComponents } from "@/mdx-components";
import { createPageMetadata } from "@/seo/metadata";

export const revalidate = false;
export const dynamic = "force-static";

const NUMBER_OF_LATEST_PAGES = 5;

export const metadata = createPageMetadata({
  description: "Latest updates and announcements.",
  ogType: "article",
  path: ROUTES.DOCS_CHANGELOG,
  title: "Changelog",
});

export default function ChangelogPage() {
  const pages = getChangelogPages();
  const latestPages = pages.slice(0, NUMBER_OF_LATEST_PAGES);
  const olderPages = pages.slice(NUMBER_OF_LATEST_PAGES);
  const toc = pages.map((page) => ({
    depth: 2,
    title: page.data.title,
    url: page.url,
  }));

  return (
    <PageTransition>
      <div
        data-slot="docs"
        className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-(--top-spacing) shrink-0" />
          <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-8 px-6 page-y text-neutral-800 md:px-10 dark:text-neutral-300">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="heading-title scroll-m-20">Changelog</h1>
                  <Button
                    nativeButton={false}
                    variant="secondary"
                    size="sm"
                    className="-mt-0.5 shrink-0"
                    render={
                      <a
                        href={ROUTES.RSS}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <RssIcon />
                    RSS
                  </Button>
                </div>
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                  Latest updates and announcements.
                </p>
              </div>
            </div>
            <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
              {latestPages.map((page) => {
                const data = page.data as ChangelogPageData;
                const MDX = page.data.body;

                return (
                  <article key={page.url} className="mb-12 border-b pb-12">
                    <h2 className="heading-subtitle">{data.title}</h2>
                    <div className="typeset typeset-site mt-6">
                      <MDX components={mdxComponents} />
                    </div>
                  </article>
                );
              })}
              {olderPages.length > 0 && (
                <div id="more-updates" className="scroll-mt-24">
                  <h2 className="heading-subtitle mb-6">More Updates</h2>
                  <div className="grid auto-rows-fr gap-3 sm:grid-cols-2">
                    {olderPages.map((page) => {
                      const data = page.data as ChangelogPageData;
                      const [date, ...titleParts] = data.title.split(" - ");
                      const title = titleParts.join(" - ");
                      return (
                        <Link
                          key={page.url}
                          href={page.url}
                          className="flex w-full flex-col rounded-xl bg-surface px-4 py-3 text-surface-foreground transition-colors hover:bg-surface/80"
                        >
                          <span className="text-xs text-muted-foreground">
                            {date}
                          </span>
                          <span className="text-sm font-medium">{title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DocsSidebar toc={toc} filePath="app/(app)/docs/changelog/page.tsx" />
      </div>
    </PageTransition>
  );
}
