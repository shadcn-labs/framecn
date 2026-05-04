"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface CursorWaypoint {
  x: number;
  y: number;
  /** If set, the cursor will pause here for this many frames before moving on. */
  hold?: number;
  /** If true, a click animation will fire when the cursor reaches this point. */
  click?: boolean;
  /** Optional label rendered next to the click target. */
  label?: string;
}

export interface CursorFlowProps {
  waypoints?: CursorWaypoint[];
  cursorColor?: string;
  cursorSize?: number;
  segmentDuration?: number;
  background?: string;
  showTargets?: boolean;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WAYPOINTS: CursorWaypoint[] = [
  { x: 200, y: 180 },
  { click: true, label: "Generate", x: 540, y: 240 },
  { hold: 8, x: 880, y: 360 },
  { click: true, label: "Publish", x: 1040, y: 520 },
];

// Simplified bezier path through waypoints
const CURSOR_PATH =
  "M 200 180 C 350 200, 450 220, 540 240 C 650 260, 750 300, 880 360 C 920 380, 980 460, 1040 520";

export const CursorFlow = ({
  waypoints = DEFAULT_WAYPOINTS,
  cursorColor = "#fafafa",
  cursorSize = 28,
  segmentDuration = 36,
  background = "#0a0a0a",
  showTargets = true,
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CursorFlowProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const segmentMs = ((segmentDuration / fps) * 1000) / safeSpeed;
  const totalPathMs = segmentMs * (waypoints.length - 1);

  const containerStyle: CSSProperties = {
    background,
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-cursor-flow {
            from { offset-distance: 0%; }
            to { offset-distance: 100%; }
          }
          @keyframes framecn-cursor-click {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.85); }
          }
          @keyframes framecn-target-appear {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Click targets */}
        {showTargets &&
          waypoints.map((wp, i) => {
            if (!wp.click) {
              return null;
            }
            const targetDelayMs = i * segmentMs * 0.9;
            return (
              <div
                key={i}
                style={{
                  animation: `framecn-target-appear 300ms cubic-bezier(0.16, 1, 0.3, 1) ${targetDelayMs}ms backwards`,
                  background: "#fafafa",
                  borderRadius: 10,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                  color: "#0a0a0a",
                  fontSize: 14,
                  fontWeight: 600,
                  left: wp.x - 70,
                  padding: "10px 18px",
                  pointerEvents: "none",
                  position: "absolute",
                  top: wp.y - 22,
                }}
              >
                {wp.label ?? "Click"}
              </div>
            );
          })}

        {/* Cursor */}
        <svg
          width={cursorSize}
          height={cursorSize}
          viewBox="0 0 24 24"
          style={{
            animation: `framecn-cursor-flow ${totalPathMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards`,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
            left: 0,
            offsetPath: `path("${CURSOR_PATH}")`,
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            transformOrigin: "0 0",
            zIndex: 9999,
          }}
        >
          <path
            d="M3 2 L3 18 L7 14 L10 21 L13 20 L10 13 L17 13 Z"
            fill={cursorColor}
            stroke="#0a0a0a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Active waypoint markers */}
        {waypoints.map((wp, i) => (
          <div
            key={`marker-${i}`}
            style={{
              animation: `framecn-target-appear 300ms ease-out ${i * segmentMs * 0.9}ms backwards`,
              background: "rgba(255,255,255,0.04)",
              borderRadius: "50%",
              height: 6,
              left: wp.x - 3,
              pointerEvents: "none",
              position: "absolute",
              top: wp.y - 3,
              width: 6,
            }}
          />
        ))}
      </>
    </Timegroup>
  );
};
