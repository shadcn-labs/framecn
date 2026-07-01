"use client";

import { dropdownMenuItemStyle } from "@/registry/bases/editframe/ui/dropdown-menu-item";
import type {
  DropdownMenuItemState,
  DropdownMenuItemStyle,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";

export const DEFAULT_DURATION = 8;

export const tweenDropdownMenuItemStyle = (
  a: DropdownMenuItemStyle,
  b: DropdownMenuItemStyle,
  t: number
): DropdownMenuItemStyle => ({
  background: a.background,
  labelColor: a.labelColor,
  scale: a.scale + (b.scale - a.scale) * t,
});

export const dropdownMenuItemKeyframes = (
  fromStyle: DropdownMenuItemStyle,
  toStyle: DropdownMenuItemStyle
): string => {
  const dScale = toStyle.scale - fromStyle.scale;

  return `
    @keyframes framecn-dropdown-menu-item-bg {
      0% { background: ${fromStyle.background}; color: ${fromStyle.labelColor}; }
      100% { background: ${toStyle.background}; color: ${toStyle.labelColor}; }
    }
    @keyframes framecn-dropdown-menu-item-scale {
      0% { transform: scale(${fromStyle.scale}); }
      100% { transform: scale(calc(${fromStyle.scale} + ${dScale} * var(--ef-progress))); }
    }
  `;
};

export const dropdownMenuItemAnimation = (
  from: DropdownMenuItemState,
  to: DropdownMenuItemState,
  duration: string,
  fromStyle: DropdownMenuItemStyle,
  toStyle: DropdownMenuItemStyle
): {
  background: string;
  scale: string;
} => {
  if (from === to) {
    return { background: "none", scale: "none" };
  }

  const bgAnim = `${duration} framecn-dropdown-menu-item-bg cubic-bezier(0.4, 0, 0.2, 1) forwards`;
  const scaleAnim = `${duration} framecn-dropdown-menu-item-scale cubic-bezier(0.4, 0, 0.2, 1) forwards`;

  return { background: bgAnim, scale: scaleAnim };
};
