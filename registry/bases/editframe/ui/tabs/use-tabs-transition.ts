"use client";

import { mixOklch } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import type {
  TabsState,
  TabsStyle,
  TabsStyleContext,
} from "@/registry/bases/editframe/ui/tabs";

const _DEFAULT_ITEMS = ["Account", "Password", "Settings"];

export const DEFAULT_DURATION = 14;

export const tweenTabsStyle = (
  a: TabsStyle,
  b: TabsStyle,
  t: number
): TabsStyle => ({
  indicatorOffset:
    a.indicatorOffset + (b.indicatorOffset - a.indicatorOffset) * t,
});

export interface TabsTransitionOptions {
  items?: string[];
  variant?: "pill" | "underline";
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const tabsKeyframes = (
  fromStyle: TabsStyle,
  toStyle: TabsStyle,
  ctx: TabsStyleContext
): string => {
  const isPill = ctx.variant === "pill";
  const trackPad = isPill ? 4 : 0;
  const WIDTH = 440;
  const innerWidth = WIDTH - trackPad * 2;
  const segmentWidth = innerWidth / ctx.items.length;
  const _rowHeight = 40;

  const fromX = trackPad + fromStyle.indicatorOffset * segmentWidth;
  const toX = trackPad + toStyle.indicatorOffset * segmentWidth;
  const deltaX = toX - fromX;

  const fromLabelColors = ctx.items.map((_, i) =>
    mixOklch(
      ctx.inactiveFg,
      ctx.activeFg,
      Math.max(0, 1 - Math.abs(i - fromStyle.indicatorOffset))
    )
  );
  const toLabelColors = ctx.items.map((_, i) =>
    mixOklch(
      ctx.inactiveFg,
      ctx.activeFg,
      Math.max(0, 1 - Math.abs(i - toStyle.indicatorOffset))
    )
  );

  const fromContentOpacities = ctx.items.map((_, i) =>
    Math.max(0, 1 - Math.abs(i - fromStyle.indicatorOffset))
  );
  const toContentOpacities = ctx.items.map((_, i) =>
    Math.max(0, 1 - Math.abs(i - toStyle.indicatorOffset))
  );

  let css = `
    @keyframes framecn-tabs-indicator {
      0% { left: ${fromX}px; }
      100% { left: calc(${fromX}px + ${deltaX}px * var(--ef-progress)); }
    }
  `;

  for (let i = 0; i < ctx.items.length; i += 1) {
    if (fromLabelColors[i] !== toLabelColors[i]) {
      css += `
        @keyframes framecn-tabs-label-${i} {
          0% { color: ${fromLabelColors[i]}; }
          100% { color: ${toLabelColors[i]}; }
        }
      `;
    }
  }

  for (let i = 0; i < ctx.items.length; i += 1) {
    if (fromContentOpacities[i] !== toContentOpacities[i]) {
      const delta = toContentOpacities[i] - fromContentOpacities[i];
      css += `
        @keyframes framecn-tabs-content-${i} {
          0% { opacity: ${fromContentOpacities[i]}; }
          100% { opacity: calc(${fromContentOpacities[i]} + ${delta} * var(--ef-progress)); }
        }
      `;
    }
  }

  return css;
};

export const tabsAnimation = (
  from: TabsState,
  to: TabsState,
  duration: string,
  fromStyle: TabsStyle,
  toStyle: TabsStyle,
  ctx: TabsStyleContext
): {
  indicator: string;
  labels: string[];
  contents: string[];
} => {
  if (from === to) {
    return {
      contents: ctx.items.map(() => "none"),
      indicator: "none",
      labels: ctx.items.map(() => "none"),
    };
  }

  const indicatorAnim = `${duration} framecn-tabs-indicator cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  const labels = ctx.items.map((_, i) => {
    const fc = mixOklch(
      ctx.inactiveFg,
      ctx.activeFg,
      Math.max(0, 1 - Math.abs(i - fromStyle.indicatorOffset))
    );
    const tc = mixOklch(
      ctx.inactiveFg,
      ctx.activeFg,
      Math.max(0, 1 - Math.abs(i - toStyle.indicatorOffset))
    );
    if (fc === tc) {
      return "none";
    }
    return `${duration} framecn-tabs-label-${i} cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  });

  const contents = ctx.items.map((_, i) => {
    const fo = Math.max(0, 1 - Math.abs(i - fromStyle.indicatorOffset));
    const to2 = Math.max(0, 1 - Math.abs(i - toStyle.indicatorOffset));
    if (fo === to2) {
      return "none";
    }
    return `${duration} framecn-tabs-content-${i} cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  });

  return { contents, indicator: indicatorAnim, labels };
};
