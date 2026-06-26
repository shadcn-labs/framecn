"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

/* ── Types ──────────────────────────────────────────────────────── */

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionWeightShiftProps {
  words?: CaptionWord[];
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeightLight?: number;
  fontWeightBold?: number;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

/* ── Constants (matching HTML) ──────────────────────────────────── */

const SAFE_ZONE_WIDTH = 1400;
const MAX_LINE_WIDTH = SAFE_ZONE_WIDTH - 40;
const DEFAULT_FONT_SIZE = 72;
const MAX_WORDS_PER_GROUP = 4;
const WORD_SPACING = 12;
const PAUSE_THRESHOLD = 0.1;
const ENTRY_DURATION = 100 / 1000;
const WEIGHT_TRANSITION = 100 / 1000;
const FONT_WIDTH_SAFETY = 1.14;
const DEFAULT_FONT_WEIGHT_LIGHT = 300;
const DEFAULT_FONT_WEIGHT_BOLD = 700;

/* ── Default transcript ─────────────────────────────────────────── */

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

/* ── Internal types for grouping ────────────────────────────────── */

interface CaptionLine {
  words: CaptionWord[];
  startIndex: number;
}

interface CaptionGroup {
  words: CaptionWord[];
  lines: CaptionLine[];
  start: number;
  end: number;
}

/* ── Canvas measurement (ported from HTML) ──────────────────────── */

let _fitCanvas: HTMLCanvasElement | null = null;
let _fitCtx: CanvasRenderingContext2D | null = null;
let _measureCanvas: HTMLCanvasElement | null = null;
let _measureCtx: CanvasRenderingContext2D | null = null;

const getFitContext = (): CanvasRenderingContext2D | null => {
  if (typeof document === "undefined") {
    return null;
  }
  if (!_fitCanvas) {
    _fitCanvas = document.createElement("canvas");
    _fitCtx = _fitCanvas.getContext("2d");
  }
  return _fitCtx;
};

const getMeasureContext = (
  fontWeight: number,
  fontSize: number,
  fontFamily: string
): CanvasRenderingContext2D | null => {
  if (typeof document === "undefined") {
    return null;
  }
  if (!_measureCanvas) {
    _measureCanvas = document.createElement("canvas");
    _measureCtx = _measureCanvas.getContext("2d");
  }
  if (_measureCtx) {
    _measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  }
  return _measureCtx;
};

const fitFontSize = (
  text: string,
  baseFontSize: number,
  fontWeight: number | string,
  fontFamily: string,
  maxWidth: number
): number => {
  const ctx = getFitContext();
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

/* ── Grouping algorithm (ported from HTML) ──────────────────────── */

const normalizeWords = (
  rawWords: CaptionWord[],
  duration: number
): CaptionWord[] =>
  rawWords
    .map((item) => ({
      end: Math.min(
        duration,
        Math.max(Number(item.start) || 0, Number(item.end) || 0)
      ),
      start: Math.max(0, Number(item.start) || 0),
      text: String(item.text || "").trim(),
    }))
    .filter((w) => w.text.length > 0);

const measureWord = (
  word: CaptionWord,
  ctx: CanvasRenderingContext2D
): number => ctx.measureText(word.text.toLowerCase()).width * FONT_WIDTH_SAFETY;

const measureLineWidth = (
  words: CaptionWord[],
  ctx: CanvasRenderingContext2D
): number => {
  let total = 0;
  for (let index = 0; index < words.length; index += 1) {
    total += measureWord(words[index], ctx) + (index ? WORD_SPACING : 0);
  }
  return total;
};

const fitsInTwoLines = (
  words: CaptionWord[],
  ctx: CanvasRenderingContext2D
): boolean => measureLineWidth(words, ctx) <= MAX_LINE_WIDTH * 1.8;

const splitLines = (
  words: CaptionWord[],
  ctx: CanvasRenderingContext2D
): CaptionLine[] => {
  if (words.length < 2) {
    return [{ startIndex: 0, words }];
  }
  let bestSplit = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let s = 1; s < words.length; s += 1) {
    const w1 = measureLineWidth(words.slice(0, s), ctx);
    const w2 = measureLineWidth(words.slice(s), ctx);
    if (w1 <= MAX_LINE_WIDTH && w2 <= MAX_LINE_WIDTH) {
      const diff = Math.abs(w1 - w2);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestSplit = s;
      }
    }
  }
  const result: CaptionLine[] = [];
  const line1 = words.slice(0, bestSplit);
  const line2 = words.slice(bestSplit);
  if (line1.length) {
    result.push({ startIndex: 0, words: line1 });
  }
  if (line2.length) {
    result.push({ startIndex: line1.length, words: line2 });
  }
  return result;
};

