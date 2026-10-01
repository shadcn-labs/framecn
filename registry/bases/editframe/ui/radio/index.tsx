"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type RadioState = "unchecked" | "checked";

type RadioSize = "sm" | "default" | "lg";

export interface RadioProps {
  state?: RadioState;
  style?: RadioStyle;
  label?: string;
  size?: RadioSize;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  className?: string;
}
const SIZE_STYLES: Record<
  RadioSize,
  {
    box: number;
    fontSize: number;
    gap: number;
  }
> = {
  default: { box: 20, fontSize: 15, gap: 10 },
  lg: { box: 24, fontSize: 17, gap: 12 },
  sm: { box: 16, fontSize: 13, gap: 8 },
};

export interface RadioStyle {
  ringBorderColor: string;
  dotOpacity: number;
  dotScale: number;
}

export interface RadioStyleContext {
  uncheckedBorder: string;
  checkedBorder: string;
  dotColor: string;
}

export const radioStyleContext = (theme: FramecnTheme): RadioStyleContext => ({
  checkedBorder: theme.primary,
  dotColor: theme.primary,
  uncheckedBorder: theme.border,
});

export const radioStyle = (
  state: RadioState,
  ctx: RadioStyleContext
): RadioStyle => {
  switch (state) {
    case "checked": {
      return {
        dotOpacity: 1,
        dotScale: 1,
        ringBorderColor: ctx.checkedBorder,
      };
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
  style,
  label,
  size = "default",
  theme: themeOverride,
  primary,
  className,
}: RadioProps) => {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );
  const sizeStyle = SIZE_STYLES[size];
  const ctx = radioStyleContext(theme);
  const v = style ?? radioStyle(state, ctx);
  const boxSize = sizeStyle.box;
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
            background: theme.background,
            border: `1px solid ${v.ringBorderColor}`,
            borderRadius: "50%",
            display: "flex",
            height: boxSize,
            justifyContent: "center",
            width: boxSize,
          }}
        >
          <span
            style={{
              background: ctx.dotColor,
              borderRadius: "50%",
              height: Math.round(boxSize * 0.45),
              opacity: v.dotOpacity,
              transform: `scale(${v.dotScale})`,
              width: Math.round(boxSize * 0.45),
            }}
          />
        </span>
        {label !== undefined && (
          <span
            style={{
              color: theme.foreground,
              fontSize: sizeStyle.fontSize,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </span>
        )}
      </span>
    </div>
  );
};
