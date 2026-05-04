"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface RGBGlitchTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  glitchAt?: number;
  glitchDuration?: number;
  intensity?: number;
  seed?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const RGBGlitchText = ({
  text,
  fontSize = 96,
  color = "#171717",
  fontWeight = 700,
  glitchAt = 20,
  glitchDuration = 8,
  intensity = 6,
  _seed = "glitch",
  _speed = 1,
  fps = 30,
  durationInFrames = 60,
  className,
}: RGBGlitchTextProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  const glitchStartPercent = (glitchAt / durationInFrames) * 100;
  const glitchEndPercent =
    ((glitchAt + glitchDuration) / durationInFrames) * 100;

  const style = {
    height: "100%",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  const baseStyle: CSSProperties = {
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize,
    fontWeight,
    left: 0,
    letterSpacing: "-0.03em",
    mixBlendMode: "multiply" as const,
    position: "absolute",
    top: 0,
    whiteSpace: "pre" as const,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-glitch-r {
            0%, ${glitchStartPercent}% {
              opacity: 0;
              transform: translateX(0) translateY(0);
            }
            ${glitchStartPercent}% {
              opacity: 1;
              transform: translateX(${intensity}px) translateY(${intensity * 0.4}px);
            }
            ${glitchStartPercent + 0.5}% {
              transform: translateX(${-intensity}px) translateY(${-intensity * 0.2}px);
            }
            ${glitchStartPercent + 1}% {
              transform: translateX(${intensity * 0.5}px) translateY(${intensity * 0.3}px);
            }
            ${glitchStartPercent + 1.5}% {
              transform: translateX(${-intensity * 0.8}px) translateY(${intensity * 0.1}px);
            }
            ${glitchStartPercent + 2}% {
              transform: translateX(${intensity * 0.3}px) translateY(${-intensity * 0.4}px);
            }
            ${glitchEndPercent}% {
              opacity: 1;
              transform: translateX(${intensity}px) translateY(${intensity * 0.4}px);
            }
            ${glitchEndPercent + 0.1}%, 100% {
              opacity: 0;
              transform: translateX(0) translateY(0);
            }
          }

          @keyframes framecn-glitch-g {
            0%, ${glitchStartPercent}% {
              opacity: 0;
              transform: translateX(0) translateY(0);
            }
            ${glitchStartPercent}% {
              opacity: 1;
              transform: translateX(${-intensity}px) translateY(${intensity * 0.3}px);
            }
            ${glitchStartPercent + 0.7}% {
              transform: translateX(${intensity * 0.7}px) translateY(${-intensity * 0.3}px);
            }
            ${glitchStartPercent + 1.4}% {
              transform: translateX(${-intensity * 0.4}px) translateY(${intensity * 0.2}px);
            }
            ${glitchStartPercent + 2.1}% {
              transform: translateX(${intensity * 0.9}px) translateY(${-intensity * 0.1}px);
            }
            ${glitchEndPercent}% {
              opacity: 1;
              transform: translateX(${-intensity}px) translateY(${intensity * 0.3}px);
            }
            ${glitchEndPercent + 0.1}%, 100% {
              opacity: 0;
              transform: translateX(0) translateY(0);
            }
          }

          @keyframes framecn-glitch-b {
            0%, ${glitchStartPercent}% {
              opacity: 0;
              transform: translateX(0) translateY(0);
            }
            ${glitchStartPercent}% {
              opacity: 1;
              transform: translateX(${intensity * 0.5}px) translateY(${-intensity * 0.3}px);
            }
            ${glitchStartPercent + 0.9}% {
              transform: translateX(${-intensity * 0.6}px) translateY(${intensity * 0.4}px);
            }
            ${glitchStartPercent + 1.8}% {
              transform: translateX(${intensity * 0.3}px) translateY(${-intensity * 0.2}px);
            }
            ${glitchStartPercent + 2.5}% {
              transform: translateX(${-intensity * 0.7}px) translateY(${intensity * 0.3}px);
            }
            ${glitchEndPercent}% {
              opacity: 1;
              transform: translateX(${intensity * 0.5}px) translateY(${-intensity * 0.3}px);
            }
            ${glitchEndPercent + 0.1}%, 100% {
              opacity: 0;
              transform: translateX(0) translateY(0);
            }
          }
        `}</style>

        <div
          style={{
            alignItems: "center",
            background: "#fafafa",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <div style={{ display: "inline-block", position: "relative" }}>
            <span
              style={{
                color,
                fontFamily:
                  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize,
                fontWeight,
                letterSpacing: "-0.03em",
                position: "relative",
                whiteSpace: "pre",
              }}
            >
              {text}
            </span>
            <span
              style={{
                ...baseStyle,
                animation: `framecn-glitch-r ${durationMs}ms linear forwards`,
                color: "#ff0040",
              }}
            >
              {text}
            </span>
            <span
              style={{
                ...baseStyle,
                animation: `framecn-glitch-g ${durationMs}ms linear forwards`,
                color: "#00ff80",
              }}
            >
              {text}
            </span>
            <span
              style={{
                ...baseStyle,
                animation: `framecn-glitch-b ${durationMs}ms linear forwards`,
                color: "#0080ff",
              }}
            >
              {text}
            </span>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
