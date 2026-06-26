"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionEmojiPopProps {
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
const DEFAULT_ACCENT_COLORS = ["#FF76FF", "#FF0002", "#B2F7FF"];

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
]);

const WORD_EMOJI: Record<string, string> = {
  cinema: "🎥",
  code: "⌨️",
  frame: "🖼️",
  html: "💻",
  hyperframes: "🎬",
  professional: "✨",
  video: "📹",
};

const RAW_GROUPS: [number, number][] = [
  [0, 2],
  [3, 5],
  [6, 7],
  [8, 10],
  [11, 13],
  [14, 16],
  [17, 18],
  [19, 21],
  [22, 22],
  [23, 25],
  [26, 27],
];

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10_000;
  return x - Math.floor(x);
};

const assignWordColors = (
  words: CaptionWord[],
  groupIndex: number,
  keywords: string[],
  accentColors: string[]
): string[] =>
  words.map((word, index) => {
    const clean = word.text.toLowerCase().replaceAll(/[^a-z]/g, "");
    if (keywords.includes(clean)) {
      const ci = Math.floor(
        seededRandom(groupIndex * 23 + index * 31) * accentColors.length
      );
      return accentColors[ci];
    }
    if (TRANSITION_WORDS.has(clean)) {
      return "#FFFFFF";
    }
    const rand = seededRandom(groupIndex * 13 + index);
    if (rand > 0.55) {
      const ci2 = Math.floor(rand * accentColors.length) % accentColors.length;
      return accentColors[ci2];
    }
    return "#FFFFFF";
  });

const shadowForColor = (color: string): string => {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `0 4px 8px rgba(0,0,0,0.7), 0 0 2px rgba(${r},${g},${b},1), 0 0 8px rgba(${r},${g},${b},0.6)`;
};

export const CaptionEmojiPop = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  accentColors = DEFAULT_ACCENT_COLORS,
  fontSize = 72,
  fontWeight = 900,
  fontFamily = "'Gabarito', Arial, sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionEmojiPopProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const totalSec = durationInFrames / fps;
  const ENTRY_DURATION = 4 / fps;
  const EXIT_DURATION = 3 / fps;

  const groups = RAW_GROUPS.map(([ws, we]) => ({
    end: words[we].end,
    start: words[ws].start,
    wordEnd: we,
    wordStart: ws,
  }));

  const visibleStarts = groups.map((group, gi) => {
    const prev = gi > 0 ? groups[gi - 1] : null;
    const availableGap = prev
      ? Math.max(0, group.start - prev.end)
      : ENTRY_DURATION;
    const entryLead = Math.min(ENTRY_DURATION, availableGap);
    return Math.max(0, group.start - entryLead);
  });

  const visibleEnds = visibleStarts.map((_, i) =>
    i < visibleStarts.length - 1 ? visibleStarts[i + 1] : totalSec
  );

  const exitStarts = groups.map((_, i) =>
    Math.max(visibleStarts[i], visibleEnds[i] - EXIT_DURATION)
  );

  const keyframesCSS = groups
    .map((_, gi) => {
      const vs = visibleStarts[gi];
      const ve = visibleEnds[gi];
      const xs = exitStarts[gi];
      const total = ve - vs;
      if (total <= 0) {
        return "";
      }
      const entryPct = ((ENTRY_DURATION / total) * 100).toFixed(2);
      const exitPct = (((xs - vs) / total) * 100).toFixed(2);
      return `@keyframes ce-g${gi}{0%{opacity:0;transform:scaleX(0.8) scaleY(1)}${entryPct}%{opacity:1;transform:scaleX(1) scaleY(1)}${exitPct}%{opacity:0.8;transform:scaleX(0.75) scaleY(1)}100%{opacity:0}}`;
    })
    .filter(Boolean)
    .join("\n");

  const emojiKF = `@keyframes ce-emoji-pop{0%{transform:translate(-50%,calc(-50% - 70px)) scale(0)}60%{transform:translate(-50%,calc(-50% - 70px)) scale(1.2)}80%{transform:translate(-50%,calc(-50% - 70px)) scale(0.9)}100%{transform:translate(-50%,calc(-50% - 70px)) scale(1)}}`;

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
        <style>{`${keyframesCSS}\n${emojiKF}`}</style>
        <div
          style={
            {
              inset: 0,
              pointerEvents: "none",
              position: "absolute",
              transform: "translateZ(0)",
              zIndex: 20,
            } as CSSProperties
          }
        >
          <div
            style={{
              alignItems: "center",
              bottom: 80,
              display: "flex",
              height: 280,
              justifyContent: "center",
              left: "50%",
              position: "absolute",
              transform: "translateX(-50%)",
              width: 1400,
            }}
          >
            {groups.map((g, gi) => {
              const groupWords = words.slice(g.wordStart, g.wordEnd + 1);
              const vsMs = (visibleStarts[gi] * 1000) / safeSpeed;
              const durMs =
                ((visibleEnds[gi] - visibleStarts[gi]) * 1000) / safeSpeed;
              const colors = assignWordColors(
                groupWords,
                gi,
                keywords,
                accentColors
              );

              let emoji: string | null = null;
              for (const word of groupWords) {
                const clean = word.text.toLowerCase().replaceAll(/[^a-z]/g, "");
                if (WORD_EMOJI[clean]) {
                  emoji = WORD_EMOJI[clean];
                  break;
                }
              }

              return (
                <div
                  key={gi}
                  style={{
                    alignItems: "center",
                    animation: `ce-g${gi} ${durMs}ms linear ${vsMs}ms both`,
                    backfaceVisibility: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.15em",
                    height: 280,
                    justifyContent: "center",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    transformOrigin: "50% 50%",
                    width: 1400,
                    willChange: "transform, opacity",
                  }}
                >
                  {emoji && (
                    <div
                      style={{
                        animation: `ce-emoji-pop 400ms ease-out ${vsMs + 100}ms both`,
                        fontFamily:
                          "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                        fontSize: 56,
                        left: "50%",
                        lineHeight: 1,
                        position: "absolute",
                        textAlign: "center",
                        top: "50%",
                        transform: "translate(-50%, calc(-50% - 70px))",
                        willChange: "transform",
                      }}
                    >
                      {emoji}
                    </div>
                  )}
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: 14,
                      justifyContent: "center",
                      lineHeight: 1.1,
                      maxWidth: 1400,
                      whiteSpace: "nowrap",
                      width: "max-content",
                    }}
                  >
                    {groupWords.map((word, i) => {
                      const color = colors[i];
                      return (
                        <span
                          key={i}
                          style={{
                            WebkitTextStroke: "3px #000000",
                            color,
                            display: "inline-block",
                            fontFamily,
                            fontSize,
                            fontWeight,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            paintOrder: "stroke fill",
                            textShadow:
                              color === "#FFFFFF"
                                ? undefined
                                : shadowForColor(color),
                            textTransform: "uppercase",
                          }}
                        >
                          {word.text.toUpperCase()}
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
