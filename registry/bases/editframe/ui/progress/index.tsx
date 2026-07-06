"use client";

import { clamp01, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export interface ProgressStyle {
  value: number;
}

export interface ProgressProps {
  value?: number;
  style?: ProgressStyle;
  width?: number;
  showLabel?: boolean;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const TRACK_HEIGHT = 12;

const clampValue = (value: number): number => clamp01(value / 100) * 100;

export const Progress = ({
  value = 0,
  style,
  width = 320,
  showLabel = false,
  theme: themeOverride,
  className,
}: ProgressProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const v = clampValue(style ? style.value : value);
  const track = theme.muted;
  const indicator = theme.primary;
  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "inline-flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 12,
      }}
    >
      <div
        style={{
          background: track,
          borderRadius: TRACK_HEIGHT / 2,
          height: TRACK_HEIGHT,
          overflow: "hidden",
          position: "relative",
          width,
        }}
      >
        <div
          style={{
            background: indicator,
            borderRadius: TRACK_HEIGHT / 2,
            bottom: 0,
            left: 0,
            position: "absolute",
            top: 0,
            width: `${v}%`,
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            color: theme.mutedForeground,
            fontSize: 14,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 500,
            minWidth: "3ch",
            textAlign: "right",
          }}
        >
          {Math.floor(v)}%
        </span>
      )}
    </div>
  );
};
