"use client";

import { mixOklch, useFramecnMode, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type SwitchState = "unchecked" | "checked";

type SwitchSize = "sm" | "default" | "lg";

export interface SwitchProps {
  state?: SwitchState;
  style?: SwitchStyle;
  label?: string;
  size?: SwitchSize;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  className?: string;
}
const SIZE_STYLES: Record<
  SwitchSize,
  {
    trackW: number;
    trackH: number;
    thumb: number;
    pad: number;
    fontSize: number;
    gap: number;
  }
> = {
  default: {
    fontSize: 14,
    gap: 8,
    pad: 1,
    thumb: 16,
    trackH: 18.4,
    trackW: 32,
  },
  lg: { fontSize: 14, gap: 8, pad: 1, thumb: 20, trackH: 22, trackW: 40 },
  sm: { fontSize: 12, gap: 8, pad: 1, thumb: 12, trackH: 14, trackW: 24 },
};

export interface SwitchStyle {
  trackBackground: string;
  thumbOffset: number;
}

export interface SwitchStyleContext {
  uncheckedTrack: string;
  checkedTrack: string;
  thumbColor: string;
}

export const switchStyleContext = (
  theme: FramecnTheme,
  mode: "light" | "dark" = "light"
): SwitchStyleContext => ({
  checkedTrack: theme.primary,
  thumbColor: theme.background,
  uncheckedTrack:
    mode === "dark" ? mixOklch(theme.input, "transparent", 0.2) : theme.input,
});

export const switchStyle = (
  state: SwitchState,
  ctx: SwitchStyleContext
): SwitchStyle => {
  switch (state) {
    case "checked": {
      return {
        thumbOffset: 1,
        trackBackground: ctx.checkedTrack,
      };
    }
    default: {
      return {
        thumbOffset: 0,
        trackBackground: ctx.uncheckedTrack,
      };
    }
  }
};

export const Switch = ({
  state = "unchecked",
  style,
  label,
  size = "default",
  theme: themeOverride,
  primary,
  className,
}: SwitchProps) => {
  const theme = useFramecnTheme({
    ...themeOverride,
    ...(primary ? { primary } : {}),
  });
  const mode = useFramecnMode();
  const sizeStyle = SIZE_STYLES[size];
  const ctx = switchStyleContext(theme, mode);
  const v = style ?? switchStyle(state, ctx);
  const travel = sizeStyle.trackW - sizeStyle.thumb - sizeStyle.pad * 2;
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
      <span
        className={className}
        style={{
          alignItems: "center",
          display: "inline-flex",
          gap: sizeStyle.gap,
        }}
      >
        <span
          style={{
            alignItems: "center",
            background: v.trackBackground,
            borderRadius: sizeStyle.trackH / 2,
            boxShadow: "0 1px 2px rgb(0 0 0 / 5%)",
            display: "flex",
            height: sizeStyle.trackH,
            position: "relative",
            width: sizeStyle.trackW,
          }}
        >
          <span
            style={{
              background:
                mode === "dark"
                  ? mixOklch(
                      theme.foreground,
                      theme.primaryForeground,
                      v.thumbOffset
                    )
                  : ctx.thumbColor,
              borderRadius: "50%",
              boxShadow: "none",
              height: sizeStyle.thumb,
              left: sizeStyle.pad,
              position: "absolute",
              transform: `translateX(${v.thumbOffset * travel}px)`,
              width: sizeStyle.thumb,
            }}
          />
        </span>
        {label !== undefined && (
          <span
            style={{
              color: theme.foreground,
              fontSize: sizeStyle.fontSize,
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            {label}
          </span>
        )}
      </span>
    </div>
  );
};
