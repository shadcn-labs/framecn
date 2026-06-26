"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionNeonGlowProps {
  words?: CaptionWord[];
  keywords?: number[];
  fadedColor?: string;
  keywordColor?: string;
  normalColor?: string;
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

const RAW_GROUPS: [number, number, number, number][] = [
  [0, 3, 0, 1.05],
  [4, 7, 1.1, 2.05],
  [8, 8, 2.1, 2.6],
  [9, 12, 2.65, 3.5],
  [13, 15, 3.55, 4.4],
  [16, 16, 3.95, 4.75],
  [17, 19, 4.9, 5.4],
  [20, 22, 5.65, 6.2],
  [23, 24, 6.35, 6.75],
  [25, 27, 6.8, 7.8],
];

let _canvas: HTMLCanvasElement | null = null;
let _ctx: CanvasRenderingContext2D | null = null;

const getFitFontSize = (
  text: string,
  baseFontSize: number,
  fontWeight: number | string,
  fontFamily: string,
  maxWidth: number
): number => {
  if (typeof document === "undefined") {
    return baseFontSize;
  }
  if (!_canvas) {
    _canvas = document.createElement("canvas");
    _ctx = _canvas.getContext("2d");
  }
  if (!_ctx) {
    return baseFontSize;
  }
  let size = baseFontSize;
  const minSize = Math.floor(baseFontSize * 0.45);
  while (size > minSize) {
    _ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    if (_ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  return minSize;
};

export const CaptionNeonGlow = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  fadedColor = "rgba(0,255,240,0.14)",
  keywordColor = "#FF0099",
  normalColor = "#00FFF0",
  fontSize = 96,
  fontWeight = 900,
  fontFamily = "'Outfit', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionNeonGlowProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = RAW_GROUPS.map(([ws, we, gStart, gEnd]) => ({
    end: gEnd,
    start: gStart,
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
          @keyframes cng-grp-show {
            to { visibility: visible; }
          }
          @keyframes cng-grp-enter-opacity {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes cng-grp-enter-slide {
            from { transform: translateX(-8px); }
            to { transform: translateX(0); }
          }
          @keyframes cng-grp-exit {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(6px); }
          }
          @keyframes cng-grp-hide {
            to { visibility: hidden; }
          }
          @keyframes cng-glow-on-pink {
            to { color: ${keywordColor}; text-shadow: 0 0 10px ${keywordColor}, 0 0 35px ${keywordColor}, 0 0 90px ${keywordColor}; }
          }
          @keyframes cng-glow-on-cyan {
            to { color: ${normalColor}; text-shadow: 0 0 10px ${normalColor}, 0 0 35px ${normalColor}, 0 0 90px ${normalColor}; }
          }
          @keyframes cng-glow-off {
            to { color: ${fadedColor}; text-shadow: none; }
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
            const groupWords = words.slice(g.wordStart, g.wordEnd + 1);
            const groupText = groupWords
              .map((w) => w.text.toUpperCase())
              .join(" ");
            const fittedSize = getFitFontSize(
              groupText,
              fontSize,
              fontWeight,
              fontFamily,
              1760
            );
            const groupStartMs = (g.start * 1000) / safeSpeed;
            const groupEndMs = (g.end * 1000) / safeSpeed;
            const slideStartMs = groupStartMs + 50;
            const exitStartMs = groupEndMs - 100;

            return (
              <div
                key={gi}
                style={{
                  alignItems: "flex-end",
                  animation: [
                    `cng-grp-show 1ms linear ${groupStartMs}ms both`,
                    `cng-grp-enter-opacity 50ms steps(1, end) ${groupStartMs}ms both`,
                    `cng-grp-enter-slide 140ms cubic-bezier(0.33, 1, 0.68, 1) ${slideStartMs}ms both`,
                    `cng-grp-exit 100ms steps(1, end) ${exitStartMs}ms forwards`,
                    `cng-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                  ].join(", "),
                  bottom: 120,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  justifyContent: "center",
                  left: 0,
                  padding: "0 80px",
                  position: "absolute",
                  right: 0,
                  visibility: "hidden",
                  width: "100%",
                  willChange: "opacity, transform, visibility",
                }}
              >
                {groupWords.map((word, i) => {
                  const wi = g.wordStart + i;
                  const wordStartMs = (word.start * 1000) / safeSpeed;
                  const wordEndMs = (word.end * 1000) / safeSpeed;
                  const isKW = keywords.includes(wi);

                  return (
                    <span
                      key={wi}
                      style={{
                        animation: [
                          isKW
                            ? `cng-glow-on-pink 60ms ease ${wordStartMs}ms both`
                            : `cng-glow-on-cyan 60ms ease ${wordStartMs}ms both`,
                          `cng-glow-off 60ms ease ${wordEndMs}ms forwards`,
                        ].join(", "),
                        color: fadedColor,
                        display: "inline-block",
                        fontFamily,
                        fontSize: fittedSize,
                        fontWeight,
                        letterSpacing: "0.04em",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        willChange: "color, text-shadow",
                      }}
                    >
                      {word.text}
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
