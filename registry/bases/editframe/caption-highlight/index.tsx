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
  color?: string;
  highlightColor?: string;
  highlightEndColor?: string;
  highlightShadow?: string;
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

export const CaptionHighlight = ({
  words = DEFAULT_WORDS,
  color: _color = "#ffffff",
  highlightColor = "#ff1745",
  highlightEndColor = "#df1238",
  highlightShadow = "rgba(229, 20, 58, 0.32)",
  fontSize = 80,
  fontWeight = 800,
  fontFamily = "'Montserrat', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionHighlightProps) => {
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
          @keyframes ch-grp-show {
            from { visibility: hidden; opacity: 0; }
            to { visibility: visible; opacity: 1; }
          }
          @keyframes ch-grp-hide {
            from { visibility: visible; opacity: 1; }
            to { visibility: hidden; opacity: 0; }
          }
          @keyframes ch-grp-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes ch-grp-fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes ch-bg-in {
            from { opacity: 0; transform: scaleX(0); }
            to { opacity: 1; transform: scaleX(1); }
          }
          @keyframes ch-bg-out {
            from { opacity: 1; transform: scaleX(1); }
            to { opacity: 0; transform: scaleX(1.02); }
          }
          @keyframes ch-bg-reset {
            from { transform: scaleX(1.02); }
            to { transform: scaleX(0); }
          }
          @keyframes ch-bright-in {
            from { filter: brightness(1); }
            to { filter: brightness(1.05); }
          }
          @keyframes ch-bright-out {
            from { filter: brightness(1.05); }
            to { filter: brightness(1); }
          }
        `}</style>
        <div
          style={
            {
              "--ch-hl-color": highlightColor,
              "--ch-hl-end-color": highlightEndColor,
              "--ch-hl-shadow": highlightShadow,
              bottom: 140,
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
                    `ch-grp-show 1ms linear ${groupStartMs}ms both`,
                    `ch-grp-fade-in 120ms ease-out ${groupStartMs}ms both`,
                    `ch-grp-fade-out 100ms ease-in ${groupEndMs - 100}ms forwards`,
                    `ch-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                  ].join(", "),
                  bottom: 140,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
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
                  const bgInDuration = 150;
                  const bgOutDuration = 100;
                  const bgResetDelayMs = wordEndMs + 100;
                  const brightInDuration = 80;
                  const brightOutDuration = 160;
                  const brightOutDelayMs = wordStartMs + 80;

                  return (
                    <span
                      key={wi}
                      style={{
                        animation: [
                          `ch-bright-in ${brightInDuration}ms ease-out ${wordStartMs}ms both`,
                          `ch-bright-out ${brightOutDuration}ms ease-out ${brightOutDelayMs}ms forwards`,
                        ].join(", "),
                        display: "inline-block",
                        fontFamily,
                        fontSize,
                        fontWeight,
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                        padding: "6px 12px 8px",
                        position: "relative",
                        textShadow: "0 6px 18px rgba(0, 0, 0, 0.45)",
                        textTransform: "uppercase",
                        willChange: "filter",
                      }}
                    >
                      <span
                        style={{
                          animation: [
                            `ch-bg-in ${bgInDuration}ms ease-out ${wordStartMs}ms both`,
                            `ch-bg-out ${bgOutDuration}ms ease-in ${wordEndMs}ms forwards`,
                            `ch-bg-reset 1ms linear ${bgResetDelayMs}ms forwards`,
                          ].join(", "),
                          background: `linear-gradient(135deg, var(--ch-hl-color) 0%, var(--ch-hl-end-color) 100%)`,
                          borderRadius: 10,
                          boxShadow: `0 12px 30px var(--ch-hl-shadow)`,
                          inset: 0,
                          opacity: 0,
                          position: "absolute",
                          transformOrigin: "0% 50%",
                          willChange: "transform, opacity",
                          zIndex: -1,
                        }}
                      />
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {word.text.toUpperCase()}
                      </span>
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
