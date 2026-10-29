"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccountButton } from "@/components/account-button";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { findCategoryByPath } from "@/lib/catalog";

const COMPONENTS_PAGE = {
  description: "A little motion makes all the difference.",
  title: "Components",
};

export const AppTopbar = () => {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const showTitle =
    Boolean(findCategoryByPath(pathname)) ||
    pathname === ROUTES.COMPONENTS ||
    pathname.startsWith(`${ROUTES.COMPONENTS}/`);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-3 md:px-4">
      {(isMobile || state === "collapsed") && (
        <SidebarTrigger className="text-muted-foreground -ml-1 size-8" />
      )}
      {showTitle ? (
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="shrink-0 text-base font-medium tracking-tight">
            {COMPONENTS_PAGE.title}
          </p>
          <p className="text-muted-foreground hidden truncate text-sm sm:block">
            {COMPONENTS_PAGE.description}
          </p>
        </div>
      ) : null}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* Home and pricing already lead with their own Get Pro call to action. */}
        {pathname !== ROUTES.HOME && pathname !== ROUTES.PRICING && (
          <Button
            size="sm"
            variant="gradient"
            className="rounded-full px-3.5"
            nativeButton={false}
            render={<Link href={ROUTES.PRICING} />}
          >
            Get Pro
          </Button>
        )}
        <AccountButton />
      </div>
    </header>
  );
};
