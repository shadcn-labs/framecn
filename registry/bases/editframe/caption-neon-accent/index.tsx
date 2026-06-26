"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionNeonAccentProps {
  words?: CaptionWord[];
  keywords?: string[];
  accentColors?: string[];
  primaryColor?: string;
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

const DEFAULT_KEYWORDS = [
  "hyperframes",
  "html",
  "professional",
  "code",
  "cinema",
];

const DEFAULT_ACCENT_COLORS = ["#53FF01", "#FF0002", "#FCFF00"];
const DEFAULT_PRIMARY_COLOR = "#FFFFFF";

const SAFE_ZONE_WIDTH = 1400;
const MIN_FONT_SIZE = 62;
const MAX_WORDS_PER_GROUP = 4;
const WORD_SPACING = 16;
const PAUSE_THRESHOLD = 0.1;
const ENTRY_DURATION_FRAMES = 7;
const WIGGLE_DISTANCE = 14;
const WIGGLE_CYCLE = 2 / 1.3;
const FONT_WIDTH_SAFETY = 1.14;

const TRANSITION_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "is",
  "are",
  "was",
  "were",
  "to",
  "of",
  "in",
  "on",
  "at",
  "for",
  "with",
  "by",
  "from",
  "as",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "if",
  "then",
  "so",
  "just",
  "not",
  "no",
  "yes",
  "up",
  "out",
  "about",
  "lets",
  "you",
  "write",
  "render",
]);

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10_000;
  return x - Math.floor(x);
};

const isKeyword = (text: string, keywords: string[]): boolean =>
  keywords.includes(text.toLowerCase().replaceAll(/[^a-z]/g, ""));

const shadowForColor = (color: string): string => {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const glow = `0 0 4px rgba(${r},${g},${b},1), 0 0 10px rgba(${r},${g},${b},0.9), 0 0 20px rgba(${r},${g},${b},0.7), 0 0 40px rgba(${r},${g},${b},0.4)`;
  return `0 8px 16px rgba(0,0,0,0.8), 0 16px 40px rgba(0,0,0,0.6), ${glow}`;
};

