"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CatalogPreview } from "@/components/catalog-preview";
import { SectionHeading } from "@/components/landing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FrameContent } from "@/components/ui/frame";
import { ROUTES } from "@/constants/routes";
import { CATALOG, CATEGORY_LABELS, catalogItemHref } from "@/lib/catalog";

const FEATURED = [
  "blur-reveal",
  "caption-pill-karaoke",
  "chromatic-aberration-wipe",
  "matrix-decode",
  "device-mockup-zoom",
  "node-reveal",
];

const ITEMS = FEATURED.flatMap((id) => {
  const item = CATALOG.find((entry) => entry.id === id);
  return item ? [item] : [];
});

export const Showcase = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="showcase-title"
      className="container-page py-16 md:py-24"
    >
      <SectionHeading
        id="showcase-title"
        title="See it in motion"
        description="Every preview is the real component running in your browser. Hover or focus a card to play it."
      >
        <Button
          nativeButton={false}
          render={<Link href={ROUTES.COMPONENTS} />}
          variant="ghost"
          className="rounded-full"
        >
          View all
          <ArrowRightIcon />
        </Button>
      </SectionHeading>
      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <li
            key={item.id}
            className="group/card bg-muted/60 hover:border-foreground/15 focus-within:border-foreground/25 relative rounded-xl border p-0.5 transition-colors"
            onPointerEnter={() => setActive(item.id)}
            onPointerLeave={() => setActive(null)}
          >
            <Link
              href={catalogItemHref(item)}
              onFocus={() => setActive(item.id)}
              onBlur={() => setActive(null)}
              className="focus-visible:after:ring-ring block outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2"
            >
              <FrameContent className="relative overflow-hidden">
                <CatalogPreview name={item.id} active={active === item.id} />
                <Badge
                  variant="outline"
                  className="bg-background/90 absolute top-2.5 left-2.5 rounded-md px-1.5 text-[11px] backdrop-blur"
                >
                  {CATEGORY_LABELS[item.category]}
                </Badge>
                {item.pro && (
                  <Badge
                    variant="brand"
                    className="absolute top-2.5 right-2.5 rounded-md px-1.5 text-[11px] font-semibold"
                  >
                    Pro
                  </Badge>
                )}
              </FrameContent>
              <div className="px-2.5 pt-2 pb-1.5">
                <h3 className="truncate text-sm font-medium">{item.name}</h3>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                  {item.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
