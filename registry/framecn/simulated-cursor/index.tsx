"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CursorPoint {
  x: number;
  y: number;
  hold?: number;
  click?: boolean;
}

export interface SimulatedCursorProps {
  points?: CursorPoint[];
  color?: string;
  size?: number;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const DEFAULT_POINTS: CursorPoint[] = [
  { hold: 20, x: 200, y: 150 },
  { click: true, hold: 25, x: 800, y: 360 },
  { hold: 20, x: 1050, y: 560 },
];

const buildCursorSegments = (points: CursorPoint[], travelPerLeg: number) => {
  const segments: {
    start: number;
    end: number;
    holdEnd: number;
    from: CursorPoint;
    to: CursorPoint;
  }[] = [];

  let cursor = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const start = cursor;
    const end = start + travelPerLeg;
    const holdEnd = end + (to.hold ?? 15);
    segments.push({ end, from, holdEnd, start, to });
    cursor = holdEnd;
  }

  return segments;
};

const buildKeyframeStops = (
  segments: ReturnType<typeof buildCursorSegments>,
  points: CursorPoint[],
  totalFrames: number
) => {
  const keyframeStops: string[] = [];

  // Initial position
  const initialHold = points[0].hold ?? 0;
  keyframeStops.push(`  0% { left: ${points[0].x}px; top: ${points[0].y}px; }`);

  if (initialHold > 0 && segments.length > 0) {
    const holdPct = (segments[0].start / totalFrames) * 100;
    keyframeStops.push(
      `  ${holdPct.toFixed(2)}% { left: ${points[0].x}px; top: ${points[0].y}px; }`
    );
  }

  // Add segment keyframes
  for (const seg of segments) {
    const startPct = (seg.start / totalFrames) * 100;
    const endPct = (seg.end / totalFrames) * 100;

    keyframeStops.push(
      `  ${startPct.toFixed(2)}% { left: ${seg.from.x}px; top: ${seg.from.y}px; }`
    );
    keyframeStops.push(
      `  ${endPct.toFixed(2)}% { left: ${seg.to.x}px; top: ${seg.to.y}px; }`
    );

    if (seg.holdEnd > seg.end && seg !== segments.at(-1)) {
      const holdPct = (seg.holdEnd / totalFrames) * 100;
      keyframeStops.push(
        `  ${holdPct.toFixed(2)}% { left: ${seg.to.x}px; top: ${seg.to.y}px; }`
      );
    }
  }

  return keyframeStops;
};

const buildClickAnimations = (
  segments: ReturnType<typeof buildCursorSegments>,
  totalFrames: number
) => {
  const clickAnimations: string[] = [];

  for (const seg of segments) {
    if (seg.to.click) {
      const clickStartPct = endPct;
      const _clickEndPct = Math.min(
        holdEndPct,
        clickStartPct + (24 / totalFrames) * 100
      );
      const clickKeyframes = `
    @keyframes framecn-cursor-click-${seg.end} {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.82); }
    }
    @keyframes framecn-cursor-ripple-${seg.end} {
      0% { r: 4; opacity: 0.6; }
      100% { r: 60; opacity: 0; }
    }`;
      clickAnimations.push(clickKeyframes);
    }
  }

  return clickAnimations;
};

export const SimulatedCursor = ({
  points = DEFAULT_POINTS,
  color = "#ffffff",
  size = 32,
  background = "#0a0a0a",
  _speed = 1,
  fps = 30,
  durationInFrames = 150,
  className,
}: SimulatedCursorProps) => {
  const _frameMs = 1000 / fps;
  const travelPerLeg = 24;

  const segments = buildCursorSegments(points, travelPerLeg);

  const lastHold = points.at(-1)?.hold ?? 0;
  const totalFrames = Math.max(
    durationInFrames,
    segments.at(-1)?.holdEnd ?? 0 + lastHold
  );
  const durationMs = (totalFrames / fps) * 1000;

  const keyframeStops = buildKeyframeStops(segments, points, totalFrames);
  const clickAnimations = buildClickAnimations(segments, totalFrames);

  const containerStyle = {
    background,
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-cursor-move {
${keyframeStops.join("\n")}
          }

          ${clickAnimations.join("\n")}

          @keyframes framecn-cursor-click {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.82); }
          }

          @keyframes framecn-cursor-ripple {
            0% { r: 4; opacity: 0.6; }
            100% { r: 60; opacity: 0; }
          }
        `}</style>

        {/* Cursor */}
        <div
          style={{
            animation: `framecn-cursor-move ${durationMs}ms linear forwards`,
            height: size,
            left: points[0].x,
            pointerEvents: "none",
            position: "absolute",
            top: points[0].y,
            transformOrigin: "top left",
            width: size,
            zIndex: 2_147_483_647,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3L5 19L9.5 14.5L12.5 21L15 20L12 13.5L18.5 13.5L5 3Z"
              fill={color}
              stroke="#000000"
              strokeWidth={1.2}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </>
    </Timegroup>
  );
};
