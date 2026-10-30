"use client";

import type { Root as PageTreeRoot } from "fumadocs-core/page-tree";
import {
  ArrowRightIcon,
  CornerDownLeftIcon,
  CircleDashedIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/constants/site";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useHaptic } from "@/hooks/use-haptic-toggle";
import { useIsMac } from "@/hooks/use-is-mac";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { usePackageManager } from "@/hooks/use-package-manager";
import {
  CATALOG,
  CATEGORY_LABELS,
  catalogItemHref,
  findCatalogItemByPath,
} from "@/lib/catalog";
import { EXCLUDED_SECTIONS } from "@/lib/docs";
import { trackEvent } from "@/lib/events";
import { getPagesFromFolder } from "@/lib/page-tree";
import { cn } from "@/lib/utils";

type DocUrlKind = { kind: "component"; slug: string } | { kind: "page" };

const GROUP_HEADING_CLS =
  "[--command-group-padding:0px] !p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1";

const parseDocPageUrl = (url: string): DocUrlKind => {
  const item = findCatalogItemByPath(url);
  return item ? { kind: "component", slug: item.id } : { kind: "page" };
};

const buildDocPageKeywords = (
  parsed: DocUrlKind,
  url: string,
  breadcrumb: string[]
): string[] => [
  ...(parsed.kind === "page" ? [] : [parsed.kind]),
  ...breadcrumb.filter(Boolean).flatMap((s) => [s, s.toLowerCase()]),
  ...url
    .split("/")
    .filter(Boolean)
    .flatMap((segment) =>
      segment.includes("-") ? [segment, ...segment.split("-")] : [segment]
    ),
];

const CommandMenuItem = ({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  "data-selected"?: string;
  "aria-selected"?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.();
      }
    }
  });

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-[var(--command-item-radius)] border border-transparent px-3! font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
};

