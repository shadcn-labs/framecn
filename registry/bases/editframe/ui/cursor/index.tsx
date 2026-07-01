"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import type { CursorWaypoint } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";

export type { CursorWaypoint };

export interface CursorProps {
  waypoints?: CursorWaypoint[];
  frame?: number;
  speed?: number;
  style?: CursorStyle;
  variant?: "default" | "pointer";
  theme?: Partial<FramecnTheme> | "light" | "dark";
  className?: string;
}

const CURSOR_SIZE = 16;
const RIPPLE_SIZE = 40;

export interface CursorStyle {
  x: number;
  y: number;
  scale: number;
  pressScale: number;
  rippleOpacity: number;
  rippleScale: number;
}

export const Cursor = ({
  waypoints = [
    { at: 0, x: 0, y: 0 },
    { at: 24, x: 200, y: 100 },
    { at: 48, click: true, x: 400, y: 50 },
    { at: 72, x: 300, y: 250 },
  ],
  frame = 0,
  speed = 1,
  style: styleProp,
  theme: themeOverride,
  className,
}: CursorProps) => {
  const resolvedTheme =
    typeof themeOverride === "string" ? undefined : themeOverride;
  const theme = useFramecnTheme(resolvedTheme, "light");
  const v = styleProp ?? useCursorPath(waypoints, frame, { speed });

  return (
    <div
      className={className}
      style={{
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          left: v.x - CURSOR_SIZE / 2,
          position: "absolute",
          top: v.y - CURSOR_SIZE / 2,
          transform: `scale(${v.pressScale})`,
          transformOrigin: "center",
          zIndex: 2,
        }}
      >
        <svg
          width={CURSOR_SIZE}
          height={CURSOR_SIZE}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M1 1.5L1 12.5L4.5 9L8.5 15L11 13.5L7 7.5L12 6.5L1 1.5Z"
            fill={theme.foreground}
            stroke={theme.background}
            strokeWidth="1"
          />
        </svg>
      </div>
      <div
        style={{
          alignItems: "center",
          borderRadius: "50%",
          height: RIPPLE_SIZE,
          left: v.x - RIPPLE_SIZE / 2,
          opacity: v.rippleOpacity,
          position: "absolute",
          top: v.y - RIPPLE_SIZE / 2,
          transform: `scale(${v.rippleScale})`,
          transformOrigin: "center",
          width: RIPPLE_SIZE,
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: theme.primary,
            borderRadius: "50%",
            height: "100%",
            opacity: 0.3,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};
