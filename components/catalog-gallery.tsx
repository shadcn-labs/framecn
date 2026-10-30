"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CarbonAds } from "@/components/carbon-ads";
import { CatalogCard } from "@/components/catalog-card";
import { useGalleryPath } from "@/components/component-panel-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  CATALOG,
  CATEGORY_LABELS,
  catalogItemHref,
  categoryHref,
  COMPONENT_CATEGORIES,
  findCategoryByPath,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const CatalogGallery = () => {
  const pathname = usePathname();
  const [adDismissed, setAdDismissed] = useState(false);
  const galleryPath = useGalleryPath();
  const isGallery = pathname === galleryPath;
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
        className="no-scrollbar scroll-fade-x scroll-fade-6 flex gap-1.5 overflow-x-auto px-4 py-2"
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
            scroll={false}
          />
        ))}
      </ul>
      {isGallery && !adDismissed && (
        <aside
          aria-label="Advertisement"
          className="catalog-ad bg-card invisible fixed right-4 bottom-4 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-xl border p-3 shadow-lg has-[#carbonads]:visible"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2 z-10 size-6"
            aria-label="Dismiss advertisement"
            onClick={() => setAdDismissed(true)}
          >
            <XIcon className="size-4" />
          </Button>
          <CarbonAds format="responsive" className="w-full" />
        </aside>
      )}
    </div>
  );
};
