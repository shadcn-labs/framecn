import {
  useCurrentFrame,
  useVideoConfig,
} from "@/registry/bases/editframe/lib/frame";

import type { Step } from "./types";

export const framesFor = (
  d: number | { seconds: number },
  fps: number
): number => (typeof d === "number" ? d : Math.round(d.seconds * fps));

export const revealCount = (
  localFrame: number,
  fps: number,
  len: number,
  cps: number
): number => {
  const over = (len / cps) * fps;
  if (over <= 0) {
    return len;
  }
  return Math.max(0, Math.min(len, Math.floor((localFrame / over) * len)));
};

export const clamp01 = (t: number): number => Math.max(0, Math.min(1, t));

export const revealedText = (full: string, count: number): string => {
  const c = Math.max(0, Math.min(full.length, Math.floor(count)));
  return full.slice(0, c);
};

export interface TypewriterOptions {
  cps?: number;
  speed?: number;
  startFrame?: number;
}

export interface TypewriterState {
  text: string;
  count: number;
  done: boolean;
  typing: boolean;
}

export const typewriterAt = (
  full: string,
  frame: number,
  fps: number,
  options: TypewriterOptions = {}
): TypewriterState => {
  const { cps = 20, speed = 1, startFrame = 0 } = options;
  const local = frame * speed - startFrame;
  const count = local <= 0 ? 0 : revealCount(local, fps, full.length, cps);
  return {
    count,
    done: count >= full.length,
    text: revealedText(full, count),
    typing: count > 0 && count < full.length,
  };
};

export const useTypewriter = (
  full: string,
  options: TypewriterOptions = {}
): TypewriterState => {
  const { cps = 20, speed = 1, startFrame = 0 } = options;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame * speed - startFrame;
  const count = local <= 0 ? 0 : revealCount(local, fps, full.length, cps);
  return {
    count,
    done: count >= full.length,
    text: revealedText(full, count),
    typing: count > 0 && count < full.length,
  };
};

export const useCurrentState = <S extends string>(
  steps: Step<S>[],
  defaultState: S,
  speed = 1
): S => {
  const effectiveFrame = useCurrentFrame() * speed;
  let current = defaultState;
  let bestAt = -Infinity;
  for (const step of steps) {
    if (step.at <= effectiveFrame && step.at >= bestAt) {
      bestAt = step.at;
      current = step.state;
    }
  }
  return current;
};

export const useStateTransition = <S extends string>(
  steps: Step<S>[],
  defaultState: S,
  speed = 1,
  defaultDuration = 8
): { from: S; to: S; progress: number } => {
  const effectiveFrame = useCurrentFrame() * speed;
  const started = steps
    .map((step, index) => ({ index, step }))
    .toSorted((a, b) => a.step.at - b.step.at || a.index - b.index)
    .filter((entry) => entry.step.at <= effectiveFrame);
  if (started.length === 0) {
    return { from: defaultState, progress: 1, to: defaultState };
  }
  const to = started.at(-1)?.step;
  if (!to) {
    return { from: defaultState, progress: 1, to: defaultState };
  }
  const from = started.length >= 2 ? started.at(-2)?.step : null;
  const dur = to.duration ?? defaultDuration;
  const progress = dur > 0 ? clamp01((effectiveFrame - to.at) / dur) : 1;
  return { from: from ? from.state : defaultState, progress, to: to.state };
};
