"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  dropdownMenuItemKeyframes,
  dropdownMenuItemAnimation,
} from "@/registry/bases/editframe/ui/dropdown-menu-item/use-dropdown-menu-item-transition";

export type DropdownMenuItemState = "idle" | "hover" | "press";

export interface DropdownMenuItemStyle {
  background: string;
  labelColor: string;
  scale: number;
}

export interface DropdownMenuItemStyleContext {
  idleBg: string;
  hoverBg: string;
  pressBg: string;
  idleFg: string;
}

export const dropdownMenuItemStyleContext = (
  theme: FramecnTheme
): DropdownMenuItemStyleContext => ({
  hoverBg: theme.accent,
  idleBg: theme.popover,
  idleFg: theme.popoverForeground,
  pressBg: mixOklch(theme.accent, theme.foreground, 0.08),
});

export const dropdownMenuItemStyle = (
  state: DropdownMenuItemState,
  ctx: DropdownMenuItemStyleContext
): DropdownMenuItemStyle => {
  switch (state) {
    case "hover": {
      return { background: ctx.hoverBg, labelColor: ctx.idleFg, scale: 1 };
    }
    case "press": {
      return { background: ctx.pressBg, labelColor: ctx.idleFg, scale: 0.98 };
    }
    default: {
      return { background: ctx.idleBg, labelColor: ctx.idleFg, scale: 1 };
    }
  }
};

const ROW_WIDTH = 240;

export interface DropdownMenuItemRowProps {
  style?: DropdownMenuItemStyle;
  state?: DropdownMenuItemState;
  from?: DropdownMenuItemState;
  label?: string;
  width?: number;
  theme?: Partial<FramecnTheme>;
  duration?: string;
}

export function DropdownMenuItemRow({
  style,
  state = "idle",
  from,
  label = "Profile",
  width = ROW_WIDTH,
  theme: themeOverride,
  duration = "8frames",
}: DropdownMenuItemRowProps) {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = dropdownMenuItemStyleContext(theme);
  const v = style ?? dropdownMenuItemStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? dropdownMenuItemStyle(from, ctx) : v;
  const anim = hasAnimation
    ? dropdownMenuItemAnimation(from, state, duration, fromStyle, v)
    : { background: "none", scale: "none" };

  return (
    <div
      style={{
        alignItems: "center",
        animation: hasAnimation
          ? `${anim.background}, ${anim.scale}`
          : undefined,
        background: v.background,
        borderRadius: theme.radius,
        boxSizing: "border-box",
        color: v.labelColor,
        display: "flex",
        fontSize: 14,
        letterSpacing: "-0.01em",
        padding: "8px 12px",
        transform: `scale(${v.scale})`,
        width,
      }}
    >
      {hasAnimation && <style>{dropdownMenuItemKeyframes(fromStyle, v)}</style>}
      <span>{label}</span>
    </div>
  );
}

export interface DropdownMenuItemProps extends DropdownMenuItemRowProps {
  className?: string;
}

export function DropdownMenuItem({
  style,
  state = "idle",
  from,
  label = "Profile",
  width = ROW_WIDTH,
  theme: themeOverride,
  className,
  duration = "8frames",
}: DropdownMenuItemProps) {
  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        background: "transparent",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <DropdownMenuItemRow
        style={style}
        state={state}
        from={from}
        label={label}
        width={width}
        theme={themeOverride}
        duration={duration}
      />
    </div>
  );
}
