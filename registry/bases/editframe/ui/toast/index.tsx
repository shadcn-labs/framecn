"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  toastKeyframes,
  toastAnimation,
} from "@/registry/bases/editframe/ui/toast/use-toast-transition";

export type ToastState = "hidden" | "visible";

export type ToastVariant = "default" | "success" | "error";

export interface ToastProps {
  state?: ToastState;
  from?: ToastState;
  style?: ToastStyle;
  title: string;
  description?: string;
  variant?: ToastVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
}

const TOAST_WIDTH = 356;

export interface ToastStyle {
  opacity: number;
  translateY: number;
  scale: number;
}

export interface ToastStyleContext {
  iconColor: string;
}

export const toastStyleContext = (
  variant: ToastVariant,
  theme: FramecnTheme
): ToastStyleContext => {
  if (variant === "success") {
    return { iconColor: "oklch(0.6 0.17 150)" };
  }
  if (variant === "error") {
    return { iconColor: theme.destructive };
  }
  return { iconColor: theme.mutedForeground };
};

export const toastStyle = (state: ToastState): ToastStyle => {
  switch (state) {
    case "visible": {
      return { opacity: 1, scale: 1, translateY: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.97, translateY: 16 };
    }
  }
};

const ToastIcon = ({
  variant,
  color,
}: {
  variant: ToastVariant;
  color: string;
}) => {
  if (variant === "success") {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <path
          d="M8 12.5l2.6 2.6L16 9"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <path
          d="M12 7.5v5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1.1" fill={color} />
      </svg>
    );
  }
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M12 11v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.1" fill={color} />
    </svg>
  );
};

export const Toast = ({
  state = "hidden",
  from,
  style,
  title,
  description,
  variant = "default",
  theme: themeOverride,
  className,
  duration = "12frames",
}: ToastProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = toastStyleContext(variant, theme);
  const v = style ?? toastStyle(state);

  const hasAnimation = from && from !== state;
  const fromStyle = hasAnimation ? toastStyle(from) : v;
  const anim = hasAnimation
    ? toastAnimation(from, state, duration, fromStyle, v)
    : { opacity: "none", transform: "none" };

  return (
    <div
      className={className}
      style={{
        alignItems: description ? "flex-start" : "center",

        animation: hasAnimation
          ? `${anim.opacity}, ${anim.transform}`
          : undefined,
        background: theme.popover,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius,
        boxShadow:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        color: theme.popoverForeground,
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 12,
        opacity: v.opacity,
        padding: "16px",
        transform: `translateY(${v.translateY}px) scale(${v.scale})`,
        transformOrigin: "bottom center",
        width: TOAST_WIDTH,
      }}
    >
      <style>{hasAnimation ? toastKeyframes(fromStyle, v) : ""}</style>
      <span
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          marginTop: description ? 1 : 0,
        }}
      >
        <ToastIcon variant={variant} color={ctx.iconColor} />
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {title}
        </span>
        {description !== undefined && (
          <span
            style={{
              color: theme.mutedForeground,
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
