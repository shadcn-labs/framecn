"use client";

import { mixOklch, revealedText, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Caret } from "@/registry/bases/editframe/ui/caret";

export type InputState =
  | "idle"
  | "hover"
  | "active"
  | "typing"
  | "blur"
  | "invalid";

type InputSize = "sm" | "default" | "lg";

export interface InputProps {
  state?: InputState;
  style?: InputStyle;
  placeholder?: string;
  value?: string;
  size?: InputSize;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  fullWidth?: boolean;
  className?: string;
}

const FIELD_WIDTH = 320;

const SIZE_STYLES: Record<
  InputSize,
  {
    height: number;
    padding: number;
    fontSize: number;
  }
> = {
  default: { fontSize: 15, height: 40, padding: 14 },
  lg: { fontSize: 17, height: 48, padding: 16 },
  sm: { fontSize: 13, height: 36, padding: 12 },
};

export interface InputStyle {
  borderColor: string;
  ringColor: string;
  ringWidth: number;
  background: string;
  caretOpacity: number;
  valueReveal: number;
  placeholderOpacity: number;
}

export interface InputStyleContext {
  idleBorder: string;
  hoverBorder: string;
  activeBorder: string;
  invalidBorder: string;
  ring: string;
  invalidRing: string;
  background: string;
  hoverBackground: string;
  foreground: string;
  mutedForeground: string;
}

export const inputStyleContext = (theme: FramecnTheme): InputStyleContext => ({
  activeBorder: theme.ring,
  background: theme.background,
  foreground: theme.foreground,
  hoverBackground: mixOklch(theme.background, theme.muted, 0.4),
  hoverBorder: mixOklch(theme.input, theme.foreground, 0.18),
  idleBorder: theme.input,
  invalidBorder: theme.destructive,
  invalidRing: mixOklch(theme.background, theme.destructive, 0.4),
  mutedForeground: theme.mutedForeground,
  ring: mixOklch(theme.background, theme.ring, 0.5),
});

export const inputStyle = (
  state: InputState,
  ctx: InputStyleContext
): InputStyle => {
  switch (state) {
    case "hover": {
      return {
        background: ctx.hoverBackground,
        borderColor: ctx.hoverBorder,
        caretOpacity: 0,
        placeholderOpacity: 1,
        ringColor: ctx.ring,
        ringWidth: 0,
        valueReveal: 0,
      };
    }
    case "active": {
      return {
        background: ctx.background,
        borderColor: ctx.activeBorder,
        caretOpacity: 1,
        placeholderOpacity: 1,
        ringColor: ctx.ring,
        ringWidth: 3,
        valueReveal: 0,
      };
    }
    case "typing": {
      return {
        background: ctx.background,
        borderColor: ctx.activeBorder,
        caretOpacity: 1,
        placeholderOpacity: 0,
        ringColor: ctx.ring,
        ringWidth: 3,
        valueReveal: 1,
      };
    }
    case "blur": {
      return {
        background: ctx.background,
        borderColor: ctx.idleBorder,
        caretOpacity: 0,
        placeholderOpacity: 0,
        ringColor: ctx.ring,
        ringWidth: 0,
        valueReveal: 1,
      };
    }
    case "invalid": {
      return {
        background: ctx.background,
        borderColor: ctx.invalidBorder,
        caretOpacity: 0,
        placeholderOpacity: 0,
        ringColor: ctx.invalidRing,
        ringWidth: 3,
        valueReveal: 1,
      };
    }
    default: {
      return {
        background: ctx.background,
        borderColor: ctx.idleBorder,
        caretOpacity: 0,
        placeholderOpacity: 1,
        ringColor: ctx.ring,
        ringWidth: 0,
        valueReveal: 0,
      };
    }
  }
};

export const Input = ({
  state = "idle",
  style,
  placeholder = "you@example.com",
  value = "remotion@remocn.dev",
  size = "default",
  theme: themeOverride,
  primary,
  fullWidth = false,
  className,
}: InputProps) => {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );
  const sizeStyle = SIZE_STYLES[size];
  const ctx = inputStyleContext(theme);
  const v = style ?? inputStyle(state, ctx);
  const revealed = revealedText(
    value,
    Math.round(value.length * v.valueReveal)
  );
  return (
    <div
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
      <div
        className={className}
        style={{
          alignItems: "center",
          background: v.background,
          border: `1px solid ${v.borderColor}`,
          borderRadius: theme.radius,
          boxShadow: `0 0 0 ${v.ringWidth}px ${v.ringColor}`,
          display: "flex",
          fontSize: sizeStyle.fontSize,
          height: sizeStyle.height,
          letterSpacing: "-0.01em",
          padding: `0 ${sizeStyle.padding}px`,
          position: "relative",
          width: fullWidth ? "100%" : FIELD_WIDTH,
        }}
      >
        <span
          style={{
            color: ctx.mutedForeground,
            left: sizeStyle.padding,
            opacity: v.valueReveal > 0 ? 0 : v.placeholderOpacity,
            pointerEvents: "none",
            position: "absolute",
            whiteSpace: "nowrap",
          }}
        >
          {placeholder}
        </span>

        <div style={{ alignItems: "center", display: "flex", minWidth: 0 }}>
          <span style={{ color: ctx.foreground, whiteSpace: "nowrap" }}>
            {revealed}
          </span>
          <Caret
            color={ctx.foreground}
            height={Math.round(sizeStyle.fontSize * 1.1)}
            radius={1}
            opacity={v.caretOpacity}
            marginLeft={revealed.length > 0 ? 4 : 0}
          />
        </div>
      </div>
    </div>
  );
};
