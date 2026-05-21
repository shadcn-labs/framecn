"use client";

import "@hyperframes/player";
import { cn } from "@/lib/utils";

export const HyperframesPlayer = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={cn(
      "relative aspect-video overflow-hidden rounded-lg",
      className
    )}
  >
    {/* @ts-expect-error hyperframes-player is a custom element */}
    <hyperframes-player className="h-full w-full" src={src} muted controls />
  </div>
);
