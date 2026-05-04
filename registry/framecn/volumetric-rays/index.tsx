"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface VolumetricRaysProps {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  rayColor?: string;
  background?: string;
  textColor?: string;
  intensity?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export const VolumetricRays = ({
  text = "REMOCN",
  fontSize = 240,
  fontWeight = 800,
  rayColor = "#fcd34d",
  background = "#050505",
  textColor = "#050505",
  intensity = 1,
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  className,
}: VolumetricRaysProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const bloomFadeInDurationMs = (30 * frameMs) / speed;
  const rotationDurationMs = durationMs / speed;
  const pulseDurationMs = (28 * frameMs) / speed;

  const style = {
    background,
    display: "block",
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
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-vr-rotate {
            from {
              transform: rotate(-4deg);
            }
            to {
              transform: rotate(8deg);
            }
          }

          @keyframes framecn-vr-bloom-fade {
            from {
              opacity: 0;
            }
            to {
              opacity: ${0.95 * intensity};
            }
          }

          @keyframes framecn-vr-pulse {
            0%, 100% {
              opacity: ${0.95 * intensity * 0.6};
            }
            50% {
              opacity: ${0.95 * intensity * 0.75};
            }
          }

          @keyframes framecn-vr-ray-rotate {
            from {
              background-image: conic-gradient(from -4deg at 50% 100%,
                transparent 0deg,
                ${rayColor} 20deg,
                transparent 40deg,
                ${rayColor} 80deg,
                transparent 100deg,
                ${rayColor} 140deg,
                transparent 160deg,
                ${rayColor} 200deg,
                transparent 220deg,
                ${rayColor} 260deg,
                transparent 280deg,
                ${rayColor} 320deg,
                transparent 360deg);
            }
            to {
              background-image: conic-gradient(from 8deg at 50% 100%,
                transparent 0deg,
                ${rayColor} 20deg,
                transparent 40deg,
                ${rayColor} 80deg,
                transparent 100deg,
                ${rayColor} 140deg,
                transparent 160deg,
                ${rayColor} 200deg,
                transparent 220deg,
                ${rayColor} 260deg,
                transparent 280deg,
                ${rayColor} 320deg,
                transparent 360deg);
            }
          }
        `}</style>

        {/* 1. The bloom: same text, scaled and blurred */}
        <div
          style={{
            alignItems: "center",
            animation: `
              framecn-vr-bloom-fade ${bloomFadeInDurationMs}ms ease-out forwards,
              framecn-vr-pulse ${pulseDurationMs}ms ease-in-out ${bloomFadeInDurationMs}ms infinite
            `,
            color: rayColor,
            display: "flex",
            filter: `blur(${60 * intensity}px)`,
            fontFamily: FONT_FAMILY,
            fontSize,
            fontWeight,
            inset: 0,
            justifyContent: "center",
            letterSpacing: "-0.04em",
            position: "absolute",
            textAlign: "center",
            transform: "scale(1.2, 1.6)",
            transformOrigin: "center bottom",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>

        {/* 2. Conic-gradient ray mask */}
        <div
          style={{
            WebkitBackgroundClip: "text",
            alignItems: "center",
            animation: `framecn-vr-ray-rotate ${rotationDurationMs}ms linear infinite`,
            backgroundClip: "text",
            backgroundImage: `conic-gradient(from -4deg at 50% 100%,
              transparent 0deg,
              ${rayColor} 20deg,
              transparent 40deg,
              ${rayColor} 80deg,
              transparent 100deg,
              ${rayColor} 140deg,
              transparent 160deg,
              ${rayColor} 200deg,
              transparent 220deg,
              ${rayColor} 260deg,
              transparent 280deg,
              ${rayColor} 320deg,
              transparent 360deg)`,
            color: "transparent",
            display: "flex",
            filter: "blur(2px)",
            fontFamily: FONT_FAMILY,
            fontSize,
            fontWeight,
            inset: 0,
            justifyContent: "center",
            letterSpacing: "-0.04em",
            opacity: 0.5 * intensity,
            position: "absolute",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>

        {/* 3. Front silhouette */}
        <div
          style={{
            alignItems: "center",
            color: textColor,
            display: "flex",
            fontFamily: FONT_FAMILY,
            fontSize,
            fontWeight,
            inset: 0,
            justifyContent: "center",
            letterSpacing: "-0.04em",
            position: "absolute",
            textAlign: "center",
            textShadow: `0 0 ${30 * intensity}px ${rayColor}`,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>

        {/* 4. Floor light bleed */}
        <div
          style={{
            animation: `framecn-vr-bloom-fade ${bloomFadeInDurationMs}ms ease-out forwards`,
            background: `radial-gradient(ellipse at 50% 100%, ${rayColor}55 0%, transparent 60%)`,
            bottom: 0,
            height: 200,
            left: 0,
            pointerEvents: "none",
            position: "absolute",
            right: 0,
          }}
        />
      </>
    </Timegroup>
  );
};
