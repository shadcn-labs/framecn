"use client";

import { CatalogPreview } from "@/components/catalog-preview";
import { cn } from "@/lib/utils";

/** Two columns drifting in opposite directions; each track is doubled so the loop is seamless. */
const COLUMNS = [
  ["kinetic-text", "route-globe", "caption-neon-glow", "bar-chart"],
  ["album-carousel", "caption-pill-karaoke", "helix-carousel", "node-reveal"],
];

export const SignInWall = () => (
  <div
    aria-hidden
    className="relative hidden overflow-hidden border-l lg:block lg:min-h-[640px]"
  >
    <div className="absolute inset-0 grid grid-cols-2 gap-3 px-3 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      {COLUMNS.map((column, index) => (
        <div key={column[0]} className="min-w-0 overflow-hidden">
          <div
            className={cn(
              "scroll-feed flex flex-col gap-3",
              index === 1 && "[animation-direction:reverse]"
            )}
          >
            {[...column, ...column].map((id, position) => (
              <div
                // Each id appears twice in the doubled track.
                key={`${id}-${position}`}
                className="bg-card overflow-hidden rounded-lg border"
              >
                <CatalogPreview name={id} active />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
