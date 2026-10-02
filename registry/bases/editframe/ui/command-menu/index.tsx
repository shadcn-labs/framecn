"use client";

import { FramecnIcon, revealedText, useFramecnTheme } from "@/lib/framecn-ui";
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

const PANEL_WIDTH = 512;
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
        panelScale: 0.95,
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
  const theme = useFramecnTheme(themeOverride);
  const ctx = commandMenuStyleContext(theme);
  const v = style ?? commandMenuStyle(state, ctx);
  const visibleQuery =
    revealCount === undefined ? query : revealedText(query, revealCount);
  const filtered = filterCommandItems(items, query, revealCount);
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
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
          borderRadius: ctx.radius,
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 32px)",
          opacity: v.panelOpacity,
          overflow: "hidden",
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
            gap: 8,
            height: 48,
            padding: "0 40px 0 12px",
          }}
        >
          <FramecnIcon
            name="Search"
            size={20}
            color={ctx.inputFg}
            style={{ opacity: 0.5 }}
          />
          <span
            style={{
              alignItems: "center",
              color: visibleQuery ? ctx.inputFg : ctx.placeholderFg,
              display: "flex",
              fontSize: 14,
              lineHeight: "20px",
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
          <button
            aria-label="Close"
            type="button"
            style={{
              background: "transparent",
              border: "none",
              borderRadius: 2,
              color: ctx.inputFg,
              display: "flex",
              opacity: 0.7,
              padding: 0,
              position: "absolute",
              right: 16,
              top: 16,
            }}
          >
            <FramecnIcon name="X" size={16} />
          </button>
        </div>

        <div
          style={{
            background: ctx.divider,
            height: 1,
            margin: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            maxHeight: 300,
            overflowY: "auto",
            padding: 8,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                color: ctx.mutedFg,
                fontSize: 14,
                padding: "24px 8px",
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
                  width="100%"
                  radius={theme.radius}
                  dialog
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
