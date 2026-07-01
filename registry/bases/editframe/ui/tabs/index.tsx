"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { tabsKeyframes } from "@/registry/bases/editframe/ui/tabs/use-tabs-transition";

export type TabsState = number;

export interface TabsStyle {
  indicatorOffset: number;
}

export interface TabsStyleContext {
  items: string[];
  variant: "pill" | "underline";
  activeFg: string;
  inactiveFg: string;
  trackBg: string;
  indicatorBg: string;
}

export const tabsStyleContext = (
  items: string[],
  variant: "pill" | "underline",
  theme: FramecnTheme
): TabsStyleContext => ({
  activeFg: theme.foreground,
  inactiveFg: theme.mutedForeground,
  indicatorBg: theme.primary,
  items,
  trackBg: variant === "pill" ? theme.muted : "transparent",
  variant,
});

export const tabsStyle = (
  state: TabsState,
  _ctx: TabsStyleContext
): TabsStyle => ({
  indicatorOffset: state,
});

export interface TabsProps {
  state?: TabsState;
  from?: TabsState;
  items?: string[];
  variant?: "pill" | "underline";
  theme?: Partial<FramecnTheme>;
  primary?: string;
  className?: string;
}

export const Tabs = ({
  state = 0,
  from,
  items = ["Account", "Password", "Settings"],
  variant = "pill",
  theme: themeOverride,
  primary,
  className,
}: TabsProps) => {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );

  const ctx = tabsStyleContext(items, variant, theme);
  const v = tabsStyle(state, ctx);

  const WIDTH = 440;
  const trackPad = variant === "pill" ? 4 : 0;
  const innerWidth = WIDTH - trackPad * 2;
  const segmentWidth = innerWidth / items.length;
  const rowHeight = 40;

  const indicatorLeft = trackPad + v.indicatorOffset * segmentWidth;

  const hasAnimation = from !== undefined && from !== state;
  const fromStyle = hasAnimation ? tabsStyle(from, ctx) : undefined;
  const toStyle = v;

  return (
    <div
      className={className}
      style={{
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        width: WIDTH,
      }}
    >
      {hasAnimation && fromStyle && (
        <style>{tabsKeyframes(fromStyle, toStyle, ctx)}</style>
      )}
      <div
        style={{
          background: ctx.trackBg,
          border:
            variant === "underline" ? `1px solid ${theme.border}` : "none",
          borderRadius: variant === "pill" ? theme.radius : 0,
          display: "flex",
          padding: trackPad,
          position: "relative",
        }}
      >
        {variant === "pill" && (
          <div
            style={{
              background: ctx.indicatorBg,
              borderRadius: theme.radius - trackPad,
              height: rowHeight,
              left: indicatorLeft,
              position: "absolute",
              transition: hasAnimation
                ? undefined
                : "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              width: segmentWidth,
            }}
          />
        )}
        {items.map((label, i) => {
          const isActive = i === state;
          const labelColor = mixOklch(
            ctx.inactiveFg,
            ctx.activeFg,
            Math.max(0, 1 - Math.abs(i - v.indicatorOffset))
          );

          return (
            <div
              key={label}
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
              {label}
              {variant === "underline" && isActive && (
                <div
                  style={{
                    background: ctx.indicatorBg,
                    borderRadius: 999,
                    bottom: -1,
                    height: 2,
                    left: 0,
                    position: "absolute",
                    right: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
