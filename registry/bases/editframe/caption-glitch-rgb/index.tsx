"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface CaptionWord {
  text: string;
  start: number;
  end: number;
}

export interface CaptionGlitchRgbProps {
  words?: CaptionWord[];
  color?: string;
  glitchRedColor?: string;
  glitchCyanColor?: string;
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

export const CaptionGlitchRgb = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  glitchRedColor = "#ff003c",
  glitchCyanColor = "#00e5ff",
  fontSize = 88,
  fontWeight = 700,
  background = "#0a0a0a",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: CaptionGlitchRgbProps) => {
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
          @keyframes framecn-cgr-grp-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes framecn-cgr-grp-out {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
          @keyframes framecn-cgr-glitch-6 {
            from { transform: translateX(-6px); text-shadow: 5px 0 ${glitchRedColor}, -5px 0 ${glitchCyanColor}, 0 5px 18px rgba(0,0,0,0.52); }
            to   { transform: translateX(0); text-shadow: 0 5px 18px rgba(0,0,0,0.52); }
          }
          @keyframes framecn-cgr-glitch-8 {
            from { transform: translateX(-8px); text-shadow: 5px 0 ${glitchRedColor}, -5px 0 ${glitchCyanColor}, 0 5px 18px rgba(0,0,0,0.52); }
            to   { transform: translateX(0); text-shadow: 0 5px 18px rgba(0,0,0,0.52); }
          }
          @keyframes framecn-cgr-glitch-12 {
            from { transform: translateX(-12px); text-shadow: 5px 0 ${glitchRedColor}, -5px 0 ${glitchCyanColor}, 0 5px 18px rgba(0,0,0,0.52); }
            to   { transform: translateX(0); text-shadow: 0 5px 18px rgba(0,0,0,0.52); }
          }
        `}</style>
        {/* Scanlines overlay */}
        <div
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
            zIndex: 10,
          }}
        />
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
                  `framecn-cgr-grp-in 80ms ease-out ${group.startMs}ms both`,
                  `framecn-cgr-grp-out 80ms ease-in ${group.endMs}ms forwards`,
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
                const travelVariants = [
                  "framecn-cgr-glitch-8",
                  "framecn-cgr-glitch-12",
                  "framecn-cgr-glitch-6",
                ];
                const keyframeName = travelVariants[wi % 3];

                return (
                  <span
                    key={wi}
                    style={{
                      animation: `${keyframeName} 200ms cubic-bezier(0.16,1,0.3,1) ${wordStartMs}ms both`,
                      color,
                      display: "inline-block",
                      fontFamily:
                        "'Space Grotesk', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize,
                      fontWeight,
                      letterSpacing: "0.02em",
                      lineHeight: 1,
                      textShadow: `0 5px 18px rgba(0,0,0,0.52)`,
                    }}
                  >
                    {word.text}
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
