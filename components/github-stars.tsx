"use client";

import { GithubIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LINK } from "@/constants/links";
import { UTM_PARAMS } from "@/constants/site";
import { addQueryParams } from "@/lib/url";
import { cn } from "@/lib/utils";

export const GitHubStars = ({
  stargazersCount,
}: {
  stargazersCount: number;
}) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <a
          className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
          href={addQueryParams(LINK.GITHUB, UTM_PARAMS)}
          aria-label={`Star on GitHub (${stargazersCount} stars)`}
          data-sound="success"
          rel="noopener"
          target="_blank"
        />
      }
    >
      <GithubIcon className="-translate-y-px" />
      <span className="text-muted-foreground text-xs tabular-nums">
        {new Intl.NumberFormat("en-US", {
          compactDisplay: "short",
          notation: "compact",
        })
          .format(stargazersCount)
          .toLowerCase()}
      </span>
    </TooltipTrigger>
    <TooltipContent>
      {new Intl.NumberFormat("en-US").format(stargazersCount)} stars
    </TooltipContent>
  </Tooltip>
);
