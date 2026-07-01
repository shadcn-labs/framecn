"use client";

import type {
  PopoverState,
  PopoverStyle,
} from "@/registry/bases/editframe/ui/popover";

export const DEFAULT_DURATION = 10;

export const tweenPopoverStyle = (
  a: PopoverStyle,
  b: PopoverStyle,
  t: number
): PopoverStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translate: a.translate + (b.translate - a.translate) * t,
});

export const popoverKeyframes = (
  fromStyle: PopoverStyle,
  toStyle: PopoverStyle
): string => {
  const deltaOpacity = toStyle.opacity - fromStyle.opacity;
  const deltaScale = toStyle.scale - fromStyle.scale;
  const deltaTranslate = toStyle.translate - fromStyle.translate;

  return `
    @keyframes framecn-popover-opacity {
      0% { opacity: ${fromStyle.opacity}; }
      100% { opacity: calc(${fromStyle.opacity} + ${deltaOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-popover-transform {
      0% { --ef-popover-translate: ${fromStyle.translate}px; --ef-popover-scale: ${fromStyle.scale}; }
      100% { --ef-popover-translate: calc(${fromStyle.translate}px + ${deltaTranslate}px * var(--ef-progress)); --ef-popover-scale: calc(${fromStyle.scale} + ${deltaScale} * var(--ef-progress)); }
    }
  `;
};

export const popoverAnimation = (
  from: PopoverState,
  to: PopoverState,
  duration: string,
  _fromStyle: PopoverStyle,
  _toStyle: PopoverStyle
): {
  opacity: string;
  transform: string;
} => {
  if (from === to) {
    return { opacity: "none", transform: "none" };
  }

  const opacityAnim = `${duration} framecn-popover-opacity cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const transformAnim = `${duration} framecn-popover-transform cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return { opacity: opacityAnim, transform: transformAnim };
};
