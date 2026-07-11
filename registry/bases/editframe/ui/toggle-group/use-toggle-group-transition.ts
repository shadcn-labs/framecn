"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  toggleGroupStyle,
  toggleGroupStyleContext,
} from "@/registry/bases/editframe/ui/toggle-group";
import type {
  ToggleGroupItem,
  ToggleGroupState,
  ToggleGroupStyle,
} from "@/registry/bases/editframe/ui/toggle-group";

const DEFAULT_ITEMS: ToggleGroupItem[] = [
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

export const useToggleGroupTransition = (
  steps: Step<ToggleGroupState>[],
  opts: ToggleGroupTransitionOptions = {}
): ToggleGroupStyle => {
  const {
    items = DEFAULT_ITEMS,
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = toggleGroupStyleContext(items, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    items[0].value,
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenToggleGroupStyle(
    toggleGroupStyle(from, ctx),
    toggleGroupStyle(to, ctx),
    t
  );
};
