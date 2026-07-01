"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  commandMenuItemKeyframes,
  commandMenuItemAnimation,
} from "@/registry/bases/editframe/ui/command-menu-item/use-command-menu-item-transition";

export type CommandMenuItemState = "idle" | "hover" | "press" | "selected";

export interface CommandMenuItemProps {
  state?: CommandMenuItemState;
  from?: CommandMenuItemState;
  style?: CommandMenuItemStyle;
  label?: string;
  icon?: CommandMenuIcon;
  shortcut?: string;
  width?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
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
  kbdBg: string;
  kbdFg: string;
  kbdBorder: string;
}

export const commandMenuItemStyleContext = (
  theme: FramecnTheme
): CommandMenuItemStyleContext => ({
  hoverBg: theme.accent,
  idleBg: theme.popover,
  idleFg: theme.popoverForeground,
  idleIcon: theme.mutedForeground,
  kbdBg: theme.muted,
  kbdBorder: theme.border,
  kbdFg: theme.mutedForeground,
  pressBg: mixOklch(theme.accent, theme.foreground, 0.08),
  selectedBg: theme.accent,
  selectedFg: theme.accentForeground,
  selectedIcon: theme.foreground,
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
        labelColor: ctx.idleFg,
        scale: 1,
      };
    }
    case "press": {
      return {
        background: ctx.pressBg,
        iconColor: ctx.selectedIcon,
        labelColor: ctx.idleFg,
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

const ICON_PATHS: Record<CommandMenuIcon, string> = {
  file: "M7 3h7l4 4v14H7ZM14 3v4h4",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.5-3.5",
  settings:
    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 2v3 M12 19v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M2 12h3 M19 12h3 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0",
};

const CommandMenuItemIcon = ({
  icon,
  color,
}: {
  icon: CommandMenuIcon;
  color: string;
}) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <path
      d={ICON_PATHS[icon]}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CommandMenuItemRowProps {
  style?: CommandMenuItemStyle;
  state?: CommandMenuItemState;
  from?: CommandMenuItemState;
  ctx: CommandMenuItemStyleContext;
  label: string;
  icon?: CommandMenuIcon;
  shortcut?: string;
  width: number;
  radius: number;
  duration?: string;
}

export const CommandMenuItemRow = ({
  style,
  state = "idle",
  from,
  ctx,
  label,
  icon,
  shortcut,
  width,
  radius,
  duration = "8frames",
}: CommandMenuItemRowProps) => {
  const v = style ?? commandMenuItemStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? commandMenuItemStyle(from, ctx) : v;
  const anim = hasAnimation
    ? commandMenuItemAnimation(from, state, duration, fromStyle, v)
    : { background: "none", iconColor: "none", scale: "none" };

  return (
    <div
      className={undefined}
      style={{
        alignItems: "center",
        animation: hasAnimation
          ? `${anim.background}, ${anim.scale}`
          : undefined,
        background: v.background,
        borderRadius: radius,
        boxSizing: "border-box",
        color: v.labelColor,
        display: "flex",
        fontSize: 14,
        gap: 12,
        justifyContent: "space-between",
        letterSpacing: "-0.01em",
        padding: "8px 12px",
        transform: `scale(${v.scale})`,
        width,
      }}
    >
      {hasAnimation && <style>{commandMenuItemKeyframes(fromStyle, v)}</style>}
      <span
        style={{
          alignItems: "center",
          display: "flex",
          gap: 10,
          minWidth: 0,
        }}
      >
        {icon !== undefined && (
          <span
            style={{
              animation: hasAnimation ? anim.iconColor : undefined,
              display: "flex",
              flexShrink: 0,
            }}
          >
            <CommandMenuItemIcon icon={icon} color={v.iconColor} />
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
        <kbd
          style={{
            alignItems: "center",
            background: ctx.kbdBg,
            border: `1px solid ${ctx.kbdBorder}`,
            borderRadius: Math.max(4, radius - 4),
            color: ctx.kbdFg,
            display: "inline-flex",
            flexShrink: 0,
            fontFamily: "inherit",
            fontSize: 12,
            gap: 2,
            height: 20,
            letterSpacing: "0.05em",
            padding: "0 6px",
          }}
        >
          {shortcut}
        </kbd>
      )}
    </div>
  );
};

export const CommandMenuItem = ({
  state = "idle",
  from,
  style,
  label = "Settings",
  icon = "settings",
  shortcut,
  width = ROW_WIDTH,
  theme: themeOverride,
  className,
  duration = "8frames",
}: CommandMenuItemProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
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
        from={from}
        ctx={ctx}
        label={label}
        icon={icon}
        shortcut={shortcut}
        width={width}
        radius={theme.radius}
        duration={duration}
      />
    </div>
  );
};
