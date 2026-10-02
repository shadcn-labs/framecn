"use client";

import { FramecnIcon, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type CommandMenuItemState = "idle" | "hover" | "press" | "selected";

export interface CommandMenuItemProps {
  state?: CommandMenuItemState;
  style?: CommandMenuItemStyle;
  label?: string;
  icon?: CommandMenuIcon;
  shortcut?: string;
  width?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

export type CommandMenuIcon = "search" | "settings" | "user" | "file";

const ROW_WIDTH = 360;

export interface CommandMenuItemStyle {
  background: string;
  labelColor: string;
  iconColor: string;
  scale: number;
}

export interface CommandMenuItemStyleContext {
  idleBg: string;
  hoverBg: string;
  pressBg: string;
  selectedBg: string;
  idleFg: string;
  selectedFg: string;
  idleIcon: string;
  selectedIcon: string;
  kbdFg: string;
}

export const commandMenuItemStyleContext = (
  theme: FramecnTheme
): CommandMenuItemStyleContext => ({
  hoverBg: theme.accent,
  idleBg: theme.popover,
  idleFg: theme.popoverForeground,
  idleIcon: theme.mutedForeground,
  kbdFg: theme.mutedForeground,
  pressBg: mixOklch(theme.accent, theme.foreground, 0.08),
  selectedBg: theme.accent,
  selectedFg: theme.accentForeground,
  selectedIcon: theme.mutedForeground,
});

export const commandMenuItemStyle = (
  state: CommandMenuItemState,
  ctx: CommandMenuItemStyleContext
): CommandMenuItemStyle => {
  switch (state) {
    case "hover": {
      return {
        background: ctx.hoverBg,
        iconColor: ctx.selectedIcon,
        labelColor: ctx.selectedFg,
        scale: 1,
      };
    }
    case "press": {
      return {
        background: ctx.pressBg,
        iconColor: ctx.selectedIcon,
        labelColor: ctx.selectedFg,
        scale: 0.98,
      };
    }
    case "selected": {
      return {
        background: ctx.selectedBg,
        iconColor: ctx.selectedIcon,
        labelColor: ctx.selectedFg,
        scale: 1,
      };
    }
    default: {
      return {
        background: ctx.idleBg,
        iconColor: ctx.idleIcon,
        labelColor: ctx.idleFg,
        scale: 1,
      };
    }
  }
};

const ICON_NAMES = {
  file: "File",
  search: "Search",
  settings: "Settings",
  user: "User",
} as const;

export interface CommandMenuItemRowProps {
  style?: CommandMenuItemStyle;
  state?: CommandMenuItemState;
  ctx: CommandMenuItemStyleContext;
  label: string;
  icon?: CommandMenuIcon;
  shortcut?: string;
  width: number | string;
  radius: number;
  dialog?: boolean;
}

export const CommandMenuItemRow = ({
  style,
  state = "idle",
  ctx,
  label,
  icon,
  shortcut,
  width,
  radius,
  dialog = false,
}: CommandMenuItemRowProps) => {
  const v = style ?? commandMenuItemStyle(state, ctx);
  return (
    <div
      style={{
        alignItems: "center",
        background: v.background,
        borderRadius: Math.max(0, radius - 4),
        boxSizing: "border-box",
        color: v.labelColor,
        display: "flex",
        fontSize: 14,
        gap: 8,
        justifyContent: "space-between",
        lineHeight: "20px",
        padding: dialog ? "12px 8px" : "6px 8px",
        transform: `scale(${v.scale})`,
        width,
      }}
    >
      <span
        style={{
          alignItems: "center",
          display: "flex",
          gap: 8,
          minWidth: 0,
        }}
      >
        {icon !== undefined && (
          <span style={{ display: "flex", flexShrink: 0 }}>
            <FramecnIcon
              name={ICON_NAMES[icon]}
              size={dialog ? 20 : 16}
              color={v.iconColor}
            />
          </span>
        )}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </span>
      {shortcut !== undefined && (
        <span
          style={{
            color: ctx.kbdFg,
            display: "inline-block",
            flexShrink: 0,
            fontFamily: "inherit",
            fontSize: 12,
            letterSpacing: "0.1em",
            marginLeft: "auto",
          }}
        >
          {shortcut}
        </span>
      )}
    </div>
  );
};

export const CommandMenuItem = ({
  state = "idle",
  style,
  label = "Settings",
  icon = "settings",
  shortcut,
  width = ROW_WIDTH,
  theme: themeOverride,
  className,
}: CommandMenuItemProps) => {
  const theme = useFramecnTheme(themeOverride);
  const ctx = commandMenuItemStyleContext(theme);
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
      <CommandMenuItemRow
        style={style}
        state={state}
        ctx={ctx}
        label={label}
        icon={icon}
        shortcut={shortcut}
        width={width}
        radius={theme.radius}
      />
    </div>
  );
};
