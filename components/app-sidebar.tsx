"use client";

import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BlocksIcon,
  BookOpenIcon,
  ChevronRightIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { BrandContextMenu } from "@/components/brand-context-menu";
import { XIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { ProBadge } from "@/components/pro-badge";
import { SiteSettings } from "@/components/site-settings";
import { SponsorSlot } from "@/components/sponsor-slot";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LINK } from "@/constants/links";
import {
  APP_NAV,
  LABS_LATEST,
  LABS_NAV_SECTIONS,
  TOP_LEVEL_SECTIONS,
} from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { SITE, UTM_PARAMS } from "@/constants/site";
import {
  CATALOG,
  CATEGORY_LABELS,
  catalogItemHref,
  categoryHref,
  COMPONENT_CATEGORIES,
  findCatalogItemByPath,
} from "@/lib/catalog";
import { addQueryParams } from "@/lib/url";

const getCurrentYear = () => new Date().getFullYear();
const getServerYear = () => null;

const subscribeToYear = (onChange: () => void) => {
  let timeout: number;
  const schedule = () => {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    // Browsers cap timeout delays at a signed 32-bit integer.
    timeout = window.setTimeout(
      () => {
        onChange();
        schedule();
      },
      Math.min(nextYear.getTime() - now.getTime(), 2_147_483_647)
    );
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      window.clearTimeout(timeout);
      onChange();
      schedule();
    }
  };
  schedule();
  document.addEventListener("visibilitychange", onVisibilityChange);
  return () => {
    window.clearTimeout(timeout);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
};

/** Muted rows; hover and active are tints of primary, active a step stronger than hover. */
const ROW_TONE =
  "text-muted-foreground hover:bg-sidebar-primary/[0.05] hover:text-sidebar-foreground active:bg-sidebar-primary/[0.08] data-[active=true]:bg-sidebar-primary/[0.08] data-[active=true]:text-sidebar-foreground";

const EXPANDABLE = new Set<string>([ROUTES.COMPONENTS, ROUTES.DOCS]);

const PRIMARY_NAV_ICONS: Record<string, typeof BlocksIcon> = {
  [ROUTES.COMPONENTS]: BlocksIcon,
  [ROUTES.DOCS]: BookOpenIcon,
  [ROUTES.PRICING]: WalletIcon,
};

interface TreeItem {
  href: string;
  name: string;
  active: boolean;
  pro?: boolean;
}

/** Nested list on a guide line; the active row gets a primary marker on that line. */
const TreeList = ({
  items,
  onNavigate,
}: {
  items: TreeItem[];
  onNavigate: () => void;
}) => (
  <SidebarMenuSub className="mx-0 ml-3 gap-0.5 px-0 py-0 pl-1">
    {items.map((item) => (
      <SidebarMenuSubItem key={item.href}>
        {item.active && (
          <span
            aria-hidden
            className="bg-sidebar-primary absolute top-1/2 -left-[5.5px] h-4 w-0.5 -translate-y-1/2 rounded-full"
          />
        )}
        <SidebarMenuSubButton
          isActive={item.active}
          className={`${ROW_TONE} h-8 px-2.5 text-sm`}
          render={
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.active ? "page" : undefined}
              onClick={onNavigate}
            />
          }
        >
          <span className="truncate">{item.name}</span>
          {item.pro && <ProBadge className="ml-auto" />}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ))}
  </SidebarMenuSub>
);

