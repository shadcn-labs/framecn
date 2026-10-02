"use client";

import {
  FramecnIcon,
  mixOklch,
  useFramecnMode,
  useFramecnTheme,
} from "@/lib/framecn-ui";
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
  default: { box: 16, fontSize: 14, gap: 8 },
  lg: { box: 20, fontSize: 14, gap: 8 },
  sm: { box: 14, fontSize: 12, gap: 8 },
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
  checkedBorder: theme.input,
  dotColor: theme.primary,
  uncheckedBorder: theme.input,
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
  const theme = useFramecnTheme({
    ...themeOverride,
    ...(primary ? { primary } : {}),
  });
  const mode = useFramecnMode();
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
            background:
              mode === "dark"
                ? mixOklch(theme.input, "transparent", 0.7)
                : "transparent",
            border: `1px solid ${v.ringBorderColor}`,
            borderRadius: "50%",
            boxShadow: "0 1px 2px rgb(0 0 0 / 5%)",
            boxSizing: "border-box",
            display: "flex",
            height: boxSize,
            justifyContent: "center",
            width: boxSize,
          }}
        >
          <FramecnIcon
            name="Circle"
            size={boxSize / 2}
            color={ctx.dotColor}
            style={{
              fill: ctx.dotColor,
              opacity: v.dotOpacity,
              transform: `scale(${v.dotScale})`,
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
