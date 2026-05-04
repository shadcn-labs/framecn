"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface BrushStrokeSimulatorProps {
  brushSize?: number;
  cursorColor?: string;
  background?: string;
  baseColorA?: string;
  baseColorB?: string;
  overlayColor?: string;
  startFrame?: number;
  sweepDuration?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const STAGE_W = 1280;
const STAGE_H = 720;

// Pre-computed brush stroke path (simplified bezier path covering both faces)
const BRUSH_PATH =
  "M 280 280 C 320 260, 420 260, 460 260 C 460 300, 460 360, 460 380 C 420 400, 320 400, 280 380 C 280 360, 280 300, 280 280 Z M 640 220 C 700 240, 780 240, 820 280 C 860 280, 960 280, 1000 280 C 1000 320, 1000 360, 1000 380 C 960 400, 860 400, 820 380 C 780 360, 700 340, 640 220 Z";

// Simplified path for cursor to follow
const CURSOR_PATH =
  "M 280 280 C 370 260, 460 260, 460 320 C 460 360, 370 400, 280 380 C 280 340, 280 300, 280 280 M 640 220 C 730 240, 820 280, 820 320 C 820 360, 910 400, 1000 380";

export const BrushStrokeSimulator = ({
  brushSize = 70,
  cursorColor = "rgba(255,255,255,0.45)",
  background = "#0a0a0a",
  baseColorA = "#f4a261",
  baseColorB = "#e76f51",
  overlayColor = "#1f1f23",
  startFrame = 12,
  sweepDuration = 150,
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: BrushStrokeSimulatorProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const startMs = startFrame * frameMs;
  const sweepMs = ((sweepDuration / fps) * 1000) / safeSpeed;
  const introDurationMs = 8 * frameMs;

  // Approximate path length for dash animation
  const approxPathLength = 1400;

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
          @keyframes framecn-brush-intro {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes framecn-brush-reveal {
            from {
              stroke-dashoffset: ${approxPathLength};
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes framecn-brush-cursor {
            from {
              offset-distance: 0%;
            }
            to {
              offset-distance: 100%;
            }
          }
          @keyframes framecn-brush-press {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.86); }
          }
        `}</style>

        {/* Intro fade */}
        <div
          style={{
            animation: `framecn-brush-intro ${introDurationMs}ms ease-out backwards`,
            inset: 0,
            position: "absolute",
          }}
        >
          {/* Sharp base layer */}
          <div
            style={{
              background: `
                radial-gradient(circle at 27% 45%, ${baseColorA} 0%, transparent 28%),
                radial-gradient(circle at 67% 45%, ${baseColorA} 0%, transparent 28%),
                radial-gradient(circle at 47% 70%, ${baseColorB} 0%, transparent 55%),
                linear-gradient(160deg, #2a1a14 0%, #1a0f0a 100%)
              `,
              inset: 0,
              position: "absolute",
            }}
          />

          {/* Eye / detail dots */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            style={{ inset: 0, pointerEvents: "none", position: "absolute" }}
          >
            {/* Left face */}
            <circle cx="320" cy="300" r="10" fill="rgba(0,0,0,0.55)" />
            <circle cx="420" cy="300" r="10" fill="rgba(0,0,0,0.55)" />
            <path
              d="M310 360 Q370 390 430 360"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right face */}
            <circle cx="860" cy="300" r="10" fill="rgba(0,0,0,0.55)" />
            <circle cx="960" cy="300" r="10" fill="rgba(0,0,0,0.55)" />
            <path
              d="M850 360 Q910 390 970 360"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Pixelated overlay with animated mask */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            style={{ inset: 0, pointerEvents: "none", position: "absolute" }}
          >
            <defs>
              <mask id="brush-reveal-mask" maskUnits="userSpaceOnUse">
                <rect width={STAGE_W} height={STAGE_H} fill="white" />
                <path
                  d={BRUSH_PATH}
                  stroke="black"
                  strokeWidth={brushSize}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    animation: `framecn-brush-reveal ${sweepMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${startMs}ms backwards`,
                    strokeDasharray: approxPathLength,
                    transformBox: "fill-box",
                  }}
                />
              </mask>
              <pattern
                id="pixel-overlay"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <rect width="32" height="32" fill={overlayColor} />
                <rect width="16" height="16" fill="rgba(255,255,255,0.04)" />
                <rect
                  x="16"
                  y="16"
                  width="16"
                  height="16"
                  fill="rgba(0,0,0,0.25)"
                />
              </pattern>
            </defs>
            <rect
              width={STAGE_W}
              height={STAGE_H}
              fill="url(#pixel-overlay)"
              mask="url(#brush-reveal-mask)"
            />
          </svg>

          {/* Cursor / fingertip */}
          <div
            style={{
              animation: `framecn-brush-cursor ${sweepMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${startMs}ms backwards, framecn-brush-press 600ms ease-in-out ${startMs + sweepMs * 0.5}ms backwards`,
              background: cursorColor,
              border: "1.5px solid rgba(255,255,255,0.85)",
              borderRadius: "50%",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.15)",
              height: brushSize,
              offsetPath: `path("${CURSOR_PATH}")`,
              pointerEvents: "none",
              position: "absolute",
              transformOrigin: "center",
              width: brushSize,
              zIndex: 9999,
            }}
          />
        </div>
      </>
    </Timegroup>
  );
};
