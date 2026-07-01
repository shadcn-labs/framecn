"use client";

import type {
  DialogState,
  DialogStyle,
} from "@/registry/bases/editframe/ui/dialog";

export const DEFAULT_DURATION = 12;

export const dialogKeyframes = (
  fromStyle: DialogStyle,
  toStyle: DialogStyle
): string => {
  const dOverlay = toStyle.overlayOpacity - fromStyle.overlayOpacity;
  const dOpacity = toStyle.popupOpacity - fromStyle.popupOpacity;
  const dScale = toStyle.popupScale - fromStyle.popupScale;
  const dY = toStyle.popupTranslateY - fromStyle.popupTranslateY;

  return `
    @keyframes framecn-dialog-overlay {
      0% { opacity: ${fromStyle.overlayOpacity}; }
      100% { opacity: calc(${fromStyle.overlayOpacity} + ${dOverlay} * var(--ef-progress)); }
    }
    @keyframes framecn-dialog-popup {
      0% { opacity: ${fromStyle.popupOpacity}; transform: translateY(${fromStyle.popupTranslateY}px) scale(${fromStyle.popupScale}); }
      100% { opacity: calc(${fromStyle.popupOpacity} + ${dOpacity} * var(--ef-progress)); transform: translateY(calc(${fromStyle.popupTranslateY}px + ${dY}px * var(--ef-progress))) scale(calc(${fromStyle.popupScale} + ${dScale} * var(--ef-progress))); }
    }
  `;
};

export const dialogAnimation = (
  from: DialogState,
  to: DialogState,
  duration: string,
  _fromStyle: DialogStyle,
  _toStyle: DialogStyle
): { overlay: string; popup: string } => {
  if (from === to) {
    return { overlay: "none", popup: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    overlay: `${duration} framecn-dialog-overlay ${ease} forwards`,
    popup: `${duration} framecn-dialog-popup ${ease} forwards`,
  };
};
