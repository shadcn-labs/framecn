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
  keywords?: number[];
  fadedColor?: string;
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

const RAW_GROUPS: [number, number][] = [
  [0, 3],
  [4, 7],
  [8, 8],
  [9, 12],
  [13, 15],
  [16, 16],
  [17, 19],
  [20, 22],
  [23, 24],
  [25, 27],
];

const PARTICLE_COLORS = [
  "#FFD700",
  "#FF6B35",
  "#FF3C78",
  "#9B5DE5",
  "#00BBF9",
  "#00F5D4",
  "#ffffff",
  "#F15BB5",
];

const NUM_PARTICLES = 10;

const makeRng = (seed: number) => {
  let s = (Math.abs(seed) % 2_147_483_646) + 1;
  return () => {
    s = (16_807 * s) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
};

export const CaptionParticleBurst = ({
  words = DEFAULT_WORDS,
  keywords = DEFAULT_KEYWORDS,
  fadedColor = "rgba(255,255,255,0.4)",
  fontSize = 88,
  fontWeight = 900,
  fontFamily = "'Outfit', sans-serif",
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionParticleBurstProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const groups = RAW_GROUPS.map(([ws, we], gi) => {
    const nextStart =
      gi + 1 < RAW_GROUPS.length
        ? words[RAW_GROUPS[gi + 1][0]].start
        : durationInFrames / fps;
    const gEnd = Math.min(words[we].end + 0.35, nextStart - 0.05);
    return {
      end: gEnd,
      start: words[ws].start,
      wordEnd: we,
      wordStart: ws,
    };
  });

  const particleData: Record<
    number,
    { dx: number; dy: number; sz: number; color: string }[]
  > = {};
  for (const wi of keywords) {
    const rng = makeRng(wi * 137 + 99);
    particleData[wi] = [];
    for (let p = 0; p < NUM_PARTICLES; p += 1) {
      const angle = (p / NUM_PARTICLES) * Math.PI * 2 + rng() * 0.6;
      const dist = 120 + rng() * 200;
      const sz = 4 + rng() * 8;
      particleData[wi].push({
        color: PARTICLE_COLORS[p % PARTICLE_COLORS.length],
        dx: Math.cos(angle) * dist,
        dy: -Math.sin(angle) * dist,
        sz,
      });
    }
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
          @keyframes cpb-grp-show {
            to { visibility: visible; }
          }
          @keyframes cpb-grp-in {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes cpb-grp-out {
            to { opacity: 0; }
          }
          @keyframes cpb-grp-hide {
            to { visibility: hidden; }
          }
        `}</style>
        <div
          style={
            {
              bottom: 120,
              left: 0,
              position: "absolute",
              right: 0,
            } as CSSProperties
          }
        >
          {groups.map((g, gi) => {
            const groupWords = words.slice(g.wordStart, g.wordEnd + 1);
            const groupStartMs = (g.start * 1000) / safeSpeed;
            const groupEndMs = (g.end * 1000) / safeSpeed;
            const grpOutStartMs = groupEndMs - 140;

            return (
              <div
                key={gi}
                style={{
                  alignItems: "flex-end",
                  animation: [
                    `cpb-grp-show 1ms linear ${groupStartMs}ms both`,
                    `cpb-grp-in 200ms cubic-bezier(0.34,1.56,0.64,1) ${groupStartMs}ms both`,
                    `cpb-grp-out 140ms ease-in ${grpOutStartMs}ms forwards`,
                    `cpb-grp-hide 1ms linear ${groupEndMs}ms forwards`,
                  ].join(", "),
                  bottom: 120,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  justifyContent: "center",
                  left: 0,
                  padding: "0 100px",
                  position: "absolute",
                  right: 0,
                  visibility: "hidden",
                  width: "100%",
                }}
              >
                {groupWords.map((word, i) => {
                  const wi = g.wordStart + i;
                  const wordStartMs = (word.start * 1000) / safeSpeed;
                  const wordEndMs = (word.end * 1000) / safeSpeed;
                  const _isKW = keywords.includes(wi);
                  const wordDurationMs = wordEndMs - wordStartMs;
                  const colorDuration = Math.round(wordDurationMs * 0.18);
                  const fadeDuration = Math.round(wordDurationMs * 0.25);

                  return (
                    <span
                      key={wi}
                      style={{
                        animation: [
                          `cpb-w-${wi}-in 80ms ease ${wordStartMs}ms both`,
                          `cpb-w-${wi}-color ${colorDuration}ms ease ${wordStartMs}ms both`,
                          `cpb-w-${wi}-fade ${fadeDuration}ms ease ${wordEndMs}ms forwards`,
                        ].join(", "),
                        color: fadedColor,
                        display: "inline-block",
                        fontFamily,
                        fontSize,
                        fontWeight,
                        letterSpacing: "0.05em",
                        lineHeight: 1,
                        opacity: 1,
                        textTransform: "uppercase",
                        willChange: "transform, color, opacity",
                      }}
                    >
                      {word.text.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          style={{
            height: 0,
            left: "50%",
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            width: 0,
          }}
        >
          {keywords.map((wi) => {
            const w = words[wi];
            const wordStartMs = (w.start * 1000) / safeSpeed;
            const particles = particleData[wi];

            return (
              <span key={wi}>
                <style>{`
                  @keyframes cpb-w-${wi}-in {
                    from { transform: scale(1); }
                    to { transform: scale(1.12); }
                  }
                  @keyframes cpb-w-${wi}-color {
                    to { color: #FFD700; }
                  }
                  @keyframes cpb-w-${wi}-fade {
                    to { color: ${fadedColor}; transform: scale(1); }
                  }
                `}</style>
                {particles.map((pd, pi) => (
                  <style key={pi}>{`
                      @keyframes cpb-p-${wi}-${pi} {
                        0% { transform: translate(0px, 0px); opacity: 0; }
                        ${Math.round((120 / 700) * 100)}% { transform: translate(${pd.dx.toFixed(1)}px, ${pd.dy.toFixed(1)}px); opacity: 1; }
                        ${Math.round((570 / 700) * 100)}% { transform: translate(${pd.dx.toFixed(1)}px, ${pd.dy.toFixed(1)}px); opacity: 0; }
                        100% { transform: translate(0px, 0px); opacity: 0; }
                      }
                    `}</style>
                ))}
                {particles.map((pd, pi) => {
                  const delayMs = wordStartMs + pi * 18;

                  return (
                    <div
                      key={pi}
                      style={{
                        animation: `cpb-p-${wi}-${pi} 700ms linear ${delayMs}ms both`,
                        backgroundColor: pd.color,
                        borderRadius: "50%",
                        height: pd.sz,
                        left: 0,
                        opacity: 0,
                        pointerEvents: "none",
                        position: "absolute",
                        top: 0,
                        width: pd.sz,
                        willChange: "transform, opacity",
                      }}
                    />
                  );
                })}
              </span>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
