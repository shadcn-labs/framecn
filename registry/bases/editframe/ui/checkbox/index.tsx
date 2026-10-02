"use client";

import {
  FramecnIcon,
  mixOklch,
  useFramecnMode,
  useFramecnTheme,
} from "@/lib/framecn-ui";
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

const SIZE_STYLES: Record<
  CheckboxSize,
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
  theme: FramecnTheme,
  mode: "light" | "dark" = "light"
): CheckboxStyleContext => ({
  checkColor: theme.primaryForeground,
  checkedBg: theme.primary,
  checkedBorder: theme.primary,
  uncheckedBg:
    mode === "dark" ? mixOklch(theme.input, "transparent", 0.7) : "transparent",
  uncheckedBorder: theme.input,
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
  const theme = useFramecnTheme({
    ...themeOverride,
    ...(primary ? { primary } : {}),
  });
  const mode = useFramecnMode();
  const sizeStyle = SIZE_STYLES[size];
  const ctx = checkboxStyleContext(theme, mode);
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
            borderRadius: Math.max(0, theme.radius - 6),
            boxShadow: "0 1px 2px rgb(0 0 0 / 5%)",
            boxSizing: "border-box",
            display: "flex",
            height: boxSize,
            justifyContent: "center",
            width: boxSize,
          }}
        >
          <FramecnIcon
            name="Check"
            size={boxSize - 2}
            color={ctx.checkColor}
            style={{
              clipPath: `inset(0 ${(1 - v.checkDraw) * 100}% 0 0)`,
              opacity: v.checkOpacity,
              transform: `scale(${v.checkScale})`,
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