/** Every catalog entry, grouped by category; keeps the open entry scrolled into view. */
const CatalogList = ({ onNavigate }: { onNavigate: () => void }) => {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pathname) {
      return;
    }
    container.current
      ?.querySelector(`[data-active=true][href="${CSS.escape(pathname)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);
  return (
    <div ref={container}>
      {COMPONENT_CATEGORIES.map((category) => {
        const items = CATALOG.filter((item) => item.category === category);
        if (items.length === 0) {
          return null;
        }
        const href = categoryHref(category);
        return (
          <section key={category} aria-label={CATEGORY_LABELS[category]}>
            {/* Label sits on the guide line; the count lines up with the Pro badges. */}
            <SidebarGroupLabel
              className="hover:text-sidebar-foreground mb-0.5 ml-3 h-7 gap-2 pr-2.5 pl-0 text-xs"
              render={
                <Link
                  href={href}
                  scroll={false}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={onNavigate}
                />
              }
            >
              {CATEGORY_LABELS[category]}
              <span className="text-muted-foreground ml-auto font-mono text-[11px] tabular-nums">
                {items.length}
              </span>
            </SidebarGroupLabel>
            <TreeList
              onNavigate={onNavigate}
              items={items.map((item) => {
                const itemHref = catalogItemHref(item);
                return {
                  active: pathname === itemHref,
                  href: itemHref,
                  name: item.name,
                  pro: item.pro,
                };
              })}
            />
          </section>
        );
      })}
    </div>
  );
};

const MainView = ({
  onShowProjects,
  search,
}: {
  onShowProjects: () => void;
  search: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const closeMobile = () => isMobile && setOpenMobile(false);
  const openItem = findCatalogItemByPath(pathname);
  const isActive = (href: string) =>
    openItem
      ? href === ROUTES.COMPONENTS
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <SidebarHeader className="h-12 flex-row items-center gap-0.5 px-1 py-0">
        <BrandContextMenu>
          <Button
            nativeButton={false}
            variant="ghost"
            size="icon"
            className="size-8"
            render={
              <Link href={ROUTES.HOME} aria-label={`${SITE.NAME} home`} />
            }
          >
            <LogoMark className="size-5" />
          </Button>
        </BrandContextMenu>
        <span aria-hidden className="text-muted-foreground/50 text-sm">
          /
        </span>
        <Button
          variant="ghost"
          onClick={onShowProjects}
          aria-label="Show Shadcn Labs projects"
          className="group/projects h-8 gap-0.5 pr-1 pl-1.5 text-base font-medium tracking-tight has-[>svg]:pr-1 has-[>svg]:pl-1.5"
        >
          {SITE.NAME}
          <ChevronRightIcon className="text-muted-foreground size-3.5 transition-transform group-hover/projects:translate-x-0.5" />
        </Button>
        <div className="ml-auto flex items-center">
          <SiteSettings />
          <SidebarTrigger className="text-foreground size-8" />
        </div>
      </SidebarHeader>
      <div className="px-2 py-2">{search}</div>
      {/* scroll-padding keeps scroll-into-view clear of the fade masks at both ends. */}
      <SidebarContent className="scroll-py-12">
        <SidebarGroup className="pt-0">
          <SidebarMenu aria-label="Primary" className="gap-0.5">
            {APP_NAV.map((item) => {
              const active = isActive(item.href);
              const expandable = EXPANDABLE.has(item.href);
              const open = expandable && (expanded[item.href] ?? active);
              const Icon = PRIMARY_NAV_ICONS[item.href];
              const button = (
                <SidebarMenuButton
                  isActive={active}
                  className={`${ROW_TONE} px-2.5`}
                  render={
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={expandable ? open : undefined}
                      onClick={() => {
                        if (expandable) {
                          setExpanded((current) => ({
                            ...current,
                            [item.href]: active ? !open : true,
                          }));
                        }
                        closeMobile();
                      }}
                    />
                  }
                >
                  <Icon aria-hidden className="size-4 shrink-0" />
                  {item.name}
                  {expandable && (
                    <ChevronRightIcon
                      aria-hidden
                      className={`text-muted-foreground ml-auto size-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                    />
                  )}
                </SidebarMenuButton>
              );
              if (!expandable) {
                return (
                  <SidebarMenuItem key={item.href}>{button}</SidebarMenuItem>
                );
              }
              return (
                <Collapsible
                  key={item.href}
                  open={open}
                  render={<SidebarMenuItem />}
                >
                  {button}
                  <CollapsibleContent className="pt-0.5 pb-1.5">
                    {item.href === ROUTES.DOCS ? (
                      <TreeList
                        onNavigate={closeMobile}
                        items={TOP_LEVEL_SECTIONS.map((section) => ({
                          active:
                            section.href === ROUTES.DOCS
                              ? pathname === ROUTES.DOCS
                              : pathname.startsWith(section.href),
                          href: section.href,
                          name: section.name,
                        }))}
                      />
                    ) : (
                      <CatalogList onNavigate={closeMobile} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
};

const ProjectsView = ({ onBack }: { onBack: () => void }) => (
  <>
    <SidebarHeader className="h-12 flex-row items-center px-1 py-0">
      <Button
        variant="ghost"
        onClick={onBack}
        autoFocus
        aria-label="Back to framecn"
        className="relative h-8 w-full text-base font-medium tracking-tight"
      >
        <ArrowLeftIcon className="text-muted-foreground absolute left-2 size-4" />
        Shadcn Labs
      </Button>
    </SidebarHeader>
    <SidebarContent className="gap-0">
      <SidebarGroup>
        <SidebarGroupLabel>Latest</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              variant="outline"
              className="bg-card hover:bg-card hover:border-foreground/15 h-auto flex-col items-stretch gap-0.5 border px-3 py-2.5 shadow-none hover:shadow-none"
              render={
                <a
                  href={addQueryParams(LABS_LATEST.href, UTM_PARAMS)}
                  aria-label={LABS_LATEST.name}
                  target="_blank"
                  rel="noopener"
                />
              }
            >
              <span className="flex items-center justify-between font-medium">
                {LABS_LATEST.name}
                <ArrowUpRightIcon className="text-muted-foreground size-3.5" />
              </span>
              <span className="text-muted-foreground text-xs">
                {LABS_LATEST.description}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      {LABS_NAV_SECTIONS.map((section) => (
        <SidebarGroup key={section.id} className="pt-0">
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {section.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  className={`${ROW_TONE} group/item px-2.5`}
                  render={
                    <a
                      href={addQueryParams(item.href, UTM_PARAMS)}
                      aria-label={item.name}
                      target="_blank"
                      rel="noopener"
                    />
                  }
                >
                  <span className="truncate">{item.name}</span>
                  <ArrowUpRightIcon className="ml-auto opacity-0 transition-opacity group-hover/item:opacity-60 group-focus-visible/item:opacity-60" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  </>
);

export const AppSidebar = ({
  search,
  github,
}: {
  search: React.ReactNode;
  github: React.ReactNode;
}) => {
  const year = useSyncExternalStore(
    subscribeToYear,
    getCurrentYear,
    getServerYear
  );
  const [view, setView] = useState<"main" | "projects">("main");
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      {view === "main" ? (
        <MainView search={search} onShowProjects={() => setView("projects")} />
      ) : (
        <ProjectsView onBack={() => setView("main")} />
      )}
      {/* Carbon allows in-house logos and text links, so the slot stays on every page. */}
      <SponsorSlot placement="sidebar" className="shrink-0 px-2 pb-1" />
      <SidebarFooter className="h-12 shrink-0 flex-row items-center justify-between py-0 pr-0 pl-2.5">
        <span className="text-muted-foreground truncate text-xs">© {year}</span>
        <div className="flex items-center">
          <TooltipProvider>
            {github}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    nativeButton={false}
                    variant="ghost"
                    size="icon"
                    className="extend-touch-target size-8"
                    aria-label="Follow on X"
                    render={
                      <a
                        href={LINK.X_SHADCN_LABS}
                        aria-label="Follow on X"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  />
                }
              >
                <XIcon />
              </TooltipTrigger>
              <TooltipContent>Follow on X</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
