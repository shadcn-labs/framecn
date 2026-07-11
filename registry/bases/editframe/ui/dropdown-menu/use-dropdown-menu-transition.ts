"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  dropdownMenuStyle,
  dropdownMenuStyleContext,
} from "@/registry/bases/editframe/ui/dropdown-menu";
import type {
  DropdownMenuState,
  DropdownMenuStyle,
} from "@/registry/bases/editframe/ui/dropdown-menu";

export const DEFAULT_DURATION = 12;

export const tweenDropdownMenuStyle = (
  a: DropdownMenuStyle,
  b: DropdownMenuStyle,
  t: number
): DropdownMenuStyle => ({
  chevronRotation:
    a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export interface DropdownMenuTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useDropdownMenuTransition = (
  steps: Step<DropdownMenuState>[],
  opts: DropdownMenuTransitionOptions = {}
): DropdownMenuStyle => {
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
  const ctx = dropdownMenuStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenDropdownMenuStyle(
    dropdownMenuStyle(from, ctx),
    dropdownMenuStyle(to, ctx),
    t
  );
};
