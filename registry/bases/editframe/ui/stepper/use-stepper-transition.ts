"use client";

import { clamp01, easings } from "@/lib/framecn-ui";
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

export const useStepperTransition = (
  steps: StepperStep[],
  frame: number = 0,
  opts: StepperTransitionOptions = {}
): StepperStyle => {
  const { speed = 1 } = opts;
  const raw = frame * speed;
  return stepperStyleAt(steps, raw, opts);
};

export const stepperStyleAt = (
  steps: StepperStep[],
  raw: number,
  opts: StepperTransitionOptions = {}
): StepperStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;

  if (steps.length === 0) {
    return { position: 0 };
  }

  const first = steps[0];

  if (raw <= first.at) {
    return { position: first.index };
  }

  let toIndex = steps.length - 1;
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const lastStep = steps.at(-1);
  if (!lastStep) {
    return { position: 0 };
  }

  const pastLast = raw >= lastStep.at;
  const to = pastLast ? lastStep : steps[toIndex];
  const from = pastLast ? lastStep : steps[toIndex - 1];

  if (!to || !from) {
    return { position: 0 };
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  const position = from.index + (to.index - from.index) * t;

  return { position };
};
