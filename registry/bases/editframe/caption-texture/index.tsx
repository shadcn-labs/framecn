"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionTextureProps {
  words?: CaptionWord[];
  textureFrom?: string;
  textureMid?: string;
  textureTo?: string;
  fontSize?: number;
  fontWeight?: number | string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WORDS: CaptionWord[] = [
  { end: 0.35, start: 0, text: "Every" },
  { end: 0.65, start: 0.35, text: "great" },
  { end: 1, start: 0.65, text: "video" },
  { end: 1.45, start: 1.1, text: "starts" },
  { end: 1.65, start: 1.45, text: "with" },
  { end: 1.8, start: 1.65, text: "a" },
  { end: 2.15, start: 1.8, text: "single" },
  { end: 2.7, start: 2.15, text: "frame." },
  { end: 3.2, start: 3, text: "No" },
  { end: 3.9, start: 3.2, text: "timelines." },
  { end: 4.2, start: 4, text: "No" },
  { end: 4.5, start: 4.2, text: "drag" },
  { end: 4.65, start: 4.5, text: "and" },
  { end: 5.1, start: 4.65, text: "drop." },
  { end: 5.55, start: 5.3, text: "Just" },
  { end: 6, start: 5.55, text: "code." },
];

const IN_DURATION = 220;
const OUT_DURATION = 140;

export const CaptionTexture = ({
  words = DEFAULT_WORDS,
  textureFrom = "#ff6414",
  textureMid = "#ff2200",
  textureTo = "#ffd000",
  fontSize = 120,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionTextureProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    height,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width,
  };

  const textureBackground = `radial-gradient(ellipse at 20% 30%, ${textureFrom} 0%, transparent 50%), radial-gradient(ellipse at 75% 65%, ${textureMid} 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, ${textureTo} 0%, transparent 60%), ${textureMid}`;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-ctx-in {
            0%   { opacity: 0; transform: translateY(-40px) scale(1.3); }
            60%  { opacity: 1; }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-ctx-out {
            from { opacity: 1; transform: scale(1); }
            to   { opacity: 0; transform: scale(0.82); }
          }
        `}</style>
        {words.map((word, i) => {
          const startMs = (word.start * 1000) / safeSpeed;
          const endMs = (word.end * 1000) / safeSpeed;
          const wordDurationMs = endMs - startMs;
          const outStart = Math.max(
            startMs + IN_DURATION,
            endMs - OUT_DURATION
          );
          return (
            <span
              key={i}
              style={{
                WebkitBackgroundClip: "text",
                animation: [
                  `framecn-ctx-in ${Math.min(IN_DURATION, wordDurationMs * 0.6)}ms cubic-bezier(0.16,1,0.3,1) ${startMs}ms backwards`,
                  `framecn-ctx-out ${OUT_DURATION}ms ease-in ${outStart}ms forwards`,
                ].join(", "),
                backgroundClip: "text",
                backgroundImage: textureBackground,
                color: "transparent",
                display: "inline-block",
                fontFamily:
                  "'Anton', 'Impact', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize,
                fontWeight,
                left: 0,
                letterSpacing: "0.04em",
                lineHeight: 1,
                position: "absolute",
                right: 0,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </>
    </Timegroup>
  );
};
