"use client";

import { clamp01, easings } from "@/lib/framecn-ui";
import type { EasingName } from "@/lib/framecn-ui";
import type {
  SliderStyle,
  SliderThumbState,
} from "@/registry/bases/editframe/ui/slider";
import { sliderThumbStyle } from "@/registry/bases/editframe/ui/slider";

export interface SliderStep {
  at: number;
  value?: number;
  thumbState?: SliderThumbState;
  duration?: number;
  easing?: EasingName;
}

export const DEFAULT_DURATION = 18;

export interface SliderTransitionOptions {
  speed?: number;
  defaultDuration?: number;
}

export const tweenSliderStyle = (
  a: SliderStyle,
  b: SliderStyle,
  t: number
): SliderStyle => ({
  ringOpacity: a.ringOpacity + (b.ringOpacity - a.ringOpacity) * t,
  thumbScale: a.thumbScale + (b.thumbScale - a.thumbScale) * t,
  value: a.value + (b.value - a.value) * t,
});

const valueAt = (
  steps: SliderStep[],
  raw: number,
  defaultDuration: number
): number => {
  const valueSteps = steps.filter(
    (s): s is SliderStep & { value: number } => s.value !== undefined
  );
  if (valueSteps.length === 0) {
    return 0;
  }
  const [first] = valueSteps;
  if (raw <= first.at) {
    return first.value;
  }

  let toIndex = valueSteps.length - 1;
  for (let i = 1; i < valueSteps.length; i += 1) {
    if (valueSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const lastStep = valueSteps.at(-1);
  if (!lastStep) {
    return first.value;
  }

  const pastLast = raw >= lastStep.at;
  const to = pastLast ? lastStep : valueSteps[toIndex];
  const from = pastLast ? lastStep : valueSteps[toIndex - 1];

  if (!to || !from) {
    return first.value;
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  return from.value + (to.value - from.value) * t;
};
const thumbAt = (
  steps: SliderStep[],
  raw: number,
  defaultDuration: number
): { thumbScale: number; ringOpacity: number } => {
  const thumbSteps = steps.filter(
    (s): s is SliderStep & { thumbState: SliderThumbState } =>
      s.thumbState !== undefined
  );
  if (thumbSteps.length === 0) {
    return sliderThumbStyle("idle");
  }
  const [first] = thumbSteps;
  if (raw <= first.at) {
    return sliderThumbStyle(first.thumbState);
  }

  let toIndex = thumbSteps.length - 1;
  for (let i = 1; i < thumbSteps.length; i += 1) {
    if (thumbSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const lastStep = thumbSteps.at(-1);
  if (!lastStep) {
    return sliderThumbStyle("idle");
  }

  const pastLast = raw >= lastStep.at;
  const to = pastLast ? lastStep : thumbSteps[toIndex];
  const from = pastLast ? lastStep : thumbSteps[toIndex - 1];

  if (!to || !from) {
    return sliderThumbStyle("idle");
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));

  const a = sliderThumbStyle(from.thumbState);
  const b = sliderThumbStyle(to.thumbState);
  return {
    ringOpacity: a.ringOpacity + (b.ringOpacity - a.ringOpacity) * t,
    thumbScale: a.thumbScale + (b.thumbScale - a.thumbScale) * t,
  };
};

export const sliderStyleAt = (
  steps: SliderStep[],
  raw: number,
  opts: SliderTransitionOptions = {}
): SliderStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;
  const value = valueAt(steps, raw, defaultDuration);
  const thumb = thumbAt(steps, raw, defaultDuration);
  return {
    ringOpacity: thumb.ringOpacity,
    thumbScale: thumb.thumbScale,
    value,
  };
};

export const useSliderTransition = (
  steps: SliderStep[],
  frame = 0,
  opts: SliderTransitionOptions = {}
): SliderStyle => {
  const { speed = 1 } = opts;
  const raw = frame * speed;
  return sliderStyleAt(steps, raw, opts);
};
