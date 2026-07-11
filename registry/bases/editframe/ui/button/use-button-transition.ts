"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  buttonStyle,
  buttonStyleContext,
} from "@/registry/bases/editframe/ui/button";
import type {
  ButtonState,
  ButtonStyle,
} from "@/registry/bases/editframe/ui/button";

export const DEFAULT_DURATION = 8;

export const tweenButtonStyle = (
  a: ButtonStyle,
  b: ButtonStyle,
  t: number
): ButtonStyle => ({
  background: mixOklch(a.background, b.background, t),
  checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
  labelOpacity: a.labelOpacity + (b.labelOpacity - a.labelOpacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  spinnerOpacity: a.spinnerOpacity + (b.spinnerOpacity - a.spinnerOpacity) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export interface ButtonTransitionOptions {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useButtonTransition = (
  steps: Step<ButtonState>[],
  opts: ButtonTransitionOptions = {}
): ButtonStyle => {
  const {
    variant = "default",
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
  const ctx = buttonStyleContext(variant, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenButtonStyle(buttonStyle(from, ctx), buttonStyle(to, ctx), t);
};
