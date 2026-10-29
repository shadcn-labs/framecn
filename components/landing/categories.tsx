import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/landing/section-heading";
import { FrameContent } from "@/components/ui/frame";
import { ROUTES } from "@/constants/routes";
import { CATALOG, COMPONENT_CATEGORIES, categoryHref } from "@/lib/catalog";
import type { CatalogCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TILES = [
  {
    blurb: "Headlines that type, scramble, wheel, and glitch into place.",
    category: "text",
    href: categoryHref("text"),
    label: "Text",
  },
  {
    blurb: "Word-timed subtitles with karaoke, emoji, and emphasis styles.",
    category: "captions",
    href: categoryHref("captions"),
    label: "Captions",
  },
  {
    blurb: "Covers and photos that spin, cascade, orbit, and trail.",
    category: "carousels",
    href: categoryHref("carousels"),
    label: "Carousels",
  },
  {
    blurb: "Rotating globes with flight routes, pins, and hub networks.",
    category: "globes",
    href: categoryHref("globes"),
    label: "3D & Globes",
  },
  {
    blurb: "Photo grids, stacks, and spotlights that assemble in time.",
    category: "collages",
    href: categoryHref("collages"),
    label: "Collages",
  },
  {
    blurb: "Area, bar, funnel, and radar charts with a moving camera.",
    category: "charts",
    href: categoryHref("charts"),
    label: "Charts",
  },
  {
    blurb: "Galleries and story stacks that scroll and zoom through frames.",
    category: "scroll-animations",
    href: categoryHref("scroll-animations"),
    label: "Scroll Animations",
  },
  {
    blurb: "Complete compositions you re-skin with your own copy and brand.",
    category: "compositions",
    href: categoryHref("compositions"),
    label: "Compositions",
  },
] as const satisfies {
  blurb: string;
  category: CatalogCategory;
  href: string;
  label: string;
}[];

const tileClass =
  "bg-muted/60 hover:border-foreground/15 focus-visible:ring-ring flex h-full rounded-xl border p-0.5 outline-none transition-colors focus-visible:ring-2";

const tileContentClass = "flex flex-1 flex-col p-5";

export const Categories = () => {
  const componentCount = CATALOG.filter((item) =>
    COMPONENT_CATEGORIES.includes(item.category)
  ).length;

  return (
    <section
      aria-labelledby="categories-title"
      className="container-page py-16 md:py-24"
    >
      <SectionHeading
        id="categories-title"
        title="What you get"
        description="Self-contained, time-based scenes for every part of a video. Combine them on one Editframe timeline."
      />
      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => (
          <li key={tile.category}>
            <Link href={tile.href} className={tileClass}>
              <FrameContent className={tileContentClass}>
                <span className="text-4xl font-medium tracking-[-0.04em] tabular-nums">
                  {
                    CATALOG.filter((item) => item.category === tile.category)
                      .length
                  }
                </span>
                <span className="mt-6 text-sm font-medium">{tile.label}</span>
                <span className="text-muted-foreground mt-1 text-sm leading-6">
                  {tile.blurb}
                </span>
              </FrameContent>
            </Link>
          </li>
        ))}
        <li className="sm:col-span-2 lg:col-span-1">
          <Link href={ROUTES.COMPONENTS} className={tileClass}>
            <FrameContent className={cn(tileContentClass, "justify-between")}>
              <span className="text-muted-foreground text-sm leading-6">
                Captions are free under the MIT license; everything else is Pro.
                Copy the source, own the code.
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                All {componentCount} components
                <ArrowRightIcon className="size-4" />
              </span>
            </FrameContent>
          </Link>
        </li>
      </ul>
    </section>
  );
};
