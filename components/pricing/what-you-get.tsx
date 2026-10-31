"use client";

import {
  BotIcon,
  BriefcaseBusinessIcon,
  CopyIcon,
  TerminalIcon,
} from "lucide-react";

import { CatalogPreview } from "@/components/catalog-preview";
import { Frame, FrameContent } from "@/components/ui/frame";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

const MOSAIC = [
  { className: "col-span-2", id: "route-globe" },
  { className: "", id: "kinetic-text" },
  { className: "", id: "album-carousel" },
];

const SMALL = [
  {
    description:
      "Source lands in components/framecn. Fork it, rename it, ship it. It's a file, not a dependency.",
    icon: TerminalIcon,
    title: "Your repo, your code",
  },
  {
    description:
      "MCP, llms.txt and markdown for every component, so your agent stops guessing prop names.",
    icon: BotIcon,
    title: "Agents read the manual",
  },
  {
    description:
      "Client work, commercial launches, the startup you haven't named yet. Every plan covers it.",
    icon: BriefcaseBusinessIcon,
    title: "Client work included",
  },
];

const Tile = ({
  className,
  title,
  description,
  children,
}: {
  className?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Frame className={cn("flex min-w-0", className)}>
    <FrameContent className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <p className="text-muted-foreground max-w-md p-5 pb-0 text-sm leading-6 text-pretty md:p-6 md:pb-0">
        <span className="text-foreground font-medium">{title}</span>{" "}
        {description}
      </p>
      <div className="mt-5 flex flex-1 flex-col">{children}</div>
    </FrameContent>
  </Frame>
);

const FRAMES = Array.from({ length: 8 }, (_, index) => index * 15);

export const WhatYouGet = ({ proCount }: { proCount: number }) => (
  <section
    aria-labelledby="get-title"
    className="container-page pt-16 md:pt-24"
  >
    <h2 id="get-title" className="heading-title text-center">
      What you&apos;ll get
    </h2>
    <div className="mt-10 grid gap-4 lg:grid-cols-5">
      <Tile
        className="lg:col-span-3"
        title={`All ${proCount} Pro components,`}
        description="previewed right here. Text, carousels, globes, charts and full compositions, not a folder of stock templates."
      >
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5 p-1.5 pt-0">
          {MOSAIC.map((item) => (
            <div
              key={item.id}
              className={cn(
                "min-w-0 overflow-hidden rounded-lg border",
                item.className
              )}
            >
              <CatalogPreview name={item.id} active />
            </div>
          ))}
        </div>
      </Tile>
      <div className="grid min-w-0 gap-4 lg:col-span-2">
        <Tile
          title="What you preview is what renders."
          description="Frame-based timing on Editframe, so the MP4 matches the browser, frame for frame."
        >
          <div className="relative mx-5 my-auto pb-5 md:mx-6">
            <div className="flex gap-1">
              {FRAMES.map((frame) => (
                <div
                  key={frame}
                  className="bg-muted flex h-20 flex-1 items-end rounded-md border p-1"
                >
                  <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
                    f{String(frame).padStart(3, "0")}
                  </span>
                </div>
              ))}
            </div>
            <span
              aria-hidden
              className="playhead bg-brand absolute -top-2 bottom-3 left-0 w-0.5 rounded-full"
            />
          </div>
        </Tile>
        <Tile
          title="Tune it, then hand it off."
          description="Dial in props live; Copy prompt gives your agent the install command and your exact settings."
        >
          <div className="bg-muted/40 mx-5 my-auto mb-5 min-w-0 rounded-lg border p-3 font-mono text-[11px] leading-5 md:mx-6">
            <p className="text-muted-foreground truncate">
              npx shadcn@latest add {SITE.REGISTRY}/caption-highlight
            </p>
            <p className="truncate">
              {"<CaptionHighlight "}
              <span className="text-brand">highlightColor</span>
              {'="#f06292" '}
              <span className="text-brand">wordsPerGroup</span>
              {"={4} />"}
            </p>
            <span className="bg-background mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-sans text-xs font-medium shadow-xs">
              <CopyIcon aria-hidden className="size-3" />
              Copy prompt
            </span>
          </div>
        </Tile>
      </div>
    </div>
    <ul className="mt-12 grid gap-8 text-center sm:grid-cols-3">
      {SMALL.map(({ description, icon: Icon, title }) => (
        <li key={title} className="flex flex-col items-center">
          <Icon aria-hidden className="size-5" />
          <h3 className="mt-3 font-medium">{title}</h3>
          <p className="text-muted-foreground mt-1.5 max-w-64 text-sm leading-6 text-pretty">
            {description}
          </p>
        </li>
      ))}
    </ul>
  </section>
);
