"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  checkboxStyle,
  checkboxStyleContext,
} from "@/registry/bases/editframe/ui/checkbox";
import type {
  CheckboxState,
  CheckboxStyle,
} from "@/registry/bases/editframe/ui/checkbox";

export const DEFAULT_DURATION = 10;

export const tweenCheckboxStyle = (
  a: CheckboxStyle,
  b: CheckboxStyle,
  t: number
): CheckboxStyle => ({
  boxBackground: mixOklch(a.boxBackground, b.boxBackground, t),
  boxBorderColor: mixOklch(a.boxBorderColor, b.boxBorderColor, t),
  checkDraw: a.checkDraw + (b.checkDraw - a.checkDraw) * t,
  checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
  checkScale: a.checkScale + (b.checkScale - a.checkScale) * t,
});

export interface CheckboxTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useCheckboxTransition = (
  steps: Step<CheckboxState>[],
  opts: CheckboxTransitionOptions = {}
): CheckboxStyle => {
  const {
    theme: themeOverride,
    mode,
    primary,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    mode
  );
  const ctx = checkboxStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "unchecked",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenCheckboxStyle(
    checkboxStyle(from, ctx),
    checkboxStyle(to, ctx),
    t
  );
};
