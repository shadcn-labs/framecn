"use client";

import {
  FramecnIcon,
  mixOklch,
  useFramecnMode,
  useFramecnTheme,
} from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Spinner } from "@/registry/bases/editframe/ui/spinner";

export type ButtonState = "idle" | "hover" | "press" | "loading" | "success";

type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost";

type ButtonSize = "sm" | "default" | "lg";

export interface ButtonProps {
  state?: ButtonState;
  style?: ButtonStyle;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  speed?: number;
  align?: "start" | "center" | "end";
  className?: string;
}
const justify = (align: "start" | "center" | "end"): string => {
  if (align === "start") {
    return "flex-start";
  }
  if (align === "end") {
    return "flex-end";
  }
  return "center";
};

const SIZE_STYLES: Record<
  ButtonSize,
  {
    height: number;
    padding: string;
    fontSize: number;
    gap: number;
  }
> = {
  default: { fontSize: 14, gap: 8, height: 36, padding: "0 16px" },
  lg: { fontSize: 14, gap: 8, height: 40, padding: "0 24px" },
  sm: { fontSize: 14, gap: 6, height: 32, padding: "0 12px" },
};

interface VariantTokens {
  bg: string;
  fg: string;
  hoverBg: string;
  border: string;
}
const variantTokens = (
  variant: ButtonVariant,
  theme: FramecnTheme,
  mode: "light" | "dark"
): VariantTokens => {
  const variants = {
    default: {
      bg: theme.primary,
      border: "transparent",
      fg: theme.primaryForeground,
      hoverBg: mixOklch(theme.primary, "transparent", 0.1),
    },
    destructive: {
      bg:
        mode === "dark"
          ? mixOklch(theme.destructive, "transparent", 0.4)
          : theme.destructive,
      border: "transparent",
      fg: theme.destructiveForeground,
      hoverBg: mixOklch(theme.destructive, "transparent", 0.1),
    },
    ghost: {
      bg: "transparent",
      border: "transparent",
      fg: theme.foreground,
      hoverBg:
        mode === "dark"
          ? mixOklch(theme.accent, "transparent", 0.5)
          : theme.accent,
    },
    outline: {
      bg:
        mode === "dark"
          ? mixOklch(theme.input, "transparent", 0.7)
          : theme.background,
      border: mode === "dark" ? theme.input : theme.border,
      fg: theme.foreground,
      hoverBg:
        mode === "dark"
          ? mixOklch(theme.input, "transparent", 0.5)
          : theme.accent,
    },
    secondary: {
      bg: theme.secondary,
      border: "transparent",
      fg: theme.secondaryForeground,
      hoverBg: mixOklch(theme.secondary, "transparent", 0.2),
    },
  };

  return variants[variant] ?? variants.default;
};

export interface ButtonStyle {
  translateY: number;
  scale: number;
  background: string;
  labelOpacity: number;
  spinnerOpacity: number;
  checkOpacity: number;
  hoverProgress?: number;
}

export interface ButtonStyleContext {
  restBg: string;
  hoverBg: string;
  pressBg: string;
  primary: string;
}

export const buttonStyleContext = (
  variant: ButtonVariant,
  theme: FramecnTheme,
  mode: "light" | "dark" = "light"
): ButtonStyleContext => {
  const tokens = variantTokens(variant, theme, mode);
  const restBg = tokens.bg;
  return {
    hoverBg: tokens.hoverBg,
    pressBg:
      tokens.bg === "transparent"
        ? tokens.hoverBg
        : mixOklch(tokens.hoverBg, theme.foreground, 0.08),
    primary: tokens.bg,
    restBg,
  };
};

export const buttonStyle = (
  state: ButtonState,
  ctx: ButtonStyleContext
): ButtonStyle => {
  switch (state) {
    case "hover": {
      return {
        background: ctx.hoverBg,
        checkOpacity: 0,
        hoverProgress: 1,
        labelOpacity: 1,
        scale: 1,
        spinnerOpacity: 0,
        translateY: -1,
      };
    }
    case "press": {
      return {
        background: ctx.pressBg,
        checkOpacity: 0,
        hoverProgress: 1,
        labelOpacity: 1,
        scale: 0.97,
        spinnerOpacity: 0,
        translateY: -1,
      };
    }
    case "loading": {
      return {
        background: ctx.hoverBg,
        checkOpacity: 0,
        hoverProgress: 1,
        labelOpacity: 0,
        scale: 1,
        spinnerOpacity: 1,
        translateY: -1,
      };
    }
    case "success": {
      return {
        background: ctx.primary,
        checkOpacity: 1,
        hoverProgress: 0,
        labelOpacity: 0,
        scale: 1,
        spinnerOpacity: 0,
        translateY: -1,
      };
    }
    default: {
      return {
        background: ctx.restBg,
        checkOpacity: 0,
        hoverProgress: 0,
        labelOpacity: 1,
        scale: 1,
        spinnerOpacity: 0,
        translateY: 0,
      };
    }
  }
};

export const Button = ({
  state = "idle",
  style,
  label = "Continue",
  variant = "default",
  size = "default",
  theme: themeOverride,
  primary,
  speed = 1,
  align = "center",
  className,
}: ButtonProps) => {
  const theme = useFramecnTheme({
    ...themeOverride,
    ...(primary ? { primary } : {}),
  });
  const mode = useFramecnMode();
  const sizeStyle = SIZE_STYLES[size];
  const tokens = variantTokens(variant, theme, mode);
  const ctx = buttonStyleContext(variant, theme, mode);
  const v = style ?? buttonStyle(state, ctx);
  const foreground =
    variant === "outline" || variant === "ghost"
      ? mixOklch(tokens.fg, theme.accentForeground, v.hoverProgress ?? 0)
      : tokens.fg;
  const iconSize = 16;
  return (
    <div
      style={{
        alignItems: "center",
        background: "transparent",
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        inset: 0,
        justifyContent: justify(align),
        position: "absolute",
      }}
    >
      <button
        type="button"
        className={className}
        style={{
          alignItems: "center",
          background: v.background,
          border:
            variant === "outline"
              ? `1px solid ${tokens.border}`
              : "1px solid transparent",
          borderRadius: Math.max(0, theme.radius - 2),
          boxShadow:
            variant === "outline" ? "0 1px 2px rgb(0 0 0 / 5%)" : undefined,
          boxSizing: "border-box",
          color: foreground,
          cursor: "pointer",
          display: "inline-flex",
          flexShrink: 0,
          fontSize: sizeStyle.fontSize,
          fontWeight: 500,
          gap: sizeStyle.gap,
          height: sizeStyle.height,
          justifyContent: "center",
          lineHeight: "20px",
          padding: sizeStyle.padding,
          position: "relative",
          transform: `translateY(${v.translateY}px) scale(${v.scale})`,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-flex", position: "relative" }}>
          <span style={{ opacity: v.labelOpacity }}>{label}</span>
          <span
            style={{
              alignItems: "center",
              display: "flex",
              inset: 0,
              justifyContent: "center",
              opacity: v.spinnerOpacity,
              position: "absolute",
            }}
          >
            <Spinner color={foreground} speed={speed} size={iconSize} />
          </span>
          <span
            style={{
              alignItems: "center",
              display: "flex",
              inset: 0,
              justifyContent: "center",
              opacity: v.checkOpacity,
              position: "absolute",
            }}
          >
            <FramecnIcon name="Check" size={iconSize} color={foreground} />
          </span>
        </span>
      </button>
    </div>
  );
};
