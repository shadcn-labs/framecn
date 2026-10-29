import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Frame, FrameContent } from "@/components/ui/frame";
import { cn } from "@/lib/utils";

export interface DocsPagerItem {
  url: string;
  title: string;
  description?: string;
}

const PagerCard = ({
  item,
  direction,
}: {
  item: DocsPagerItem;
  direction: "previous" | "next";
}) => {
  const isNext = direction === "next";
  return (
    <Link
      href={item.url}
      transitionTypes={[isNext ? "nav-forward" : "nav-back"]}
      className={cn("group min-w-0", isNext && "sm:col-start-2")}
    >
      <Frame
        className={cn(
          "flex h-full items-stretch transition-colors group-hover:border-foreground/20",
          isNext && "flex-row-reverse"
        )}
      >
        <div className="flex w-8 shrink-0 items-center justify-center">
          {isNext ? (
            <ChevronRightIcon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          ) : (
            <ChevronLeftIcon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
        </div>
        <FrameContent
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-1 px-4 py-3",
            isNext && "items-end text-right"
          )}
        >
          <span className="max-w-full truncate text-sm font-medium">
            {item.title}
          </span>
          {item.description && (
            <span className="max-w-full truncate text-muted-foreground text-xs">
              {item.description}
            </span>
          )}
        </FrameContent>
      </Frame>
    </Link>
  );
};

export const DocsPager = ({
  previous,
  next,
}: {
  previous?: DocsPagerItem;
  next?: DocsPagerItem;
}) => {
  if (!(previous || next)) {
    return null;
  }
  return (
    <nav aria-label="Docs pages" className="grid gap-3 sm:grid-cols-2">
      {previous && <PagerCard item={previous} direction="previous" />}
      {next && <PagerCard item={next} direction="next" />}
    </nav>
  );
};
