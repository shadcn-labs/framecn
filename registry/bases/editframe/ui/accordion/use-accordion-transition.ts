"use client";

import {
  easings,
  mixOklch,
  useFramecnTheme,
  useStateTransition,
} from "@/lib/framecn-ui";
import type { FramecnTheme, Step } from "@/lib/framecn-ui";
import {
  accordionStyle,
  accordionStyleContext,
} from "@/registry/bases/editframe/ui/accordion";
import type {
  AccordionState,
  AccordionStyle,
} from "@/registry/bases/editframe/ui/accordion";

export const DEFAULT_DURATION = 14;

export function tweenAccordionStyle(
  a: AccordionStyle,
  b: AccordionStyle,
  t: number
): AccordionStyle {
  return {
    background: mixOklch(a.background, b.background, t),
    chevronRotation:
      a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
    panelHeight: a.panelHeight + (b.panelHeight - a.panelHeight) * t,
    panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  };
}

export interface AccordionTransitionOptions {
  variant?: "default" | "ghost";
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export function useAccordionTransition(
  steps: Step<AccordionState>[],
  opts: AccordionTransitionOptions = {}
): AccordionStyle {
  const {
    variant = "default",
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useFramecnTheme(themeOverride, mode);
  const ctx = accordionStyleContext(variant, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenAccordionStyle(
    accordionStyle(from, ctx),
    accordionStyle(to, ctx),
    t
  );
}
