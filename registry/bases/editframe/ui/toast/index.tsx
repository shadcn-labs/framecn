"use client";

import { FramecnIcon, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type ToastState = "hidden" | "visible";

export type ToastVariant = "default" | "success" | "error";

export interface ToastProps {
  state?: ToastState;
  style?: ToastStyle;
  title: string;
  description?: string;
  variant?: ToastVariant;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const TOAST_WIDTH = 356;

export interface ToastStyle {
  opacity: number;
  translateY: number;
  scale: number;
}

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

export const Toast = ({
  state = "hidden",
  style,
  title,
  description,
  variant = "default",
  theme: themeOverride,
  className,
}: ToastProps) => {
  const theme = useFramecnTheme(themeOverride);
  const v = style ?? toastStyle(state);
  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        background: theme.popover,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius,
        boxShadow: "0 4px 12px rgb(0 0 0 / 10%)",
        boxSizing: "border-box",
        color: theme.popoverForeground,
        display: "flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 10,
        opacity: v.opacity,
        padding: "16px",
        transform: `translateY(${v.translateY}px) scale(${v.scale})`,
        transformOrigin: "bottom center",
        width: TOAST_WIDTH,
      }}
    >
      {variant !== "default" && (
        <span
          style={{
            alignItems: "center",
            display: "flex",
            flexShrink: 0,
            justifyContent: "center",
            marginLeft: -3,
          }}
        >
          <FramecnIcon
            name={variant === "success" ? "CircleCheck" : "OctagonX"}
            size={16}
            color={theme.popoverForeground}
            style={{ marginLeft: -1 }}
          />
        </span>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "19.5px",
          }}
        >
          {title}
        </span>
        {description !== undefined && (
          <span
            style={{
              color: theme.mutedForeground,
              fontSize: 13,
              lineHeight: "18.2px",
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
