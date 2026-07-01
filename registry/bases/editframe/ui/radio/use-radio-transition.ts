"use client";

import type {
  RadioState,
  RadioStyleContext,
} from "@/registry/bases/editframe/ui/radio";

export const DEFAULT_DURATION = 10;

export const radioKeyframes = (ctx: RadioStyleContext): string => `
    @keyframes framecn-radio-check {
      0% { border-color: ${ctx.uncheckedBorder}; }
      100% { border-color: ${ctx.checkedBorder}; }
    }
    @keyframes framecn-radio-uncheck {
      0% { border-color: ${ctx.checkedBorder}; }
      100% { border-color: ${ctx.uncheckedBorder}; }
    }
    @keyframes framecn-radio-dot-in {
      0% { opacity: 0; transform: scale(0.4); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes framecn-radio-dot-out {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.4); }
    }
  `;

export const radioAnimation = (
  from: RadioState,
  to: RadioState,
  duration: string
): { ring: string; dot: string } => {
  if (from === "unchecked" && to === "checked") {
    return {
      dot: `${duration} framecn-radio-dot-in ease-out forwards`,
      ring: `${duration} framecn-radio-check ease-out forwards`,
    };
  }
  if (from === "checked" && to === "unchecked") {
    return {
      dot: `${duration} framecn-radio-dot-out ease-out forwards`,
      ring: `${duration} framecn-radio-uncheck ease-out forwards`,
    };
  }
  return { dot: "none", ring: "none" };
};
