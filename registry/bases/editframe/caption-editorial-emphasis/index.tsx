"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

type WordType = "n" | "i" | "e";
type WordPair = [number, WordType];

interface Block {
  line1: WordPair[];
  line2: WordPair[] | null;
}

export interface CaptionEditorialEmphasisProps {
  words?: CaptionWord[];
  blocks?: Block[];
  color?: string;
  safeWidth?: number;
  entryDuration?: number;
  slideDuration?: number;
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

const DEFAULT_BLOCKS: Block[] = [
  {
    line1: [
      [0, "n"],
      [1, "n"],
      [2, "n"],
    ],
    line2: [
      [3, "n"],
      [4, "n"],
    ],
  },
  {
    line1: [
      [5, "n"],
      [6, "n"],
    ],
    line2: [[7, "e"]],
  },
  { line1: [[8, "e"]], line2: null },
  {
    line1: [
      [9, "n"],
      [10, "n"],
      [11, "n"],
    ],
    line2: [[12, "e"]],
  },
  {
    line1: [
      [13, "n"],
      [14, "n"],
    ],
    line2: [[15, "e"]],
  },
  {
    line1: [
      [16, "n"],
      [17, "n"],
    ],
    line2: null,
  },
  {
    line1: [[18, "n"]],
    line2: [
      [19, "n"],
      [20, "n"],
    ],
  },
  {
    line1: [
      [21, "n"],
      [22, "n"],
    ],
    line2: null,
  },
  {
    line1: [
      [23, "i"],
      [24, "e"],
    ],
    line2: null,
  },
  {
    line1: [
      [25, "n"],
      [26, "n"],
    ],
    line2: [[27, "e"]],
  },
];

const DURATION = 8;
const ENTRY_DUR = 0.1;
const SLIDE_DUR = 0.2;

let _fitCanvas: HTMLCanvasElement | null = null;
let _fitCtx: CanvasRenderingContext2D | null = null;

const fitFontSize = (
  text: string,
  baseFontSize: number,
  fontWeight: string,
  fontFamily: string,
  maxWidth: number
): number => {
  try {
    if (!_fitCanvas) {
      _fitCanvas = document.createElement("canvas");
      _fitCtx = _fitCanvas.getContext("2d");
    }
    if (!_fitCtx) {
      return baseFontSize;
    }

    let size = baseFontSize;
    const minSize = Math.floor(baseFontSize * 0.45);
    while (size > minSize) {
      _fitCtx.font = `${fontWeight} ${size}px ${fontFamily}`;
      if (_fitCtx.measureText(text).width <= maxWidth) {
        return size;
      }
      size -= 2;
    }
    return minSize;
  } catch {
    return baseFontSize;
  }
};

const computeLineSize = (
  pairs: WordPair[],
  words: CaptionWord[],
  safeWidth: number
): number => {
  const hasEmphasis = pairs.some((p) => p[1] === "e");
  const lineText = pairs.map((p) => words[p[0]].text).join(" ");
  if (hasEmphasis) {
    return fitFontSize(lineText, 180, "800", "Playfair Display", safeWidth);
  }
  return fitFontSize(lineText, 86, "400", "Inter", safeWidth);
};

export const CaptionEditorialEmphasis = ({
  words = DEFAULT_WORDS,
  blocks = DEFAULT_BLOCKS,
  color = "#f5f0d0",
  safeWidth = 1800,
  entryDuration = ENTRY_DUR,
  slideDuration = SLIDE_DUR,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionEditorialEmphasisProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  const blockData = blocks.map((block, bi) => {
    const [[firstWordIdx]] = block.line1;
    const blockStart = words[firstWordIdx].start;
    const nextStart =
      bi < blocks.length - 1
        ? words[blocks[bi + 1].line1[0][0]].start
        : DURATION;

    const l1Size = computeLineSize(block.line1, words, safeWidth);

    let l2Pairs: WordPair[] | null = null;
    let l2Size = 0;
    let l2HasEmphasis = false;
    let l2Start = 0;

    if (block.line2) {
      l2Pairs = block.line2;
      l2Size = computeLineSize(l2Pairs, words, safeWidth);
      l2HasEmphasis = l2Pairs.some((p) => p[1] === "e");
      l2Start = words[l2Pairs[0][0]].start;
    }

    return {
      blockStart,
      l1Pairs: block.line1,
      l1Size,
      l2HasEmphasis,
      l2Pairs,
      l2Size,
      l2Start,
      nextStart,
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
          @keyframes ce-grp-show {
            to { visibility: visible; opacity: 1; }
          }
          @keyframes ce-grp-hide {
            to { visibility: hidden; opacity: 0; }
          }
          @keyframes ce-word-in {
            from { opacity: 0; transform: scale(1.12); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes ce-slide-in {
            from { opacity: 0; transform: translateX(-1920px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        <div
          style={
            {
              height: 430,
              left: 60,
              pointerEvents: "none",
              position: "absolute",
              top: 580,
              width: safeWidth,
            } as CSSProperties
          }
        >
          {blockData.map((bd, bi) => {
            const blockStartMs = bd.blockStart * 1000;
            const nextStartMs = bd.nextStart * 1000;

            return (
              <div
                key={bi}
                style={
                  {
                    animation: [
                      `ce-grp-show 1ms linear ${blockStartMs}ms both`,
                      `ce-grp-hide 1ms linear ${nextStartMs}ms forwards`,
                    ].join(", "),
                    backfaceVisibility: "hidden",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    transformOrigin: "0% 0%",
                    visibility: "hidden",
                    willChange: "transform, opacity",
                  } as CSSProperties
                }
              >
                <div
                  style={{
                    alignItems: "baseline",
                    display: "flex",
                    gap: 14,
                    lineHeight: 1.1,
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {bd.l1Pairs.map((pair, wi) => {
                    const [wordIdx, wordType] = pair;
                    const wordStartMs = words[wordIdx].start * 1000;
                    const isEmphasis = wordType === "e";

                    return (
                      <span
                        key={wi}
                        style={
                          {
                            animation: `ce-word-in ${entryDuration * 1000}ms ease-out ${wordStartMs}ms both`,
                            backfaceVisibility: "hidden",
                            color,
                            display: "inline-block",
                            fontFamily: isEmphasis
                              ? "'Playfair Display', serif"
                              : "'Inter', sans-serif",
                            fontSize: bd.l1Size,
                            fontStyle:
                              wordType === "i" || isEmphasis
                                ? "italic"
                                : "normal",
                            fontWeight: isEmphasis ? 800 : 400,
                            lineHeight: isEmphasis ? 0.9 : undefined,
                            opacity: 0,
                            textShadow:
                              "0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)",
                            transform: "scale(1.12)",
                            transformOrigin: "0% 100%",
                            willChange: "transform, opacity",
                          } as CSSProperties
                        }
                      >
                        {words[wordIdx].text}
                      </span>
                    );
                  })}
                </div>
                {bd.l2Pairs && (
                  <div
                    style={
                      {
                        alignItems: "baseline",
                        display: "flex",
                        gap: 14,
                        lineHeight: 1.1,
                        marginTop: 8,
                        whiteSpace: "nowrap" as const,
                        ...(bd.l2HasEmphasis
                          ? {
                              animation: `ce-slide-in ${slideDuration * 1000}ms ease-out ${bd.l2Start * 1000}ms both`,
                              backfaceVisibility: "hidden",
                              opacity: 0,
                              transform: "translateX(-1920px)",
                              willChange: "transform, opacity",
                            }
                          : {}),
                      } as CSSProperties
                    }
                  >
                    {bd.l2Pairs.map((pair, wi) => {
                      const [wordIdx, wordType] = pair;
                      const wordStartMs = words[wordIdx].start * 1000;
                      const isEmphasis = wordType === "e";

                      if (bd.l2HasEmphasis) {
                        return (
                          <span
                            key={wi}
                            style={
                              {
                                backfaceVisibility: "hidden",
                                color,
                                display: "inline-block",
                                fontFamily: isEmphasis
                                  ? "'Playfair Display', serif"
                                  : "'Inter', sans-serif",
                                fontSize: bd.l2Size,
                                fontStyle:
                                  wordType === "i" || isEmphasis
                                    ? "italic"
                                    : "normal",
                                fontWeight: isEmphasis ? 800 : 400,
                                lineHeight: isEmphasis ? 0.9 : undefined,
                                textShadow:
                                  "0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)",
                              } as CSSProperties
                            }
                          >
                            {words[wordIdx].text}
                          </span>
                        );
                      }

                      return (
                        <span
                          key={wi}
                          style={
                            {
                              animation: `ce-word-in ${entryDuration * 1000}ms ease-out ${wordStartMs}ms both`,
                              backfaceVisibility: "hidden",
                              color,
                              display: "inline-block",
                              fontFamily: "'Inter', sans-serif",
                              fontSize: bd.l2Size,
                              fontStyle: "normal",
                              fontWeight: 400,
                              opacity: 0,
                              textShadow:
                                "0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)",
                              transform: "scale(1.12)",
                              transformOrigin: "0% 100%",
                              willChange: "transform, opacity",
                            } as CSSProperties
                          }
                        >
                          {words[wordIdx].text}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
