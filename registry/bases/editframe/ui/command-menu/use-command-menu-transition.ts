"use client";

import { easings, useFramecnTheme, useStateTransition } from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  commandMenuStyle,
  commandMenuStyleContext,
} from "@/registry/bases/editframe/ui/command-menu";
import type {
  CommandMenuState,
  CommandMenuStyle,
} from "@/registry/bases/editframe/ui/command-menu";

export const DEFAULT_DURATION = 12;

export const tweenCommandMenuStyle = (
  a: CommandMenuStyle,
  b: CommandMenuStyle,
  t: number
): CommandMenuStyle => ({
  backdropOpacity:
    a.backdropOpacity + (b.backdropOpacity - a.backdropOpacity) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export interface CommandMenuTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useCommandMenuTransition = (
  steps: Step<CommandMenuState>[],
  opts: CommandMenuTransitionOptions = {}
): CommandMenuStyle => {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = commandMenuStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenCommandMenuStyle(
    commandMenuStyle(from, ctx),
    commandMenuStyle(to, ctx),
    t
  );
};
