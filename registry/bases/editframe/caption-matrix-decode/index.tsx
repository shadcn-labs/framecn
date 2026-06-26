"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionMatrixDecodeProps {
  words?: CaptionWord[];
  color?: string;
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

const RAW_GROUPS: [number, number, number, number][] = [
  [0, 3, 0, 1.35],
  [4, 7, 1.1, 2.35],
  [8, 8, 2.1, 2.9],
  [9, 12, 2.65, 3.8],
  [13, 15, 3.55, 4.7],
  [16, 16, 3.95, 5],
  [17, 19, 4.9, 5.7],
  [20, 22, 5.65, 6.5],
  [23, 24, 6.35, 7.05],
  [25, 27, 6.8, 7.9],
];

const makeRng = (seed: number): (() => number) => {
  let s = (Math.abs(seed) % 2_147_483_646) + 1;
  return () => {
    s = (16_807 * s) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
};

const ALPHANUM =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const scrambleChars = (seed: number): string => {
  const rng = makeRng(seed);
  let result = "";
  for (let i = 0; i < 4; i += 1) {
    result += ALPHANUM[Math.floor(rng() * ALPHANUM.length)];
  }
  return result;
};

export const CaptionMatrixDecode = ({
  words = DEFAULT_WORDS,
  color = "#00ff41",
  fontSize = 96,
  fontWeight = 700,
  fontFamily = "'Space Grotesk', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionMatrixDecodeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = RAW_GROUPS.map(([ws, we, s, e]) => ({
    end: e,
    start: s,
    wordEnd: we,
    wordStart: ws,
  }));

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
          @keyframes cmd-grp-show {
            to { opacity: 1; }
          }
          @keyframes cmd-grp-hide {
            to { opacity: 0; }
          }
          @keyframes cmd-scr0-show {
            to { opacity: 1; }
          }
          @keyframes cmd-scr1-show {
            to { opacity: 1; }
          }
          @keyframes cmd-real-show {
            to { opacity: 1; }
          }
          @keyframes cmd-scanline {
            from { transform: translateY(0); }
            to { transform: translateY(8px); }
          }
        `}</style>
        <div
          style={
            {
              bottom: 120,
              left: 0,
              position: "absolute",
              right: 0,
            } as CSSProperties
          }
        >
          {groups.map((g, gi) => {
            const groupStartMs = (g.start * 1000) / safeSpeed;
            const groupEndMs = (g.end * 1000) / safeSpeed;

            return (
              <div
                key={gi}
                style={{
                  alignItems: "flex-end",
                  animation: [
                    `cmd-grp-show 1ms linear ${groupStartMs}ms both`,
                    `cmd-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                  ].join(", "),
                  bottom: 120,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  justifyContent: "center",
                  left: 0,
                  opacity: 0,
                  padding: "0 80px",
                  position: "absolute",
                  right: 0,
                  width: "100%",
                }}
              >
                {Array.from({ length: g.wordEnd - g.wordStart + 1 }, (_, i) => {
                  const wi = g.wordStart + i;
                  const word = words[wi];
                  const wordStartMs = (word.start * 1000) / safeSpeed;
                  const scr0Delay = wordStartMs;
                  const scr1Delay = wordStartMs + 100;
                  const realDelay = wordStartMs + 200;

                  return (
                    <span
                      key={wi}
                      style={{
                        color,
                        display: "inline-block",
                        fontFamily,
                        fontSize,
                        fontWeight,
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          animation: `cmd-real-show 1ms linear ${realDelay}ms both`,
                          display: "inline",
                          opacity: 0,
                        }}
                      >
                        {word.text}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          animation: `cmd-scr0-show 1ms linear ${scr0Delay}ms both`,
                          display: "inline",
                          left: 0,
                          opacity: 0,
                          position: "absolute",
                          top: 0,
                        }}
                      >
                        {scrambleChars(wi * 1000 + 0)}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          animation: `cmd-scr1-show 1ms linear ${scr1Delay}ms both`,
                          display: "inline",
                          left: 0,
                          opacity: 0,
                          position: "absolute",
                          top: 0,
                        }}
                      >
                        {scrambleChars(wi * 1000 + 1)}
                      </span>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, transparent 1px, transparent 3px)",
            bottom: 0,
            left: 0,
            pointerEvents: "none",
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 100,
          }}
        />
      </>
    </Timegroup>
  );
};
