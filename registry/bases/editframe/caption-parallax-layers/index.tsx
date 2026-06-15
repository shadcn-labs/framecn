"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionParallaxLayersProps {
  words?: CaptionWord[];
  color?: string;
  behindColor?: string;
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

const WORDS_PER_GROUP = 3;

export const CaptionParallaxLayers = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  behindColor = "#a78bfa",
  fontSize = 56,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionParallaxLayersProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = [];
  for (let i = 0; i < words.length; i += WORDS_PER_GROUP) {
    const groupWords = words.slice(i, i + WORDS_PER_GROUP);
    groups.push({
      endMs: ((groupWords.at(-1)?.end ?? 0) * 1000) / safeSpeed + 180,
      startMs: (groupWords[0].start * 1000) / safeSpeed,
      words: groupWords,
    });
  }

  const containerStyle: CSSProperties = {
    background,
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
          @keyframes framecn-cpl-grp-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes framecn-cpl-grp-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-cpl-word-in {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {groups.map((group, gi) => {
          const text = group.words.map((w) => w.text).join(" ");
          return (
            <div key={gi}>
              {/* Behind layer */}
              <div
                style={{
                  animation: [
                    `framecn-cpl-grp-in 120ms ease-out ${group.startMs}ms both`,
                    `framecn-cpl-grp-out 80ms ease-in ${group.endMs}ms forwards`,
                  ].join(", "),
                  color: `${behindColor}26`,
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: fontSize * 3,
                  fontStyle: "italic",
                  fontWeight: "400",
                  left: 0,
                  lineHeight: 1,
                  opacity: 0,
                  overflow: "hidden",
                  position: "absolute",
                  right: 0,
                  textAlign: "center",
                  top: height * 0.08,
                  whiteSpace: "nowrap",
                }}
              >
                {text}
              </div>
              {/* Front layer */}
              <div
                style={{
                  animation: [
                    `framecn-cpl-grp-in 120ms ease-out ${group.startMs}ms both`,
                    `framecn-cpl-grp-out 80ms ease-in ${group.endMs}ms forwards`,
                  ].join(", "),
                  bottom: height * 0.12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.3em",
                  justifyContent: "center",
                  left: 0,
                  opacity: 0,
                  padding: "0 80px",
                  position: "absolute",
                  right: 0,
                }}
              >
                {group.words.map((word, wi) => {
                  const wordStartMs = (word.start * 1000) / safeSpeed;
                  return (
                    <span
                      key={wi}
                      style={{
                        animation: `framecn-cpl-word-in 160ms ease-out ${wordStartMs}ms both`,
                        color,
                        display: "inline-block",
                        fontFamily:
                          "'Inter', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize,
                        fontWeight,
                        lineHeight: 1,
                      }}
                    >
                      {word.text}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    </Timegroup>
  );
};
