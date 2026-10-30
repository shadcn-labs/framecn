"use client";

import { useState } from "react";

import { CatalogCard } from "@/components/catalog-card";
import { SectionHeading } from "@/components/landing/section-heading";
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
      className="container-page pt-16 md:pt-24"
    >
      <SectionHeading id="showcase-title" title="See it in motion" />
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
