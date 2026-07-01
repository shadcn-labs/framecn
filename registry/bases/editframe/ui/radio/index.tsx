"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  radioKeyframes,
  radioAnimation,
} from "@/registry/bases/editframe/ui/radio/use-radio-transition";

export type RadioState = "checked" | "unchecked";

export interface RadioStyle {
  ringBorderColor: string;
  dotOpacity: number;
  dotScale: number;
}

export interface RadioStyleContext {
  checkedBorder: string;
  uncheckedBorder: string;
  dotColor: string;
  foreground: string;
  mutedForeground: string;
}

export interface RadioProps {
  state?: RadioState;
  from?: RadioState;
  label?: string;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const RADIO_SIZE = 20;
const DOT_SIZE = 10;

export const radioStyleContext = (theme: FramecnTheme): RadioStyleContext => ({
  checkedBorder: theme.primary,
  dotColor: theme.primary,
  foreground: theme.foreground,
  mutedForeground: theme.mutedForeground,
  uncheckedBorder: theme.input,
});

export const radioStyle = (
  state: RadioState,
  ctx: RadioStyleContext
): RadioStyle => {
  switch (state) {
    case "checked": {
      return { dotOpacity: 1, dotScale: 1, ringBorderColor: ctx.checkedBorder };
    }
    default: {
      return {
        dotOpacity: 0,
        dotScale: 0.4,
        ringBorderColor: ctx.uncheckedBorder,
      };
    }
  }
};

export const Radio = ({
  state = "unchecked",
  from,
  label = "Option",
  theme: themeOverride,
  className,
  duration = "10frames",
}: RadioProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = radioStyleContext(theme);
  const v = radioStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const anim = hasAnimation
    ? radioAnimation(from, state, duration)
    : { dot: "none", ring: "none" };

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
      {hasAnimation && <style>{radioKeyframes(ctx)}</style>}
      <label
        className={className}
        style={{
          alignItems: "center",
          cursor: "pointer",
          display: "inline-flex",
          gap: 10,
          userSelect: "none",
        }}
      >
        <span
          style={{
            alignItems: "center",
            animation: hasAnimation ? anim.ring : undefined,
            border: `1.5px solid ${v.ringBorderColor}`,
            borderRadius: "50%",
            display: "flex",
            height: RADIO_SIZE,
            justifyContent: "center",
            width: RADIO_SIZE,
          }}
        >
          <span
            style={{
              animation: hasAnimation ? anim.dot : undefined,
              background: ctx.dotColor,
              borderRadius: "50%",
              display: "block",
              height: DOT_SIZE,
              opacity: v.dotOpacity,
              transform: `scale(${v.dotScale})`,
              width: DOT_SIZE,
            }}
          />
        </span>
        <span
          style={{
            color: ctx.foreground,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </span>
      </label>
    </div>
  );
};
