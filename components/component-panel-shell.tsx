"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSidebar } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import { categoryHref, findCatalogItemByPath } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type PanelPhase = "entering" | "open" | "closing" | "closed";

/** Exit animations in the panel content must finish within this window before navigation unmounts them. */
export const PANEL_EXIT_MS = 260;
const PANEL_ENTER_MS = 360;

const GalleryPathContext = createContext<string>(ROUTES.COMPONENTS);

/** The gallery URL the user is browsing; stays put while a detail panel is open on top of it. */
export const useGalleryPath = () => useContext(GalleryPathContext);

/**
 * Remembers the last gallery URL (/components or /components/<category>) so the gallery behind an
 * open panel keeps its filter and closing returns to exactly where the user came from.
 */
export const CatalogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const item = findCatalogItemByPath(pathname);
  const [galleryPath, setGalleryPath] = useState(() =>
    item ? categoryHref(item.category) : pathname
  );
  if (!item && pathname !== galleryPath) {
    setGalleryPath(pathname);
  }
  return (
    <GalleryPathContext.Provider value={galleryPath}>
      {children}
    </GalleryPathContext.Provider>
  );
};

interface PanelContextValue {
  close: () => void;
  phase: PanelPhase;
  /** Returns true exactly once per opening, so remounted content never replays the enter animation. */
  claimEnter: () => boolean;
}

const PanelContext = createContext<PanelContextValue | null>(null);

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanel must be used within ComponentPanelShell.");
  }
  return context;
};

/**
 * Persistent frame for the component detail panel. It lives in the catalog layout so stepping between
 * components swaps only the content; open/close motion is driven by the content via `phase`/`claimEnter`.
 */
export const ComponentPanelShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const galleryPath = useGalleryPath();
  const { isMobile, state } = useSidebar();
  const frame = useRef<HTMLDivElement>(null);
  const enterClaimed = useRef(false);
  const open = Boolean(findCatalogItemByPath(pathname));
  const [phase, setPhase] = useState<PanelPhase>("entering");
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setPhase("entering");
    }
  }

  const close = useCallback(
    () => setPhase((current) => (current === "closed" ? current : "closing")),
    []
  );
  const claimEnter = useCallback(() => {
    if (enterClaimed.current) {
      return false;
    }
    enterClaimed.current = true;
    return true;
  }, []);

  useEffect(() => {
    if (open) {
      router.prefetch(galleryPath);
    }
  }, [galleryPath, open, router]);

  useEffect(() => {
    if (phase === "entering") {
      frame.current
        ?.querySelector<HTMLElement>("[data-panel-autofocus]")
        ?.focus({ preventScroll: true });
      const timer = window.setTimeout(() => setPhase("open"), PANEL_ENTER_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === "closing") {
      const timer = window.setTimeout(() => {
        setPhase("closed");
        router.push(galleryPath, { scroll: false });
      }, PANEL_EXIT_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === "closed") {
      enterClaimed.current = false;
    }
  }, [galleryPath, phase, router]);

  useEffect(() => {
    if (!open) {
      enterClaimed.current = false;
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  // The page behind the panel must not scroll while it is open.
  useEffect(() => {
    if (!open) {
      return;
    }
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  const value = useMemo(
    () => ({ claimEnter, close, phase }),
    [claimEnter, close, phase]
  );

  if (!open || phase === "closed") {
    return null;
  }

  // Mobile is flush; on desktop the panel sits exactly over the inset page card. With the sidebar expanded the frame
  // starts 1px left of the card so the gutter paint also hides the card's own 1px ring (it would otherwise run
  // straight past the panel's rounded corners); the panel then draws the same ring itself.
  const panelLeft =
    isMobile || state === "collapsed"
      ? "0"
      : "calc(var(--sidebar-width) - 1px)";

  return (
    <PanelContext.Provider value={value}>
      <div
        ref={frame}
        data-phase={phase}
        className={cn(
          "group/panel fixed inset-y-0 right-0 z-40 flex overflow-hidden transition-[left] duration-200 ease-linear md:p-2",
          state === "expanded" && "md:pl-px"
        )}
        style={{ left: panelLeft }}
      >
        {/* The spread shadow paints the gutters in the sidebar colour so the scrolled page never shows around the panel. */}
        <div className="relative flex min-w-0 flex-1 overflow-hidden md:rounded-xl md:shadow-[0_0_0_1px_color-mix(in_oklab,var(--border)_60%,transparent),0_0_0_100vmax_var(--sidebar)]">
          <div
            aria-hidden
            className="bg-card/70 absolute inset-0 backdrop-blur-md [animation-fill-mode:forwards] group-data-[phase=closing]/panel:animate-out group-data-[phase=closing]/panel:fade-out-0 group-data-[phase=closing]/panel:duration-200 group-data-[phase=entering]/panel:animate-in group-data-[phase=entering]/panel:fade-in-0 group-data-[phase=entering]/panel:duration-300"
          />
          {children}
        </div>
      </div>
    </PanelContext.Provider>
  );
};
