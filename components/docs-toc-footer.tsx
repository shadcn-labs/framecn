"use client";

import { SquarePenIcon } from "lucide-react";

import { DiscordIcon, XIcon } from "@/components/icons";
import { GITHUB, LINK } from "@/constants/links";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

export const DocsTocFooter = ({
  filePath,
  className,
}: {
  filePath: string;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <a
      href={`${LINK.GITHUB}/edit/${GITHUB.branch}/${filePath}`}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors text-[0.8rem] hover:text-foreground text-muted-foreground [&_svg]:size-3 flex gap-1.5 items-center"
      onClick={() =>
        trackEvent({
          name: "click_edit_page",
          properties: { doc: filePath },
        })
      }
    >
      <SquarePenIcon />
      Edit this page
    </a>
    <a
      href={LINK.X_SHADCN_LABS}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors text-[0.8rem] hover:text-foreground text-muted-foreground [&_svg]:size-3 flex gap-1.5 items-center"
    >
      <XIcon />
      Follow @shadcnlabs
    </a>
    <a
      href={LINK.DISCORD}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors text-[0.8rem] hover:text-foreground text-muted-foreground [&_svg]:size-3 flex gap-1.5 items-center"
    >
      <DiscordIcon />
      Join community
    </a>
  </div>
);
