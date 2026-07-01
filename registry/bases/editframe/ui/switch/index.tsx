"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  getSwitchKeyframes,
  switchTrackAnimation,
  switchThumbAnimation,
  tweenSwitchStyle,
} from "@/registry/bases/editframe/ui/switch/use-switch-transition";

export type SwitchState = "unchecked" | "checked";

export interface SwitchStyle {
  thumbOffset: number;
  trackBackground: string;
}

export interface SwitchStyleContext {
  trackOff: string;
  trackOn: string;
  thumb: string;
  travel: number;
}

export const switchStyleContext = (
  theme: FramecnTheme,
  primary?: string
): SwitchStyleContext => {
  const activeColor = primary ?? theme.primary;
  return {
    thumb: theme.background,
    trackOff: theme.muted,
    trackOn: activeColor,
    travel: 20,
  };
};

export const switchStyle = (
  state: SwitchState,
  ctx: SwitchStyleContext
): SwitchStyle => {
  switch (state) {
    case "checked":
      return {
        thumbOffset: ctx.travel,
        trackBackground: ctx.trackOn,
      };
    default:
      return {
        thumbOffset: 0,
        trackBackground: ctx.trackOff,
      };
  }
};

export interface SwitchProps {
  state?: SwitchState;
  from?: SwitchState;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  speed?: number;
  className?: string;
  duration?: string;
}

export function Switch({
  state = "unchecked",
  from,
  theme: themeOverride,
  primary,
  speed = 1,
  className,
  duration = "10frames",
}: SwitchProps) {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );

  const ctx = switchStyleContext(theme, primary);
  const v = switchStyle(state, ctx);

  const hasAnimation = from && from !== state;

  const trackWidth = 44;
  const trackHeight = 24;
  const thumbSize = 18;
  const thumbPadding = (trackHeight - thumbSize) / 2;

  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "inline-flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          background: v.trackBackground,
          border: `1px solid ${theme.border}`,
          borderRadius: 999,
          cursor: "pointer",
          height: trackHeight,
          padding: thumbPadding,
          position: "relative",
          width: trackWidth,
        }}
      >
        <div
          style={{
            background: ctx.thumb,
            borderRadius: "50%",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            height: thumbSize,
            left: thumbPadding + v.thumbOffset,
            position: "absolute",
            top: thumbPadding,
            transition: hasAnimation
              ? undefined
              : "left 0.15s cubic-bezier(0.16, 1, 0.3, 1), background 0.15s",
            width: thumbSize,
          }}
        />
      </div>
    </div>
  );
}
