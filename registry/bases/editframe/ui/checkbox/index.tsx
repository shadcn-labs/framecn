"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type CheckboxState = "unchecked" | "checked";

type CheckboxSize = "sm" | "default" | "lg";

export interface CheckboxProps {
  state?: CheckboxState;
  style?: CheckboxStyle;
  label?: string;
  size?: CheckboxSize;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  align?: "start" | "center" | "end";
  className?: string;
}
const justify = (align: "start" | "center" | "end"): string => {
  if (align === "start") {
    return "flex-start";
  }
  if (align === "end") {
    return "flex-end";
  }
  return "center";
};

const CHECK_PATH_LENGTH = 14;
const SIZE_STYLES: Record<
  CheckboxSize,
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

export interface CheckboxStyle {
  boxBackground: string;
  boxBorderColor: string;
  checkOpacity: number;
  checkScale: number;
  checkDraw: number;
}

export interface CheckboxStyleContext {
  uncheckedBg: string;
  checkedBg: string;
  uncheckedBorder: string;
  checkedBorder: string;
  checkColor: string;
}

export const checkboxStyleContext = (
  theme: FramecnTheme
): CheckboxStyleContext => ({
  checkColor: theme.primaryForeground,
  checkedBg: theme.primary,
  checkedBorder: theme.primary,
  uncheckedBg: theme.background,
  uncheckedBorder: theme.border,
});

export const checkboxStyle = (
  state: CheckboxState,
  ctx: CheckboxStyleContext
): CheckboxStyle => {
  switch (state) {
    case "checked": {
      return {
        boxBackground: ctx.checkedBg,
        boxBorderColor: ctx.checkedBorder,
        checkDraw: 1,
        checkOpacity: 1,
        checkScale: 1,
      };
    }
    default: {
      return {
        boxBackground: ctx.uncheckedBg,
        boxBorderColor: ctx.uncheckedBorder,
        checkDraw: 0,
        checkOpacity: 0,
        checkScale: 0.6,
      };
    }
  }
};

export const Checkbox = ({
  state = "unchecked",
  style,
  label,
  size = "default",
  theme: themeOverride,
  primary,
  align = "center",
  className,
}: CheckboxProps) => {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );
  const sizeStyle = SIZE_STYLES[size];
  const ctx = checkboxStyleContext(theme);
  const v = style ?? checkboxStyle(state, ctx);
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
        justifyContent: justify(align),
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
            background: v.boxBackground,
            border: `1px solid ${v.boxBorderColor}`,
            borderRadius: Math.round(boxSize * 0.28),
            display: "flex",
            height: boxSize,
            justifyContent: "center",
            width: boxSize,
          }}
        >
          <svg
            width={boxSize}
            height={boxSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              opacity: v.checkOpacity,
              transform: `scale(${v.checkScale})`,
            }}
          >
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke={ctx.checkColor}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={CHECK_PATH_LENGTH}
              strokeDasharray={CHECK_PATH_LENGTH}
              strokeDashoffset={CHECK_PATH_LENGTH * (1 - v.checkDraw)}
            />
          </svg>
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
