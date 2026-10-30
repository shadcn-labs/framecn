"use client";

import Link from "next/link";

import { CatalogPreview } from "@/components/catalog-preview";
import { CopyButton } from "@/components/copy-button";
import { ProBadge } from "@/components/pro-badge";
import { Badge } from "@/components/ui/badge";
import { Frame, FrameContent } from "@/components/ui/frame";
import { CATEGORY_LABELS } from "@/lib/catalog";
import type { CatalogItem } from "@/lib/catalog";
import { componentPrompt } from "@/lib/component-prompt";

/** The catalog card shared by the components gallery and the home showcase. */
export const CatalogCard = ({
  item,
  href,
  showCategory,
  active,
  onActiveChange,
  scroll = true,
  titleAs: Title = "h2",
}: {
  item: CatalogItem;
  href: string;
  showCategory: boolean;
  active: boolean;
  onActiveChange: (active: boolean) => void;
  /** Pass false to keep the gallery scroll position when opening the panel route. */
  scroll?: boolean;
  /** Heading level for the card title, to keep the page outline correct. */
  titleAs?: "h2" | "h3";
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
      scroll={scroll}
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
            className="bg-background/90 absolute top-2.5 left-2.5 h-4 px-1.5 py-0 text-[10px] backdrop-blur"
          >
            {CATEGORY_LABELS[item.category]}
          </Badge>
        )}
        {item.pro && <ProBadge className="absolute top-2.5 right-2.5" />}
      </FrameContent>
      <div className="py-2 pr-12 pl-2.5">
        <Title className="truncate text-sm font-medium">{item.name}</Title>
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
