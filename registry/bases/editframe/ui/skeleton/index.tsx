"use client";

import type { ReactNode } from "react";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { SkeletonBlock } from "@/registry/bases/editframe/ui/skeleton-block";

export type SkeletonState = "loading" | "loaded";

export type SkeletonLayout = "lines" | "card";

export interface SkeletonProps {
  state?: SkeletonState;
  style?: SkeletonStyle;
  children?: ReactNode;
  placeholder?: ReactNode;
  layout?: SkeletonLayout;
  speed?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

export interface SkeletonStyle {
  skeletonOpacity: number;
  contentOpacity: number;
}

export const skeletonStyle = (state: SkeletonState): SkeletonStyle => {
  switch (state) {
    case "loaded": {
      return { contentOpacity: 1, skeletonOpacity: 0 };
    }
    default: {
      return { contentOpacity: 0, skeletonOpacity: 1 };
    }
  }
};

function LayoutPlaceholder({
  layout,
  speed,
  baseColor,
}: {
  layout: SkeletonLayout;
  speed?: number;
  baseColor: string;
}) {
  const shimmer = { baseColor, speed };
  if (layout === "card") {
    return (
      <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
        {}
        <SkeletonBlock
          width={48}
          height={48}
          radius={24}
          flexShrink={0}
          {...shimmer}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SkeletonBlock width={180} height={14} {...shimmer} />
          <SkeletonBlock width={120} height={14} {...shimmer} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <SkeletonBlock width={260} height={14} {...shimmer} />
      <SkeletonBlock width={240} height={14} {...shimmer} />
      <SkeletonBlock width={160} height={14} {...shimmer} />
    </div>
  );
}

export function Skeleton({
  state = "loading",
  style,
  children,
  placeholder,
  layout = "lines",
  speed,
  theme: themeOverride,
  className,
}: SkeletonProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const v = style ?? skeletonStyle(state);

  const placeholderLayer = placeholder ?? (
    <LayoutPlaceholder layout={layout} speed={speed} baseColor={theme.muted} />
  );

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
      }}
    >
      {}
      <div style={{ opacity: v.contentOpacity }}>{children}</div>
      {}
      <div
        style={{
          inset: 0,
          opacity: v.skeletonOpacity,
          pointerEvents: "none",
          position: "absolute",
        }}
      >
        {placeholderLayer}
      </div>
    </div>
  );
}
