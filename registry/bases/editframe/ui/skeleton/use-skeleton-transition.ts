"use client";

import { skeletonStyle } from "@/registry/bases/editframe/ui/skeleton";
import type {
  SkeletonState,
  SkeletonStyle,
} from "@/registry/bases/editframe/ui/skeleton";

export const DEFAULT_DURATION = 12;

export const skeletonKeyframes = (
  fromStyle: SkeletonStyle,
  toStyle: SkeletonStyle
): string => {
  const dSkeleton = toStyle.skeletonOpacity - fromStyle.skeletonOpacity;
  const dContent = toStyle.contentOpacity - fromStyle.contentOpacity;

  return `
    @keyframes framecn-skeleton-opacity {
      0% { opacity: ${fromStyle.skeletonOpacity}; }
      100% { opacity: calc(${fromStyle.skeletonOpacity} + ${dSkeleton} * var(--ef-progress)); }
    }
    @keyframes framecn-content-opacity {
      0% { opacity: ${fromStyle.contentOpacity}; }
      100% { opacity: calc(${fromStyle.contentOpacity} + ${dContent} * var(--ef-progress)); }
    }
  `;
};

export const skeletonAnimation = (
  from: SkeletonState,
  to: SkeletonState,
  duration: string,
  fromStyle: SkeletonStyle,
  toStyle: SkeletonStyle
): { skeleton: string; content: string } => {
  if (from === to) {
    return { content: "none", skeleton: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    content: `${duration} framecn-content-opacity ${ease} forwards`,
    skeleton: `${duration} framecn-skeleton-opacity ${ease} forwards`,
  };
};
