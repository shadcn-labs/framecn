"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  contextMenuStyle,
  contextMenuStyleContext,
} from "@/registry/bases/editframe/ui/context-menu";
import type {
  ContextMenuState,
  ContextMenuStyle,
} from "@/registry/bases/editframe/ui/context-menu";

export const DEFAULT_DURATION = 10;

export const tweenContextMenuStyle = (
  a: ContextMenuStyle,
  b: ContextMenuStyle,
  t: number
): ContextMenuStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export interface ContextMenuTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useContextMenuTransition = (
  steps: Step<ContextMenuState>[],
  opts: ContextMenuTransitionOptions = {}
): ContextMenuStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = contextMenuStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenContextMenuStyle(
    contextMenuStyle(from, ctx),
    contextMenuStyle(to, ctx),
    t
  );
};
