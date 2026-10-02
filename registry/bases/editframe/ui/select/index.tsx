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
  SelectItemRow,
  selectItemStyle,
  selectItemStyleContext,
} from "@/registry/bases/editframe/ui/select-item";
import type {
  SelectItemState,
  SelectItemStyle,
  SelectItemStyleContext,
} from "@/registry/bases/editframe/ui/select-item";

export type SelectState = "opened" | "closed";

export interface SelectProps {
  state?: SelectState;
  style?: SelectStyle;
  label?: string;
  triggerStyle?: ButtonStyle;
  items?: string[];
  selectedIndex?: number;
  highlightedIndex?: number;
  pressedIndex?: number;
  itemStyles?: (SelectItemStyle | undefined)[];
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const WIDTH = 260;

export interface SelectStyle {
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
  chevronRotation: number;
}

export interface SelectStyleContext {
  triggerCtx: ButtonStyleContext;
  panelBg: string;
  panelBorder: string;
  triggerFg: string;
  mutedFg: string;
  radius: number;
  itemCtx: SelectItemStyleContext;
}

export const selectStyleContext = (
  theme: FramecnTheme,
  mode: "light" | "dark" = "light"
): SelectStyleContext => ({
  itemCtx: selectItemStyleContext(theme),
  mutedFg: theme.mutedForeground,
  panelBg: theme.popover,
  panelBorder: theme.border,
  radius: theme.radius,
  triggerCtx: buttonStyleContext("outline", theme, mode),
  triggerFg: theme.foreground,
});

export const selectStyle = (
  state: SelectState,
  _ctx: SelectStyleContext
): SelectStyle => {
  switch (state) {
    case "opened": {
      return {
        chevronRotation: 0,
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

const rowState = (
  i: number,
  selectedIndex: number,
  highlightedIndex: number,
  pressedIndex: number
): SelectItemState => {
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

export const Select = ({
  state = "closed",
  style,
  label = "Select a fruit",
  triggerStyle,
  items = ["Apple", "Banana", "Orange", "Grape"],
  selectedIndex = -1,
  highlightedIndex = -1,
  pressedIndex = -1,
  itemStyles,
  theme: themeOverride,
  className,
}: SelectProps) => {
  const theme = useFramecnTheme(themeOverride);
  const mode = useFramecnMode();
  const ctx = selectStyleContext(theme, mode);
  const v = style ?? selectStyle(state, ctx);
  const trigger: ButtonStyle =
    triggerStyle ?? buttonStyle("idle", ctx.triggerCtx);
  const idleBackground =
    mode === "dark"
      ? `color-mix(in oklab, ${theme.input} 30%, transparent)`
      : "transparent";
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
      <div style={{ position: "relative", width: WIDTH }}>
        <div
          style={{
            alignItems: "center",
            background: triggerStyle ? trigger.background : idleBackground,
            border: `1px solid ${theme.input}`,
            borderRadius: Math.max(0, ctx.radius - 2),
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 5%)",
            boxSizing: "border-box",
            color: selectedIndex < 0 ? ctx.mutedFg : ctx.triggerFg,
            display: "flex",
            fontSize: 14,
            fontWeight: 400,
            gap: 8,
            height: 36,
            justifyContent: "space-between",
            lineHeight: "20px",
            padding: "0 12px",
            transform: `translateY(${trigger.translateY}px) scale(${trigger.scale})`,
            width: WIDTH,
          }}
        >
          <span>{items[selectedIndex] ?? label}</span>
          <FramecnIcon
            name="ChevronDown"
            size={16}
            color={ctx.mutedFg}
            style={{
              flexShrink: 0,
              opacity: 0.5,
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
            return (
              <SelectItemRow
                key={item}
                style={
                  override ??
                  selectItemStyle(
                    rowState(i, selectedIndex, highlightedIndex, pressedIndex),
                    ctx.itemCtx
                  )
                }
                ctx={ctx.itemCtx}
                label={item}
                width="100%"
                radius={theme.radius}
                check={ctx.itemCtx.check}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
