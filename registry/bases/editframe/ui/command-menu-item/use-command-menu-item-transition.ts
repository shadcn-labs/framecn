"use client";

import type {
  CommandMenuItemState,
  CommandMenuItemStyle,
} from "@/registry/bases/editframe/ui/command-menu-item";

export const DEFAULT_DURATION = 8;

export const tweenCommandMenuItemStyle = (
  a: CommandMenuItemStyle,
  b: CommandMenuItemStyle,
  t: number
): CommandMenuItemStyle => ({
  background: a.background,
  iconColor: a.iconColor,
  labelColor: a.labelColor,
  scale: a.scale + (b.scale - a.scale) * t,
});

export const commandMenuItemKeyframes = (
  fromStyle: CommandMenuItemStyle,
  toStyle: CommandMenuItemStyle
): string => {
  const dScale = toStyle.scale - fromStyle.scale;

  return `
    @keyframes framecn-command-menu-item-bg {
      0% { background: ${fromStyle.background}; color: ${fromStyle.labelColor}; }
      100% { background: ${toStyle.background}; color: ${toStyle.labelColor}; }
    }
    @keyframes framecn-command-menu-item-icon {
      0% { color: ${fromStyle.iconColor}; }
      100% { color: ${toStyle.iconColor}; }
    }
    @keyframes framecn-command-menu-item-scale {
      0% { transform: scale(${fromStyle.scale}); }
      100% { transform: scale(calc(${fromStyle.scale} + ${dScale} * var(--ef-progress))); }
    }
  `;
};

export const commandMenuItemAnimation = (
  from: CommandMenuItemState,
  to: CommandMenuItemState,
  duration: string,
  _fromStyle: CommandMenuItemStyle,
  _toStyle: CommandMenuItemStyle
): {
  background: string;
  iconColor: string;
  scale: string;
} => {
  if (from === to) {
    return { background: "none", iconColor: "none", scale: "none" };
  }

  const bgAnim = `${duration} framecn-command-menu-item-bg cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const iconAnim = `${duration} framecn-command-menu-item-icon cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const scaleAnim = `${duration} framecn-command-menu-item-scale cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return { background: bgAnim, iconColor: iconAnim, scale: scaleAnim };
};
