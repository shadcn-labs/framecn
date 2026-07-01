"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export interface ProgressStyle {
  value: number;
}

export interface ProgressStyleContext {
  trackBg: string;
  fillBg: string;
}

export interface ProgressProps {
  value?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const PROGRESS_WIDTH = 320;
const PROGRESS_HEIGHT = 8;

export const progressStyleContext = (
  theme: FramecnTheme
): ProgressStyleContext => ({
  fillBg: theme.primary,
  trackBg: theme.muted,
});

export const progressStyle = (
  value: number,
  _ctx: ProgressStyleContext
): ProgressStyle => ({
  value: Math.max(0, Math.min(1, value)),
});

export const Progress = ({
  value = 0.6,
  theme: themeOverride,
  className,
}: ProgressProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = progressStyleContext(theme);
  const v = progressStyle(value, ctx);

  return (
    <div
      style={{
        alignItems: "center",
        background: "transparent",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <div
        className={className}
        style={{
          background: ctx.trackBg,
          borderRadius: theme.radius,
          height: PROGRESS_HEIGHT,
          overflow: "hidden",
          width: PROGRESS_WIDTH,
        }}
      >
        <div
          style={{
            background: ctx.fillBg,
            borderRadius: theme.radius,
            height: "100%",
            transition: "width 80ms linear",
            width: `${v.value * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
