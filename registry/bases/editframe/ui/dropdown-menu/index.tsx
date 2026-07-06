"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
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
  theme: FramecnTheme
): DropdownMenuStyleContext => ({
  itemCtx: dropdownMenuItemStyleContext(theme),
  mutedFg: theme.mutedForeground,
  panelBg: theme.popover,
  panelBorder: theme.border,
  radius: theme.radius,
  triggerCtx: buttonStyleContext("outline", theme),
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
        panelScale: 0.96,
        panelTranslateY: -4,
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
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = dropdownMenuStyleContext(theme);
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
            borderRadius: ctx.radius,
            boxSizing: "border-box",
            color: ctx.triggerFg,
            display: "flex",
            fontSize: 15,
            fontWeight: 500,
            gap: 12,
            height: 40,
            justifyContent: "space-between",
            letterSpacing: "-0.01em",
            padding: "0 16px",
            transform: `translateY(${trigger.translateY}px) scale(${trigger.scale})`,
            width: WIDTH,
          }}
        >
          <span>{label}</span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              flexShrink: 0,
              transform: `rotate(${v.chevronRotation}deg)`,
            }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke={ctx.mutedFg}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            background: ctx.panelBg,
            border: `1px solid ${ctx.panelBorder}`,
            borderRadius: ctx.radius + 2,
            boxShadow: "0 12px 32px -8px rgba(0,0,0,0.18)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            left: 0,
            opacity: v.panelOpacity,
            padding: 4,
            position: "absolute",
            top: 48,
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
                width={WIDTH - 8}
                theme={themeOverride}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
