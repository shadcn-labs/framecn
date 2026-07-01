"use client";

import { mixOklch } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import type {
  ToggleGroupItem,
  ToggleGroupState,
  ToggleGroupStyle,
  ToggleGroupStyleContext,
} from "@/registry/bases/editframe/ui/toggle-group";

const _DEFAULT_ITEMS: ToggleGroupItem[] = [
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

export const DEFAULT_DURATION = 14;

export const tweenToggleGroupStyle = (
  a: ToggleGroupStyle,
  b: ToggleGroupStyle,
  t: number
): ToggleGroupStyle => ({
  indicatorOffset:
    a.indicatorOffset + (b.indicatorOffset - a.indicatorOffset) * t,
});

export interface ToggleGroupTransitionOptions {
  items?: ToggleGroupItem[];
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const toggleGroupKeyframes = (
  fromStyle: ToggleGroupStyle,
  toStyle: ToggleGroupStyle,
  ctx: ToggleGroupStyleContext,
  segmentWidth: number
): string => {
  const fromX = fromStyle.indicatorOffset * segmentWidth;
  const toX = toStyle.indicatorOffset * segmentWidth;
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

  let css = `
    @keyframes framecn-toggle-group-indicator {
      0% { left: ${fromX}px; }
      100% { left: calc(${fromX}px + ${deltaX}px * var(--ef-progress)); }
    }
  `;

  for (let i = 0; i < ctx.items.length; i += 1) {
    if (fromLabelColors[i] !== toLabelColors[i]) {
      css += `
        @keyframes framecn-toggle-group-label-${i} {
          0% { color: ${fromLabelColors[i]}; }
          100% { color: ${toLabelColors[i]}; }
        }
      `;
    }
  }

  return css;
};

export const toggleGroupAnimation = (
  from: ToggleGroupState,
  to: ToggleGroupState,
  duration: string,
  fromStyle: ToggleGroupStyle,
  toStyle: ToggleGroupStyle,
  ctx: ToggleGroupStyleContext
): {
  indicator: string;
  labels: string[];
} => {
  if (from === to) {
    return {
      indicator: "none",
      labels: ctx.items.map(() => "none"),
    };
  }

  const indicatorAnim = `${duration} framecn-toggle-group-indicator cubic-bezier(0.4, 0, 0.2, 1) forwards`;

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
    return `${duration} framecn-toggle-group-label-${i} cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  });

  return { indicator: indicatorAnim, labels };
};
