"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties, ReactNode } from "react";

export interface SpotlightCardProps {
  title?: string;
  body?: string;
  cardWidth?: number;
  cardHeight?: number;
  glowSize?: number;
  glowOpacity?: number;
  background?: string;
  cardColor?: string;
  textColor?: string;
  mutedColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
  children?: ReactNode;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const cursorAt = (
  frame: number,
  cardWidth: number,
  cardHeight: number,
  durationInFrames: number
) => {
  const t = (frame / durationInFrames) * Math.PI * 2;
  const x = cardWidth / 2 + Math.sin(t) * (cardWidth * 0.42);
  const y = cardHeight / 2 + Math.sin(t * 2) * (cardHeight * 0.32);
  return { x, y };
};

export const SpotlightCard = ({
  title = "Spotlight Card",
  body = "Soft radial light follows the cursor, picking out the microborder.",
  cardWidth = 520,
  cardHeight = 320,
  glowSize = 600,
  glowOpacity = 0.08,
  background = "#050505",
  cardColor = "#0a0a0a",
  textColor = "#fafafa",
  mutedColor = "#71717a",
  _speed = 1,
  fps = 30,
  durationInFrames = 150,
  className,
  children,
}: SpotlightCardProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  // Pre-compute glow position keyframes at 20 intervals
  const keyframeIntervals = 20;
  const glowKeyframes: string[] = [];

  for (let i = 0; i <= keyframeIntervals; i += 1) {
    const pct = (i / keyframeIntervals) * 100;
    const frame = (i / keyframeIntervals) * durationInFrames;
    const cursor = cursorAt(frame, cardWidth, cardHeight, durationInFrames);
    glowKeyframes.push(
      `  ${pct.toFixed(2)}% { left: ${cursor.x}px; top: ${cursor.y}px; }`
    );
  }

  const containerStyle = {
    alignItems: "center",
    background,
    display: "flex",
    fontFamily: FONT_FAMILY,
    height: "100%",
    justifyContent: "center",
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
          @keyframes framecn-spotlight-glow {
${glowKeyframes.join("\n")}
          }

          @keyframes framecn-spotlight-border {
${glowKeyframes.join("\n")}
          }

          @keyframes framecn-spotlight-card-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        {/* Border glow wrapper */}
        <div
          style={{
            animation: `framecn-spotlight-card-in 400ms ease-out forwards`,
            borderRadius: 20,
            height: cardHeight,
            opacity: 1,
            padding: 1,
            position: "relative",
            width: cardWidth,
          }}
        >
          {/* Animated border glow */}
          <div
            style={{
              animation: `framecn-spotlight-border ${durationMs}ms linear infinite`,
              background: `radial-gradient(${glowSize * 0.6}px circle at center, rgba(255,255,255,0.35), transparent 40%)`,
              inset: -glowSize * 0.6,
              pointerEvents: "none",
              position: "absolute",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Card surface */}
          <div
            style={{
              background: cardColor,
              borderRadius: 19,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              height: "100%",
              overflow: "hidden",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Surface glow underlay */}
            <div
              style={{
                animation: `framecn-spotlight-glow ${durationMs}ms linear infinite`,
                background: `radial-gradient(${glowSize}px circle at center, rgba(255,255,255,${glowOpacity}), transparent 40%)`,
                inset: -glowSize,
                pointerEvents: "none",
                position: "absolute",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Card content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: "100%",
                justifyContent: "flex-end",
                padding: 36,
                position: "relative",
              }}
            >
              {children ?? (
                <>
                  <div
                    style={{
                      color: textColor,
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      color: mutedColor,
                      fontSize: 16,
                      lineHeight: 1.5,
                      maxWidth: 360,
                    }}
                  >
                    {body}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
