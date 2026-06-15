"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionEditorialEmphasisProps {
  words?: CaptionWord[];
  emphasisWords?: string[];
  color?: string;
  fontSize?: number;
  fontWeight?: number | string;
  emphasisScale?: number;
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

export const CaptionEditorialEmphasis = ({
  words = DEFAULT_WORDS,
  emphasisWords = ["single", "code."],
  color = "#f5f0d0",
  fontSize = 56,
  fontWeight = "400",
  emphasisScale = 2,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionEditorialEmphasisProps) => {
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
          @keyframes framecn-cee-grp-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes framecn-cee-grp-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-cee-word-in {
            from { opacity: 0; transform: scale(1.12); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
        {groups.map((group, gi) => (
          <div
            key={gi}
            style={{
              alignItems: "flex-end",
              animation: [
                `framecn-cee-grp-in 120ms ease-out ${group.startMs}ms both`,
                `framecn-cee-grp-out 80ms ease-in ${group.endMs}ms forwards`,
              ].join(", "),
              display: "flex",
              flexWrap: "wrap",
              gap: "0.2em",
              left: 60,
              opacity: 0,
              position: "absolute",
              top: height * 0.55,
            }}
          >
            {group.words.map((word, wi) => {
              const wordStartMs = (word.start * 1000) / safeSpeed;
              const isEmphasis = emphasisWords.includes(word.text);
              const clampedScale = Math.max(1.2, Math.min(3, emphasisScale));

              return (
                <span
                  key={wi}
                  style={{
                    animation: `framecn-cee-word-in 180ms cubic-bezier(0.16,1,0.3,1) ${wordStartMs}ms both`,
                    color,
                    display: "inline-block",
                    fontFamily: isEmphasis
                      ? "'Playfair Display', Georgia, serif"
                      : "'Inter', var(--font-geist-sans), sans-serif",
                    fontSize: isEmphasis ? fontSize * clampedScale : fontSize,
                    fontStyle: isEmphasis ? "italic" : "normal",
                    fontWeight,
                    lineHeight: 1,
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        ))}
      </>
    </Timegroup>
  );
};
