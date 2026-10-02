"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  DropdownMenuItemRow,
  dropdownMenuItemStyle,
  dropdownMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";
import type {
  DropdownMenuItemState,
  DropdownMenuItemStyle,
  DropdownMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";

export type ContextMenuState = "opened" | "closed";

export interface ContextMenuProps {
  state?: ContextMenuState;
  style?: ContextMenuStyle;
  items?: string[];
  highlightedIndex?: number;
  pressedIndex?: number;
  itemStyles?: (DropdownMenuItemStyle | undefined)[];
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const WIDTH = 200;

export interface ContextMenuStyle {
  opacity: number;
  scale: number;
  translateY: number;
}

export interface ContextMenuStyleContext {
  panelBg: string;
  panelBorder: string;
  radius: number;
  itemCtx: DropdownMenuItemStyleContext;
}

export const contextMenuStyleContext = (
  theme: FramecnTheme
): ContextMenuStyleContext => ({
  itemCtx: dropdownMenuItemStyleContext(theme),
  panelBg: theme.popover,
  panelBorder: theme.border,
  radius: theme.radius,
});

export const contextMenuStyle = (
  state: ContextMenuState,
  _ctx: ContextMenuStyleContext
): ContextMenuStyle => {
  switch (state) {
    case "opened": {
      return { opacity: 1, scale: 1, translateY: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.95, translateY: -8 };
    }
  }
};

const rowState = (
  i: number,
  highlightedIndex: number,
  pressedIndex: number
): DropdownMenuItemState => {
  if (i === pressedIndex) {
    return "press";
  }
  if (i === highlightedIndex) {
    return "hover";
  }
  return "idle";
};

export const ContextMenu = ({
  state = "closed",
  style,
  items = ["Back", "Reload", "Save As…", "Inspect"],
  highlightedIndex = -1,
  pressedIndex = -1,
  itemStyles,
  theme: themeOverride,
  className,
}: ContextMenuProps) => {
  const theme = useFramecnTheme(themeOverride);
  const ctx = contextMenuStyleContext(theme);
  const v = style ?? contextMenuStyle(state, ctx);
  return (
    <div
      className={className}
      style={{
        background: ctx.panelBg,
        border: `1px solid ${ctx.panelBorder}`,
        borderRadius: Math.max(0, ctx.radius - 2),
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 0,
        opacity: v.opacity,
        padding: 4,
        transform: `translateY(${v.translateY}px) scale(${v.scale})`,
        transformOrigin: "top left",
        width: WIDTH,
      }}
    >
      {items.map((item, i) => {
        const override = itemStyles?.[i];
        const rowStyle =
          override ??
          dropdownMenuItemStyle(
            rowState(i, highlightedIndex, pressedIndex),
            ctx.itemCtx
          );
        return (
          <DropdownMenuItemRow
            key={item}
            style={rowStyle}
            label={item}
            width="100%"
            theme={themeOverride}
          />
        );
      })}
    </div>
  );
};
