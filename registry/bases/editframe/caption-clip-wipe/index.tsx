"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionClipWipeProps {
  words?: CaptionWord[];
  keywords?: string[];
  color?: string;
  keywordColor?: string;
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

export const CaptionClipWipe = ({
  words = DEFAULT_WORDS,
  keywords = ["single", "code."],
  color = "#ffffff",
  keywordColor = "#FFD700",
  fontSize = 72,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionClipWipeProps) => {
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
          @keyframes framecn-ccw-grp-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes framecn-ccw-grp-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-ccw-wipe-in {
            from { clip-path: inset(0 100% 0 0); }
            to   { clip-path: inset(0 0% 0 0); }
          }
          @keyframes framecn-ccw-wipe-out {
            from { clip-path: inset(0 0% 0 0); }
            to   { clip-path: inset(0 0% 0 100%); }
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
                  `framecn-ccw-grp-in 80ms ease-out ${group.startMs}ms both`,
                  `framecn-ccw-grp-out 80ms ease-in ${group.endMs}ms forwards`,
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
                const wordEndMs = (word.end * 1000) / safeSpeed;
                const isKeyword = keywords.includes(word.text);
                const wipeInDuration = 300;
                const wipeOutStart = wordEndMs + 100;
                const wipeOutDuration = 200;

                return (
                  <span
                    key={wi}
                    style={{
                      animation: [
                        `framecn-ccw-wipe-in ${wipeInDuration}ms ease-out ${wordStartMs}ms both`,
                        `framecn-ccw-wipe-out ${wipeOutDuration}ms ease-in ${wipeOutStart}ms forwards`,
                      ].join(", "),
                      color: isKeyword ? keywordColor : color,
                      display: "inline-block",
                      fontFamily:
                        "'Montserrat', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize,
                      fontWeight,
                      letterSpacing: "0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {word.text}
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
