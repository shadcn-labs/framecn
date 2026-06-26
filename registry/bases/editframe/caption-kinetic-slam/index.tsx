"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionKineticSlamProps {
  words?: CaptionWord[];
  keywords?: number[];
  color?: string;
  keywordColor?: string;
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

const fitFontSize = (
  text: string,
  baseFontSize: number,
  fontWeight: number | string,
  fontFamily: string,
  maxWidth: number
): number => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return baseFontSize;
  }

  let size = baseFontSize;
  const minSize = Math.floor(baseFontSize * 0.45);

  while (size > minSize) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }

  return minSize;
};

const ENTER_DURATIONS: Record<number, number> = {
  0: 220,
  1: 200,
  2: 200,
  3: 240,
};

const ENTER_EASINGS: Record<number, string> = {
  0: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  1: "cubic-bezier(0.16, 1, 0.3, 1)",
  2: "cubic-bezier(0.16, 1, 0.3, 1)",
  3: "cubic-bezier(0.34, 1.8, 0.64, 1)",
};

const ENTER_KEYFRAMES: Record<number, string> = {
  0: "cks-enter-top",
  1: "cks-enter-left",
  2: "cks-enter-right",
  3: "cks-enter-scale",
};

export const CaptionKineticSlam = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  color = "#ffffff",
  keywordColor = "#FFD700",
  fontSize = 220,
  fontWeight = 400,
  fontFamily = "'Anton', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionKineticSlamProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

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
          @keyframes cks-show {
            to { visibility: visible; }
          }
          @keyframes cks-hide {
            to { visibility: hidden; opacity: 0; }
          }
          @keyframes cks-enter-top {
            from { transform: translateY(-120px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes cks-enter-left {
            from { transform: translateX(-300px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes cks-enter-right {
            from { transform: translateX(300px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes cks-enter-scale {
            from { transform: scale(0.4); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes cks-fade-out {
            to { opacity: 0; }
          }
        `}</style>
        <div
          style={
            {
              bottom: 0,
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            } as CSSProperties
          }
        >
          {words.map((w, wi) => {
            const startMs = (w.start * 1000) / safeSpeed;
            const endMs = (w.end * 1000) / safeSpeed;
            const isKW = keywords.includes(wi);
            const entranceMode = wi % 4;
            const upperText = w.text.toUpperCase();
            const computedFontSize = fitFontSize(
              upperText,
              fontSize,
              fontWeight,
              fontFamily,
              1720
            );

            const entranceDuration = ENTER_DURATIONS[entranceMode];
            const entranceEasing = ENTER_EASINGS[entranceMode];
            const entranceKeyframe = ENTER_KEYFRAMES[entranceMode];

            const fadeOutDuration = 100;
            const hideDelay = endMs + 100;

            return (
              <span
                key={wi}
                style={
                  {
                    alignItems: "center",
                    animation: [
                      `cks-show 1ms linear ${startMs}ms both`,
                      `${entranceKeyframe} ${entranceDuration}ms ${entranceEasing} ${startMs}ms both`,
                      `cks-fade-out ${fadeOutDuration}ms cubic-bezier(0.55, 0.085, 0.68, 0.53) ${endMs}ms forwards`,
                      `cks-hide 1ms linear ${hideDelay}ms forwards`,
                    ].join(", "),
                    bottom: 0,
                    color: isKW ? keywordColor : color,
                    display: "flex",
                    fontFamily,
                    fontSize: computedFontSize,
                    fontWeight,
                    justifyContent: "center",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    position: "absolute",
                    textAlign: "center",
                    textTransform: "uppercase",
                    top: 0,
                    visibility: "hidden",
                    width: "100%",
                    willChange: "transform, opacity",
                  } as CSSProperties
                }
              >
                {upperText}
              </span>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
