"use client";

import {
  blurInStyle,
  blurInStyleContext,
} from "@/registry/bases/editframe/ui/blur-in";
import type {
  BlurInDirection,
  BlurInState,
  BlurInStyle,
} from "@/registry/bases/editframe/ui/blur-in";

export const DEFAULT_DURATION = 18;

export const blurInKeyframes = (
  fromStyle: BlurInStyle,
  toStyle: BlurInStyle
): string => {
  const dOpacity = toStyle.opacity - fromStyle.opacity;
  const dBlur = toStyle.blur - fromStyle.blur;
  const dTx = toStyle.translateX - fromStyle.translateX;
  const dTy = toStyle.translateY - fromStyle.translateY;

  return `
    @keyframes framecn-blur-in-opacity {
      0% { opacity: ${fromStyle.opacity}; }
      100% { opacity: calc(${fromStyle.opacity} + ${dOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-blur-in-filter {
      0% { filter: blur(${fromStyle.blur}px); }
      100% { filter: blur(calc(${fromStyle.blur}px + ${dBlur}px * var(--ef-progress))); }
    }
    @keyframes framecn-blur-in-transform {
      0% { transform: translate(${fromStyle.translateX}px, ${fromStyle.translateY}px); }
      100% { transform: translate(calc(${fromStyle.translateX}px + ${dTx}px * var(--ef-progress)), calc(${fromStyle.translateY}px + ${dTy}px * var(--ef-progress))); }
    }
  `;
};

export const blurInAnimation = (
  from: BlurInState,
  to: BlurInState,
  duration: string,
  fromStyle: BlurInStyle,
  toStyle: BlurInStyle
): { opacity: string; filter: string; transform: string } => {
  if (from === to) {
    return { filter: "none", opacity: "none", transform: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    filter: `${duration} framecn-blur-in-filter ${ease} forwards`,
    opacity: `${duration} framecn-blur-in-opacity ${ease} forwards`,
    transform: `${duration} framecn-blur-in-transform ${ease} forwards`,
  };
};
