"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { toggleGroupKeyframes } from "@/registry/bases/editframe/ui/toggle-group/use-toggle-group-transition";

export interface ToggleGroupItem {
  label: string;
  value: string;
}

export type ToggleGroupState = number;

export interface ToggleGroupStyle {
  indicatorOffset: number;
}

export interface ToggleGroupStyleContext {
  items: ToggleGroupItem[];
  activeFg: string;
  inactiveFg: string;
  trackBg: string;
  indicatorBg: string;
}

export const toggleGroupStyleContext = (
  items: ToggleGroupItem[],
  theme: FramecnTheme
): ToggleGroupStyleContext => ({
  activeFg: theme.foreground,
  inactiveFg: theme.mutedForeground,
  indicatorBg: theme.background,
  items,
  trackBg: theme.muted,
});

export const toggleGroupStyle = (
  state: ToggleGroupState,
  _ctx: ToggleGroupStyleContext
): ToggleGroupStyle => ({
  indicatorOffset: state,
});

export interface ToggleGroupProps {
  items?: ToggleGroupItem[];
  state?: ToggleGroupState;
  from?: ToggleGroupState;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  className?: string;
}

export const ToggleGroup = ({
  items = [
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
  ],
  state = 0,
  from,
  theme: themeOverride,
  primary,
  className,
}: ToggleGroupProps) => {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );

  const ctx = toggleGroupStyleContext(items, theme);
  const v = toggleGroupStyle(state, ctx);

  const rowHeight = 40;
  const trackPad = 4;
  const segmentWidth = (440 - trackPad * 2) / items.length;
  const indicatorLeft = trackPad + v.indicatorOffset * segmentWidth;

  const hasAnimation = from !== undefined && from !== state;
  const fromStyle = hasAnimation ? toggleGroupStyle(from, ctx) : undefined;
  const toStyle = v;

  return (
    <div
      className={className}
      style={{
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        width: 440,
      }}
    >
      {hasAnimation && fromStyle && (
        <style>
          {toggleGroupKeyframes(fromStyle, toStyle, ctx, segmentWidth)}
        </style>
      )}
      <div
        style={{
          background: ctx.trackBg,
          borderRadius: theme.radius,
          display: "flex",
          padding: trackPad,
          position: "relative",
        }}
      >
        <div
          style={{
            background: ctx.indicatorBg,
            borderRadius: theme.radius - trackPad,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            height: rowHeight,
            left: indicatorLeft,
            position: "absolute",
            transition: hasAnimation
              ? undefined
              : "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            width: segmentWidth,
          }}
        />
        {items.map((item, i) => {
          const isActive = i === state;
          const labelColor = mixOklch(
            ctx.inactiveFg,
            ctx.activeFg,
            Math.max(0, 1 - Math.abs(i - v.indicatorOffset))
          );

          return (
            <div
              key={item.value}
              style={{
                alignItems: "center",
                color: labelColor,
                cursor: "pointer",
                display: "flex",
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                height: rowHeight,
                justifyContent: "center",
                position: "relative",
                width: segmentWidth,
                zIndex: 1,
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
