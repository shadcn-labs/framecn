"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionParticleBurstProps {
  words?: CaptionWord[];
  color?: string;
  burstColor?: string;
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

export const CaptionParticleBurst = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  burstColor = "#fbbf24",
  fontSize = 80,
  fontWeight = 900,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionParticleBurstProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = [];
  for (let i = 0; i < words.length; i += WORDS_PER_GROUP) {
    const groupWords = words.slice(i, i + WORDS_PER_GROUP);
    groups.push({
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
          @keyframes framecn-cpb-grp-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes framecn-cpb-grp-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-cpb-ring {
            from { width: 0px; height: 0px; opacity: 0.8; box-shadow: 0 0 0 0 ${burstColor}; }
            to   { width: 100px; height: 40px; opacity: 0; box-shadow: 0 0 0 30px ${burstColor}00; }
          }
        `}</style>
        <div
          style={{
            bottom: Math.round(height * 0.15),
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
                  `framecn-cpb-grp-in 120ms ease-out ${group.startMs}ms both`,
                  `framecn-cpb-grp-out 80ms ease-in ${group.endMs}ms forwards`,
                ].join(", "),
                display: "flex",
                flexWrap: "wrap",
                gap: "0.3em",
                justifyContent: "center",
                left: 0,
                opacity: 0,
                padding: "0 80px",
                position: "absolute",
                right: 0,
              }}
            >
              {group.words.map((word, wi) => {
                const wordStartMs = (word.start * 1000) / safeSpeed;
                const wordDurationMs = Math.max(
                  120,
                  ((word.end - word.start) * 1000) / safeSpeed
                );
                const brightKeyframe = `framecn-cpb-bright-${gi}-${wi}`;

                return (
                  <span
                    key={wi}
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <style>{`
                      @keyframes ${brightKeyframe} {
                        0%, 100% { opacity: 0.4; }
                        8%, 92%  { opacity: 1; }
                      }
                    `}</style>
                    {/* Burst ring */}
                    <span
                      aria-hidden
                      style={{
                        animation: `framecn-cpb-ring 400ms ease-out ${wordStartMs}ms both`,
                        borderRadius: "50%",
                        height: 0,
                        left: "50%",
                        position: "absolute",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 0,
                      }}
                    />
                    <span
                      style={{
                        animation: `${brightKeyframe} ${wordDurationMs}ms ease-in-out ${wordStartMs}ms both`,
                        color,
                        display: "inline-block",
                        fontFamily:
                          "'Outfit', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize,
                        fontWeight,
                        lineHeight: 1,
                        opacity: 0.4,
                        position: "relative",
                      }}
                    >
                      {word.text}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </>
    </Timegroup>
  );
};
