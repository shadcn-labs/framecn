"use client";

import { easings, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { buttonStyleContext } from "@/registry/bases/editframe/ui/button";
import type {
  ButtonState,
  ButtonStyle,
  ButtonStyleContext,
} from "@/registry/bases/editframe/ui/button";

export const DEFAULT_DURATION = 8;

export const tweenButtonStyle = (
  a: ButtonStyle,
  b: ButtonStyle,
  t: number
): ButtonStyle => ({
  background: mixOklch(a.background, b.background, t),
  checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
  labelOpacity: a.labelOpacity + (b.labelOpacity - a.labelOpacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  spinnerOpacity: a.spinnerOpacity + (b.spinnerOpacity - a.spinnerOpacity) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export interface ButtonTransitionOptions {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  primary?: string;
  speed?: number;
  defaultDuration?: number;
}

export interface ButtonCssAnimation {
  keyframes: string;
  animation: string;
}

const BUTTON_IDLE_STYLE: ButtonStyle = {
  background: "transparent",
  checkOpacity: 0,
  labelOpacity: 1,
  scale: 1,
  spinnerOpacity: 0,
  translateY: 0,
};

const BUTTON_HOVER_STYLE: ButtonStyle = {
  background: "transparent",
  checkOpacity: 0,
  labelOpacity: 1,
  scale: 1,
  spinnerOpacity: 0,
  translateY: -1,
};

const BUTTON_PRESS_STYLE: ButtonStyle = {
  background: "transparent",
  checkOpacity: 0,
  labelOpacity: 1,
  scale: 0.97,
  spinnerOpacity: 0,
  translateY: -1,
};

const BUTTON_LOADING_STYLE: ButtonStyle = {
  background: "transparent",
  checkOpacity: 0,
  labelOpacity: 0,
  scale: 1,
  spinnerOpacity: 1,
  translateY: -1,
};

const BUTTON_SUCCESS_STYLE: ButtonStyle = {
  background: "transparent",
  checkOpacity: 1,
  labelOpacity: 0,
  scale: 1,
  spinnerOpacity: 0,
  translateY: -1,
};
const buttonStateStyle = (
  state: ButtonState,
  ctx: ButtonStyleContext
): ButtonStyle => {
  const base =
    state === "idle"
      ? BUTTON_IDLE_STYLE
      : state === "hover"
        ? BUTTON_HOVER_STYLE
        : state === "press"
          ? BUTTON_PRESS_STYLE
          : state === "loading"
            ? BUTTON_LOADING_STYLE
            : BUTTON_SUCCESS_STYLE;

  let bg = ctx.restBg;
  if (state === "hover" || state === "loading") {
    bg = ctx.hoverBg;
  } else if (state === "press") {
    bg = ctx.pressBg;
  } else if (state === "success") {
    bg = ctx.primary;
  }

  return { ...base, background: bg };
};

export const buttonKeyframes = (ctx: ButtonStyleContext): string => {
  const idle = buttonStateStyle("idle", ctx);
  const hover = buttonStateStyle("hover", ctx);
  const press = buttonStateStyle("press", ctx);
  const loading = buttonStateStyle("loading", ctx);
  const success = buttonStateStyle("success", ctx);

  return `
    @keyframes framecn-btn-idle-to-hover {
      0% { transform: translateY(${idle.translateY}px) scale(${idle.scale}); background: ${idle.background}; }
      100% { transform: translateY(${hover.translateY}px) scale(${hover.scale}); background: ${hover.background}; }
    }
    @keyframes framecn-btn-hover-to-press {
      0% { transform: translateY(${hover.translateY}px) scale(${hover.scale}); background: ${hover.background}; }
      100% { transform: translateY(${press.translateY}px) scale(${press.scale}); background: ${press.background}; }
    }
    @keyframes framecn-btn-press-to-hover {
      0% { transform: translateY(${press.translateY}px) scale(${press.scale}); background: ${press.background}; }
      100% { transform: translateY(${hover.translateY}px) scale(${hover.scale}); background: ${hover.background}; }
    }
    @keyframes framecn-btn-hover-to-idle {
      0% { transform: translateY(${hover.translateY}px) scale(${hover.scale}); background: ${hover.background}; }
      100% { transform: translateY(${idle.translateY}px) scale(${idle.scale}); background: ${idle.background}; }
    }
    @keyframes framecn-btn-to-loading {
      0% { transform: translateY(${idle.translateY}px) scale(${idle.scale}); background: ${idle.background}; }
      100% { transform: translateY(${loading.translateY}px) scale(${loading.scale}); background: ${loading.background}; }
    }
    @keyframes framecn-btn-to-success {
      0% { transform: translateY(${loading.translateY}px) scale(${loading.scale}); background: ${loading.background}; }
      100% { transform: translateY(${success.translateY}px) scale(${success.scale}); background: ${success.background}; }
    }
    @keyframes framecn-btn-success-to-idle {
      0% { transform: translateY(${success.translateY}px) scale(${success.scale}); background: ${success.background}; }
      100% { transform: translateY(${idle.translateY}px) scale(${idle.scale}); background: ${idle.background}; }
    }
    @keyframes framecn-btn-label-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes framecn-btn-label-out {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
};

export const buttonAnimation = (
  from: ButtonState,
  to: ButtonState,
  duration: string
): { container: string; label: string } => {
  const map: Record<string, string> = {
    "hover-idle": "framecn-btn-hover-to-idle",
    "hover-press": "framecn-btn-hover-to-press",
    "idle-hover": "framecn-btn-idle-to-hover",
    "idle-loading": "framecn-btn-to-loading",
    "loading-success": "framecn-btn-to-success",
    "press-hover": "framecn-btn-press-to-hover",
    "success-idle": "framecn-btn-success-to-idle",
  };

  const key = `${from}-${to}`;
  const containerAnim = map[key]
    ? `${duration} ${map[key]} ease-out forwards`
    : "none";

  let labelAnim = "none";
  if (to === "loading" || to === "success") {
    labelAnim = `${duration} framecn-btn-label-out ease-out forwards`;
  } else if (from === "loading" || from === "success") {
    labelAnim = `${duration} framecn-btn-label-in ease-out forwards`;
  }

  return { container: containerAnim, label: labelAnim };
};
