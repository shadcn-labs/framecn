"use client";

import { easings, useStateTransition } from "@/lib/framecn-ui";
import type { Step } from "@/lib/framecn-ui";
import { popoverStyle } from "@/registry/bases/editframe/ui/popover";
import type {
  PopoverState,
  PopoverStyle,
} from "@/registry/bases/editframe/ui/popover";

export const DEFAULT_DURATION = 10;

export const tweenPopoverStyle = (
  a: PopoverStyle,
  b: PopoverStyle,
  t: number
): PopoverStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translate: a.translate + (b.translate - a.translate) * t,
});

export interface PopoverTransitionOptions {
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const usePopoverTransition = (
  steps: Step<PopoverState>[],
  opts: PopoverTransitionOptions = {}
): PopoverStyle => {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenPopoverStyle(popoverStyle(from), popoverStyle(to), t);
};
