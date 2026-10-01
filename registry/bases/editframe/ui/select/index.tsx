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
  theme: FramecnTheme
): SelectStyleContext => ({
  itemCtx: selectItemStyleContext(theme),
  mutedFg: theme.mutedForeground,
  panelBg: theme.popover,
  panelBorder: theme.border,
  radius: theme.radius,
  triggerCtx: buttonStyleContext("outline", theme),
  triggerFg: theme.foreground,
});

export const selectStyle = (
  state: SelectState,
  _ctx: SelectStyleContext
): SelectStyle => {
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
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = selectStyleContext(theme);
  const v = style ?? selectStyle(state, ctx);
  const trigger: ButtonStyle =
    triggerStyle ?? buttonStyle("idle", ctx.triggerCtx);
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
            background: trigger.background,
            border: `1px solid ${ctx.panelBorder}`,
            borderRadius: ctx.radius,
            boxSizing: "border-box",
            color: ctx.triggerFg,
            display: "flex",
            fontSize: 15,
            fontWeight: 500,
            gap: 8,
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
            borderRadius: ctx.radius,
            boxShadow: "0 16px 32px -12px rgba(0,0,0,0.25)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            left: 0,
            opacity: v.panelOpacity,
            padding: 4,
            position: "absolute",
            top: "calc(100% + 6px)",
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
                width={WIDTH - 8}
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
