"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  drawerStyle,
  drawerStyleContext,
} from "@/registry/bases/editframe/ui/drawer";
import type {
  DrawerState,
  DrawerStyle,
} from "@/registry/bases/editframe/ui/drawer";

export const DEFAULT_DURATION = 12;

export const tweenDrawerStyle = (
  a: DrawerStyle,
  b: DrawerStyle,
  t: number
): DrawerStyle => ({
  overlayOpacity: a.overlayOpacity + (b.overlayOpacity - a.overlayOpacity) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export interface DrawerTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useDrawerTransition = (
  steps: Step<DrawerState>[],
  opts: DrawerTransitionOptions = {}
): DrawerStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = drawerStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenDrawerStyle(drawerStyle(from, ctx), drawerStyle(to, ctx), t);
};
