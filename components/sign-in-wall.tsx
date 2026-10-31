"use client";

import { CatalogPreview } from "@/components/catalog-preview";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/** Native dark previews only; no component colors or page theme are overridden. */
const COLUMNS = [
  [
    "bloom-carousel",
    "arc-enter",
    "ring-carousel",
    "depth-trail",
    "departure-board",
    "orbit-carousel",
    "crest-carousel",
    "caption-neon-glow",
  ],
  [
    "helix-carousel",
    "brand-flythrough",
    "cascade-carousel",
    "blob-trail",
    "node-reveal",
    "reel-carousel",
    "slice-trail",
    "scatter-trail",
  ],
];

export const SignInWall = () => {
  const motionAllowed = useMediaQuery(
    "(prefers-reduced-motion: no-preference)"
  );

  return (
    <div
      aria-hidden
      className="relative hidden overflow-hidden border-l border-border lg:block lg:min-h-[640px]"
    >
      <div className="absolute inset-0 grid grid-cols-2 gap-3 px-3 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        {COLUMNS.map((column, index) => (
          <div key={column[0]} className="min-w-0 overflow-hidden">
            <div
              className={cn(
                "scroll-feed flex flex-col gap-3 [animation-duration:80s]",
                index === 1 && "[animation-direction:reverse]"
              )}
              style={{
                animationPlayState: motionAllowed ? "running" : "paused",
              }}
            >
              {[...column, ...column].map((name, position) => (
                <div
                  // Each preview appears twice in the doubled track.
                  key={`${name}-${position}`}
                  className="bg-card border-border shrink-0 overflow-hidden rounded-lg border"
                >
                  <CatalogPreview name={name} theme="dark" active />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
