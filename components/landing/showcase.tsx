"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CatalogCard } from "@/components/catalog-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { CATALOG, catalogItemHref } from "@/lib/catalog";

const FEATURED = [
  "kinetic-text",
  "caption-pill-karaoke",
  "album-carousel",
  "route-globe",
  "bar-chart",
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
      className="container-page section-y"
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
          <CatalogCard
            key={item.id}
            item={item}
            href={catalogItemHref(item)}
            showCategory
            active={active === item.id}
            onActiveChange={(isActive) => setActive(isActive ? item.id : null)}
            titleAs="h3"
          />
        ))}
      </ul>
    </section>
  );
};
