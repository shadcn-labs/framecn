"use client";

import type { ReactNode } from "react";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type ToggleGroupState = string;

export type ToggleGroupSize = "default" | "sm";

export interface ToggleGroupItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ToggleGroupProps {
  state?: ToggleGroupState;
  style?: ToggleGroupStyle;
  items?: ToggleGroupItem[];
  size?: ToggleGroupSize;
  theme?: Partial<FramecnTheme>;
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

const DEFAULT_ITEMS: ToggleGroupItem[] = [
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];
const SIZE_STYLES: Record<
  ToggleGroupSize,
  {
    height: number;
    segMinWidth: number;
    fontSize: number;
    pad: number;
    gap: number;
  }
> = {
  default: { fontSize: 14, gap: 8, height: 36, pad: 4, segMinWidth: 88 },
  sm: { fontSize: 13, gap: 6, height: 32, pad: 3, segMinWidth: 72 },
};

export interface ToggleGroupStyle {
  indicatorOffset: number;
}

export interface ToggleGroupStyleContext {
  items: ToggleGroupItem[];
  trackBg: string;
  thumbBg: string;
  activeFg: string;
  inactiveFg: string;
  radius: number;
}

export const toggleGroupStyleContext = (
  items: ToggleGroupItem[],
  theme: FramecnTheme
): ToggleGroupStyleContext => ({
  activeFg: theme.foreground,
  inactiveFg: theme.mutedForeground,
  items,
  radius: theme.radius,
  thumbBg: theme.background,
  trackBg: theme.muted,
});

export const toggleGroupStyle = (
  state: ToggleGroupState,
  ctx: ToggleGroupStyleContext
): ToggleGroupStyle => {
  const i = ctx.items.findIndex((it) => it.value === state);
  return { indicatorOffset: Math.max(0, i) };
};

export const ToggleGroup = ({
  state = DEFAULT_ITEMS[0].value,
  style,
  items = DEFAULT_ITEMS,
  size = "default",
  theme: themeOverride,
  align = "center",
  className,
}: ToggleGroupProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = toggleGroupStyleContext(items, theme);
  const v = style ?? toggleGroupStyle(state, ctx);
  const sizeStyle = SIZE_STYLES[size];
  const { pad } = sizeStyle;
  const segmentWidth = sizeStyle.segMinWidth;
  const thumbX = pad + v.indicatorOffset * segmentWidth;
  return (
    <div
      className={className}
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
      <div
        style={{
          background: ctx.trackBg,
          borderRadius: ctx.radius,
          boxSizing: "border-box",
          display: "flex",
          height: sizeStyle.height,
          padding: pad,
          position: "relative",
        }}
      >
        <div
          style={{
            background: ctx.thumbBg,
            borderRadius: Math.max(2, ctx.radius - 3),
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            height: sizeStyle.height - pad * 2,
            left: thumbX,
            position: "absolute",
            top: pad,
            width: segmentWidth,
          }}
        />

        {items.map((item, i) => {
          const proximity = Math.max(0, 1 - Math.abs(i - v.indicatorOffset));
          return (
            <span
              key={item.value}
              style={{
                alignItems: "center",
                color: mixOklch(ctx.inactiveFg, ctx.activeFg, proximity),
                display: "flex",
                fontSize: sizeStyle.fontSize,
                fontWeight: 500,
                gap: sizeStyle.gap,
                justifyContent: "center",
                letterSpacing: "-0.01em",
                position: "relative",
                width: segmentWidth,
              }}
            >
              {item.icon}
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
