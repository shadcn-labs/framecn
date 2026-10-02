"use client";

import { FramecnIcon, mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type SelectItemState = "idle" | "hover" | "press" | "selected";

export interface SelectItemProps {
  state?: SelectItemState;
  style?: SelectItemStyle;
  label?: string;
  width?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const ROW_WIDTH = 260;

export interface SelectItemStyle {
  background: string;
  labelColor: string;
  checkOpacity: number;
  scale: number;
}

export interface SelectItemStyleContext {
  idleBg: string;
  hoverBg: string;
  pressBg: string;
  selectedBg: string;
  idleFg: string;
  hoverFg: string;
  selectedFg: string;
  check: string;
}

export const selectItemStyleContext = (
  theme: FramecnTheme
): SelectItemStyleContext => ({
  check: theme.popoverForeground,
  hoverBg: theme.accent,
  hoverFg: theme.accentForeground,
  idleBg: theme.popover,
  idleFg: theme.popoverForeground,
  pressBg: mixOklch(theme.accent, theme.foreground, 0.08),
  selectedBg: theme.popover,
  selectedFg: theme.popoverForeground,
});

export const selectItemStyle = (
  state: SelectItemState,
  ctx: SelectItemStyleContext
): SelectItemStyle => {
  switch (state) {
    case "hover": {
      return {
        background: ctx.hoverBg,
        checkOpacity: 0,
        labelColor: ctx.hoverFg,
        scale: 1,
      };
    }
    case "press": {
      return {
        background: ctx.pressBg,
        checkOpacity: 0,
        labelColor: ctx.hoverFg,
        scale: 0.98,
      };
    }
    case "selected": {
      return {
        background: ctx.selectedBg,
        checkOpacity: 1,
        labelColor: ctx.selectedFg,
        scale: 1,
      };
    }
    default: {
      return {
        background: ctx.idleBg,
        checkOpacity: 0,
        labelColor: ctx.idleFg,
        scale: 1,
      };
    }
  }
};

export interface SelectItemRowProps {
  style?: SelectItemStyle;
  state?: SelectItemState;
  ctx: SelectItemStyleContext;
  label: string;
  width: number | string;
  radius: number;
  check: string;
}

export const SelectItemRow = ({
  style,
  state = "idle",
  ctx,
  label,
  width,
  radius,
  check,
}: SelectItemRowProps) => {
  const v = style ?? selectItemStyle(state, ctx);
  return (
    <div
      className={undefined}
      style={{
        alignItems: "center",
        background: v.background,
        borderRadius: Math.max(0, radius - 4),
        boxSizing: "border-box",
        color: v.labelColor,
        display: "flex",
        fontSize: 14,
        gap: 8,
        lineHeight: "20px",
        padding: "6px 32px 6px 8px",
        position: "relative",
        transform: `scale(${v.scale})`,
        width,
      }}
    >
      <span>{label}</span>
      <FramecnIcon
        name="Check"
        size={16}
        color={check}
        style={{ opacity: v.checkOpacity, position: "absolute", right: 8 }}
      />
    </div>
  );
};

export const SelectItem = ({
  state = "idle",
  style,
  label = "Banana",
  width = ROW_WIDTH,
  theme: themeOverride,
  className,
}: SelectItemProps) => {
  const theme = useFramecnTheme(themeOverride);
  const ctx = selectItemStyleContext(theme);
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
      <SelectItemRow
        style={style}
        state={state}
        ctx={ctx}
        label={label}
        width={width}
        radius={theme.radius}
        check={ctx.check}
      />
    </div>
  );
};
