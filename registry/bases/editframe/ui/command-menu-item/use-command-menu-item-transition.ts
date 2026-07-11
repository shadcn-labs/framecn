"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  commandMenuItemStyle,
  commandMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/command-menu-item";
import type {
  CommandMenuItemState,
  CommandMenuItemStyle,
} from "@/registry/bases/editframe/ui/command-menu-item";

export const DEFAULT_DURATION = 8;

export const tweenCommandMenuItemStyle = (
  a: CommandMenuItemStyle,
  b: CommandMenuItemStyle,
  t: number
): CommandMenuItemStyle => ({
  background: mixOklch(a.background, b.background, t),
  iconColor: mixOklch(a.iconColor, b.iconColor, t),
  labelColor: mixOklch(a.labelColor, b.labelColor, t),
  scale: a.scale + (b.scale - a.scale) * t,
});

export interface CommandMenuItemTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useCommandMenuItemTransition = (
  steps: Step<CommandMenuItemState>[],
  opts: CommandMenuItemTransitionOptions = {}
): CommandMenuItemStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = commandMenuItemStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenCommandMenuItemStyle(
    commandMenuItemStyle(from, ctx),
    commandMenuItemStyle(to, ctx),
    t
  );
};
