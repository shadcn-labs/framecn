"use client";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";

export type ResizableHandleState = "idle" | "hover" | "active";

export interface ResizableStyle {
  ratio: number;
  handleScale: number;
  handleRingOpacity: number;
}

export interface ResizableStyleContext {
  background: string;
  border: string;
  handleBg: string;
  handleRing: string;
  foreground: string;
  mutedForeground: string;
}

export interface ResizableProps {
  ratio?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
  leftContent?: string;
  rightContent?: string;
}

const RESIZABLE_WIDTH = 480;
const RESIZABLE_HEIGHT = 280;
const HANDLE_SIZE = 16;
const HANDLE_RING_SIZE = 24;

export const resizableHandleStyle = (
  state: ResizableHandleState
): { handleScale: number; handleRingOpacity: number } => {
  switch (state) {
    case "hover": {
      return { handleRingOpacity: 0.4, handleScale: 1 };
    }
    case "active": {
      return { handleRingOpacity: 0.6, handleScale: 1.1 };
    }
    default: {
      return { handleRingOpacity: 0, handleScale: 1 };
    }
  }
};

export const resizableStyleContext = (
  theme: FramecnTheme
): ResizableStyleContext => ({
  background: theme.background,
  border: theme.border,
  foreground: theme.foreground,
  handleBg: theme.mutedForeground,
  handleRing: theme.primary,
  mutedForeground: theme.mutedForeground,
});

export const resizableStyle = (
  ratio: number,
  _ctx: ResizableStyleContext
): ResizableStyle => ({
  handleRingOpacity: 0,
  handleScale: 1,
  ratio: Math.max(0.1, Math.min(0.9, ratio)),
});

export const Resizable = ({
  ratio: ratioProp = 0.5,
  theme: themeOverride,
  className,
  leftContent = "Left panel",
  rightContent = "Right panel",
}: ResizableProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = resizableStyleContext(theme);
  const v = resizableStyle(ratioProp, ctx);

  const leftWidth = v.ratio * RESIZABLE_WIDTH;
  const rightWidth = (1 - v.ratio) * RESIZABLE_WIDTH;

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
          border: `1px solid ${ctx.border}`,
          borderRadius: theme.radius,
          display: "flex",
          height: RESIZABLE_HEIGHT,
          overflow: "hidden",
          position: "relative",
          width: RESIZABLE_WIDTH,
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: ctx.background,
            borderRight: `1px solid ${ctx.border}`,
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            height: "100%",
            justifyContent: "center",
            width: leftWidth,
          }}
        >
          {leftContent}
        </div>
        <div
          style={{
            alignItems: "center",
            background: mixOklch(ctx.background, ctx.mutedForeground, 0.03),
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            height: "100%",
            justifyContent: "center",
            width: rightWidth,
          }}
        >
          {rightContent}
        </div>
        <div
          style={{
            alignItems: "center",
            background: ctx.border,
            cursor: "col-resize",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            left: leftWidth - 1,
            position: "absolute",
            top: 0,
            width: 2,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: ctx.handleBg,
              borderRadius: "50%",
              display: "flex",
              height: HANDLE_SIZE,
              justifyContent: "center",
              transform: `scale(${v.handleScale})`,
              width: HANDLE_SIZE,
              zIndex: 1,
            }}
          />
          <div
            style={{
              alignItems: "center",
              background: ctx.handleRing,
              borderRadius: "50%",
              display: "flex",
              height: HANDLE_RING_SIZE,
              justifyContent: "center",
              opacity: v.handleRingOpacity,
              position: "absolute",
              width: HANDLE_RING_SIZE,
            }}
          />
        </div>
      </div>
    </div>
  );
};
