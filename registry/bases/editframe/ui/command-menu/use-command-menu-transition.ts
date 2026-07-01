"use client";

import type {
  CommandMenuState,
  CommandMenuStyle,
} from "@/registry/bases/editframe/ui/command-menu";

export const DEFAULT_DURATION = 12;

export const tweenCommandMenuStyle = (
  a: CommandMenuStyle,
  b: CommandMenuStyle,
  t: number
): CommandMenuStyle => ({
  backdropOpacity:
    a.backdropOpacity + (b.backdropOpacity - a.backdropOpacity) * t,
  panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
  panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
  panelTranslateY:
    a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
});

export const commandMenuKeyframes = (
  fromStyle: CommandMenuStyle,
  toStyle: CommandMenuStyle
): string => {
  const deltaBackdropOpacity =
    toStyle.backdropOpacity - fromStyle.backdropOpacity;
  const deltaPanelOpacity = toStyle.panelOpacity - fromStyle.panelOpacity;
  const deltaPanelScale = toStyle.panelScale - fromStyle.panelScale;
  const deltaPanelTranslateY =
    toStyle.panelTranslateY - fromStyle.panelTranslateY;

  return `
    @keyframes framecn-command-menu-backdrop {
      0% { opacity: ${fromStyle.backdropOpacity}; }
      100% { opacity: calc(${fromStyle.backdropOpacity} + ${deltaBackdropOpacity} * var(--ef-progress)); }
    }
    @keyframes framecn-command-menu-panel {
      0% { opacity: ${fromStyle.panelOpacity}; transform: translateY(${fromStyle.panelTranslateY}px) scale(${fromStyle.panelScale}); }
      100% { opacity: calc(${fromStyle.panelOpacity} + ${deltaPanelOpacity} * var(--ef-progress)); transform: translateY(calc(${fromStyle.panelTranslateY}px + ${deltaPanelTranslateY}px * var(--ef-progress))) scale(calc(${fromStyle.panelScale} + ${deltaPanelScale} * var(--ef-progress))); }
    }
  `;
};

export const commandMenuAnimation = (
  from: CommandMenuState,
  to: CommandMenuState,
  duration: string,
  _fromStyle: CommandMenuStyle,
  _toStyle: CommandMenuStyle
): {
  backdrop: string;
  panel: string;
} => {
  if (from === to) {
    return { backdrop: "none", panel: "none" };
  }

  const backdropAnim = `${duration} framecn-command-menu-backdrop cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const panelAnim = `${duration} framecn-command-menu-panel cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return { backdrop: backdropAnim, panel: panelAnim };
};
