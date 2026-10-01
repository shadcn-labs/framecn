"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  comboboxStyle,
  comboboxStyleContext,
} from "@/registry/bases/editframe/ui/combobox";
import type {
  ComboboxState,
  ComboboxStyle,
} from "@/registry/bases/editframe/ui/combobox";

export const DEFAULT_DURATION = 12;

export const tweenComboboxStyle = (
  a: ComboboxStyle,
  b: ComboboxStyle,
  t: number
): ComboboxStyle => ({
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export interface ComboboxTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useComboboxTransition = (
  steps: Step<ComboboxState>[],
  opts: ComboboxTransitionOptions = {}
): ComboboxStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = comboboxStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenComboboxStyle(
    comboboxStyle(from, ctx),
    comboboxStyle(to, ctx),
    t
  );
};
