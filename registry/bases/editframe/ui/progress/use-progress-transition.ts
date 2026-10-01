"use client";

import { clamp01, easings, useCurrentFrame } from "@/lib/framecn-ui";
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

export const progressValueAt = (
  steps: ProgressStep[],
  raw: number,
  opts: ProgressTransitionOptions = {}
): ProgressStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;
  if (steps.length === 0) {
    return { value: 0 };
  }
  const [first] = steps;
  if (raw <= first.at) {
    return { value: first.value };
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
    return { value: 0 };
  }
  const pastLast = raw >= last.at;
  const to = pastLast ? last : steps[toIndex];
  const from = pastLast ? last : steps[toIndex - 1];
  if (to === undefined || from === undefined) {
    return { value: first.value };
  }
  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  const value = from.value + (to.value - from.value) * t;
  return { value };
};

export const useProgressTransition = (
  steps: ProgressStep[],
  opts: ProgressTransitionOptions = {}
): ProgressStyle => {
  const { speed = 1 } = opts;
  const raw = useCurrentFrame() * speed;
  return progressValueAt(steps, raw, opts);
};
