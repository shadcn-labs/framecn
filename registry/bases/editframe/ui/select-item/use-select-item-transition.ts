"use client";

import { mixOklch } from "@/lib/framecn-ui";
import type {
  SelectItemState,
  SelectItemStyle,
} from "@/registry/bases/editframe/ui/select-item";

export const DEFAULT_DURATION = 8;

export const tweenSelectItemStyle = (
  a: SelectItemStyle,
  b: SelectItemStyle,
  t: number
): SelectItemStyle => ({
  background: mixOklch(a.background, b.background, t),
  checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
  labelColor: mixOklch(a.labelColor, b.labelColor, t),
  scale: a.scale + (b.scale - a.scale) * t,
});

export const selectItemKeyframes = (
  fromStyle: SelectItemStyle,
  toStyle: SelectItemStyle
): string => {
  const dCheckOpacity = toStyle.checkOpacity - fromStyle.checkOpacity;
  const dScale = toStyle.scale - fromStyle.scale;

  return `
    @keyframes framecn-select-item-bg {
      0% { background: ${fromStyle.background}; color: ${fromStyle.labelColor}; }
      100% { background: ${toStyle.background}; color: ${toStyle.labelColor}; }
    }
    @keyframes framecn-select-item-opacity {
      0% { opacity: ${fromStyle.checkOpacity}; }
      100% { opacity: calc(${fromStyle.checkOpacity} + ${dCheckOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-select-item-scale {
      0% { transform: scale(${fromStyle.scale}); }
      100% { transform: scale(calc(${fromStyle.scale} + ${dScale} * var(--ef-progress))); }
    }
  `;
};

export const selectItemAnimation = (
  from: SelectItemState,
  to: SelectItemState,
  duration: string,
  _fromStyle: SelectItemStyle,
  _toStyle: SelectItemStyle
): {
  background: string;
  checkOpacity: string;
  scale: string;
} => {
  if (from === to) {
    return { background: "none", checkOpacity: "none", scale: "none" };
  }

  const bgAnim = `${duration} framecn-select-item-bg cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const checkOpacityAnim = `${duration} framecn-select-item-opacity cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const scaleAnim = `${duration} framecn-select-item-scale cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return {
    background: bgAnim,
    checkOpacity: checkOpacityAnim,
    scale: scaleAnim,
  };
};
