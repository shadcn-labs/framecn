"use client";

import { mixOklch } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import type {
  CheckboxState,
  CheckboxStyle,
  CheckboxStyleContext,
} from "@/registry/bases/editframe/ui/checkbox";

export const DEFAULT_DURATION = 10;

export const tweenCheckboxStyle = (
  a: CheckboxStyle,
  b: CheckboxStyle,
  t: number
): CheckboxStyle => ({
  boxBackground: mixOklch(a.boxBackground, b.boxBackground, t),
  boxBorderColor: mixOklch(a.boxBorderColor, b.boxBorderColor, t),
  checkDraw: a.checkDraw + (b.checkDraw - a.checkDraw) * t,
  checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
  checkScale: a.checkScale + (b.checkScale - a.checkScale) * t,
});

export interface CheckboxTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export interface CheckboxCssAnimation {
  keyframes: string;
  animation: string;
}
const checkboxUncheckedStyle = (ctx: CheckboxStyleContext): CheckboxStyle => ({
  boxBackground: ctx.uncheckedBg,
  boxBorderColor: ctx.uncheckedBorder,
  checkDraw: 0,
  checkOpacity: 0,
  checkScale: 0.6,
});
const checkboxCheckedStyle = (ctx: CheckboxStyleContext): CheckboxStyle => ({
  boxBackground: ctx.checkedBg,
  boxBorderColor: ctx.checkedBorder,
  checkDraw: 1,
  checkOpacity: 1,
  checkScale: 1,
});

export const checkboxKeyframes = (ctx: CheckboxStyleContext): string => {
  const unchecked = checkboxUncheckedStyle(ctx);
  const checked = checkboxCheckedStyle(ctx);

  return `
    @keyframes framecn-checkbox-check {
      0% {
        background: ${unchecked.boxBackground};
        border-color: ${unchecked.boxBorderColor};
      }
      100% {
        background: ${checked.boxBackground};
        border-color: ${checked.boxBorderColor};
      }
    }
    @keyframes framecn-checkbox-uncheck {
      0% {
        background: ${checked.boxBackground};
        border-color: ${checked.boxBorderColor};
      }
      100% {
        background: ${unchecked.boxBackground};
        border-color: ${unchecked.boxBorderColor};
      }
    }
    @keyframes framecn-check-draw {
      0% { stroke-dashoffset: ${unchecked.checkDraw * 14}; }
      100% { stroke-dashoffset: ${checked.checkDraw * 14}; }
    }
    @keyframes framecn-check-erase {
      0% { stroke-dashoffset: ${checked.checkDraw * 14}; }
      100% { stroke-dashoffset: ${unchecked.checkDraw * 14}; }
    }
    @keyframes framecn-check-scale-in {
      0% { opacity: ${unchecked.checkOpacity}; transform: scale(${unchecked.checkScale}); }
      100% { opacity: ${checked.checkOpacity}; transform: scale(${checked.checkScale}); }
    }
    @keyframes framecn-check-scale-out {
      0% { opacity: ${checked.checkOpacity}; transform: scale(${checked.checkScale}); }
      100% { opacity: ${unchecked.checkOpacity}; transform: scale(${unchecked.checkScale}); }
    }
  `;
};

export const checkboxAnimation = (
  from: CheckboxState,
  to: CheckboxState,
  duration: string
): { box: string; check: string; draw: string } => {
  if (from === "unchecked" && to === "checked") {
    return {
      box: `${duration} framecn-checkbox-check ease-out forwards`,
      check: `${duration} framecn-check-scale-in ease-out forwards`,
      draw: `${duration} framecn-check-draw ease-out forwards`,
    };
  }
  if (from === "checked" && to === "unchecked") {
    return {
      box: `${duration} framecn-checkbox-uncheck ease-out forwards`,
      check: `${duration} framecn-check-scale-out ease-out forwards`,
      draw: `${duration} framecn-check-erase ease-out forwards`,
    };
  }
  return { box: "none", check: "none", draw: "none" };
};
