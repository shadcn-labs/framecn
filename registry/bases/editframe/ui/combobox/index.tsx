"use client";

import { revealedText, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  inputStyle,
  inputStyleContext,
} from "@/registry/bases/editframe/ui/input";
import type {
  InputStyle,
  InputStyleContext,
} from "@/registry/bases/editframe/ui/input";
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

export type ComboboxState = "opened" | "closed";

export interface ComboboxProps {
  state?: ComboboxState;
  style?: ComboboxStyle;
  query?: string;
  revealCount?: number;
  placeholder?: string;
  items?: string[];
  selectedIndex?: number;
  highlightedIndex?: number;
  pressedIndex?: number;
  itemStyles?: (SelectItemStyle | undefined)[];
  inputStyle?: InputStyle;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const WIDTH = 280;

export const filterComboboxItems = (
  items: string[],
  query: string,
  revealCount?: number
): string[] => {
  const visible = (
    revealCount === undefined ? query : revealedText(query, revealCount)
  )
    .trim()
    .toLowerCase();
  if (visible === "") {
    return items;
  }
  return items.filter((item) => item.toLowerCase().includes(visible));
};

export interface ComboboxStyle {
  panelOpacity: number;
  panelScale: number;
  panelTranslateY: number;
}

export interface ComboboxStyleContext {
  triggerCtx: InputStyleContext;
  panelBg: string;
  panelBorder: string;
  mutedFg: string;
  radius: number;
  itemCtx: SelectItemStyleContext;
}

export const comboboxStyleContext = (
  theme: FramecnTheme
): ComboboxStyleContext => ({
  itemCtx: selectItemStyleContext(theme),
  mutedFg: theme.mutedForeground,
  panelBg: theme.popover,
  panelBorder: theme.border,
  radius: theme.radius,
  triggerCtx: inputStyleContext(theme),
});

export const comboboxStyle = (
  state: ComboboxState,
  _ctx: ComboboxStyleContext
): ComboboxStyle => {
  switch (state) {
    case "opened": {
      return { panelOpacity: 1, panelScale: 1, panelTranslateY: 0 };
    }
    default: {
      return { panelOpacity: 0, panelScale: 0.96, panelTranslateY: -4 };
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

export const Combobox = ({
  state = "closed",
  style,
  query = "",
  revealCount,
  placeholder = "Select a fruit…",
  items = ["Apple", "Banana", "Orange", "Grape"],
  selectedIndex = -1,
  highlightedIndex = -1,
  pressedIndex = -1,
  itemStyles,
  inputStyle: inputStyleOverride,
  theme: themeOverride,
  className,
}: ComboboxProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = comboboxStyleContext(theme);
  const v = style ?? comboboxStyle(state, ctx);
  const visibleQuery =
    revealCount === undefined ? query : revealedText(query, revealCount);
  const filtered = filterComboboxItems(items, query, revealCount);
  const trigger: InputStyle =
    inputStyleOverride ??
    inputStyle(visibleQuery ? "typing" : "idle", ctx.triggerCtx);
  const valueWidth = visibleQuery.length * 8;
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
            border: `1px solid ${trigger.borderColor}`,
            borderRadius: theme.radius,
            boxShadow: `0 0 0 ${trigger.ringWidth}px ${trigger.ringColor}`,
            boxSizing: "border-box",
            display: "flex",
            fontSize: 15,
            height: 40,
            letterSpacing: "-0.01em",
            padding: "0 14px",
            position: "relative",
            width: WIDTH,
          }}
        >
          <span
            style={{
              color: ctx.triggerCtx.mutedForeground,
              left: 14,
              opacity: trigger.valueReveal > 0 ? 0 : trigger.placeholderOpacity,
              pointerEvents: "none",
              position: "absolute",
              whiteSpace: "nowrap",
            }}
          >
            {placeholder}
          </span>

          <div style={{ alignItems: "center", display: "flex", minWidth: 0 }}>
            <span
              style={{
                color: ctx.triggerCtx.foreground,
                display: "inline-block",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: valueWidth * trigger.valueReveal,
              }}
            >
              {visibleQuery}
            </span>
            <span
              style={{
                background: ctx.triggerCtx.foreground,
                borderRadius: 1,
                flexShrink: 0,
                height: 17,
                opacity: trigger.caretOpacity,
                width: 2,
              }}
            />
          </div>
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
          {filtered.length === 0 ? (
            <div
              style={{
                color: ctx.mutedFg,
                fontSize: 14,
                padding: "12px",
                textAlign: "center",
              }}
            >
              No results found.
            </div>
          ) : (
            filtered.map((item, i) => {
              const override = itemStyles?.[i];
              return (
                <SelectItemRow
                  key={item}
                  style={
                    override ??
                    selectItemStyle(
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
                  label={item}
                  width={WIDTH - 8}
                  radius={theme.radius}
                  check={ctx.itemCtx.check}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
