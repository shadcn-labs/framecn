"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  radioStyle,
  radioStyleContext,
} from "@/registry/bases/editframe/ui/radio";
import type {
  RadioState,
  RadioStyle,
} from "@/registry/bases/editframe/ui/radio";

export const DEFAULT_DURATION = 10;

export const tweenRadioStyle = (
  a: RadioStyle,
  b: RadioStyle,
  t: number
): RadioStyle => ({
  dotOpacity: a.dotOpacity + (b.dotOpacity - a.dotOpacity) * t,
  dotScale: a.dotScale + (b.dotScale - a.dotScale) * t,
  ringBorderColor: mixOklch(a.ringBorderColor, b.ringBorderColor, t),
});

export interface RadioTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useRadioTransition = (
  steps: Step<RadioState>[],
  opts: RadioTransitionOptions = {}
): RadioStyle => {
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
  const ctx = radioStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "unchecked",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenRadioStyle(radioStyle(from, ctx), radioStyle(to, ctx), t);
};
