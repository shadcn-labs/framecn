"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccountButton } from "@/components/account-button";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/** Get Pro + account. Home and pricing lead with their own Get Pro call to action. */
export const AppActions = () => {
  const pathname = usePathname();
  return (
    <div className="flex shrink-0 items-center gap-2">
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
  );
};

// Notch geometry (px): height matches the 48px top bar.
const HEIGHT = 48;
const SLOPE = 36;
const RADIUS = 12;
// The page card sits 8px below the viewport top (sidebar inset margin).
const GAP = 8;

/**
 * Desktop: the actions sit in a notch cut out of the page card's top-right
 * corner, on the surface behind the card, and stay pinned while the page scrolls.
 * Shapes use the sidebar surface for fill and the card's ring colour for the edge.
 */
export const AppActionsNotch = () => (
  <div className="sticky top-2 z-30 hidden h-0 md:block">
    <div className="absolute -top-px -right-px flex">
      {/* Covers the inset gap above the card so scrolled content never peeks out. */}
      <div
        aria-hidden
        className="bg-sidebar absolute inset-x-0"
        style={{ bottom: "100%", height: GAP }}
      />
      <svg
        aria-hidden
        width={SLOPE}
        height={HEIGHT}
        viewBox={`0 0 ${SLOPE} ${HEIGHT}`}
        className="shrink-0"
      >
        <path
          d={`M0 0 C${SLOPE / 2} 0 ${SLOPE / 2} ${HEIGHT} ${SLOPE} ${HEIGHT} V0 Z`}
          className="fill-sidebar"
        />
        <path
          d={`M0 0.5 C${SLOPE / 2} 0.5 ${SLOPE / 2} ${HEIGHT - 0.5} ${SLOPE} ${HEIGHT - 0.5}`}
          className="stroke-border/60 fill-none"
        />
      </svg>
      <div
        className="bg-sidebar relative flex items-center pr-4 pl-1"
        style={{ height: HEIGHT }}
      >
        <AppActions />
        {/* Bottom edge stops where the card's rounded corner takes over. */}
        <span
          aria-hidden
          className="bg-border/60 absolute bottom-0 left-0 h-px"
          style={{ right: RADIUS }}
        />
        <svg
          aria-hidden
          width={RADIUS}
          height={RADIUS}
          viewBox={`0 0 ${RADIUS} ${RADIUS}`}
          className="absolute right-0"
          style={{ top: HEIGHT }}
        >
          <path
            d={`M0 0 H${RADIUS} V${RADIUS} A${RADIUS} ${RADIUS} 0 0 0 0 0 Z`}
            className="fill-sidebar"
          />
          <path
            d={`M0 0.5 A${RADIUS - 0.5} ${RADIUS - 0.5} 0 0 1 ${RADIUS - 0.5} ${RADIUS}`}
            className="stroke-border/60 fill-none"
          />
        </svg>
      </div>
    </div>
  </div>
);
