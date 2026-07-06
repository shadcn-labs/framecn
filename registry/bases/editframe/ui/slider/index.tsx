"use client";

import { clamp01, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type SliderThumbState = "idle" | "hover" | "press";

export interface SliderStyle {
  value: number;
  thumbScale: number;
  ringOpacity: number;
}

export interface SliderProps {
  value?: number;
  thumbState?: SliderThumbState;
  style?: SliderStyle;
  width?: number;
  showValue?: boolean;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const TRACK_HEIGHT = 8;
const THUMB_HEIGHT = 16;
const THUMB_WIDTH = 24;
const THUMB_RADIUS = THUMB_HEIGHT / 2;
const RING_WIDTH = 4;

const clampValue = (value: number): number => clamp01(value / 100) * 100;

export const sliderThumbStyle = (
  thumbState: SliderThumbState
): {
  thumbScale: number;
  ringOpacity: number;
} => {
  switch (thumbState) {
    case "hover": {
      return { ringOpacity: 1, thumbScale: 1.1 };
    }
    case "press": {
      return { ringOpacity: 1, thumbScale: 1.15 };
    }
    default: {
      return { ringOpacity: 0, thumbScale: 1 };
    }
  }
};

export interface SliderStyleContext {
  track: string;
  range: string;
  thumbBg: string;
  thumbRing: string;
  ring: string;
  valueText: string;
}

export const sliderStyleContext = (
  theme: FramecnTheme
): SliderStyleContext => ({
  range: theme.primary,
  ring: mixOklch(theme.ring, theme.background, 0.7),
  thumbBg: "oklch(1 0 0)",
  thumbRing: "rgba(0, 0, 0, 0.1)",
  track: mixOklch(theme.input, theme.background, 0.1),
  valueText: theme.foreground,
});

export const Slider = ({
  value = 0,
  thumbState = "idle",
  style,
  width = 320,
  showValue = false,
  theme: themeOverride,
  className,
}: SliderProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = sliderStyleContext(theme);
  const thumb = sliderThumbStyle(thumbState);
  const v: SliderStyle = style ?? {
    ringOpacity: thumb.ringOpacity,
    thumbScale: thumb.thumbScale,
    value,
  };
  const pct = clampValue(v.value);
  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "inline-flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        height: THUMB_HEIGHT,
        position: "relative",
        width,
      }}
    >
      <div
        style={{
          background: ctx.track,
          borderRadius: TRACK_HEIGHT / 2,
          height: TRACK_HEIGHT,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: ctx.range,
            borderRadius: TRACK_HEIGHT / 2,
            bottom: 0,
            left: 0,
            position: "absolute",
            top: 0,
            width: `${pct}%`,
          }}
        />
      </div>

      <div
        style={{
          left: `${pct}%`,
          position: "absolute",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${v.thumbScale})`,
        }}
      >
        <div
          style={{
            background: ctx.ring,
            borderRadius: THUMB_RADIUS + RING_WIDTH,
            height: THUMB_HEIGHT + RING_WIDTH * 2,
            left: "50%",
            opacity: v.ringOpacity,
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: THUMB_WIDTH + RING_WIDTH * 2,
          }}
        />

        <div
          style={{
            background: ctx.thumbBg,
            borderRadius: THUMB_RADIUS,
            boxShadow: `0 0 0 1px ${ctx.thumbRing}, 0 2px 4px rgba(0,0,0,0.18)`,
            height: THUMB_HEIGHT,
            position: "relative",
            width: THUMB_WIDTH,
          }}
        />
        {showValue && (
          <span
            style={{
              bottom: "100%",
              color: ctx.valueText,
              fontSize: 12,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 500,
              left: "50%",
              marginBottom: 8,
              position: "absolute",
              transform: "translateX(-50%)",
            }}
          >
            {Math.round(pct)}
          </span>
        )}
      </div>
    </div>
  );
};
