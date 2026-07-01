"use client";

import { mixOklch } from "@/lib/framecn-ui";
import type {
  InputState,
  InputStyle,
} from "@/registry/bases/editframe/ui/input";

export const DEFAULT_DURATION = 8;

export const tweenInputStyle = (
  a: InputStyle,
  b: InputStyle,
  t: number
): InputStyle => ({
  background: mixOklch(a.background, b.background, t),
  borderColor: mixOklch(a.borderColor, b.borderColor, t),
  caretOpacity: a.caretOpacity + (b.caretOpacity - a.caretOpacity) * t,
  placeholderOpacity:
    a.placeholderOpacity + (b.placeholderOpacity - a.placeholderOpacity) * t,
  ringColor: mixOklch(a.ringColor, b.ringColor, t),
  ringWidth: a.ringWidth + (b.ringWidth - a.ringWidth) * t,
  valueReveal: a.valueReveal + (b.valueReveal - a.valueReveal) * t,
});

const d = (from: number, to: number): number => to - from;

export const inputKeyframes = (
  fromStyle: InputStyle,
  toStyle: InputStyle
): string => `
    @property --ef-input-border-color {
      syntax: '<color>';
      inherits: false;
      initial-value: ${fromStyle.borderColor};
    }
    @property --ef-input-ring-color {
      syntax: '<color>';
      inherits: false;
      initial-value: ${fromStyle.ringColor};
    }
    @property --ef-input-ring-width {
      syntax: '<length>';
      inherits: false;
      initial-value: ${fromStyle.ringWidth}px;
    }
    @property --ef-input-background {
      syntax: '<color>';
      inherits: false;
      initial-value: ${fromStyle.background};
    }
    @keyframes framecn-input-border-color {
      0% { --ef-input-border-color: ${fromStyle.borderColor}; }
      100% { --ef-input-border-color: ${toStyle.borderColor}; }
    }
    @keyframes framecn-input-ring {
      0% { --ef-input-ring-width: ${fromStyle.ringWidth}px; --ef-input-ring-color: ${fromStyle.ringColor}; }
      100% { --ef-input-ring-width: ${toStyle.ringWidth}px; --ef-input-ring-color: ${toStyle.ringColor}; }
    }
    @keyframes framecn-input-background {
      0% { --ef-input-background: ${fromStyle.background}; }
      100% { --ef-input-background: ${toStyle.background}; }
    }
    @keyframes framecn-input-caret-opacity {
      0% { opacity: ${fromStyle.caretOpacity}; }
      100% { opacity: calc(${fromStyle.caretOpacity} + ${d(fromStyle.caretOpacity, toStyle.caretOpacity)} * var(--ef-progress)); }
    }
    @keyframes framecn-input-placeholder-opacity {
      0% { opacity: ${fromStyle.placeholderOpacity}; }
      100% { opacity: calc(${fromStyle.placeholderOpacity} + ${d(fromStyle.placeholderOpacity, toStyle.placeholderOpacity)} * var(--ef-progress)); }
    }
  `;

export const inputAnimations = (
  from: InputState,
  to: InputState,
  duration: string
): {
  border: string;
  ring: string;
  background: string;
  caretOpacity: string;
  placeholderOpacity: string;
} => {
  if (from === to) {
    return {
      background: "none",
      border: "none",
      caretOpacity: "none",
      placeholderOpacity: "none",
      ring: "none",
    };
  }

  const ease = `${duration} cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  return {
    background: `framecn-input-background ${ease}`,
    border: `framecn-input-border-color ${ease}`,
    caretOpacity: `framecn-input-caret-opacity ${ease}`,
    placeholderOpacity: `framecn-input-placeholder-opacity ${ease}`,
    ring: `framecn-input-ring ${ease}`,
  };
};
