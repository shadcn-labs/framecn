"use client";

import { toastStyle } from "@/registry/bases/editframe/ui/toast";
import type {
  ToastState,
  ToastStyle,
} from "@/registry/bases/editframe/ui/toast";

export const DEFAULT_DURATION = 12;

export const tweenToastStyle = (
  a: ToastStyle,
  b: ToastStyle,
  t: number
): ToastStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export const toastKeyframes = (
  fromStyle: ToastStyle,
  toStyle: ToastStyle
): string => {
  const deltaOpacity = toStyle.opacity - fromStyle.opacity;
  const deltaTranslateY = toStyle.translateY - fromStyle.translateY;
  const deltaScale = toStyle.scale - fromStyle.scale;

  const css = `
    @keyframes framecn-toast-opacity {
      0% { opacity: ${fromStyle.opacity}; }
      100% { opacity: calc(${fromStyle.opacity} + ${deltaOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-toast-translate {
      0% { transform: translateY(${fromStyle.translateY}px) scale(${fromStyle.scale}); }
      100% { transform: translateY(calc(${fromStyle.translateY}px + ${deltaTranslateY}px * var(--ef-progress))) scale(calc(${fromStyle.scale} + ${deltaScale} * var(--ef-progress))); }
    }
  `;

  return css;
};

export const toastAnimation = (
  from: ToastState,
  to: ToastState,
  duration: string,
  fromStyle: ToastStyle,
  toStyle: ToastStyle
): {
  opacity: string;
  transform: string;
} => {
  if (from === to) {
    return { opacity: "none", transform: "none" };
  }

  const opacityAnim = `${duration} framecn-toast-opacity cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const transformAnim = `${duration} framecn-toast-translate cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return { opacity: opacityAnim, transform: transformAnim };
};