export const CommandMenu = ({
  navItems,
  tree,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  navItems: { href: string; label: string }[];
  tree: PageTreeRoot;
}) => {
  const router = useRouter();
  const isMac = useIsMac();
  const [packageManager] = usePackageManager();
  const [open, setOpen] = useState(false);
  const [showGoToPage, setShowGoToPage] = useState(false);
  const [copyPayload, setCopyPayload] = useState("");
  const haptic = useHaptic();

  const { copyToClipboard } = useCopyToClipboard({
    onCopy: () => {
      if (copyPayload) {
        trackEvent({
          name: "copy_npm_command",
          properties: { command: copyPayload, pm: packageManager },
        });
      }
    },
  });

  const treeGroups = useMemo(() => {
    const groups: { label: string; pages: { url: string; name: string }[] }[] =
      [];
    for (const item of tree.children) {
      if (item.type !== "folder") {
        continue;
      }
      if (EXCLUDED_SECTIONS.has(item.$id ?? "")) {
        continue;
      }

      const pages = getPagesFromFolder(item).map((p) => ({
        name: typeof p.name === "string" ? p.name : String(p.name),
        url: p.url,
      }));
      if (pages.length > 0) {
        groups.push({
          label: typeof item.name === "string" ? item.name : String(item.name),
          pages,
        });
      }
    }
    for (const [category, label] of Object.entries(CATEGORY_LABELS)) {
      const pages = CATALOG.filter((entry) => entry.category === category).map(
        (entry) => ({
          name: entry.name,
          url: catalogItemHref(entry),
        })
      );
      if (pages.length > 0) {
        groups.push({ label, pages });
      }
    }
    return groups;
  }, [tree]);

  const handleDocPageHighlight = useCallback(
    (item: { url: string; name?: string }) => {
      setShowGoToPage(true);
      const parsed = parseDocPageUrl(item.url);
      if (parsed.kind === "component") {
        setCopyPayload(
          `${packageManager} dlx shadcn@latest add ${SITE.REGISTRY}/${parsed.slug}`
        );
        return;
      }
      setCopyPayload("");
    },
    [packageManager]
  );

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const handleOpenClick = useCallback(() => setOpen(true), []);

  const handleFilter = useCallback(
    (value: string, search: string, keywords?: string[]) => {
      const extendValue = `${value} ${keywords?.join(" ") || ""}`;
      if (extendValue.toLowerCase().includes(search.toLowerCase())) {
        return 1;
      }
      return 0;
    },
    []
  );

  const renderDocPageItem = (
    title: string,
    url: string,
    breadcrumb: string[]
  ) => {
    const parsed = parseDocPageUrl(url);
    return (
      <CommandMenuItem
        key={url}
        keywords={buildDocPageKeywords(parsed, url, breadcrumb)}
        value={[...breadcrumb, title].filter(Boolean).join(" ")}
        onHighlight={() => handleDocPageHighlight({ name: title, url })}
        onSelect={() => runCommand(() => router.push(url))}
      >
        {parsed.kind === "component" ? (
          <CircleDashedIcon />
        ) : (
          <ArrowRightIcon />
        )}
        {title}
      </CommandMenuItem>
    );
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            const metaKeyPressed = e.metaKey ? "cmd+k" : "ctrl+k";
            trackEvent({
              name: "open_command_menu",
              properties: {
                key: e.key === "/" ? "/" : metaKeyPressed,
                method: "keyboard",
              },
            });
          }
          return !prev;
        });
      }

      if (
        e.key === "c" &&
        (e.metaKey || e.ctrlKey) &&
        copyPayload.includes("shadcn@latest")
      ) {
        runCommand(() => {
          haptic("selection");
          copyToClipboard(copyPayload);
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [copyPayload, runCommand, copyToClipboard, haptic]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            aria-label="Search"
            title={`Search (${isMac ? "⌘" : "Ctrl"} K)`}
            aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
            className="bg-card text-muted-foreground h-8 w-full justify-start gap-2 rounded-lg px-3 font-normal shadow-xs"
            onClick={handleOpenClick}
            {...props}
          />
        }
      >
        <SearchIcon className="size-4 shrink-0" />
        <span>Search...</span>
        <KbdGroup className="ml-auto" aria-hidden>
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="[--command-dialog-radius:var(--radius-xl)] rounded-[var(--command-dialog-radius)] p-2 pb-11"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command
          className="[--command-radius:max(0px,calc(var(--command-dialog-radius)-var(--spacing)*2))] **:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-[var(--command-radius)] **:data-[slot=command-input-wrapper]:border"
          filter={handleFilter}
        >
          <CommandInput placeholder="Search documentation..." />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              No results found.
            </CommandEmpty>
            {navItems && navItems.length > 0 && (
              <CommandGroup heading="Pages" className={GROUP_HEADING_CLS}>
                {navItems.map((item) => (
                  <CommandMenuItem
                    key={item.href}
                    value={`Navigation ${item.label}`}
                    keywords={["nav", "navigation", item.label.toLowerCase()]}
                    onHighlight={() => {
                      setShowGoToPage(true);
                      setCopyPayload("");
                    }}
                    onSelect={() => runCommand(() => router.push(item.href))}
                  >
                    <ArrowRightIcon />
                    {item.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
            {treeGroups.map((group) => (
              <CommandGroup
                key={group.label}
                className={GROUP_HEADING_CLS}
                heading={group.label}
              >
                {group.pages.map((page) =>
                  renderDocPageItem(page.name, page.url, [group.label])
                )}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="text-muted-foreground bg-muted absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 overflow-hidden rounded-b-[var(--command-dialog-radius)] border-t px-4 text-xs font-medium">
          <div className="flex items-center gap-2 shrink-0">
            <Kbd className="shrink-0">
              <CornerDownLeftIcon />
            </Kbd>{" "}
            {showGoToPage ? (
              <span className="min-w-0 truncate">Go to Page</span>
            ) : null}
          </div>
          {copyPayload && (
            <>
              <Separator orientation="vertical" className="h-4!" />
              <div className="flex min-w-0 items-center gap-1">
                <Kbd className="shrink-0">{isMac ? "⌘" : "Ctrl"}</Kbd>
                <Kbd className="shrink-0">C</Kbd>
                <span className="min-w-0 truncate">{copyPayload}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
