"use client";

import type { FramecnTheme } from "@/lib/framecn-ui";
import type {
  DrawerState,
  DrawerStyle,
} from "@/registry/bases/editframe/ui/drawer";

export const DEFAULT_DURATION = 12;

export const drawerKeyframes = (
  fromStyle: DrawerStyle,
  toStyle: DrawerStyle
): string => {
  const dOverlay = toStyle.overlayOpacity - fromStyle.overlayOpacity;
  const dOpacity = toStyle.panelOpacity - fromStyle.panelOpacity;
  const dY = toStyle.panelTranslateY - fromStyle.panelTranslateY;

  return `
    @keyframes framecn-drawer-overlay {
      0% { opacity: ${fromStyle.overlayOpacity}; }
      100% { opacity: calc(${fromStyle.overlayOpacity} + ${dOverlay} * var(--ef-progress)); }
    }
    @keyframes framecn-drawer-panel {
      0% { opacity: ${fromStyle.panelOpacity}; transform: translateY(${fromStyle.panelTranslateY}px); }
      100% { opacity: calc(${fromStyle.panelOpacity} + ${dOpacity} * var(--ef-progress)); transform: translateY(calc(${fromStyle.panelTranslateY}px + ${dY}px * var(--ef-progress))); }
    }
  `;
};

export const drawerAnimation = (
  from: DrawerState,
  to: DrawerState,
  duration: string,
  _fromStyle: DrawerStyle,
  _toStyle: DrawerStyle
): { overlay: string; panel: string } => {
  if (from === to) {
    return { overlay: "none", panel: "none" };
  }
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  return {
    overlay: `${duration} framecn-drawer-overlay ${ease} forwards`,
    panel: `${duration} framecn-drawer-panel ${ease} forwards`,
  };
};

export interface DrawerTransitionOptions {
  theme?: Partial<FramecnTheme>;
  mode?: "light" | "dark";
  speed?: number;
  defaultDuration?: number;
}
