"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionPillKaraokeProps {
  words?: CaptionWord[];
  wordsPerSegment?: number;
  activeColor?: string;
  dimColor?: string;
  pillColor?: string;
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

export const CaptionPillKaraoke = ({
  words = DEFAULT_WORDS,
  wordsPerSegment = 6,
  activeColor = "#1a1a1a",
  dimColor = "#a6a6a6",
  pillColor = "#e7e5e7",
  fontSize = 60,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionPillKaraokeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const segments = [];
  for (let i = 0; i < words.length; i += wordsPerSegment) {
    const segWords = words.slice(i, i + wordsPerSegment);
    segments.push({
      endMs: ((segWords.at(-1)?.end ?? 0) * 1000) / safeSpeed + 180,
      startMs: (segWords[0].start * 1000) / safeSpeed,
      words: segWords,
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
          @keyframes framecn-pk-seg-in {
            from { opacity: 0; transform: translateY(10px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-pk-seg-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-pk-word-active {
            0%, 100% { color: ${dimColor}; }
            8%, 92%  { color: ${activeColor}; }
          }
        `}</style>
        <div
          style={{
            bottom: Math.round(height * 0.12),
            display: "flex",
            justifyContent: "center",
            left: 0,
            position: "absolute",
            right: 0,
          }}
        >
          {segments.map((seg, si) => (
            <div
              key={si}
              style={{
                animation: [
                  `framecn-pk-seg-in 150ms cubic-bezier(0.16, 1, 0.3, 1) ${seg.startMs}ms both`,
                  `framecn-pk-seg-out 100ms ease-in ${seg.endMs}ms forwards`,
                ].join(", "),
                opacity: 0,
                position: "absolute",
              }}
            >
              <div
                style={{
                  background: pillColor,
                  borderRadius: 22,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.3em",
                  justifyContent: "center",
                  maxWidth: width - 160,
                  padding: "18px 56px 20px",
                }}
              >
                {seg.words.map((word, wi) => {
                  const wordStartMs = (word.start * 1000) / safeSpeed;
                  const wordDurationMs = Math.max(
                    150,
                    ((word.end - word.start) * 1000) / safeSpeed
                  );
                  return (
                    <span
                      key={wi}
                      style={{
                        animation: `framecn-pk-word-active ${wordDurationMs}ms ease-in-out ${wordStartMs}ms both`,
                        color: dimColor,
                        fontFamily:
                          "'Poppins', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize,
                        fontWeight,
                        letterSpacing: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {word.text}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </>
    </Timegroup>
  );
};
