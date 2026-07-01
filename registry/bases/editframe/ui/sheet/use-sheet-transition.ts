"use client";

import { sheetStyle } from "@/registry/bases/editframe/ui/sheet";
import type {
  SheetState,
  SheetStyle,
} from "@/registry/bases/editframe/ui/sheet";

export const DEFAULT_DURATION = 12;

export const sheetKeyframes = (
  fromStyle: SheetStyle,
  toStyle: SheetStyle
): string => {
  const dOverlay = toStyle.overlayOpacity - fromStyle.overlayOpacity;
  const dOpacity = toStyle.panelOpacity - fromStyle.panelOpacity;
  const dX = toStyle.panelTranslateX - fromStyle.panelTranslateX;

  return `
    @keyframes framecn-sheet-overlay {
      0% { opacity: ${fromStyle.overlayOpacity}; }
      100% { opacity: calc(${fromStyle.overlayOpacity} + ${dOverlay} * var(--ef-progress)); }
    }
    @keyframes framecn-sheet-panel {
      0% { opacity: ${fromStyle.panelOpacity}; transform: translateX(${fromStyle.panelTranslateX}px); }
      100% { opacity: calc(${fromStyle.panelOpacity} + ${dOpacity} * var(--ef-progress)); transform: translateX(calc(${fromStyle.panelTranslateX}px + ${dX}px * var(--ef-progress))); }
    }
  `;
};

export const sheetAnimation = (
  from: SheetState,
  to: SheetState,
  duration: string,
  fromStyle: SheetStyle,
  toStyle: SheetStyle
): { overlay: string; panel: string } => {
  if (from === to) {
    return { overlay: "none", panel: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    overlay: `${duration} framecn-sheet-overlay ${ease} forwards`,
    panel: `${duration} framecn-sheet-panel ${ease} forwards`,
  };
};
