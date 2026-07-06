"use client";

import { revealedText, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  CommandMenuItemRow,
  commandMenuItemStyle,
  commandMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/command-menu-item";
import type {
  CommandMenuIcon,
  CommandMenuItemState,
  CommandMenuItemStyle,
  CommandMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/command-menu-item";

export type CommandMenuState = "opened" | "closed";

export interface CommandMenuEntry {
  icon?: CommandMenuIcon;
  label: string;
  shortcut?: string;
}

export interface CommandMenuProps {
  state?: CommandMenuState;
  style?: CommandMenuStyle;
  query?: string;
  revealCount?: number;
  items?: CommandMenuEntry[];
  selectedIndex?: number;
  highlightedIndex?: number;
  pressedIndex?: number;
  itemStyles?: (CommandMenuItemStyle | undefined)[];
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const PANEL_WIDTH = 440;
const CONTENT_WIDTH = PANEL_WIDTH - 16;
const MAX_OVERLAY_ALPHA = 0.5;

export const filterCommandItems = (
  items: CommandMenuEntry[],
  query: string,
  revealCount?: number
): CommandMenuEntry[] => {
  const visible = (
    revealCount === undefined ? query : revealedText(query, revealCount)
  )
    .trim()
    .toLowerCase();
  if (visible === "") {
    return items;
  }
  return items.filter((item) => item.label.toLowerCase().includes(visible));
};

export interface CommandMenuStyle {
  backdropOpacity: number;
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
}

export interface CommandMenuStyleContext {
  panelBg: string;
  panelBorder: string;
  inputFg: string;
  placeholderFg: string;
  mutedFg: string;
  divider: string;
  caret: string;
  radius: number;
  itemCtx: CommandMenuItemStyleContext;
}

export const commandMenuStyleContext = (
  theme: FramecnTheme
): CommandMenuStyleContext => ({
  caret: theme.foreground,
  divider: theme.border,
  inputFg: theme.popoverForeground,
  itemCtx: commandMenuItemStyleContext(theme),
  mutedFg: theme.mutedForeground,
  panelBg: theme.popover,
  panelBorder: theme.border,
  placeholderFg: theme.mutedForeground,
  radius: theme.radius,
});

export const commandMenuStyle = (
  state: CommandMenuState,
  _ctx: CommandMenuStyleContext
): CommandMenuStyle => {
  switch (state) {
    case "opened": {
      return {
        backdropOpacity: 1,
        panelOpacity: 1,
        panelScale: 1,
        panelTranslateY: 0,
      };
    }
    default: {
      return {
        backdropOpacity: 0,
        panelOpacity: 0,
        panelScale: 0.96,
        panelTranslateY: 8,
      };
    }
  }
};

const rowState = (
  i: number,
  selectedIndex: number,
  highlightedIndex: number,
  pressedIndex: number
): CommandMenuItemState => {
  if (i === pressedIndex) {
    return "press";
  }
  if (i === selectedIndex) {
    return "selected";
  }
  if (i === highlightedIndex) {
    return "hover";
  }
  return "idle";
};

export const CommandMenu = ({
  state = "closed",
  style,
  query = "",
  revealCount,
  items = [
    { icon: "user", label: "Profile", shortcut: "⌘ P" },
    { icon: "settings", label: "Settings", shortcut: "⌘ S" },
    { icon: "file", label: "New File", shortcut: "⌘ N" },
    { icon: "search", label: "Search docs" },
  ],
  selectedIndex = -1,
  highlightedIndex = -1,
  pressedIndex = -1,
  itemStyles,
  theme: themeOverride,
  className,
}: CommandMenuProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = commandMenuStyleContext(theme);
  const v = style ?? commandMenuStyle(state, ctx);
  const visibleQuery =
    revealCount === undefined ? query : revealedText(query, revealCount);
  const filtered = filterCommandItems(items, query, revealCount);
  return (
    <div
      style={{
        alignItems: "flex-start",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
        paddingTop: "18%",
        position: "absolute",
      }}
    >
      <div
        style={{
          background: `rgba(0, 0, 0, ${MAX_OVERLAY_ALPHA * v.backdropOpacity})`,
          inset: 0,
          position: "absolute",
        }}
      />
      <div
        className={className}
        style={{
          background: ctx.panelBg,
          border: `1px solid ${ctx.panelBorder}`,
          borderRadius: ctx.radius + 6,
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.25)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          opacity: v.panelOpacity,
          padding: 8,
          position: "relative",
          transform: `translateY(${v.panelTranslateY}px) scale(${v.panelScale})`,
          transformOrigin: "top",
          width: PANEL_WIDTH,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 10,
            padding: "8px 10px",
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path
              d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.5-3.5"
              stroke={ctx.mutedFg}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              alignItems: "center",
              color: visibleQuery ? ctx.inputFg : ctx.placeholderFg,
              display: "flex",
              fontSize: 15,
              letterSpacing: "-0.01em",
            }}
          >
            {visibleQuery || "Type a command or search…"}

            <span
              style={{
                background: ctx.caret,
                display: "inline-block",
                height: 18,
                marginLeft: 1,
                width: 1.5,
              }}
            />
          </span>
        </div>

        <div
          style={{
            background: ctx.divider,
            height: 1,
            margin: "4px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "4px 0",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                color: ctx.mutedFg,
                fontSize: 14,
                padding: "20px 12px",
                textAlign: "center",
              }}
            >
              No results found.
            </div>
          ) : (
            filtered.map((item, i) => {
              const override = itemStyles?.[i];
              return (
                <CommandMenuItemRow
                  key={item.label}
                  style={
                    override ??
                    commandMenuItemStyle(
                      rowState(
                        i,
                        selectedIndex,
                        highlightedIndex,
                        pressedIndex
                      ),
                      ctx.itemCtx
                    )
                  }
                  ctx={ctx.itemCtx}
                  label={item.label}
                  icon={item.icon}
                  shortcut={item.shortcut}
                  width={CONTENT_WIDTH}
                  radius={theme.radius}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
