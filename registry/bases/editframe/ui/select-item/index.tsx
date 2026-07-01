"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  selectItemKeyframes,
  selectItemAnimation,
} from "@/registry/bases/editframe/ui/select-item/use-select-item-transition";

export type SelectItemState = "idle" | "hover" | "press" | "selected";

export interface SelectItemProps {
  state?: SelectItemState;
  from?: SelectItemState;
  style?: SelectItemStyle;
  label?: string;
  width?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
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
  selectedFg: string;
  check: string;
}

export const selectItemStyleContext = (
  theme: FramecnTheme
): SelectItemStyleContext => ({
  check: theme.primary,
  hoverBg: theme.accent,
  idleBg: theme.popover,
  idleFg: theme.popoverForeground,
  pressBg: mixOklch(theme.accent, theme.foreground, 0.08),
  selectedBg: theme.accent,
  selectedFg: theme.accentForeground,
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
        labelColor: ctx.idleFg,
        scale: 1,
      };
    }
    case "press": {
      return {
        background: ctx.pressBg,
        checkOpacity: 0,
        labelColor: ctx.idleFg,
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
  from?: SelectItemState;
  ctx: SelectItemStyleContext;
  label: string;
  width: number;
  radius: number;
  check: string;
  duration?: string;
}

export function SelectItemRow({
  style,
  state = "idle",
  from,
  ctx,
  label,
  width,
  radius,
  check,
  duration = "8frames",
}: SelectItemRowProps) {
  const v = style ?? selectItemStyle(state, ctx);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? selectItemStyle(from, ctx) : v;
  const anim = hasAnimation
    ? selectItemAnimation(from, state, duration, fromStyle, v)
    : { background: "none", checkOpacity: "none", scale: "none" };

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
      {hasAnimation && <style>{selectItemKeyframes(fromStyle, v)}</style>}
      <span>{label}</span>
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        style={{
          animation: hasAnimation ? anim.checkOpacity : undefined,
          flexShrink: 0,
          opacity: v.checkOpacity,
        }}
      >
        <path
          d="M5 12.5l4.5 4.5L19 7"
          stroke={check}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function SelectItem({
  state = "idle",
  from,
  style,
  label = "Banana",
  width = ROW_WIDTH,
  theme: themeOverride,
  className,
  duration = "8frames",
}: SelectItemProps) {
  const theme = useFramecnTheme(themeOverride, "light");
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
        from={from}
        ctx={ctx}
        label={label}
        width={width}
        radius={theme.radius}
        check={ctx.check}
        duration={duration}
      />
    </div>
  );
}
