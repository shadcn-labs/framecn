"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

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
  hoverFg: string;
}

export const dropdownMenuItemStyleContext = (
  theme: FramecnTheme
): DropdownMenuItemStyleContext => ({
  hoverBg: theme.accent,
  hoverFg: theme.accentForeground,
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
      return { background: ctx.hoverBg, labelColor: ctx.hoverFg, scale: 1 };
    }
    case "press": {
      return { background: ctx.pressBg, labelColor: ctx.hoverFg, scale: 0.98 };
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
  label?: string;
  width?: number | string;
  theme?: Partial<FramecnTheme>;
}

export const DropdownMenuItemRow = ({
  style,
  state = "idle",
  label = "Profile",
  width = ROW_WIDTH,
  theme: themeOverride,
}: DropdownMenuItemRowProps) => {
  const theme = useFramecnTheme(themeOverride);
  const ctx = dropdownMenuItemStyleContext(theme);
  const v = style ?? dropdownMenuItemStyle(state, ctx);
  return (
    <div
      style={{
        alignItems: "center",
        background: v.background,
        borderRadius: Math.max(0, theme.radius - 4),
        boxSizing: "border-box",
        color: v.labelColor,
        display: "flex",
        fontSize: 14,
        gap: 8,
        lineHeight: "20px",
        padding: "6px 8px",
        transform: `scale(${v.scale})`,
        width,
      }}
    >
      <span>{label}</span>
    </div>
  );
};

export interface DropdownMenuItemProps extends DropdownMenuItemRowProps {
  className?: string;
}

export const DropdownMenuItem = ({
  style,
  state = "idle",
  label = "Profile",
  width = ROW_WIDTH,
  theme: themeOverride,
  className,
}: DropdownMenuItemProps) => (
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
      label={label}
      width={width}
      theme={themeOverride}
    />
  </div>
);
