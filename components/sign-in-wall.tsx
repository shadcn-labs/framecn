"use client";

import { CatalogPreview } from "@/components/catalog-preview";
import { cn } from "@/lib/utils";

interface WallPreview {
  name: string;
  overrides?: Record<string, unknown>;
}

const DARK_SURFACE = { background: "#09090b" };

/** Two columns drifting in opposite directions; each track is doubled so the loop is seamless. */
const COLUMNS: WallPreview[][] = [
  [
    { name: "album-carousel", overrides: DARK_SURFACE },
    {
      name: "launch-collage",
      overrides: { ...DARK_SURFACE, inkColor: "#fafafa" },
    },
    { name: "ring-carousel", overrides: DARK_SURFACE },
    { name: "depth-trail", overrides: DARK_SURFACE },
    { name: "departure-board" },
    { name: "orbit-carousel", overrides: DARK_SURFACE },
    { name: "crest-carousel", overrides: DARK_SURFACE },
    { name: "caption-neon-glow" },
  ],
  [
    { name: "helix-carousel", overrides: DARK_SURFACE },
    { name: "brand-flythrough", overrides: { look: "dark" } },
    {
      name: "cascade-carousel",
      overrides: { ...DARK_SURFACE, cardColor: "#18181b", cardInk: "#fafafa" },
    },
    { name: "blob-trail", overrides: DARK_SURFACE },
    { name: "node-reveal", overrides: DARK_SURFACE },
    { name: "reel-carousel", overrides: DARK_SURFACE },
    { name: "slice-trail", overrides: DARK_SURFACE },
    {
      name: "diagonal-carousel",
      overrides: { ...DARK_SURFACE, cardBorder: "#27272a" },
    },
  ],
];

export const SignInWall = () => (
  <div
    aria-hidden
    className="dark relative hidden overflow-hidden border-l lg:block lg:min-h-[640px]"
  >
    <div className="absolute inset-0 grid grid-cols-2 gap-3 px-3 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      {COLUMNS.map((column, index) => (
        <div key={column[0].name} className="min-w-0 overflow-hidden">
          <div
            className={cn(
              "scroll-feed flex flex-col gap-3 [animation-duration:80s]",
              index === 1 && "[animation-direction:reverse]"
            )}
          >
            {[...column, ...column].map(({ name, overrides }, position) => (
              <div
                // Each preview appears twice in the doubled track.
                key={`${name}-${position}`}
                className="bg-card shrink-0 overflow-hidden rounded-lg border"
              >
                <CatalogPreview name={name} overrides={overrides} active />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
