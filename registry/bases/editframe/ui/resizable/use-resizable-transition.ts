"use client";

import { clamp01, easings } from "@/lib/framecn-ui";
import type { EasingName } from "@/lib/framecn-ui";
import type {
  ResizableHandleState,
  ResizableStyle,
} from "@/registry/bases/editframe/ui/resizable";
import { resizableHandleStyle } from "@/registry/bases/editframe/ui/resizable";

export interface ResizableStep {
  at: number;
  ratio?: number;
  handleState?: ResizableHandleState;
  duration?: number;
  easing?: EasingName;
}

export const DEFAULT_DURATION = 18;

export interface ResizableTransitionOptions {
  speed?: number;
  defaultDuration?: number;
}

export const tweenResizableStyle = (
  a: ResizableStyle,
  b: ResizableStyle,
  t: number
): ResizableStyle => ({
  handleRingOpacity:
    a.handleRingOpacity + (b.handleRingOpacity - a.handleRingOpacity) * t,
  handleScale: a.handleScale + (b.handleScale - a.handleScale) * t,
  ratio: a.ratio + (b.ratio - a.ratio) * t,
});

const ratioAt = (
  steps: ResizableStep[],
  raw: number,
  defaultDuration: number
): number => {
  const ratioSteps = steps.filter(
    (s): s is ResizableStep & { ratio: number } => s.ratio !== undefined
  );
  if (ratioSteps.length === 0) {
    return 0.5;
  }
  const [first] = ratioSteps;
  if (raw <= first.at) {
    return first.ratio;
  }

  let toIndex = ratioSteps.length - 1;
  for (let i = 1; i < ratioSteps.length; i += 1) {
    if (ratioSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const lastStep = ratioSteps.at(-1);
  if (!lastStep) {
    return first.ratio;
  }

  const pastLast = raw >= lastStep.at;
  const to = pastLast ? lastStep : ratioSteps[toIndex];
  const from = pastLast ? lastStep : ratioSteps[toIndex - 1];

  if (!to || !from) {
    return first.ratio;
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  return from.ratio + (to.ratio - from.ratio) * t;
};
const handleAt = (
  steps: ResizableStep[],
  raw: number,
  defaultDuration: number
): { handleScale: number; handleRingOpacity: number } => {
  const handleSteps = steps.filter(
    (s): s is ResizableStep & { handleState: ResizableHandleState } =>
      s.handleState !== undefined
  );
  if (handleSteps.length === 0) {
    return resizableHandleStyle("idle");
  }
  const [first] = handleSteps;
  if (raw <= first.at) {
    return resizableHandleStyle(first.handleState);
  }

  let toIndex = handleSteps.length - 1;
  for (let i = 1; i < handleSteps.length; i += 1) {
    if (handleSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const lastStep = handleSteps.at(-1);
  if (!lastStep) {
    return resizableHandleStyle("idle");
  }

  const pastLast = raw >= lastStep.at;
  const to = pastLast ? lastStep : handleSteps[toIndex];
  const from = pastLast ? lastStep : handleSteps[toIndex - 1];

  if (!to || !from) {
    return resizableHandleStyle("idle");
  }

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));

  const a = resizableHandleStyle(from.handleState);
  const b = resizableHandleStyle(to.handleState);
  return {
    handleRingOpacity:
      a.handleRingOpacity + (b.handleRingOpacity - a.handleRingOpacity) * t,
    handleScale: a.handleScale + (b.handleScale - a.handleScale) * t,
  };
};

export const resizableStyleAt = (
  steps: ResizableStep[],
  raw: number,
  opts: ResizableTransitionOptions = {}
): ResizableStyle => {
  const { defaultDuration = DEFAULT_DURATION } = opts;
  const ratio = ratioAt(steps, raw, defaultDuration);
  const handle = handleAt(steps, raw, defaultDuration);
  return {
    handleRingOpacity: handle.handleRingOpacity,
    handleScale: handle.handleScale,
    ratio,
  };
};
