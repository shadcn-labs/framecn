"use client";

import { clamp01, easings } from "@/lib/framecn-ui";
import type { EasingName } from "@/lib/framecn-ui";
import type { ProgressStyle } from "@/registry/bases/editframe/ui/progress";

export interface ProgressStep {
  at: number;
  value: number;
  duration?: number;
  easing?: EasingName;
}

export const DEFAULT_DURATION = 24;

export interface ProgressTransitionOptions {
  speed?: number;
  defaultDuration?: number;
}

export const tweenProgressStyle = (
  a: ProgressStyle,
  b: ProgressStyle,
  t: number
): ProgressStyle => ({ value: a.value + (b.value - a.value) * t });

export const useProgressTransition = (
  steps: ProgressStep[],
  frame: number = 0,
  opts: ProgressTransitionOptions = {}
): ProgressStyle => {
  const { speed = 1 } = opts;
  const raw = frame * speed;
  return progressValueAt(steps, raw, opts);
};

export const progressValueAt = (
  steps: ProgressStep[],
  raw: number,
  opts: ProgressTransitionOptions = {}
): ProgressStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;

  if (steps.length === 0) {
    return { value: 0 };
  }

  const first = steps[0];

  if (raw <= first.at) {
    return { value: first.value };
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
    return { value: 0 };
  }

  const pastLast = raw >= lastStep.at;
  const to = pastLast ? lastStep : steps[toIndex];
  const from = pastLast ? lastStep : steps[toIndex - 1];

  if (!to || !from) {
    return { value: 0 };
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  const value = from.value + (to.value - from.value) * t;

  return { value };
};
