"use client";

import { easings, useStateTransition } from "@/lib/framecn-ui";
import type { Step } from "@/lib/framecn-ui";
import { skeletonStyle } from "@/registry/bases/editframe/ui/skeleton";
import type {
  SkeletonState,
  SkeletonStyle,
} from "@/registry/bases/editframe/ui/skeleton";

export const DEFAULT_DURATION = 12;

export const tweenSkeletonStyle = (
  a: SkeletonStyle,
  b: SkeletonStyle,
  t: number
): SkeletonStyle => ({
  contentOpacity: a.contentOpacity + (b.contentOpacity - a.contentOpacity) * t,
  skeletonOpacity:
    a.skeletonOpacity + (b.skeletonOpacity - a.skeletonOpacity) * t,
});

export interface SkeletonTransitionOptions {
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}

export const useSkeletonTransition = (
  steps: Step<SkeletonState>[],
  opts: SkeletonTransitionOptions = {}
): SkeletonStyle => {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "loading",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenSkeletonStyle(skeletonStyle(from), skeletonStyle(to), t);
};
