"use client";

import { clamp01, easings, useCurrentFrame } from "@/lib/framecn-ui";
import type { EasingName } from "@/lib/framecn-ui";
import type { StepperStyle } from "@/registry/bases/editframe/ui/stepper";

export interface StepperStep {
  at: number;
  index: number;
  duration?: number;
  easing?: EasingName;
}

export const DEFAULT_DURATION = 24;

export interface StepperTransitionOptions {
  speed?: number;
  defaultDuration?: number;
}

export const tweenStepperStyle = (
  a: StepperStyle,
  b: StepperStyle,
  t: number
): StepperStyle => ({ position: a.position + (b.position - a.position) * t });

export const stepperStyleAt = (
  steps: StepperStep[],
  raw: number,
  opts: StepperTransitionOptions = {}
): StepperStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;
  if (steps.length === 0) {
    return { position: 0 };
  }
  const [first] = steps;
  if (raw <= first.at) {
    return { position: first.index };
  }
  let toIndex = steps.length - 1;
  for (let i = 1; i < steps.length; i += 1) {
    if (steps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const last = steps.at(-1);
  if (!last) {
    return { position: 0 };
  }
  const pastLast = raw >= last.at;
  const to = pastLast ? last : steps[toIndex];
  const from = pastLast ? last : steps[toIndex - 1];
  if (to === undefined || from === undefined) {
    return { position: first.index };
  }
  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  const position = from.index + (to.index - from.index) * t;
  return { position };
};

export const useStepperTransition = (
  steps: StepperStep[],
  opts: StepperTransitionOptions = {}
): StepperStyle => {
  const { speed = 1 } = opts;
  const raw = useCurrentFrame() * speed;
  return stepperStyleAt(steps, raw, opts);
};
