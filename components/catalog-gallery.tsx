"use client";

import Link from "next/link";
import { useState } from "react";

import { CatalogPreview } from "@/components/catalog-preview";
import { useGalleryPath } from "@/components/component-panel-shell";
import { CopyButton } from "@/components/copy-button";
import { ProBadge } from "@/components/pro-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";
import { ROUTES } from "@/constants/routes";
import {
  CATALOG,
  CATEGORY_LABELS,
  catalogItemHref,
  categoryHref,
  COMPONENT_CATEGORIES,
  findCategoryByPath,
} from "@/lib/catalog";
import type { CatalogItem } from "@/lib/catalog";
import { componentPrompt } from "@/lib/component-prompt";
import { cn } from "@/lib/utils";

const CatalogCard = ({
  item,
  href,
  showCategory,
  active,
  onActiveChange,
}: {
  item: CatalogItem;
  href: string;
  showCategory: boolean;
  active: boolean;
  onActiveChange: (active: boolean) => void;
}) => (
  <Frame
    className="group/card hover:border-foreground/15 focus-within:border-foreground/25 relative transition-colors"
    render={
      <li
        onPointerEnter={() => onActiveChange(true)}
        onPointerLeave={() => onActiveChange(false)}
      />
    }
  >
    <Link
      href={href}
      scroll={false}
      onFocus={() => onActiveChange(true)}
      onBlur={() => onActiveChange(false)}
      className="block outline-none after:absolute after:inset-0 after:rounded-[var(--frame-radius)] focus-visible:after:ring-2 focus-visible:after:ring-ring"
    >
      <FrameContent
        className="relative overflow-hidden"
        data-catalog-preview={item.id}
      >
        <CatalogPreview name={item.id} active={active} />
        {showCategory && (
          <Badge
            variant="outline"
            className="bg-background/90 absolute top-2.5 left-2.5 h-4 rounded px-1.5 py-0 text-[10px] backdrop-blur"
          >
            {CATEGORY_LABELS[item.category]}
          </Badge>
        )}
        {item.pro && <ProBadge className="absolute top-2.5 right-2.5" />}
      </FrameContent>
      <div className="py-2 pr-12 pl-2.5">
        <h2 className="truncate text-sm font-medium">{item.name}</h2>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          {item.description}
        </p>
      </div>
    </Link>
    <CopyButton
      value={componentPrompt(item)}
      tooltip="Copy prompt"
      aria-label={`Copy install prompt for ${item.name}`}
      className="text-muted-foreground hover:text-foreground absolute top-auto right-2 bottom-2.5 z-10 size-8 bg-transparent"
    />
  </Frame>
);

export const CatalogGallery = () => {
  const galleryPath = useGalleryPath();
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const category = findCategoryByPath(galleryPath);
  const items = CATALOG.filter(
    (item) => !category || item.category === category
  );
  const filters = [
    { href: ROUTES.COMPONENTS, label: "All", value: undefined },
    ...COMPONENT_CATEGORIES.map((value) => ({
      href: categoryHref(value),
      label: CATEGORY_LABELS[value],
      value,
    })),
  ];

  return (
    <div className="flex flex-1 flex-col" data-catalog-gallery="">
      <h1 className="sr-only">Components</h1>
      <nav
        aria-label="Categories"
        className="flex gap-1.5 overflow-x-auto px-4 pt-2 pb-1"
      >
        {filters.map((filter) => {
          const selected = filter.value === category;
          return (
            <Link
              key={filter.label}
              href={filter.href}
              scroll={false}
              aria-current={selected ? "page" : undefined}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: selected ? "default" : "secondary",
                }),
                "h-8 rounded-full px-3.5 text-[13px]"
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>
      <ul className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            href={catalogItemHref(item)}
            showCategory={!category}
            active={activePreview === item.id}
            onActiveChange={(active) =>
              setActivePreview(active ? item.id : null)
            }
          />
        ))}
      </ul>
    </div>
  );
};
