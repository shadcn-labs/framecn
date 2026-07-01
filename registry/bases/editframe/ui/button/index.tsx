"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  buttonKeyframes,
  buttonAnimation,
} from "@/registry/bases/editframe/ui/button/use-button-transition";
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
  from?: ButtonState;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: Partial<FramecnTheme>;
  primary?: string;
  speed?: number;
  align?: "start" | "center" | "end";
  className?: string;
  duration?: string;
}
const justify = (align: "start" | "center" | "end"): string =>
  align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";

const CHECK_PATH_LENGTH = 14;

const SIZE_STYLES: Record<
  ButtonSize,
  { height: number; padding: string; fontSize: number; gap: number }
> = {
  default: { fontSize: 15, gap: 8, height: 40, padding: "0 20px" },
  lg: { fontSize: 17, gap: 10, height: 48, padding: "0 28px" },
  sm: { fontSize: 13, gap: 6, height: 32, padding: "0 12px" },
};

interface VariantTokens {
  bg: string;
  fg: string;
  hoverBg: string;
  border: string;
}
const variantTokens = (
  variant: ButtonVariant,
  theme: FramecnTheme
): VariantTokens => {
  const variants = {
    default: {
      bg: theme.primary,
      border: "transparent",
      fg: theme.primaryForeground,
      hoverBg: mixOklch(theme.primary, theme.foreground, 0.1),
    },
    destructive: {
      bg: theme.destructive,
      border: "transparent",
      fg: theme.destructiveForeground,
      hoverBg: mixOklch(theme.destructive, theme.foreground, 0.12),
    },
    ghost: {
      bg: "transparent",
      border: "transparent",
      fg: theme.foreground,
      hoverBg: theme.accent,
    },
    outline: {
      bg: "transparent",
      border: theme.border,
      fg: theme.foreground,
      hoverBg: theme.accent,
    },
    secondary: {
      bg: theme.secondary,
      border: "transparent",
      fg: theme.secondaryForeground,
      hoverBg: mixOklch(theme.secondary, theme.muted, 1),
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
}

export interface ButtonStyleContext {
  restBg: string;
  hoverBg: string;
  pressBg: string;
  primary: string;
}

export const buttonStyleContext = (
  variant: ButtonVariant,
  theme: FramecnTheme
): ButtonStyleContext => {
  const tokens = variantTokens(variant, theme);
  const restBg = tokens.bg === "transparent" ? theme.background : tokens.bg;
  return {
    hoverBg: tokens.hoverBg,
    pressBg:
      tokens.bg === "transparent"
        ? tokens.hoverBg
        : mixOklch(tokens.hoverBg, theme.foreground, 0.08),
    primary: theme.primary,
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
        labelOpacity: 1,
        scale: 1,
        spinnerOpacity: 0,
        translateY: 0,
      };
    }
  }
};

export function Button({
  state = "idle",
  from,
  label = "Continue",
  variant = "default",
  size = "default",
  theme: themeOverride,
  primary,
  speed = 1,
  align = "center",
  className,
  duration = "8frames",
}: ButtonProps) {
  const theme = useFramecnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    "light"
  );

  const sizeStyle = SIZE_STYLES[size];
  const tokens = variantTokens(variant, theme);

  const ctx = buttonStyleContext(variant, theme);
  const v = buttonStyle(state, ctx);
  const iconSize = Math.round(sizeStyle.fontSize * 1.1);

  const hasAnimation = from && from !== state;
  const anim = hasAnimation
    ? buttonAnimation(from, state, duration)
    : { container: "none", label: "none" };

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
      <style>{buttonKeyframes(ctx)}</style>
      <button
        type="button"
        className={className}
        style={{
          alignItems: "center",
          animation: hasAnimation ? anim.container : undefined,
          background: v.background,
          border:
            variant === "outline"
              ? `1px solid ${tokens.border}`
              : "1px solid transparent",
          borderRadius: theme.radius,
          color: tokens.fg,
          cursor: "pointer",
          display: "inline-flex",
          fontSize: sizeStyle.fontSize,
          fontWeight: 500,
          gap: sizeStyle.gap,
          height: sizeStyle.height,
          justifyContent: "center",
          letterSpacing: "-0.01em",
          padding: sizeStyle.padding,
          position: "relative",
          transform: `translateY(${v.translateY}px) scale(${v.scale})`,
        }}
      >
        <span style={{ display: "inline-flex", position: "relative" }}>
          <span
            style={{
              animation: hasAnimation ? anim.label : undefined,
              opacity: v.labelOpacity,
            }}
          >
            {label}
          </span>
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
            <Spinner color={tokens.fg} speed={speed} size={iconSize} />
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
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke={tokens.fg}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={CHECK_PATH_LENGTH}
                strokeDashoffset={0}
                pathLength={CHECK_PATH_LENGTH}
              />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
