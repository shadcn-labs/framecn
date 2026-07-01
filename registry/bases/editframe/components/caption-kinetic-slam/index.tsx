"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionKineticSlamProps {
  words?: CaptionWord[];
  color?: string;
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

export const CaptionKineticSlam = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  fontSize = 120,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionKineticSlamProps) => {
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

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-ks-in {
            0%   { opacity: 0; transform: translateY(-56px) scale(1.45); }
            60%  { opacity: 1; }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-ks-out {
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
                animation: [
                  `framecn-ks-in ${Math.min(IN_DURATION, wordDurationMs * 0.6)}ms cubic-bezier(0.16, 1, 0.3, 1) ${startMs}ms backwards`,
                  `framecn-ks-out ${OUT_DURATION}ms ease-in ${outStart}ms forwards`,
                ].join(", "),
                color,
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
                textShadow: "0 6px 32px rgba(0,0,0,0.6)",
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
