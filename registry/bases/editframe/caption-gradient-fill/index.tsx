"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionGradientFillProps {
  words?: CaptionWord[];
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  gradient?: string;
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
  [13, 14],
  [15, 16],
  [17, 18],
  [19, 22],
  [23, 24],
  [25, 27],
];

const GROUP_TIMINGS: [number, number][] = [
  [0, 1.05],
  [1.1, 2.05],
  [2.1, 2.6],
  [2.65, 3.5],
  [3.55, 3.9],
  [3.95, 4.75],
  [4.9, 5.4],
  [5.5, 6.2],
  [6.35, 6.75],
  [6.8, 7.8],
];

const DEFAULT_GRADIENT =
  "linear-gradient(90deg, #fe9f1b 0%, #f76e49 10%, #ff2063 20%, #fd56cb 30%, #ef7aff 40%, #fe9f1b 50%, white 50.5%, white 100%)";

export const CaptionGradientFill = ({
  words = DEFAULT_WORDS,
  fontSize = 100,
  fontWeight = 900,
  fontFamily = "'Montserrat', sans-serif",
  gradient = DEFAULT_GRADIENT,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionGradientFillProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = RAW_GROUPS.map(([ws, we], gi) => {
    const [gStart, gEnd] = GROUP_TIMINGS[gi];
    const lastWordEnd = words[we].end;
    const nextStart =
      gi + 1 < RAW_GROUPS.length ? GROUP_TIMINGS[gi + 1][0] : lastWordEnd + 0.5;
    const gap = nextStart - lastWordEnd;
    const fadeDur = Math.min(0.25, gap * 0.8);
    const fadeStart = nextStart - fadeDur;
    return {
      end: gEnd,
      fadeDur,
      fadeStart,
      groupEnd: nextStart,
      start: gStart,
      wordEnd: we,
      wordStart: ws,
    };
  });

  const containerStyle: CSSProperties = {
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
          @keyframes cgf-grp-show {
            to { visibility: visible; opacity: 1; }
          }
          @keyframes cgf-grp-hide {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
          }
          @keyframes cgf-sweep {
            from { background-position: 45% 0; }
            to { background-position: 0% 0; }
          }
          @keyframes cgf-sweep-reset {
            to { background-position: 100% 0; }
          }
          @keyframes cgf-scale-up {
            to { transform: scale(1.04); }
          }
          @keyframes cgf-scale-down {
            from { transform: scale(1.04); }
            to { transform: scale(1); }
          }
        `}</style>
        <div
          style={
            {
              bottom: 120,
              left: 0,
              position: "absolute",
              right: 0,
              zIndex: 10,
            } as CSSProperties
          }
        >
          {groups.map((g, gi) => {
            const groupWords = words.slice(g.wordStart, g.wordEnd + 1);
            const groupStartMs = g.start * 1000;
            const _groupEndMs = g.groupEnd * 1000;
            const fadeStartMs = g.fadeStart * 1000;
            const fadeDurMs = g.fadeDur * 1000;

            return (
              <div
                key={gi}
                style={{
                  alignItems: "flex-end",
                  animation: [
                    `cgf-grp-show 1ms linear ${groupStartMs}ms both`,
                    `cgf-grp-hide ${fadeDurMs}ms linear ${fadeStartMs}ms forwards`,
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
                  visibility: "hidden",
                  width: "100%",
                }}
              >
                {groupWords.map((word, i) => {
                  const wi = g.wordStart + i;
                  const wordStartMs = word.start * 1000;
                  const wordEndMs = word.end * 1000;
                  const sweepDurMs = (word.end - word.start) * 1000;

                  return (
                    <span
                      key={wi}
                      style={{
                        WebkitBackgroundClip: "text",
                        animation: [
                          `cgf-sweep ${sweepDurMs}ms linear ${wordStartMs}ms both`,
                          `cgf-sweep-reset 1ms linear ${wordEndMs}ms forwards`,
                          `cgf-scale-up 1ms linear ${wordStartMs}ms both`,
                          `cgf-scale-down 150ms ease-out ${wordEndMs}ms forwards`,
                        ].join(", "),
                        background: gradient,
                        backgroundClip: "text",
                        backgroundPosition: "100% 0",
                        backgroundSize: "350% 100%",
                        color: "transparent",
                        display: "inline-block",
                        fontFamily,
                        fontSize,
                        fontWeight,
                        letterSpacing: "0.04em",
                        lineHeight: 1.15,
                        paddingBottom: "0.05em",
                        textTransform: "uppercase",
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
