"use client";

import type { Root as PageTreeRoot } from "fumadocs-core/page-tree";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ROUTES } from "@/constants/routes";
import { TOP_LEVEL_SECTIONS } from "@/constants/site";
import { useFeedback } from "@/hooks/use-feedback";
import {
  EXCLUDED_SECTIONS,
  getDocsSidebarPanel,
  isComponentsFolder,
  isShadersFolder,
  isUiFolder,
} from "@/lib/docs";
import {
  getCatalogSubfolder,
  getFoldersFromFolder,
  getPagesFromFolder,
} from "@/lib/page-tree";
import type { PageTreeFolder } from "@/lib/page-tree";
import { cn } from "@/lib/utils";

const getUiCategoryFolder = (
  uiFolder: PageTreeFolder,
  category: "components" | "blocks"
) =>
  getFoldersFromFolder(uiFolder).find(
    (folder) =>
      folder.$id === `ui/${category}` ||
      String(folder.$id ?? "").endsWith(`/${category}`) ||
      folder.name?.toString().toLowerCase() === category
  );

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const playClick = useFeedback({ sound: "click" });

  const handleClick = useCallback(() => {
    playClick();
    router.push(href.toString());
    onOpenChange?.(false);
  }, [router, href, onOpenChange, playClick]);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn("text-2xl font-medium", className)}
      {...props}
    >
      {children}
    </Link>
  );
};

const MobileNavGroup = ({
  label,
  pages,
  setOpen,
}: {
  label: React.ReactNode;
  pages: { url: string; name: React.ReactNode }[];
  setOpen: (open: boolean) => void;
}) => {
  if (pages.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
      <div className="flex flex-col gap-3">
        {pages.map((page) => (
          <MobileLink key={page.url} href={page.url} onOpenChange={setOpen}>
            {page.name}
          </MobileLink>
        ))}
      </div>
    </div>
  );
};

const ComponentsMobilePanel = ({
  tree,
  setOpen,
}: {
  tree: PageTreeRoot;
  setOpen: (open: boolean) => void;
}) => {
  const componentsFolder = tree.children.find(
    (item): item is PageTreeFolder =>
      item.type === "folder" && isComponentsFolder(item)
  );

  if (!componentsFolder) {
    return null;
  }

  return getFoldersFromFolder(componentsFolder).map((category) => (
    <MobileNavGroup
      key={category.$id}
      label={category.name}
      pages={getPagesFromFolder(category, false)}
      setOpen={setOpen}
    />
  ));
};

const UiMobilePanel = ({
  tree,
  setOpen,
}: {
  tree: PageTreeRoot;
  setOpen: (open: boolean) => void;
}) => {
  const uiFolder = tree.children.find(
    (item): item is PageTreeFolder => item.type === "folder" && isUiFolder(item)
  );

  if (!uiFolder) {
    return null;
  }

  const componentsFolder = getUiCategoryFolder(uiFolder, "components");
  const blocksFolder = getUiCategoryFolder(uiFolder, "blocks");

  return (
    <>
      {componentsFolder ? (
        <MobileNavGroup
          label="Components"
          pages={getPagesFromFolder(componentsFolder, false)}
          setOpen={setOpen}
        />
      ) : null}
      {blocksFolder ? (
        <MobileNavGroup
          label="Blocks"
          pages={getPagesFromFolder(blocksFolder, false)}
          setOpen={setOpen}
        />
      ) : null}
    </>
  );
};

const ShadersMobilePanel = ({
  tree,
  setOpen,
}: {
  tree: PageTreeRoot;
  setOpen: (open: boolean) => void;
}) => {
  const shadersFolder = tree.children.find(
    (item): item is PageTreeFolder =>
      item.type === "folder" && isShadersFolder(item)
  );

  if (!shadersFolder) {
    return null;
  }

  const shaderPagesFolder =
    getCatalogSubfolder(shadersFolder, "components") ?? shadersFolder;

  return (
    <MobileNavGroup
      label="Shaders"
      pages={getPagesFromFolder(shaderPagesFolder, false)}
      setOpen={setOpen}
    />
  );
};

export const MobileNav = ({
  items,
  tree,
  className,
}: {
  items: { href: string; label: string }[];
  tree: PageTreeRoot;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = pathname.startsWith(ROUTES.DOCS)
    ? getDocsSidebarPanel(pathname)
    : null;

  const renderPanel = () => {
    if (!panel) {
      return null;
    }
    if (panel === "components") {
      return <ComponentsMobilePanel tree={tree} setOpen={setOpen} />;
    }
    if (panel === "ui") {
      return <UiMobilePanel tree={tree} setOpen={setOpen} />;
    }
    return <ShadersMobilePanel tree={tree} setOpen={setOpen} />;
  };

  return (
    <Popover sounds open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] -rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] rotate-45" : "top-2.5"
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>
          <span className="flex h-8 items-center text-lg leading-none font-medium">
            Menu
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/90 no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              Menu
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href={ROUTES.HOME} onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item) => (
                <MobileLink
                  key={item.href}
                  href={item.href}
                  onOpenChange={setOpen}
                >
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Sections
            </div>
            <div className="flex flex-col gap-3">
              {TOP_LEVEL_SECTIONS.map(({ href, name }) => (
                <MobileLink key={name} href={href} onOpenChange={setOpen}>
                  {name}
                </MobileLink>
              ))}
            </div>
          </div>
          {renderPanel()}
          {tree.children.map((item) => {
            if (item.type !== "folder") {
              return null;
            }
            if (EXCLUDED_SECTIONS.has(item.$id ?? "")) {
              return null;
            }
            if (
              isComponentsFolder(item) ||
              isUiFolder(item) ||
              isShadersFolder(item)
            ) {
              return null;
            }

            return (
              <MobileNavGroup
                key={item.$id}
                label={item.name}
                pages={getPagesFromFolder(item)}
                setOpen={setOpen}
              />
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
