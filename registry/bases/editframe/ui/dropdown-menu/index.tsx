"use client";

import { FramecnIcon, useFramecnMode, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  buttonStyle,
  buttonStyleContext,
} from "@/registry/bases/editframe/ui/button";
import type {
  ButtonStyle,
  ButtonStyleContext,
} from "@/registry/bases/editframe/ui/button";
import {
  DropdownMenuItemRow,
  dropdownMenuItemStyle,
  dropdownMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";
import type {
  DropdownMenuItemStyle,
  DropdownMenuItemStyleContext,
} from "@/registry/bases/editframe/ui/dropdown-menu-item";

export type DropdownMenuState = "opened" | "closed";

export interface DropdownMenuStyle {
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
  chevronRotation: number;
}

export interface DropdownMenuStyleContext {
  triggerCtx: ButtonStyleContext;
  panelBg: string;
  panelBorder: string;
  triggerFg: string;
  mutedFg: string;
  radius: number;
  itemCtx: DropdownMenuItemStyleContext;
}

export const dropdownMenuStyleContext = (
  theme: FramecnTheme,
  mode: "light" | "dark" = "light"
): DropdownMenuStyleContext => ({
  itemCtx: dropdownMenuItemStyleContext(theme),
  mutedFg: theme.mutedForeground,
  panelBg: theme.popover,
  panelBorder: theme.border,
  radius: theme.radius,
  triggerCtx: buttonStyleContext("outline", theme, mode),
  triggerFg: theme.foreground,
});

export const dropdownMenuStyle = (
  state: DropdownMenuState,
  _ctx: DropdownMenuStyleContext
): DropdownMenuStyle => {
  switch (state) {
    case "opened": {
      return {
        chevronRotation: 180,
        panelOpacity: 1,
        panelScale: 1,
        panelTranslateY: 0,
      };
    }
    default: {
      return {
        chevronRotation: 0,
        panelOpacity: 0,
        panelScale: 0.95,
        panelTranslateY: -8,
      };
    }
  }
};

const WIDTH = 240;

export interface DropdownMenuProps {
  state?: DropdownMenuState;
  style?: DropdownMenuStyle;
  label?: string;
  items?: string[];
  highlightedIndex?: number;
  pressedIndex?: number;
  itemStyles?: (DropdownMenuItemStyle | undefined)[];
  triggerStyle?: ButtonStyle;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

export const DropdownMenu = ({
  state = "closed",
  style,
  label = "Options",
  items = ["Profile", "Billing", "Settings", "Log out"],
  highlightedIndex = -1,
  pressedIndex = -1,
  itemStyles,
  triggerStyle,
  theme: themeOverride,
  className,
}: DropdownMenuProps) => {
  const theme = useFramecnTheme(themeOverride);
  const mode = useFramecnMode();
  const ctx = dropdownMenuStyleContext(theme, mode);
  const v = style ?? dropdownMenuStyle(state, ctx);
  const trigger = triggerStyle ?? buttonStyle("idle", ctx.triggerCtx);
  return (
    <div
      className={className}
      style={{
        alignItems: "flex-start",
        background: "transparent",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: "center",
        paddingTop: 220,
        position: "absolute",
      }}
    >
      <div style={{ position: "relative", width: WIDTH }}>
        <div
          style={{
            alignItems: "center",
            background: trigger.background,
            border: `1px solid ${ctx.panelBorder}`,
            borderRadius: Math.max(0, ctx.radius - 2),
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 5%)",
            boxSizing: "border-box",
            color: ctx.triggerFg,
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            gap: 8,
            height: 36,
            justifyContent: "space-between",
            lineHeight: "20px",
            padding: "0 16px",
            transform: `translateY(${trigger.translateY}px) scale(${trigger.scale})`,
            width: WIDTH,
          }}
        >
          <span>{label}</span>
          <FramecnIcon
            name="ChevronDown"
            size={16}
            color={ctx.mutedFg}
            style={{
              flexShrink: 0,
              transform: `rotate(${v.chevronRotation}deg)`,
            }}
          />
        </div>

        <div
          style={{
            background: ctx.panelBg,
            border: `1px solid ${ctx.panelBorder}`,
            borderRadius: Math.max(0, ctx.radius - 2),
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            left: 0,
            opacity: v.panelOpacity,
            padding: 4,
            position: "absolute",
            top: "calc(100% + 4px)",
            transform: `translateY(${v.panelTranslateY}px) scale(${v.panelScale})`,
            transformOrigin: "top",
            width: WIDTH,
          }}
        >
          {items.map((item, i) => {
            const override = itemStyles?.[i];
            const rowState = (() => {
              if (i === pressedIndex) {
                return "press";
              }
              if (i === highlightedIndex) {
                return "hover";
              }
              return "idle";
            })();
            const rowStyle =
              override ?? dropdownMenuItemStyle(rowState, ctx.itemCtx);
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
      </div>
    </div>
  );
};
