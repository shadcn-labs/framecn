"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  selectStyle,
  selectStyleContext,
} from "@/registry/bases/editframe/ui/select";
import type {
  SelectState,
  SelectStyle,
} from "@/registry/bases/editframe/ui/select";

export const DEFAULT_DURATION = 12;

export const tweenSelectStyle = (
  a: SelectStyle,
  b: SelectStyle,
  t: number
): SelectStyle => ({
  chevronRotation:
    a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export interface SelectTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useSelectTransition = (
  steps: Step<SelectState>[],
  opts: SelectTransitionOptions = {}
): SelectStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = selectStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenSelectStyle(selectStyle(from, ctx), selectStyle(to, ctx), t);
};
