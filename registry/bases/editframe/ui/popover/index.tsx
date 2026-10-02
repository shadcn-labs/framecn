"use client";

import type { ReactNode } from "react";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type PopoverState = "opened" | "closed";

export type PopoverSide = "top" | "bottom" | "left" | "right";

export interface PopoverProps {
  state?: PopoverState;
  style?: PopoverStyle;
  title?: string;
  description?: string;
  children?: ReactNode;
  side?: PopoverSide;
  width?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

export interface PopoverStyle {
  opacity: number;
  scale: number;
  translate: number;
}

export const popoverStyle = (state: PopoverState): PopoverStyle => {
  switch (state) {
    case "opened": {
      return { opacity: 1, scale: 1, translate: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.95, translate: 8 };
    }
  }
};

const offsetFor = (
  side: PopoverSide,
  translate: number
): {
  x: number;
  y: number;
} => {
  switch (side) {
    case "bottom": {
      return { x: 0, y: -translate };
    }
    case "left": {
      return { x: translate, y: 0 };
    }
    case "right": {
      return { x: -translate, y: 0 };
    }
    default: {
      return { x: 0, y: translate };
    }
  }
};

export const Popover = ({
  state = "closed",
  style,
  title,
  description,
  children,
  side = "bottom",
  width = 288,
  theme: themeOverride,
  className,
}: PopoverProps) => {
  const theme = useFramecnTheme(themeOverride);
  const v = style ?? popoverStyle(state);
  const { x, y } = offsetFor(side, v.translate);
  const hasHeader = title !== undefined || description !== undefined;
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        opacity: v.opacity,
        transform: `translate(${x}px, ${y}px) scale(${v.scale})`,
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          background: theme.popover,
          border: `1px solid ${theme.border}`,
          borderRadius: Math.max(0, theme.radius - 2),
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)",
          boxSizing: "border-box",
          color: theme.popoverForeground,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: 16,
          textAlign: "left",
          width,
        }}
      >
        {title !== undefined && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            {title}
          </div>
        )}
        {description !== undefined && (
          <div
            style={{
              color: theme.mutedForeground,
              fontSize: 14,
              lineHeight: "20px",
            }}
          >
            {description}
          </div>
        )}

        {children !== undefined && (
          <div style={{ marginTop: hasHeader ? 4 : 0 }}>{children}</div>
        )}
      </div>
    </div>
  );
};