const measureWordWidth = (
  word: string,
  isAccent: boolean,
  fontSize: number,
  fontFamily: string,
  fontWeight: number | string
): number => {
  if (typeof document === "undefined") {
    return word.length * fontSize * 0.6;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const size = isAccent ? fontSize * 1.2 : fontSize;
  ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  return ctx.measureText(word.toUpperCase()).width * FONT_WIDTH_SAFETY;
};

const measureLineWidth = (
  words: CaptionWord[],
  isAccents: boolean[],
  fontSize: number,
  fontFamily: string,
  fontWeight: number | string
): number => {
  let total = 0;
  for (let i = 0; i < words.length; i += 1) {
    total +=
      measureWordWidth(
        words[i].text,
        isAccents[i],
        fontSize,
        fontFamily,
        fontWeight
      ) + (i ? WORD_SPACING : 0);
  }
  return total;
};

const assignWordColors = (
  words: CaptionWord[],
  groupIndex: number,
  keywords: string[],
  accentColors: string[],
  primaryColor: string
): { colors: string[]; isAccents: boolean[] } => {
  const colors: string[] = [];
  const isAccents: boolean[] = [];

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (isKeyword(word.text, keywords)) {
      const ci = Math.floor(
        seededRandom(groupIndex * 23 + 7) * accentColors.length
      );
      colors.push(accentColors[ci]);
      isAccents.push(true);
      continue;
    }
    const clean = word.text.toLowerCase().replaceAll(/[^a-z']/g, "");
    if (TRANSITION_WORDS.has(clean)) {
      colors.push(primaryColor);
      isAccents.push(false);
      continue;
    }
    const rand = seededRandom(groupIndex * 7 + i);
    if (rand > 0.6) {
      const ci = Math.floor(rand * accentColors.length) % accentColors.length;
      colors.push(accentColors[ci]);
      isAccents.push(true);
    } else {
      colors.push(primaryColor);
      isAccents.push(false);
    }
  }

  return { colors, isAccents };
};

const splitLinesForGroup = (
  words: CaptionWord[],
  isAccents: boolean[],
  colors: string[],
  fontSize: number,
  fontFamily: string,
  fontWeight: number | string
):
  | { words: CaptionWord[]; isAccents: boolean[]; colors: string[] }[]
  | null => {
  const maxW = SAFE_ZONE_WIDTH;

  if (
    words.some(
      (w, i) =>
        measureWordWidth(
          w.text,
          isAccents[i],
          fontSize,
          fontFamily,
          fontWeight
        ) > maxW
    )
  ) {
    return null;
  }

  if (
    measureLineWidth(words, isAccents, fontSize, fontFamily, fontWeight) <= maxW
  ) {
    return [{ colors, isAccents, words }];
  }

  let best:
    | { words: CaptionWord[]; isAccents: boolean[]; colors: string[] }[]
    | null = null;
  let bestDiff = Infinity;

  for (let split = 1; split < words.length; split += 1) {
    const fw = words.slice(0, split);
    const sw = words.slice(split);
    const fc = isAccents.slice(0, split);
    const sc = isAccents.slice(split);
    const colL = colors.slice(0, split);
    const colR = colors.slice(split);

    const fW = measureLineWidth(fw, fc, fontSize, fontFamily, fontWeight);
    const sW = measureLineWidth(sw, sc, fontSize, fontFamily, fontWeight);

    if (fW <= maxW && sW <= maxW) {
      const diff = Math.abs(fW - sW);
      if (diff < bestDiff) {
        best = [
          { colors: colL, isAccents: fc, words: fw },
          { colors: colR, isAccents: sc, words: sw },
        ];
        bestDiff = diff;
      }
    }
  }

  return best;
};

const fitFontSize = (
  text: string,
  baseFontSize: number,
  fontFamily: string,
  fontWeight: number | string,
  maxWidth: number
): number => {
  if (typeof document === "undefined") {
    return baseFontSize;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
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

interface GroupData {
  words: CaptionWord[];
  colors: string[];
  isAccents: boolean[];
  fontSize: number;
  lines: { words: CaptionWord[]; isAccents: boolean[]; colors: string[] }[];
  start: number;
  end: number;
  visibleStart: number;
  visibleEnd: number;
}

const makeGroup = (
  words: CaptionWord[],
  groupIndex: number,
  totalDuration: number,
  prevGroup: GroupData | null,
  keywords: string[],
  accentColors: string[],
  primaryColor: string,
  fontFamily: string,
  fontWeight: number | string
): GroupData => {
  const { colors, isAccents } = assignWordColors(
    words,
    groupIndex,
    keywords,
    accentColors,
    primaryColor
  );

  const groupText = words.map((w) => w.text.toUpperCase()).join(" ");
  let fontSize = fitFontSize(
    groupText,
    88,
    fontFamily,
    fontWeight,
    SAFE_ZONE_WIDTH
  );
  while (
    fontSize > MIN_FONT_SIZE &&
    !splitLinesForGroup(
      words,
      isAccents,
      colors,
      fontSize,
      fontFamily,
      fontWeight
    )
  ) {
    fontSize -= 2;
  }

  const lines = splitLinesForGroup(
    words,
    isAccents,
    colors,
    fontSize,
    fontFamily,
    fontWeight
  ) || [{ colors, isAccents, words }];

  const entryDuration = ENTRY_DURATION_FRAMES / 30;
  const groupStart = words[0].start;
  const groupEnd = words.at(-1)?.end ?? 0;
  const prevEnd = prevGroup ? prevGroup.end : 0;
  const availableGap = Math.max(0, groupStart - prevEnd);
  const entryLead = Math.min(entryDuration, availableGap);
  const visibleStart = Math.max(0, groupStart - entryLead);

  return {
    colors,
    end: groupEnd,
    fontSize,
    isAccents,
    lines,
    start: groupStart,
    visibleEnd: totalDuration,
    visibleStart,
    words,
  };
};

const makeGroups = (
  words: CaptionWord[],
  totalDuration: number,
  keywords: string[],
  accentColors: string[],
  primaryColor: string,
  fontFamily: string,
  fontWeight: number | string
): GroupData[] => {
  const groups: GroupData[] = [];
  let current: CaptionWord[] = [];

  const createAndPush = (w: CaptionWord[]) => {
    const prev = groups.length > 0 ? (groups.at(-1) ?? null) : null;
    groups.push(
      makeGroup(
        w,
        groups.length,
        totalDuration,
        prev,
        keywords,
        accentColors,
        primaryColor,
        fontFamily,
        fontWeight
      )
    );
  };

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const nextWord = words[index + 1];
    const testGroup = [...current, word];

    const { colors: testColors, isAccents: testAccents } = assignWordColors(
      testGroup,
      groups.length,
      keywords,
      accentColors,
      primaryColor
    );

    const exceedsWords = testGroup.length > MAX_WORDS_PER_GROUP;
    const exceedsFit = !splitLinesForGroup(
      testGroup,
      testAccents,
      testColors,
      88,
      fontFamily,
      fontWeight
    );

    if (exceedsWords || exceedsFit) {
      if (current.length) {
        createAndPush(current);
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
      createAndPush(current);
      current = [];
    }
  }

  if (current.length) {
    createAndPush(current);
  }

  // Patch visibleEnd for each group
  for (let i = 0; i < groups.length - 1; i += 1) {
    groups[i].visibleEnd = groups[i + 1].visibleStart;
  }

  return groups;
};

export const CaptionNeonAccent = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  accentColors = DEFAULT_ACCENT_COLORS,
  primaryColor = DEFAULT_PRIMARY_COLOR,
  fontSize: _fontSize = 88,
  fontWeight = 800,
  fontFamily = "'Montserrat', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionNeonAccentProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationSec = durationInFrames / fps;
  const durationMs = durationSec * 1000;

  const groups = makeGroups(
    words,
    durationSec,
    keywords,
    accentColors,
    primaryColor,
    fontFamily,
    fontWeight
  );

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  const entryDurationMs = (ENTRY_DURATION_FRAMES / fps) * 1000;
  const wiggleCycleMs = (WIGGLE_CYCLE * 1000) / safeSpeed;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes neon-grp-entry {
            from { opacity: 0; transform: scale(0.65); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes neon-grp-exit {
            to { opacity: 0; }
          }
          @keyframes neon-grp-show {
            to { visibility: visible; }
          }
          @keyframes neon-grp-hide {
            to { visibility: hidden; }
          }
          @keyframes neon-wiggle-up {
            0% { transform: translate(0, 0); }
            50% { transform: translate(var(--neon-dx), var(--neon-dy)); }
            100% { transform: translate(0, 0); }
          }
          @keyframes neon-wiggle-down {
            0% { transform: translate(0, 0); }
            50% { transform: translate(calc(-1 * var(--neon-dx)), calc(-1 * var(--neon-dy))); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
        <div
          style={
            {
              bottom: 100,
              height: 260,
              left: "50%",
              position: "absolute",
              transform: "translateX(-50%)",
              width: SAFE_ZONE_WIDTH,
            } as CSSProperties
          }
        >
          {groups.map((group, gi) => {
            const _groupStartMs = (group.start * 1000) / safeSpeed;
            const groupVisibleStartMs = (group.visibleStart * 1000) / safeSpeed;
            const groupVisibleEndMs = (group.visibleEnd * 1000) / safeSpeed;
            const direction = gi % 2 === 0 ? -1 : 1;
            const dx = WIGGLE_DISTANCE * direction;
            const dy = WIGGLE_DISTANCE * direction;
            const wiggleVisibleDuration =
              (group.visibleEnd - group.visibleStart) / safeSpeed;
            const wiggleCycles = Math.max(
              1,
              Math.ceil(wiggleVisibleDuration / WIGGLE_CYCLE)
            );
            const _wiggleRepeatCount = Math.max(0, wiggleCycles * 2 - 1);
            const wiggleAnim =
              direction < 0
                ? `neon-wiggle-up ${wiggleCycleMs}ms ease-in-out infinite`
                : `neon-wiggle-down ${wiggleCycleMs}ms ease-in-out infinite`;

            return (
              <div
                key={gi}
                style={
                  {
                    "--neon-dx": `${dx}px`,
                    "--neon-dy": `${dy}px`,
                    alignItems: "center",
                    animation: [
                      `neon-grp-show 1ms linear ${groupVisibleStartMs}ms both`,
                      `neon-grp-entry ${entryDurationMs}ms ease-out ${groupVisibleStartMs}ms both`,
                      wiggleAnim,
                      `neon-grp-hide 1ms linear ${groupVisibleEndMs}ms forwards`,
                      `neon-grp-exit 1ms linear ${groupVisibleEndMs}ms forwards`,
                    ].join(", "),
                    backfaceVisibility: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: 260,
                    justifyContent: "center",
                    left: 0,
                    position: "absolute",
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
                  {group.lines.slice(0, 2).map((line, li) => (
                    <div
                      key={li}
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: WORD_SPACING,
                        justifyContent: "center",
                        lineHeight: 1.1,
                        maxWidth: SAFE_ZONE_WIDTH,
                        whiteSpace: "nowrap",
                        width: "max-content",
                      }}
                    >
                      {line.words.map((word, wi) => {
                        const color = line.colors[wi];
                        const isAccent = line.isAccents[wi];
                        const wordSize = isAccent
                          ? group.fontSize * 1.2
                          : group.fontSize;
                        const _wordStartMs = (word.start * 1000) / safeSpeed;

                        return (
                          <span
                            key={wi}
                            style={{
                              color,
                              display: "inline-block",
                              fontFamily,
                              fontSize: wordSize,
                              fontWeight,
                              letterSpacing: 0,
                              lineHeight: 1.1,
                              textShadow: shadowForColor(color),
                              textTransform: "uppercase",
                            }}
                          >
                            {word.text.toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