const makeGroup = (
  words: CaptionWord[],
  ctx: CanvasRenderingContext2D
): CaptionGroup => ({
  end: words.at(-1)?.end ?? 0,
  lines: splitLines(words, ctx),
  start: words[0].start,
  words: [...words],
});

const avoidSingleWordGroups = (
  groups: CaptionGroup[],
  ctx: CanvasRenderingContext2D
): CaptionGroup[] => {
  const out: CaptionGroup[] = [];
  for (const group of groups) {
    if (
      group.words.length === 1 &&
      out.length > 0 &&
      (out.at(-1)?.words.length ?? 0) < MAX_WORDS_PER_GROUP
    ) {
      out[out.length - 1] = makeGroup(
        [...(out.at(-1)?.words ?? []), ...group.words],
        ctx
      );
    } else {
      out.push(group);
    }
  }

  for (let i = 0; i < out.length; i += 1) {
    if (out[i].words.length !== 1) {
      continue;
    }
    if (i + 1 < out.length && out[i + 1].words.length < MAX_WORDS_PER_GROUP) {
      out[i] = makeGroup([...out[i].words, ...out[i + 1].words], ctx);
      out.splice(i + 1, 1);
    } else if (i > 0 && out[i - 1].words.length < MAX_WORDS_PER_GROUP) {
      out[i - 1] = makeGroup([...out[i - 1].words, ...out[i].words], ctx);
      out.splice(i, 1);
      i -= 1;
    }
  }

  return out;
};

const makeGroups = (
  words: CaptionWord[],
  ctx: CanvasRenderingContext2D
): CaptionGroup[] => {
  const groups: CaptionGroup[] = [];
  let current: CaptionWord[] = [];

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const nextWord = words[index + 1];
    const testGroup = [...current, word];

    if (
      testGroup.length > MAX_WORDS_PER_GROUP ||
      !fitsInTwoLines(testGroup, ctx)
    ) {
      if (current.length) {
        groups.push(makeGroup(current, ctx));
      }
      current = [word];
      continue;
    }

    current.push(word);
    const punctuation = /[,.:!?]$/.test(word.text);
    const pause = nextWord ? nextWord.start - word.end : 0;

    if (
      !nextWord ||
      punctuation ||
      pause >= PAUSE_THRESHOLD ||
      current.length >= MAX_WORDS_PER_GROUP
    ) {
      groups.push(makeGroup(current, ctx));
      current = [];
    }
  }

  if (current.length) {
    groups.push(makeGroup(current, ctx));
  }
  return avoidSingleWordGroups(groups, ctx);
};

/* ── Component ──────────────────────────────────────────────────── */

