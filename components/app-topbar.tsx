"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AccountButton } from "@/components/account-button";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";
import { findCategoryByPath } from "@/lib/catalog";

const COMPONENTS_PAGE = {
  description: "A little motion makes all the difference.",
  title: "Components",
};

/** Whether the signed-in session has Pro; false until its status is known. */
const useHasPro = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const sessionId = session?.session.id;
  const [status, setStatus] = useState<{
    sessionId: string;
    pro: boolean;
  } | null>(null);
  useEffect(() => {
    if (!(userId && sessionId)) {
      return;
    }
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/api-key", { cache: "no-store" });
        const data: { pro?: boolean } | null = response.ok
          ? await response.json()
          : null;
        if (active) {
          setStatus({ pro: Boolean(data?.pro), sessionId });
        }
      } catch {
        // Unknown status keeps the Get Pro button; it just links to pricing.
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [userId, sessionId]);
  return Boolean(sessionId && status?.sessionId === sessionId && status.pro);
};

export const AppTopbar = () => {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const showTitle =
    Boolean(findCategoryByPath(pathname)) ||
    pathname === ROUTES.COMPONENTS ||
    pathname.startsWith(`${ROUTES.COMPONENTS}/`);
  const showTrigger = isMobile || state === "collapsed";
  const pro = useHasPro();

  // Sign-in hides Get Pro and Log in; with no sidebar trigger the bar is empty.
  if (pathname === ROUTES.SIGN_IN && !showTrigger) {
    return null;
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-3 md:px-4">
      {showTrigger && (
        <SidebarTrigger className="text-foreground -ml-1 size-8" />
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
        {/* Account upgrades live in its plan card; home/pricing have their own CTA; sign-in stays focused. */}
        {!pro &&
          pathname !== ROUTES.HOME &&
          pathname !== ROUTES.PRICING &&
          pathname !== ROUTES.SIGN_IN &&
          pathname !== ROUTES.DASHBOARD && (
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
        {pathname !== ROUTES.SIGN_IN && <AccountButton />}
      </div>
    </header>
  );
};
