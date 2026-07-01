"use client";

import type {
  ComboboxState,
  ComboboxStyle,
} from "@/registry/bases/editframe/ui/combobox";

export const DEFAULT_DURATION = 12;

export const comboboxKeyframes = (
  fromStyle: ComboboxStyle,
  toStyle: ComboboxStyle
): string => {
  const dOpacity = toStyle.panelOpacity - fromStyle.panelOpacity;
  const dScale = toStyle.panelScale - fromStyle.panelScale;
  const dY = toStyle.panelTranslateY - fromStyle.panelTranslateY;

  return `
    @keyframes framecn-combobox-opacity {
      0% { opacity: ${fromStyle.panelOpacity}; }
      100% { opacity: calc(${fromStyle.panelOpacity} + ${dOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-combobox-panel {
      0% { transform: translateY(${fromStyle.panelTranslateY}px) scale(${fromStyle.panelScale}); }
      100% { transform: translateY(calc(${fromStyle.panelTranslateY}px + ${dY}px * var(--ef-progress))) scale(calc(${fromStyle.panelScale} + ${dScale} * var(--ef-progress))); }
    }
  `;
};

export const comboboxAnimation = (
  from: ComboboxState,
  to: ComboboxState,
  duration: string,
  _fromStyle: ComboboxStyle,
  _toStyle: ComboboxStyle
): { panelOpacity: string; panelTransform: string } => {
  if (from === to) {
    return { panelOpacity: "none", panelTransform: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    panelOpacity: `${duration} framecn-combobox-opacity ${ease} forwards`,
    panelTransform: `${duration} framecn-combobox-panel ${ease} forwards`,
  };
};
