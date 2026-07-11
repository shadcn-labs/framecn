"use client";

import type { ReactNode } from "react";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type ResizableHandleState = "idle" | "hover" | "press";

export type ResizableDirection = "horizontal" | "vertical";

export interface ResizableStyle {
  ratio: number;
  handleScale: number;
  handleRingOpacity: number;
}

export interface ResizableProps {
  first?: ReactNode;
  second?: ReactNode;
  direction?: ResizableDirection;
  ratio?: number;
  handleState?: ResizableHandleState;
  style?: ResizableStyle;
  minRatio?: number;
  maxRatio?: number;
  width?: number;
  height?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const DIVIDER = 1;
const GRIP_LONG = 24;
const GRIP_SHORT = 4;
const RING_WIDTH = 4;

const clampRatio = (
  ratio: number,
  minRatio: number,
  maxRatio: number
): number => Math.min(maxRatio, Math.max(minRatio, ratio));
export const resizableHandleStyle = (
  handleState: ResizableHandleState
): {
  handleScale: number;
  handleRingOpacity: number;
} => {
  switch (handleState) {
    case "hover": {
      return { handleRingOpacity: 1, handleScale: 1.15 };
    }
    case "press": {
      return { handleRingOpacity: 1, handleScale: 1.25 };
    }
    default: {
      return { handleRingOpacity: 0, handleScale: 1 };
    }
  }
};

export interface ResizableStyleContext {
  containerBg: string;
  border: string;
  panelBg: string;
  grip: string;
  ring: string;
  placeholderFg: string;
  radius: number;
}

export const resizableStyleContext = (
  theme: FramecnTheme
): ResizableStyleContext => ({
  border: theme.border,
  containerBg: theme.background,
  grip: theme.border,
  panelBg: theme.muted,
  placeholderFg: theme.mutedForeground,
  radius: theme.radius,
  ring: mixOklch(theme.ring, theme.background, 0.6),
});

export const resizableStyle = (
  ratio: number,
  handleState: ResizableHandleState
): ResizableStyle => {
  const handle = resizableHandleStyle(handleState);
  return {
    handleRingOpacity: handle.handleRingOpacity,
    handleScale: handle.handleScale,
    ratio,
  };
};

const Placeholder = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      alignItems: "center",
      color,
      display: "flex",
      fontSize: 13,
      fontWeight: 500,
      height: "100%",
      justifyContent: "center",
      letterSpacing: "-0.01em",
      width: "100%",
    }}
  >
    {label}
  </div>
);

export const Resizable = ({
  first,
  second,
  direction = "horizontal",
  ratio = 0.5,
  handleState = "idle",
  style,
  minRatio = 0.15,
  maxRatio = 0.85,
  width = 440,
  height = 240,
  theme: themeOverride,
  className,
}: ResizableProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = resizableStyleContext(theme);
  const v = style ?? resizableStyle(ratio, handleState);
  const pct = clampRatio(v.ratio, minRatio, maxRatio) * 100;
  const isHorizontal = direction === "horizontal";
  const gripW = isHorizontal ? GRIP_SHORT : GRIP_LONG;
  const gripH = isHorizontal ? GRIP_LONG : GRIP_SHORT;
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
      <div
        style={{
          background: ctx.containerBg,
          border: `1px solid ${ctx.border}`,
          borderRadius: ctx.radius,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          height,
          overflow: "hidden",
          position: "relative",
          width,
        }}
      >
        <div
          style={{
            background: ctx.panelBg,
            flex: "none",
            [isHorizontal ? "width" : "height"]: `${pct}%`,
            overflow: "hidden",
          }}
        >
          {first ?? <Placeholder label="Panel one" color={ctx.placeholderFg} />}
        </div>

        <div
          style={{
            background: ctx.border,
            flex: "none",
            position: "relative",
            [isHorizontal ? "width" : "height"]: DIVIDER,
          }}
        >
          <div
            style={{
              background: ctx.ring,
              borderRadius: 999,
              height: gripH + RING_WIDTH * 2,
              left: "50%",
              opacity: v.handleRingOpacity,
              position: "absolute",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${v.handleScale})`,
              width: gripW + RING_WIDTH * 2,
            }}
          />

          <div
            style={{
              background: ctx.grip,
              borderRadius: 999,
              height: gripH,
              left: "50%",
              position: "absolute",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${v.handleScale})`,
              width: gripW,
            }}
          />
        </div>

        <div
          style={{
            background: ctx.panelBg,
            flex: "1 1 0",
            overflow: "hidden",
          }}
        >
          {second ?? (
            <Placeholder label="Panel two" color={ctx.placeholderFg} />
          )}
        </div>
      </div>
    </div>
  );
};
