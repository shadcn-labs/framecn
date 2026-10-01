"use client";

import { easings, useStateTransition } from "@/lib/framecn-ui";
import type { Step } from "@/lib/framecn-ui";
import { toastStyle } from "@/registry/bases/editframe/ui/toast";
import type {
  ToastState,
  ToastStyle,
} from "@/registry/bases/editframe/ui/toast";

export const DEFAULT_DURATION = 12;

export const tweenToastStyle = (
  a: ToastStyle,
  b: ToastStyle,
  t: number
): ToastStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export interface ToastTransitionOptions {
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useToastTransition = (
  steps: Step<ToastState>[],
  opts: ToastTransitionOptions = {}
): ToastStyle => {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "hidden",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenToastStyle(toastStyle(from), toastStyle(to), t);
};
