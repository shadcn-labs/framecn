"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  inputStyle,
  inputStyleContext,
} from "@/registry/bases/editframe/ui/input";
import type {
  InputState,
  InputStyle,
} from "@/registry/bases/editframe/ui/input";

export const DEFAULT_DURATION = 8;

export const tweenInputStyle = (
  a: InputStyle,
  b: InputStyle,
  t: number
): InputStyle => ({
  background: mixOklch(a.background, b.background, t),
  borderColor: mixOklch(a.borderColor, b.borderColor, t),
  caretOpacity: a.caretOpacity + (b.caretOpacity - a.caretOpacity) * t,
  placeholderOpacity:
    a.placeholderOpacity + (b.placeholderOpacity - a.placeholderOpacity) * t,
  ringColor: mixOklch(a.ringColor, b.ringColor, t),
  ringWidth: a.ringWidth + (b.ringWidth - a.ringWidth) * t,
  valueReveal: a.valueReveal + (b.valueReveal - a.valueReveal) * t,
});

export interface InputTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useInputTransition = (
  steps: Step<InputState>[],
  opts: InputTransitionOptions = {}
): InputStyle => {
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
  const ctx = inputStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenInputStyle(inputStyle(from, ctx), inputStyle(to, ctx), t);
};
