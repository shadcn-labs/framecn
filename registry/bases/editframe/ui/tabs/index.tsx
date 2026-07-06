"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type TabsState = string;

type TabsVariant = "pill" | "underline";

export interface TabsProps {
  state?: TabsState;
  style?: TabsStyle;
  items?: string[];
  contents?: string[];
  contentHeight?: number;
  variant?: TabsVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const WIDTH = 440;
const DEFAULT_ITEMS = ["Account", "Password", "Settings"];
const DEFAULT_CONTENTS = [
  "Make changes to your account here.",
  "Change your password here.",
  "Manage your notification settings.",
];

export interface TabsStyle {
  indicatorOffset: number;
}

export interface TabsStyleContext {
  items: string[];
  variant: TabsVariant;
  trackBg: string;
  activeFg: string;
  inactiveFg: string;
  indicatorBg: string;
  border: string;
  radius: number;
  panelFg: string;
}

export const tabsStyleContext = (
  items: string[],
  variant: TabsVariant,
  theme: FramecnTheme
): TabsStyleContext => ({
  activeFg: theme.foreground,
  border: theme.border,
  inactiveFg: theme.mutedForeground,
  indicatorBg: variant === "underline" ? theme.primary : theme.background,
  items,
  panelFg: theme.mutedForeground,
  radius: theme.radius,
  trackBg: theme.muted,
  variant,
});

export const tabsStyle = (
  state: TabsState,
  ctx: TabsStyleContext
): TabsStyle => {
  const i = ctx.items.indexOf(state);
  return { indicatorOffset: Math.max(0, i) };
};

export const Tabs = ({
  state = DEFAULT_ITEMS[0],
  style,
  items = DEFAULT_ITEMS,
  contents = DEFAULT_CONTENTS,
  contentHeight = 72,
  variant = "pill",
  theme: themeOverride,
  className,
}: TabsProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = tabsStyleContext(items, variant, theme);
  const v = style ?? tabsStyle(state, ctx);
  const isPill = ctx.variant === "pill";
  const trackPad = isPill ? 4 : 0;
  const innerWidth = WIDTH - trackPad * 2;
  const segmentWidth = innerWidth / items.length;
  const rowHeight = 40;
  const indicatorX = trackPad + v.indicatorOffset * segmentWidth;
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
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <div style={{ width: WIDTH }}>
        <div
          style={{
            background: isPill ? ctx.trackBg : "transparent",
            borderBottom: isPill ? undefined : `1px solid ${ctx.border}`,
            borderRadius: isPill ? ctx.radius : 0,
            boxSizing: "border-box",
            display: "flex",
            height: rowHeight,
            padding: trackPad,
            position: "relative",
          }}
        >
          <div
            style={
              isPill
                ? {
                    background: ctx.indicatorBg,
                    borderRadius: ctx.radius - 3,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    height: rowHeight - trackPad * 2,
                    left: indicatorX,
                    position: "absolute",
                    top: trackPad,
                    width: segmentWidth,
                  }
                : {
                    background: ctx.indicatorBg,
                    bottom: 0,
                    height: 2,
                    left: indicatorX,
                    position: "absolute",
                    width: segmentWidth,
                  }
            }
          />

          {items.map((item, i) => {
            const proximity = Math.max(0, 1 - Math.abs(i - v.indicatorOffset));
            return (
              <span
                key={item}
                style={{
                  alignItems: "center",
                  color: mixOklch(ctx.inactiveFg, ctx.activeFg, proximity),
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 500,
                  justifyContent: "center",
                  letterSpacing: "-0.01em",
                  position: "relative",
                  width: segmentWidth,
                }}
              >
                {item}
              </span>
            );
          })}
        </div>

        <div
          style={{
            height: contentHeight,
            marginTop: 16,
            position: "relative",
          }}
        >
          {items.map((item, i) => {
            const proximity = Math.max(0, 1 - Math.abs(i - v.indicatorOffset));
            return (
              <div
                key={item}
                style={{
                  color: ctx.panelFg,
                  fontSize: 14,
                  inset: 0,
                  lineHeight: 1.5,
                  opacity: proximity,
                  position: "absolute",
                }}
              >
                {contents[i]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
