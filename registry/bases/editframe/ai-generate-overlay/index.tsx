"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface AIGenerateOverlayProps {
  maxBlur?: number;
  blurStartFrame?: number;
  blurPeakFrame?: number;
  revealStartFrame?: number;
  pillText?: string;
  accent?: string;
  background?: string;
  sourceImageBg?: string;
  generatedImageBg?: string;
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_SOURCE_BG =
  "linear-gradient(135deg, #6b3a1a 0%, #d4a574 50%, #8b4513 100%)";

const DEFAULT_GENERATED_BG =
  "radial-gradient(ellipse at center, #d4a574 0%, #8b4513 22%, #2a1a10 42%), linear-gradient(180deg, #1a1410 0%, #0a0806 50%, #1a1410 100%)";

const hexWithAlpha = (hex: string, alpha: number): string => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) {
    return hex;
  }
  const int = Number.parseInt(m[1], 16);
  /* eslint-disable no-bitwise */
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  /* eslint-enable no-bitwise */
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const AIGenerateOverlay = ({
  maxBlur = 20,
  blurStartFrame = 20,
  blurPeakFrame = 40,
  revealStartFrame = 110,
  pillText = "Generating…",
  accent = "#a78bfa",
  background = "#050505",
  sourceImageBg = DEFAULT_SOURCE_BG,
  generatedImageBg = DEFAULT_GENERATED_BG,
  dotColor = "#ffffff",
  dotSize = 1.2,
  dotSpacing = 20,
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  className,
}: AIGenerateOverlayProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;

  const blurStartPercent = (blurStartFrame / durationInFrames) * 100;
  const blurPeakPercent = (blurPeakFrame / durationInFrames) * 100;
  const revealStartPercent = (revealStartFrame / durationInFrames) * 100;

  const style = {
    background,
    fontFamily: FONT_FAMILY,
    height: "100%",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-ai-overlay-blur {
            from {
              filter: blur(0px) scale(1.06);
              opacity: 1;
            }
            ${blurStartPercent}% {
              filter: blur(0px) scale(1.06);
              opacity: 1;
            }
            ${blurPeakPercent}% {
              filter: blur(${maxBlur}px) scale(1.06);
              opacity: 0.6;
            }
            100% {
              filter: blur(${maxBlur}px) scale(1.06);
              opacity: 0;
            }
          }

          @keyframes framecn-ai-overlay-grid {
            from {
              opacity: 0;
            }
            ${blurStartPercent}% {
              opacity: 0;
            }
            ${blurPeakPercent}% {
              opacity: 0.4;
            }
            100% {
              opacity: 0;
            }
          }

          @keyframes framecn-ai-overlay-reveal {
            from {
              opacity: 0;
            }
            ${revealStartPercent}% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes framecn-ai-overlay-pill-in {
            from {
              opacity: 0;
              transform: scale(0.98);
            }
            ${blurStartPercent}% {
              opacity: 0;
              transform: scale(0.98);
            }
            ${blurPeakPercent}% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(1);
            }
          }

          @keyframes framecn-ai-overlay-dot-pulse {
            0%, 25% {
              opacity: 1;
            }
            26%, 50% {
              opacity: 1;
            }
            51%, 75% {
              opacity: 1;
            }
            76%, 100% {
              opacity: 1;
            }
          }

          @keyframes framecn-ai-overlay-shimmer {
            0%, 100% {
              opacity: 0.35;
            }
            50% {
              opacity: 0.45;
            }
          }
        `}</style>

        {/* Source ("painting") layer — blurs out as AI thinks. */}
        <div
          style={{
            animation: `framecn-ai-overlay-blur ${durationMs}ms ease-in-out forwards`,
            background: sourceImageBg,
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Generated image layer — fades in over the blurred source. */}
        <div
          style={{
            animation: `framecn-ai-overlay-reveal ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            background: generatedImageBg,
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Dot grid overlay — SVG pattern with animated opacity. */}
        <svg
          style={{
            animation: `framecn-ai-overlay-grid ${durationMs}ms ease-in-out forwards`,
            height: "100%",
            inset: 0,
            mixBlendMode: "screen",
            pointerEvents: "none",
            position: "absolute",
            width: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ai-generate-overlay-dots"
              width={dotSpacing}
              height={dotSpacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={dotSpacing / 2}
                cy={dotSpacing / 2}
                r={dotSize}
                fill={dotColor}
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#ai-generate-overlay-dots)"
          />
        </svg>

        {/* "Generating…" pill */}
        <div
          style={{
            alignItems: "center",
            animation: `framecn-ai-overlay-pill-in ${durationMs}ms ease-in-out forwards`,
            display: "flex",
            inset: 0,
            justifyContent: "center",
            pointerEvents: "none",
            position: "absolute",
          }}
        >
          <div
            style={{
              WebkitBackdropFilter: "blur(10px)",
              alignItems: "center",
              backdropFilter: "blur(10px)",
              background: "rgba(10, 10, 10, 0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${hexWithAlpha(
                accent,
                0.5
              )}, 0 12px 40px rgba(0,0,0,0.45)`,
              color: "#fafafa",
              display: "inline-flex",
              fontSize: 18,
              fontWeight: 500,
              gap: 12,
              letterSpacing: "-0.01em",
              padding: "14px 24px",
            }}
          >
            <span
              style={{
                animation:
                  "framecn-ai-overlay-shimmer 1.6s ease-in-out infinite",
                background: accent,
                borderRadius: 999,
                boxShadow: `0 0 12px ${hexWithAlpha(accent, 0.9)}`,
                height: 8,
                width: 8,
              }}
            />
            {pillText}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
