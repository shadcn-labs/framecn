"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionHighlightProps {
  words?: CaptionWord[];
  wordsPerGroup?: number;
  color?: string;
  highlightColor?: string;
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

export const CaptionHighlight = ({
  words = DEFAULT_WORDS,
  wordsPerGroup = 3,
  color = "#ffffff",
  highlightColor = "#ff1745",
  fontSize = 72,
  fontWeight = 800,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionHighlightProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = [];
  for (let i = 0; i < words.length; i += wordsPerGroup) {
    const groupWords = words.slice(i, i + wordsPerGroup);
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
          @keyframes framecn-ch-grp-in {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-ch-grp-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-ch-hl {
            0%   { opacity: 0; transform: scaleX(0); }
            15%  { opacity: 1; transform: scaleX(1); }
            80%  { opacity: 1; transform: scaleX(1); }
            100% { opacity: 0; transform: scaleX(0); }
          }
        `}</style>
        <div
          style={{
            bottom: Math.round(height * 0.15),
            left: 0,
            position: "absolute",
            right: 0,
          }}
        >
          {groups.map((group, gi) => (
            <div
              key={gi}
              style={{
                alignItems: "center",
                animation: [
                  `framecn-ch-grp-in 120ms ease-out ${group.startMs}ms both`,
                  `framecn-ch-grp-out 80ms ease-in ${group.endMs}ms forwards`,
                ].join(", "),
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
                const wordDurationMs = Math.max(
                  120,
                  ((word.end - word.start) * 1000) / safeSpeed
                );
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      fontFamily:
                        "'Montserrat', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize,
                      fontWeight,
                      letterSpacing: "0.02em",
                      lineHeight: 1,
                      padding: "0.06em 0.1em",
                      position: "relative",
                      textShadow: "0 4px 16px rgba(0,0,0,0.5)",
                      textTransform: "uppercase",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        animation: `framecn-ch-hl ${wordDurationMs}ms ease-in-out ${wordStartMs}ms both`,
                        background: highlightColor,
                        borderRadius: 8,
                        boxShadow: `0 8px 24px ${highlightColor}55`,
                        inset: 0,
                        position: "absolute",
                        transformOrigin: "left center",
                        zIndex: 0,
                      }}
                    />
                    <span style={{ color, position: "relative", zIndex: 1 }}>
                      {word.text}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </>
    </Timegroup>
  );
};