export const CaptionWeightShift = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  fontSize = DEFAULT_FONT_SIZE,
  fontFamily = "'Montserrat', Arial, sans-serif",
  fontWeightLight = DEFAULT_FONT_WEIGHT_LIGHT,
  fontWeightBold = DEFAULT_FONT_WEIGHT_BOLD,
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionWeightShiftProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationSec = durationInFrames / fps;
  const durationMs = durationSec * 1000;

  const normalizedWords = normalizeWords(words, durationSec);

  const measureCtx = getMeasureContext(fontWeightBold, fontSize, fontFamily);
  const groups = measureCtx
    ? makeGroups(normalizedWords, measureCtx)
    : (() => {
        const acc: CaptionGroup[] = [];
        for (const word of normalizedWords) {
          const last = acc.at(-1) ?? null;
          if (last && last.words.length < MAX_WORDS_PER_GROUP) {
            last.words.push(word);
            last.end = word.end;
          } else {
            acc.push({
              end: word.end,
              lines: [{ startIndex: 0, words: [word] }],
              start: word.start,
              words: [word],
            });
          }
        }
        return acc;
      })();

  const ENTRY_MS = ENTRY_DURATION * 1000;
  const WEIGHT_MS = WEIGHT_TRANSITION * 1000;

  const visibleStarts = groups.map((group, i) => {
    const prev = groups[i - 1];
    const availableGap = prev
      ? Math.max(0, group.start - prev.end)
      : ENTRY_DURATION;
    const entryLead = Math.min(ENTRY_DURATION, availableGap);
    return Math.max(0, group.start - entryLead);
  });

  const groupFontSizes = groups.map((group) => {
    const groupText = group.words.map((w) => w.text.toLowerCase()).join(" ");
    return fitFontSize(
      groupText,
      fontSize,
      fontWeightBold,
      fontFamily,
      MAX_LINE_WIDTH
    );
  });

  const keyframesCss = `
    @keyframes framecn-cws-show {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes framecn-cws-hide {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes framecn-cws-wl {
      from { font-weight: ${fontWeightBold}; }
      to   { font-weight: ${fontWeightLight}; }
    }
    @keyframes framecn-cws-wb {
      from { font-weight: ${fontWeightLight}; }
      to   { font-weight: ${fontWeightBold}; }
    }
  `;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={{
        background,
        height,
        overflow: "hidden",
        position: "relative",
        width,
      }}
    >
      <>
        <style>{keyframesCss}</style>
        <div
          style={
            {
              bottom: 100,
              display: "flex",
              height: 278,
              justifyContent: "center",
              left: "50%",
              position: "absolute",
              transform: "translateX(-50%)",
              width: SAFE_ZONE_WIDTH,
            } as CSSProperties
          }
        >
          {groups.map((group, gi) => {
            const visibleStartMs = (visibleStarts[gi] * 1000) / safeSpeed;
            const visibleEndMs =
              gi < groups.length - 1
                ? (visibleStarts[gi + 1] * 1000) / safeSpeed
                : (durationSec * 1000) / safeSpeed;
            const entryDurationMs = ENTRY_MS / safeSpeed;

            return (
              <div
                key={gi}
                style={
                  {
                    alignItems: "center",
                    animation: [
                      `framecn-cws-show ${entryDurationMs}ms ease-out ${visibleStartMs}ms both`,
                      `framecn-cws-hide 1ms linear ${visibleEndMs}ms forwards`,
                    ].join(", "),
                    backfaceVisibility: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: 278,
                    justifyContent: "center",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    textAlign: "center",
                    top: 0,
                    transformOrigin: "50% 50%",
                    visibility: "hidden",
                    width: SAFE_ZONE_WIDTH,
                    willChange: "transform",
                  } as CSSProperties
                }
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    maxWidth: SAFE_ZONE_WIDTH,
                    textAlign: "center",
                  }}
                >
                  {group.lines.map((line, li) => {
                    const is2Line = group.lines.length === 2;
                    const initialWeight =
                      li === 0 ? fontWeightBold : fontWeightLight;
                    const switchTimeMs =
                      is2Line && group.lines.length === 2
                        ? (group.lines[1].words[0].start * 1000) / safeSpeed
                        : 0;
                    let weightAnim: string | undefined;
                    if (is2Line && li === 0) {
                      weightAnim = `framecn-cws-wl ${WEIGHT_MS / safeSpeed}ms ease-out ${switchTimeMs}ms forwards`;
                    } else if (is2Line && li === 1) {
                      weightAnim = `framecn-cws-wb ${WEIGHT_MS / safeSpeed}ms ease-out ${switchTimeMs}ms forwards`;
                    }

                    return (
                      <div
                        key={li}
                        style={
                          {
                            alignItems: "center",
                            animation: weightAnim,
                            color,
                            display: "flex",
                            fontFamily,
                            fontSize: groupFontSizes[gi],
                            fontWeight: initialWeight,
                            gap: WORD_SPACING,
                            justifyContent: "center",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            maxWidth: SAFE_ZONE_WIDTH,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                            textTransform: "lowercase",
                            whiteSpace: "nowrap",
                            width: "max-content",
                            willChange: weightAnim ? "font-weight" : undefined,
                          } as CSSProperties
                        }
                      >
                        {line.words.map((word, wi) => (
                          <span key={wi} style={{ display: "inline-block" }}>
                            {word.text.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
