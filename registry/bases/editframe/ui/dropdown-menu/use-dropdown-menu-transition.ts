"use client";

import type {
  DropdownMenuState,
  DropdownMenuStyle,
} from "@/registry/bases/editframe/ui/dropdown-menu";

export const DEFAULT_DURATION = 12;

export const tweenDropdownMenuStyle = (
  a: DropdownMenuStyle,
  b: DropdownMenuStyle,
  t: number
): DropdownMenuStyle => ({
  chevronRotation:
    a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export const dropdownMenuKeyframes = (
  fromStyle: DropdownMenuStyle,
  toStyle: DropdownMenuStyle
): string => {
  const dOpacity = toStyle.panelOpacity - fromStyle.panelOpacity;
  const dScale = toStyle.panelScale - fromStyle.panelScale;
  const dTranslateY = toStyle.panelTranslateY - fromStyle.panelTranslateY;
  const dRotation = toStyle.chevronRotation - fromStyle.chevronRotation;

  return `
    @keyframes framecn-dropdown-menu-opacity {
      0% { opacity: ${fromStyle.panelOpacity}; }
      100% { opacity: calc(${fromStyle.panelOpacity} + ${dOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-dropdown-menu-panel {
      0% { transform: translateY(${fromStyle.panelTranslateY}px) scale(${fromStyle.panelScale}); }
      100% { transform: translateY(calc(${fromStyle.panelTranslateY}px + ${dTranslateY}px * var(--ef-progress))) scale(calc(${fromStyle.panelScale} + ${dScale} * var(--ef-progress))); }
    }
    @keyframes framecn-dropdown-menu-chevron {
      0% { transform: rotate(${fromStyle.chevronRotation}deg); }
      100% { transform: rotate(calc(${fromStyle.chevronRotation}deg + ${dRotation}deg * var(--ef-progress))); }
    }
  `;
};

export const dropdownMenuAnimation = (
  from: DropdownMenuState,
  to: DropdownMenuState,
  duration: string,
  _fromStyle: DropdownMenuStyle,
  _toStyle: DropdownMenuStyle
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

  const panelOpacityAnim = `${duration} framecn-dropdown-menu-opacity cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const panelTransformAnim = `${duration} framecn-dropdown-menu-panel cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const chevronTransformAnim = `${duration} framecn-dropdown-menu-chevron cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return {
    chevronTransform: chevronTransformAnim,
    panelOpacity: panelOpacityAnim,
    panelTransform: panelTransformAnim,
  };
};
