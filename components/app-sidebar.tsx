"use client";

import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrandContextMenu } from "@/components/brand-context-menu";
import { XIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { SiteSettings } from "@/components/site-settings";
import { Badge } from "@/components/ui/badge";
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

const SHADCN_LABS_URL = addQueryParams("https://shadcn-labs.com", UTM_PARAMS);

/** Muted rows; hover and active are tints of primary, active a step stronger than hover. */
const ROW_TONE =
  "text-muted-foreground hover:bg-sidebar-primary/[0.05] hover:text-sidebar-foreground active:bg-sidebar-primary/[0.08] data-[active=true]:bg-sidebar-primary/[0.08] data-[active=true]:text-sidebar-foreground";

const EXPANDABLE = new Set<string>([ROUTES.COMPONENTS, ROUTES.DOCS]);

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
  <SidebarMenuSub className="mx-0 ml-3 gap-px px-0 py-0.5 pl-2">
    {items.map((item) => (
      <SidebarMenuSubItem key={item.href}>
        {item.active && (
          <span
            aria-hidden
            className="bg-sidebar-primary absolute top-1/2 -left-[9.5px] h-4 w-0.5 -translate-y-1/2 rounded-full"
          />
        )}
        <SidebarMenuSubButton
          isActive={item.active}
          className={`${ROW_TONE} px-2.5 text-[13px]`}
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
          {item.pro && (
            <Badge className="ml-auto rounded px-1.5 py-0 text-[10px]">
              Pro
            </Badge>
          )}
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
    container.current
      ?.querySelector("[data-active=true]")
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
            <SidebarGroupLabel
              className="hover:text-sidebar-foreground ml-3 h-7 px-2.5 pt-1"
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
              <a
                href={SHADCN_LABS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shadcn Labs"
              />
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
          {search}
          <SidebarTrigger className="text-muted-foreground size-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu aria-label="Primary" className="gap-px">
            {APP_NAV.map((item) => {
              const active = isActive(item.href);
              const expandable = EXPANDABLE.has(item.href);
              const open = expandable && (expanded[item.href] ?? active);
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
        <SidebarGroup key={section.id} className="py-0">
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu className="gap-px">
            {section.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  className={`${ROW_TONE} group/item px-2.5`}
                  render={
                    <a
                      href={addQueryParams(item.href, UTM_PARAMS)}
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
  const [view, setView] = useState<"main" | "projects">("main");
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      {view === "main" ? (
        <MainView search={search} onShowProjects={() => setView("projects")} />
      ) : (
        <ProjectsView onBack={() => setView("main")} />
      )}
      <SidebarFooter className="h-12 flex-row items-center justify-between py-0 pr-0 pl-2.5">
        <span className="text-muted-foreground truncate text-xs">
          © {new Date().getFullYear()}
        </span>
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
          <SiteSettings />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
