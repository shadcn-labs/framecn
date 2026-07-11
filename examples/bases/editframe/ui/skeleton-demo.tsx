"use client";

import { Skeleton } from "@/registry/bases/editframe/ui/skeleton";
import type { SkeletonLayout } from "@/registry/bases/editframe/ui/skeleton";
import { useSkeletonTransition } from "@/registry/bases/editframe/ui/skeleton/use-skeleton-transition";

export interface SkeletonDemoProps {
  layout?: SkeletonLayout;
}

export const skeletonDemoControls = ["layout"] as const;

export const SkeletonDemoScene = (p: SkeletonDemoProps = {}) => {
  // Shimmer for ~3 full sweep cycles (180 frames) as if waiting on data, then
  // crossfade to real content.
  const skeletonStyle = useSkeletonTransition([
    { at: 180, duration: 16, state: "loaded" },
  ]);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <Skeleton style={skeletonStyle} layout={p.layout ?? "card"}>
        {/* Real content — defines the box size; revealed on crossfade. */}
        <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
          <div
            style={{
              background: "oklch(0.92 0 0)",
              borderRadius: 24,
              flexShrink: 0,
              height: 48,
              width: 48,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                background: "oklch(0.85 0 0)",
                borderRadius: 6,
                height: 14,
                width: 180,
              }}
            />
            <div
              style={{
                background: "oklch(0.9 0 0)",
                borderRadius: 6,
                height: 14,
                width: 120,
              }}
            />
          </div>
        </div>
      </Skeleton>
    </div>
  );
};

export const skeletonDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const layout = values.layout as string | undefined;

  const props: string[] = [];
  if (layout !== undefined && layout !== "card") {
    props.push(`layout="${layout}"`);
  }
  const extraProps = props.length
    ? `\n        ${props.join("\n        ")}\n        `
    : "";

  const optsStr = "";

  return `import { Skeleton } from "@/components/framecn/skeleton";
import { useSkeletonTransition } from "@/components/framecn/use-skeleton-transition";

export const Scene = () => {
  // Shimmer for ~3 full sweep cycles (180 frames) as if waiting on data, then
  // crossfade to real content.
  const skeletonStyle = useSkeletonTransition([
    { at: 180, state: "loaded", duration: 16 },
  ]${optsStr});

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Skeleton${extraProps}style={skeletonStyle}>
        {/* Real content — defines the box size; revealed on crossfade. */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: "oklch(0.92 0 0)",
              flexShrink: 0,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                width: 180,
                height: 14,
                borderRadius: 6,
                background: "oklch(0.85 0 0)",
              }}
            />
            <div
              style={{
                width: 120,
                height: 14,
                borderRadius: 6,
                background: "oklch(0.9 0 0)",
              }}
            />
          </div>
        </div>
      </Skeleton>
    </div>
  );
};`;
};
