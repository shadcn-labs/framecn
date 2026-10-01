"use client";

import { easings, useStateTransition } from "@/lib/framecn-ui";
import type { Step } from "@/lib/framecn-ui";
import { tooltipStyle } from "@/registry/bases/editframe/ui/tooltip";
import type {
  TooltipState,
  TooltipStyle,
} from "@/registry/bases/editframe/ui/tooltip";

export const DEFAULT_DURATION = 8;

export const tweenTooltipStyle = (
  a: TooltipStyle,
  b: TooltipStyle,
  t: number
): TooltipStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translate: a.translate + (b.translate - a.translate) * t,
});

export interface TooltipTransitionOptions {
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useTooltipTransition = (
  steps: Step<TooltipState>[],
  opts: TooltipTransitionOptions = {}
): TooltipStyle => {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "hidden",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenTooltipStyle(tooltipStyle(from), tooltipStyle(to), t);
};
