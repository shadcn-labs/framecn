"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  switchStyle,
  switchStyleContext,
} from "@/registry/bases/editframe/ui/switch";
import type {
  SwitchState,
  SwitchStyle,
} from "@/registry/bases/editframe/ui/switch";

export const DEFAULT_DURATION = 10;

export const tweenSwitchStyle = (
  a: SwitchStyle,
  b: SwitchStyle,
  t: number
): SwitchStyle => ({
  thumbOffset: a.thumbOffset + (b.thumbOffset - a.thumbOffset) * t,
  trackBackground: mixOklch(a.trackBackground, b.trackBackground, t),
});

export interface SwitchTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useSwitchTransition = (
  steps: Step<SwitchState>[],
  opts: SwitchTransitionOptions = {}
): SwitchStyle => {
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
  const ctx = switchStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "unchecked",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenSwitchStyle(switchStyle(from, ctx), switchStyle(to, ctx), t);
};
