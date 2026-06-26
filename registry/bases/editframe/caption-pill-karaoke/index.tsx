"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionPillKaraokeProps {
  words?: CaptionWord[];
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const _DURATION = 8;

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

const MAX_WORDS_PER_GROUP = 4;
const PAUSE_THRESHOLD = 0.1;
const GROUP_END_BUFFER = 0.3;
const WORD_FADE_LEAD = 0.05;
const COLOR_FADE_DURATION = 0.1;

const COLOR_INACTIVE = "#A6A6A6";
const COLOR_ACTIVE = "#1C1E1D";

interface Group {
  words: CaptionWord[];
  start: number;
  end: number;
}

const makeGroups = (words: CaptionWord[]): Group[] => {
  const groups: Group[] = [];
  let current: CaptionWord[] = [];

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const nextWord = words[index + 1];

    if (current.length >= MAX_WORDS_PER_GROUP) {
      groups.push({
        end: current.at(-1)?.end ?? 0,
        start: current[0].start,
        words: [...current],
      });
      current = [word];
      continue;
    }

    current.push(word);

    const hasPunctuation = /[,.:!?]$/.test(word.text);
    const pauseDuration = nextWord ? nextWord.start - word.end : 0;
    const hasNaturalPause = pauseDuration >= PAUSE_THRESHOLD;
    const maxWordsReached = current.length >= MAX_WORDS_PER_GROUP;

    if (maxWordsReached || !nextWord || hasPunctuation || hasNaturalPause) {
      groups.push({
        end: current.at(-1)?.end ?? 0,
        start: current[0].start,
        words: [...current],
      });
      current = [];
    }
  }

  if (current.length) {
    groups.push({
      end: current.at(-1)?.end ?? 0,
      start: current[0].start,
      words: [...current],
    });
  }

  return groups;
};

export const CaptionPillKaraoke = ({
  words = DEFAULT_WORDS,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionPillKaraokeProps) => {
  const durationSec = durationInFrames / fps;
  const groups = makeGroups(words);

  const containerStyle: CSSProperties = {
    background: "transparent",
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${(durationInFrames / fps) * 1000}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes cpk-grp-show {
            to { visibility: visible; }
          }
          @keyframes cpk-grp-hide {
            to { visibility: hidden; opacity: 0; }
          }
          @keyframes cpk-word-active {
            to { color: var(--cpk-active-color); }
          }
        `}</style>
        <div
          style={
            {
              "--cpk-active-color": COLOR_ACTIVE,
              "--cpk-inactive-color": COLOR_INACTIVE,
              bottom: 100,
              left: 0,
              position: "absolute",
              right: 0,
            } as CSSProperties
          }
        >
          {groups.map((group, gi) => {
            const nextGroup = groups[gi + 1];
            const isLastGroup = gi === groups.length - 1;
            const effectiveEnd = isLastGroup
              ? durationSec
              : Math.min(nextGroup.start, group.end + GROUP_END_BUFFER);
            const visibleStart = Math.max(0, group.start);
            const visibleEnd = Math.max(visibleStart + 0.01, effectiveEnd);

            const groupStartMs = visibleStart * 1000;
            const groupEndMs = visibleEnd * 1000;

            return (
              <div
                key={gi}
                style={{
                  alignItems: "center",
                  animation: [
                    `cpk-grp-show 1ms linear ${groupStartMs}ms both`,
                    `cpk-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                  ].join(", "),
                  bottom: 0,
                  display: "flex",
                  justifyContent: "center",
                  left: 0,
                  position: "absolute",
                  right: 0,
                  top: 0,
                  visibility: "hidden",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: "#e7e5e7",
                    borderRadius: 22,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: 1600,
                    padding: "18px 60px 20px",
                    width: "fit-content",
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      color: COLOR_INACTIVE,
                      display: "flex",
                      flexDirection: "column",
                      fontFamily: "'Poppins', Arial, sans-serif",
                      fontSize: 72,
                      fontWeight: 700,
                      justifyContent: "center",
                      lineHeight: 1.16,
                      overflow: "visible",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        columnGap: 16,
                        display: "flex",
                        justifyContent: "center",
                        lineHeight: 1.16,
                        overflow: "visible",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {group.words.map((word, wi) => {
                        const isFirstWord = wi === 0;
                        const wordStartMs =
                          Math.max(visibleStart, word.start - WORD_FADE_LEAD) *
                          1000;
                        const fadeDurationMs = COLOR_FADE_DURATION * 1000;

                        return (
                          <span
                            key={wi}
                            style={{
                              color: isFirstWord
                                ? COLOR_ACTIVE
                                : COLOR_INACTIVE,
                              display: "inline-block",
                              ...(isFirstWord
                                ? {}
                                : {
                                    animation: `cpk-word-active ${fadeDurationMs}ms linear ${wordStartMs}ms both`,
                                  }),
                            }}
                          >
                            {word.text.toLowerCase()}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
