"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  tabsStyle,
  tabsStyleContext,
} from "@/registry/bases/editframe/ui/tabs";
import type { TabsState, TabsStyle } from "@/registry/bases/editframe/ui/tabs";

const DEFAULT_ITEMS = ["Account", "Password", "Settings"];

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

export const useTabsTransition = (
  steps: Step<TabsState>[],
  opts: TabsTransitionOptions = {}
): TabsStyle => {
  const {
    items = DEFAULT_ITEMS,
    variant = "pill",
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = tabsStyleContext(items, variant, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    items[0],
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenTabsStyle(tabsStyle(from, ctx), tabsStyle(to, ctx), t);
};
