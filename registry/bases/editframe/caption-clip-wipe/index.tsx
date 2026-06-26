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
  keywords?: number[];
  color?: string;
  keywordColor?: string;
  fadedColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WORDS: CaptionWord[] = [
  { end: 0.3, start: 0, text: "Every" },
  { end: 0.55, start: 0.3, text: "great" },
  { end: 0.85, start: 0.55, text: "video" },
  { end: 1.1, start: 0.85, text: "starts" },
  { end: 1.25, start: 1.1, text: "with" },
  { end: 1.35, start: 1.25, text: "a" },
  { end: 1.65, start: 1.35, text: "single" },
  { end: 2, start: 1.65, text: "frame." },
  { end: 2.65, start: 2.1, text: "HyperFrames" },
  { end: 2.85, start: 2.65, text: "lets" },
  { end: 2.95, start: 2.85, text: "you" },
  { end: 3.15, start: 2.95, text: "write" },
  { end: 3.55, start: 3.15, text: "HTML" },
  { end: 3.65, start: 3.55, text: "and" },
  { end: 3.95, start: 3.65, text: "render" },
  { end: 4.45, start: 3.95, text: "professional" },
  { end: 4.8, start: 4.45, text: "video." },
  { end: 5.05, start: 4.9, text: "No" },
  { end: 5.45, start: 5.05, text: "timeline." },
  { end: 5.65, start: 5.5, text: "No" },
  { end: 5.85, start: 5.65, text: "drag" },
  { end: 5.95, start: 5.85, text: "and" },
  { end: 6.25, start: 5.95, text: "drop." },
  { end: 6.55, start: 6.35, text: "Just" },
  { end: 6.8, start: 6.55, text: "code" },
  { end: 6.95, start: 6.8, text: "that" },
  { end: 7.3, start: 6.95, text: "becomes" },
  { end: 7.7, start: 7.3, text: "cinema." },
];

const DEFAULT_KEYWORDS = [8, 12, 15, 24, 27];

const RAW_GROUPS: [number, number][] = [
  [0, 3],
  [4, 7],
  [8, 8],
  [9, 12],
  [13, 15],
  [16, 16],
  [17, 19],
  [20, 22],
  [23, 24],
  [25, 27],
];

export const CaptionClipWipe = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  color: _color = "#ffffff",
  keywordColor = "#FFD700",
  fadedColor = "rgba(255,255,255,0.4)",
  fontSize = 88,
  fontWeight = 800,
  fontFamily = "'Poppins', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionClipWipeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = RAW_GROUPS.map(([ws, we], gi) => {
    const nextStart =
      gi + 1 < RAW_GROUPS.length
        ? words[RAW_GROUPS[gi + 1][0]].start
        : durationInFrames / fps;
    const gEnd = Math.min(words[we].end + 0.5, nextStart - 0.05);
    return {
      end: gEnd,
      start: words[ws].start,
      wordEnd: we,
      wordStart: ws,
    };
  });

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
          @keyframes ccw-grp-show {
            to { visibility: visible; }
          }
          @keyframes ccw-grp-hide {
            to { visibility: hidden; opacity: 0; }
          }
          @keyframes ccw-wipe-in {
            to { clip-path: inset(0 0% 0 0); }
          }
          @keyframes ccw-wipe-out {
            to { clip-path: inset(0 0% 0 100%); }
          }
          @keyframes ccw-color-keyword {
            to { color: var(--ccw-keyword-color); }
          }
          @keyframes ccw-color-fade {
            to { color: var(--ccw-faded-color); }
          }
        `}</style>
        <div
          style={
            {
              "--ccw-faded-color": fadedColor,
              "--ccw-keyword-color": keywordColor,
              bottom: 120,
              left: 0,
              position: "absolute",
              right: 0,
            } as CSSProperties
          }
        >
          {groups.map((g, gi) => {
            const groupWords = words.slice(g.wordStart, g.wordEnd + 1);
            const groupStartMs = (g.start * 1000) / safeSpeed;
            const groupEndMs = (g.end * 1000) / safeSpeed;

            return (
              <div
                key={gi}
                style={{
                  alignItems: "flex-end",
                  animation: [
                    `ccw-grp-show 1ms linear ${groupStartMs}ms both`,
                    `ccw-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                  ].join(", "),
                  bottom: 120,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  justifyContent: "center",
                  left: 0,
                  padding: "0 100px",
                  position: "absolute",
                  right: 0,
                  visibility: "hidden",
                  width: "100%",
                }}
              >
                {groupWords.map((word, i) => {
                  const wi = g.wordStart + i;
                  const wordStartMs = (word.start * 1000) / safeSpeed;
                  const wordEndMs = (word.end * 1000) / safeSpeed;
                  const isKW = keywords.includes(wi);
                  const wipeInDuration = 300;
                  const wipeOutStartMs = groupEndMs - 200;
                  const wipeOutStaggerMs = i * 40;
                  const wipeOutDuration = 250;
                  const colorKeyDuration = 50;
                  const colorKeyDelayMs = wordStartMs + 100;
                  const fadeDuration = 200;

                  return (
                    <span
                      key={wi}
                      style={{
                        animation: [
                          `ccw-wipe-in ${wipeInDuration}ms ease-out ${wordStartMs}ms both`,
                          isKW
                            ? `ccw-color-keyword ${colorKeyDuration}ms ease ${colorKeyDelayMs}ms both`
                            : "",
                          `ccw-color-fade ${fadeDuration}ms ease ${wordEndMs}ms forwards`,
                          `ccw-wipe-out ${wipeOutDuration}ms ease-in ${wipeOutStartMs + wipeOutStaggerMs}ms forwards`,
                        ]
                          .filter(Boolean)
                          .join(", "),
                        clipPath: "inset(0 100% 0 0)",
                        display: "inline-block",
                        fontFamily,
                        fontSize,
                        fontWeight,
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        willChange: "clip-path, color, opacity",
                      }}
                    >
                      {word.text.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
