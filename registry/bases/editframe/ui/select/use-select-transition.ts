"use client";

import type {
  SelectState,
  SelectStyle,
} from "@/registry/bases/editframe/ui/select";

export const DEFAULT_DURATION = 12;

export const tweenSelectStyle = (
  a: SelectStyle,
  b: SelectStyle,
  t: number
): SelectStyle => ({
  chevronRotation:
    a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export const selectKeyframes = (
  fromStyle: SelectStyle,
  toStyle: SelectStyle
): string => {
  const dOpacity = toStyle.panelOpacity - fromStyle.panelOpacity;
  const dScale = toStyle.panelScale - fromStyle.panelScale;
  const dTranslateY = toStyle.panelTranslateY - fromStyle.panelTranslateY;
  const dRotation = toStyle.chevronRotation - fromStyle.chevronRotation;

  return `
    @keyframes framecn-select-opacity {
      0% { opacity: ${fromStyle.panelOpacity}; }
      100% { opacity: calc(${fromStyle.panelOpacity} + ${dOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-select-panel {
      0% { transform: translateY(${fromStyle.panelTranslateY}px) scale(${fromStyle.panelScale}); }
      100% { transform: translateY(calc(${fromStyle.panelTranslateY}px + ${dTranslateY}px * var(--ef-progress))) scale(calc(${fromStyle.panelScale} + ${dScale} * var(--ef-progress))); }
    }
    @keyframes framecn-select-chevron {
      0% { transform: rotate(${fromStyle.chevronRotation}deg); }
      100% { transform: rotate(calc(${fromStyle.chevronRotation}deg + ${dRotation}deg * var(--ef-progress))); }
    }
  `;
};

export const selectAnimation = (
  from: SelectState,
  to: SelectState,
  duration: string,
  _fromStyle: SelectStyle,
  _toStyle: SelectStyle
): {
  panelOpacity: string;
  panelTransform: string;
  chevronTransform: string;
} => {
  if (from === to) {
    return {
      chevronTransform: "none",
      panelOpacity: "none",
      panelTransform: "none",
    };
  }

  const panelOpacityAnim = `${duration} framecn-select-opacity cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const panelTransformAnim = `${duration} framecn-select-panel cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const chevronTransformAnim = `${duration} framecn-select-chevron cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return {
    chevronTransform: chevronTransformAnim,
    panelOpacity: panelOpacityAnim,
    panelTransform: panelTransformAnim,
  };
};
