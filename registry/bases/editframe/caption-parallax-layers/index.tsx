"use client";

import { Timegroup } from "@editframe/react";
import { useMemo } from "react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionParallaxLayersProps {
  words?: CaptionWord[];
  behindColor?: string;
  color?: string;
  behindFontSize?: number;
  frontFontSize?: number;
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

interface Block {
  behind: number[][];
  front: number[][] | null;
}

const BLOCKS: Block[] = [
  { behind: [], front: [[0], [1], [2]] },
  { behind: [[3]], front: [[4], [5]] },
  { behind: [[6]], front: [[7]] },
  { behind: [[8]], front: [[9], [10], [11]] },
  { behind: [[12]], front: [[13], [14]] },
  { behind: [[15]], front: [[16]] },
  { behind: [], front: [[17], [18]] },
  { behind: [], front: [[19], [20], [21], [22]] },
  { behind: [[24]], front: [[23], [25], [26]] },
  { behind: [[27]], front: [] },
];

const BEHIND_MAX_WIDTH = 1800;
const FRONT_MAX_WIDTH = 1750;
const ENTRY_DUR = 100;

const fitFontSize = (
  text: string,
  baseFontSize: number,
  fontWeight: string,
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
    ctx.font = `${fontWeight} ${size}px Instrument Serif, Georgia, serif`;
    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  return minSize;
};

const blockStart = (bi: number, words: CaptionWord[]): number => {
  const b = BLOCKS[bi];
  const firstIdx =
    b.behind.length > 0 ? b.behind[0][0] : (b.front?.[0]?.[0] ?? 0);
  return words[firstIdx].start;
};

export const CaptionParallaxLayers = ({
  words = DEFAULT_WORDS,
  behindColor = "#e50914",
  color = "#eeeeee",
  behindFontSize = 220,
  frontFontSize = 130,
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionParallaxLayersProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationSec = durationInFrames / fps;
  const durationMs = durationSec * 1000;

  const blockData = useMemo(
    () =>
      BLOCKS.map((block, bi) => {
        const start = blockStart(bi, words);
        const nextStart =
          bi < BLOCKS.length - 1 ? blockStart(bi + 1, words) : durationSec;

        let behindWords: { text: string; size: number }[] = [];
        if (block.behind.length > 0) {
          const behindText = block.behind
            .map((wi) => words[wi[0]].text)
            .join(" ");
          const behindSize = fitFontSize(
            behindText,
            behindFontSize,
            "400",
            "'Instrument Serif', Georgia, serif",
            BEHIND_MAX_WIDTH
          );
          behindWords = block.behind.map((wi) => ({
            size: behindSize,
            text: words[wi[0]].text,
          }));
        }

        let frontWords: { italic: boolean; size: number; text: string }[] = [];
        if (block.front && block.front.length > 0) {
          const frontText = block.front
            .map((wi) => words[wi[0]].text)
            .join(" ");
          const frontSize = fitFontSize(
            frontText,
            frontFontSize,
            "400",
            "'Instrument Serif', Georgia, serif",
            FRONT_MAX_WIDTH
          );
          frontWords = block.front.map((wi) => ({
            italic: wi[0] === 7 || wi[0] === 18,
            size: frontSize,
            text: words[wi[0]].text,
          }));
        }

        return { behindWords, frontWords, nextStart, start };
      }),
    [words, behindFontSize, frontFontSize]
  );

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
          @keyframes cpl-grp-show {
            to { visibility: visible; }
          }
          @keyframes cpl-grp-hide {
            to { visibility: hidden; }
          }
          @keyframes cpl-word-fade {
            to { opacity: 1; }
          }
        `}</style>
        <div
          style={
            {
              left: 0,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
              transform: "translateZ(0)",
              width: 1920,
              zIndex: 10,
            } as CSSProperties
          }
        >
          <div
            style={{
              height: 500,
              left: 0,
              position: "absolute",
              top: 40,
              width: 1920,
            }}
          >
            {blockData.map((bd, bi) => {
              if (bd.behindWords.length === 0) {
                return null;
              }
              const groupStartMs = (bd.start * 1000) / safeSpeed;
              const groupEndMs = (bd.nextStart * 1000) / safeSpeed;
              return (
                <div
                  key={bi}
                  style={{
                    animation: [
                      `cpl-grp-show 1ms linear ${groupStartMs}ms both`,
                      `cpl-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                    ].join(", "),
                    left: "50%",
                    position: "absolute",
                    top: 0,
                    transform: "translateX(-50%)",
                    transformOrigin: "50% 50%",
                    visibility: "hidden",
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    style={{
                      alignItems: "baseline",
                      display: "flex",
                      gap: 14,
                      justifyContent: "center",
                      lineHeight: 0.9,
                      transform: "scaleY(2.8)",
                      transformOrigin: "50% 0%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bd.behindWords.map((bw, wi) => {
                      const wordStartMs =
                        (words[BLOCKS[bi].behind[wi][0]].start * 1000) /
                        safeSpeed;
                      return (
                        <span
                          key={wi}
                          style={{
                            WebkitTextStroke: `5px ${behindColor}`,
                            animation: `cpl-word-fade ${ENTRY_DUR}ms ease-out ${wordStartMs}ms both`,
                            color: behindColor,
                            display: "inline-block",
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: bw.size,
                            fontWeight: 400,
                            lineHeight: 0.9,
                            textShadow: "2px 4px 4px #a30610",
                            willChange: "transform, opacity",
                          }}
                        >
                          {bw.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={
            {
              left: 0,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
              transform: "translateZ(0)",
              width: 1920,
              zIndex: 30,
            } as CSSProperties
          }
        >
          <div
            style={{
              height: 300,
              left: 0,
              position: "absolute",
              top: 700,
              width: 1920,
            }}
          >
            {blockData.map((bd, bi) => {
              if (bd.frontWords.length === 0) {
                return null;
              }
              const groupStartMs = (bd.start * 1000) / safeSpeed;
              const groupEndMs = (bd.nextStart * 1000) / safeSpeed;
              return (
                <div
                  key={bi}
                  style={{
                    animation: [
                      `cpl-grp-show 1ms linear ${groupStartMs}ms both`,
                      `cpl-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                    ].join(", "),
                    left: "50%",
                    position: "absolute",
                    top: 0,
                    transform: "translateX(-50%)",
                    transformOrigin: "50% 50%",
                    visibility: "hidden",
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    style={{
                      alignItems: "baseline",
                      display: "flex",
                      gap: 14,
                      justifyContent: "center",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bd.frontWords.map((fw, wi) => {
                      const wordStartMs =
                        (words[BLOCKS[bi].front?.[wi]?.[0] ?? 0].start * 1000) /
                        safeSpeed;
                      return (
                        <span
                          key={wi}
                          style={{
                            animation: `cpl-word-fade ${ENTRY_DUR}ms ease-out ${wordStartMs}ms both`,
                            color,
                            display: "inline-block",
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: fw.size,
                            fontStyle: fw.italic ? "italic" : "normal",
                            fontWeight: 400,
                            lineHeight: 1.1,
                            textShadow:
                              "0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)",
                            willChange: "transform, opacity",
                          }}
                        >
                          {fw.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
