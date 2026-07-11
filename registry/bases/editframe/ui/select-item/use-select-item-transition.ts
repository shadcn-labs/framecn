"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  selectItemStyle,
  selectItemStyleContext,
} from "@/registry/bases/editframe/ui/select-item";
import type {
  SelectItemState,
  SelectItemStyle,
} from "@/registry/bases/editframe/ui/select-item";

export const DEFAULT_DURATION = 8;

export const tweenSelectItemStyle = (
  a: SelectItemStyle,
  b: SelectItemStyle,
  t: number
): SelectItemStyle => ({
  background: mixOklch(a.background, b.background, t),
  checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
  labelColor: mixOklch(a.labelColor, b.labelColor, t),
  scale: a.scale + (b.scale - a.scale) * t,
});

export interface SelectItemTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useSelectItemTransition = (
  steps: Step<SelectItemState>[],
  opts: SelectItemTransitionOptions = {}
): SelectItemStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = selectItemStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenSelectItemStyle(
    selectItemStyle(from, ctx),
    selectItemStyle(to, ctx),
    t
  );
};
