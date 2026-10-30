import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LINK } from "@/constants/links";
import { FOOTER_COLUMNS } from "@/constants/nav";
import { SITE, UTM_PARAMS } from "@/constants/site";
import { addQueryParams } from "@/lib/url";

const linkClass =
  "text-muted-foreground hover:text-foreground text-sm transition-colors";

export const SiteFooter = () => (
  // No bottom padding: the last row is h-12 like the sidebar footer, and both sit 0.5rem above the viewport edge,
  // so at the end of the page "Created by" lines up with the sidebar's copyright row.
  <footer className="bg-sidebar px-4 pt-14 md:px-6">
    <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
      <div className="max-w-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-0.5 text-base font-medium tracking-tight"
        >
          <span className="flex size-8 items-center justify-center">
            <LogoMark className="size-5" />
          </span>
          <span aria-hidden className="text-muted-foreground/50 text-sm">
            /
          </span>
          <span className="flex h-8 items-center pr-1 pl-1.5">{SITE.NAME}</span>
        </Link>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {SITE.DESCRIPTION.LONG}
        </p>
      </div>
      <nav
        aria-label="Footer"
        className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 xl:grid-cols-5"
      >
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-medium">{column.title}</h2>
            <ul className="mt-3 grid gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className={linkClass}>
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={addQueryParams(link.href, UTM_PARAMS)}
                      target="_blank"
                      rel="noopener"
                      className={linkClass}
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
    <div className="text-muted-foreground mt-10 flex h-12 flex-wrap items-center justify-between gap-2 text-xs">
      <p>
        Created by{" "}
        <Button
          nativeButton={false}
          variant="link"
          className="text-foreground h-auto p-0 text-xs"
          render={
            <a
              href={addQueryParams(LINK.PORTFOLIO, UTM_PARAMS)}
              aria-label={SITE.AUTHOR.NAME}
              target="_blank"
              rel="noopener"
            />
          }
        >
          {SITE.AUTHOR.NAME}
        </Button>
      </p>
      <p>
        A{" "}
        <Button
          nativeButton={false}
          variant="link"
          className="text-foreground h-auto p-0 text-xs"
          render={
            <a
              href={addQueryParams(LINK.SHADCN_LABS, UTM_PARAMS)}
              aria-label="Shadcn Labs"
              target="_blank"
              rel="noopener"
            />
          }
        >
          Shadcn Labs
        </Button>{" "}
        project
      </p>
    </div>
  </footer>
);
