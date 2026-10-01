"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  dropdownMenuItemStyle,
  dropdownMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";
import type {
  DropdownMenuItemState,
  DropdownMenuItemStyle,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";

export const DEFAULT_DURATION = 8;

export const tweenDropdownMenuItemStyle = (
  a: DropdownMenuItemStyle,
  b: DropdownMenuItemStyle,
  t: number
): DropdownMenuItemStyle => ({
  background: mixOklch(a.background, b.background, t),
  labelColor: mixOklch(a.labelColor, b.labelColor, t),
  scale: a.scale + (b.scale - a.scale) * t,
});

export interface DropdownMenuItemTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export const useDropdownMenuItemTransition = (
  steps: Step<DropdownMenuItemState>[],
  opts: DropdownMenuItemTransitionOptions = {}
): DropdownMenuItemStyle => {
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
  const ctx = dropdownMenuItemStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenDropdownMenuItemStyle(
    dropdownMenuItemStyle(from, ctx),
    dropdownMenuItemStyle(to, ctx),
    t
  );
};
