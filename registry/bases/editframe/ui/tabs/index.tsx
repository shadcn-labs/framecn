"use client";

import { mixOklch, useFramecnMode, useFramecnTheme } from "@/lib/framecn-ui";
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
  theme: FramecnTheme,
  mode: "light" | "dark" = "light"
): TabsStyleContext => {
  const pillBackground =
    mode === "dark"
      ? mixOklch(theme.input, "transparent", 0.7)
      : theme.background;
  return {
    activeFg: theme.foreground,
    border: theme.border,
    inactiveFg:
      mode === "dark"
        ? theme.mutedForeground
        : mixOklch(theme.foreground, "transparent", 0.4),
    indicatorBg: variant === "underline" ? theme.foreground : pillBackground,
    items,
    panelFg: theme.foreground,
    radius: theme.radius,
    trackBg: theme.muted,
    variant,
  };
};

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
  const theme = useFramecnTheme(themeOverride);
  const mode = useFramecnMode();
  const ctx = tabsStyleContext(items, variant, theme, mode);
  const v = style ?? tabsStyle(state, ctx);
  const isPill = ctx.variant === "pill";
  const trackPad = isPill ? 3 : 0;
  const innerWidth = WIDTH - trackPad * 2;
  const segmentWidth = innerWidth / items.length;
  const rowHeight = 36;
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
                    border: `1px solid ${mode === "dark" ? theme.input : "transparent"}`,
                    borderRadius: Math.max(0, ctx.radius - 2),
                    boxShadow:
                      "0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 10%)",
                    boxSizing: "border-box",
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
                  lineHeight: "20px",
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
            marginTop: 8,
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
