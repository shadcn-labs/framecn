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
  color?: string;
  accentColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WORDS: CaptionWord[] = [
  { end: 0.35, start: 0, text: "Every" },
  { end: 0.65, start: 0.35, text: "great" },
  { end: 1, start: 0.65, text: "video" },
  { end: 1.45, start: 1.1, text: "starts" },
  { end: 1.65, start: 1.45, text: "with" },
  { end: 1.8, start: 1.65, text: "a" },
  { end: 2.15, start: 1.8, text: "single" },
  { end: 2.7, start: 2.15, text: "frame." },
  { end: 3.2, start: 3, text: "No" },
  { end: 3.9, start: 3.2, text: "timelines." },
  { end: 4.2, start: 4, text: "No" },
  { end: 4.5, start: 4.2, text: "drag" },
  { end: 4.65, start: 4.5, text: "and" },
  { end: 5.1, start: 4.65, text: "drop." },
  { end: 5.55, start: 5.3, text: "Just" },
  { end: 6, start: 5.55, text: "code." },
];

const WORDS_PER_GROUP = 3;

const EMOJI_MAP: Record<string, string> = {
  "code.": "⌨️",
  "drop.": "🔥",
  "frame.": "🖼️",
  "timelines.": "⏱️",
  video: "📹",
};

const ACCENT_WORDS = new Set([
  "video",
  "frame.",
  "code.",
  "timelines.",
  "drop.",
]);

export const CaptionEmojiPop = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  accentColor = "#FF76FF",
  fontSize = 72,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionEmojiPopProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = [];
  for (let i = 0; i < words.length; i += WORDS_PER_GROUP) {
    const groupWords = words.slice(i, i + WORDS_PER_GROUP);
    const emoji =
      groupWords.map((w) => EMOJI_MAP[w.text]).find(Boolean) ?? null;
    groups.push({
      emoji,
      endMs: ((groupWords.at(-1)?.end ?? 0) * 1000) / safeSpeed + 180,
      startMs: (groupWords[0].start * 1000) / safeSpeed,
      words: groupWords,
    });
  }

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
          @keyframes framecn-cep-grp-in {
            from { opacity: 0; transform: scaleX(0.8); }
            to   { opacity: 1; transform: scaleX(1); }
          }
          @keyframes framecn-cep-grp-out {
            from { opacity: 1; transform: scaleX(1); }
            to   { opacity: 0; transform: scaleX(0.75); }
          }
          @keyframes framecn-cep-emoji-in {
            from { opacity: 0; transform: scale(0.5) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
        <div
          style={{
            bottom: Math.round(height * 0.12),
            left: 0,
            position: "absolute",
            right: 0,
          }}
        >
          {groups.map((group, gi) => (
            <div
              key={gi}
              style={{
                alignItems: "center",
                animation: [
                  `framecn-cep-grp-in 200ms cubic-bezier(0.34,1.56,0.64,1) ${group.startMs}ms both`,
                  `framecn-cep-grp-out 150ms ease-in ${group.endMs}ms forwards`,
                ].join(", "),
                display: "flex",
                flexDirection: "column",
                gap: "0.15em",
                left: 0,
                opacity: 0,
                position: "absolute",
                right: 0,
              }}
            >
              {group.emoji && (
                <span
                  style={{
                    animation: `framecn-cep-emoji-in 250ms cubic-bezier(0.34,1.56,0.64,1) ${group.startMs + 50}ms both`,
                    display: "block",
                    fontSize: fontSize * 0.8,
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  {group.emoji}
                </span>
              )}
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.25em",
                  justifyContent: "center",
                  padding: "0 80px",
                }}
              >
                {group.words.map((word, wi) => (
                  <span
                    key={wi}
                    style={{
                      color: ACCENT_WORDS.has(word.text) ? accentColor : color,
                      display: "inline-block",
                      fontFamily:
                        "'Gabarito', 'Montserrat', var(--font-geist-sans), sans-serif",
                      fontSize,
                      fontWeight,
                      lineHeight: 1,
                    }}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    </Timegroup>
  );
};
