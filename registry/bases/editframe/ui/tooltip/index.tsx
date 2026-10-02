"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type TooltipState = "hidden" | "visible";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  state?: TooltipState;
  style?: TooltipStyle;
  label: string;
  side?: TooltipSide;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const ARROW = 10;

export interface TooltipStyle {
  opacity: number;
  scale: number;
  translate: number;
}

export const tooltipStyle = (state: TooltipState): TooltipStyle => {
  switch (state) {
    case "visible": {
      return { opacity: 1, scale: 1, translate: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.95, translate: 8 };
    }
  }
};

const offsetFor = (
  side: TooltipSide,
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

export const Tooltip = ({
  state = "hidden",
  style,
  label,
  side = "top",
  theme: themeOverride,
  className,
}: TooltipProps) => {
  const theme = useFramecnTheme(themeOverride);
  const v = style ?? tooltipStyle(state);
  const bg = theme.foreground;
  const fg = theme.background;
  const { x, y } = offsetFor(side, v.translate);
  const arrowStyle: React.CSSProperties = {
    background: bg,
    borderRadius: 2,
    height: ARROW,
    position: "absolute",
    transform: "rotate(45deg)",
    width: ARROW,
    ...(side === "top" && {
      bottom: -ARROW / 2,
      left: "50%",
      marginLeft: -ARROW / 2,
    }),
    ...(side === "bottom" && {
      left: "50%",
      marginLeft: -ARROW / 2,
      top: -ARROW / 2,
    }),
    ...(side === "left" && {
      marginTop: -ARROW / 2,
      right: -ARROW / 2,
      top: "50%",
    }),
    ...(side === "right" && {
      left: -ARROW / 2,
      marginTop: -ARROW / 2,
      top: "50%",
    }),
  };
  return (
    <div
      className={className}
      style={{
        alignItems: "center",
        display: "inline-flex",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        opacity: v.opacity,
        position: "relative",
        transform: `translate(${x}px, ${y}px) scale(${v.scale})`,
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: Math.max(0, theme.radius - 2),
          color: fg,
          fontSize: 12,
          fontWeight: 400,
          lineHeight: "16px",
          padding: "6px 12px",
          position: "relative",
          whiteSpace: "nowrap",
        }}
      >
        {label}

        <span style={arrowStyle} />
      </div>
    </div>
  );
};
