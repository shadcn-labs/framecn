"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  sheetStyle,
  sheetStyleContext,
} from "@/registry/bases/editframe/ui/sheet";
import type {
  SheetState,
  SheetStyle,
} from "@/registry/bases/editframe/ui/sheet";

export const DEFAULT_DURATION = 12;

export const tweenSheetStyle = (
  a: SheetStyle,
  b: SheetStyle,
  t: number
): SheetStyle => ({
  overlayOpacity: a.overlayOpacity + (b.overlayOpacity - a.overlayOpacity) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelTranslateX:
    a.panelTranslateX + (b.panelTranslateX - a.panelTranslateX) * t,
});

export interface SheetTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useSheetTransition = (
  steps: Step<SheetState>[],
  opts: SheetTransitionOptions = {}
): SheetStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = sheetStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenSheetStyle(sheetStyle(from, ctx), sheetStyle(to, ctx), t);
};
