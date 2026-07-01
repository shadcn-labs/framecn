"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  sliderStyleAt,
  tweenSliderStyle,
} from "@/registry/bases/editframe/ui/slider/use-slider-transition";
import type {
  SliderStep,
  SliderTransitionOptions,
} from "@/registry/bases/editframe/ui/slider/use-slider-transition";

export type SliderThumbState = "idle" | "hover" | "press" | "active" | "disabled";

export interface SliderStyle {
  ringOpacity: number;
  thumbScale: number;
  value: number;
}

export const sliderThumbStyle = (state: SliderThumbState): { ringOpacity: number; thumbScale: number } => {
  switch (state) {
    case "hover":
      return { ringOpacity: 0.3, thumbScale: 1.1 };
    case "press":
      return { ringOpacity: 0.5, thumbScale: 0.9 };
    case "active":
      return { ringOpacity: 0.4, thumbScale: 1.05 };
    case "disabled":
      return { ringOpacity: 0, thumbScale: 0.8 };
    default:
      return { ringOpacity: 0, thumbScale: 1 };
  }
};

export interface SliderProps {
  value?: number;
  from?: number;
  min?: number;
  max?: number;
  steps?: SliderStep[];
  theme?: Partial<FramecnTheme>;
  primary?: string;
  speed?: number;
  className?: string;
  duration?: string;
}

export function Slider({
  value = 50,
  from,
  min = 0,
  max = 100,
  steps,
  theme: themeOverride,
  primary,
  speed = 1,
  className,
  duration = "18frames",
}: SliderProps) {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );

  const range = max - min;
  const normalized = range > 0 ? (value - min) / range : 0;
  const fromNormalized = from !== undefined ? (from - min) / range : undefined;

  const trackHeight = 6;
  const thumbSize = 18;
  const thumbOffset = normalized * (100);
  const fromOffset = fromNormalized !== undefined ? fromNormalized * 100 : undefined;

  const trackFill = `linear-gradient(to right, ${theme.primary} ${thumbOffset}%, ${theme.muted} ${thumbOffset}%)`;

  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 12,
        width: "100%",
      }}
    >
      <div
        style={{
          background: theme.muted,
          borderRadius: 999,
          flex: 1,
          height: trackHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            background: theme.primary,
            borderRadius: 999,
            height: "100%",
            width: `${thumbOffset}%`,
          }}
        />
        <div
          style={{
            background: theme.primaryForeground,
            border: `2px solid ${theme.primary}`,
            borderRadius: "50%",
            height: thumbSize,
            left: `calc(${thumbOffset}% - ${thumbSize / 2}px)`,
            position: "absolute",
            top: `calc(50% - ${thumbSize / 2}px)`,
            width: thumbSize,
          }}
        />
      </div>
      <span
        style={{
          color: theme.foreground,
          fontVariantNumeric: "tabular-nums",
          fontSize: 14,
          minWidth: 36,
          textAlign: "right",
        }}
      >
        {Math.round(value)}
      </span>
    </div>
  );
}
