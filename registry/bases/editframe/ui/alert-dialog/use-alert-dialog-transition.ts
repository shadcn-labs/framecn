"use client";

import type {
  AlertDialogState,
  AlertDialogStyle,
} from "@/registry/bases/editframe/ui/alert-dialog";

export const DEFAULT_DURATION = 12;

export const alertDialogKeyframes = (
  fromStyle: AlertDialogStyle,
  toStyle: AlertDialogStyle
): string => {
  const dOverlay = toStyle.overlayOpacity - fromStyle.overlayOpacity;
  const dPopup = toStyle.popupOpacity - fromStyle.popupOpacity;
  const dScale = toStyle.popupScale - fromStyle.popupScale;
  const dY = toStyle.popupTranslateY - fromStyle.popupTranslateY;

  return `
    @keyframes framecn-alert-dialog-overlay {
      0% { opacity: ${fromStyle.overlayOpacity}; }
      100% { opacity: calc(${fromStyle.overlayOpacity} + ${dOverlay} * var(--ef-progress)); }
    }
    @keyframes framecn-alert-dialog-popup {
      0% { opacity: ${fromStyle.popupOpacity}; transform: translateY(${fromStyle.popupTranslateY}px) scale(${fromStyle.popupScale}); }
      100% { opacity: calc(${fromStyle.popupOpacity} + ${dPopup} * var(--ef-progress)); transform: translateY(calc(${fromStyle.popupTranslateY}px + ${dY}px * var(--ef-progress))) scale(calc(${fromStyle.popupScale} + ${dScale} * var(--ef-progress))); }
    }
  `;
};

export const alertDialogAnimation = (
  from: AlertDialogState,
  to: AlertDialogState,
  duration: string,
  _fromStyle: AlertDialogStyle,
  _toStyle: AlertDialogStyle
): { overlay: string; popup: string } => {
  if (from === to) {
    return { overlay: "none", popup: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    overlay: `${duration} framecn-alert-dialog-overlay ${ease} forwards`,
    popup: `${duration} framecn-alert-dialog-popup ${ease} forwards`,
  };
};
