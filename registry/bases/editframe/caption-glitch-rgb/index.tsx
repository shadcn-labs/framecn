"use client";

import { Timegroup } from "@editframe/react";
import { useMemo } from "react";
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
  shadowColor?: string;
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

const fitCanvas =
  typeof document === "undefined" ? null : document.createElement("canvas");
const fitCtx = fitCanvas?.getContext("2d");

const fitFontSize = (
  text: string,
  baseFontSize: number,
  fontWeight: number | string,
  fontFamily: string,
  maxWidth: number
): number => {
  if (!fitCtx) {
    return baseFontSize;
  }
  let size = baseFontSize;
  const minSize = Math.floor(baseFontSize * 0.45);
  while (size > minSize) {
    fitCtx.font = `${fontWeight} ${size}px ${fontFamily}`;
    if (fitCtx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  return minSize;
};

const makeRng = (seed: number) => {
  let s = (Math.abs(seed) % 2_147_483_646) + 1;
  return () => {
    s = (16_807 * s) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
};

const buildGroups = (words: CaptionWord[]): [number, number][] => {
  const groups: [number, number][] = [];
  let start = 0;
  let chars = 0;
  for (let i = 0; i < words.length; i += 1) {
    chars += words[i].text.length + 1;
    const endsSentence = /[.!?]$/.test(words[i].text);
    const nextGap =
      i + 1 < words.length ? words[i + 1].start - words[i].end : 0;
    const full = i - start >= 3 || chars >= 21;
    if (endsSentence || nextGap > 0.28 || full || i === words.length - 1) {
      groups.push([start, i]);
      start = i + 1;
      chars = 0;
    }
  }
  return groups;
};

const shouldAftershock = (word: CaptionWord): boolean =>
  /\d|\$|%/.test(word.text) || word.text.replaceAll(/[^\w]/g, "").length >= 7;

const glitchPlan = (word: CaptionWord, nextWord: CaptionWord | undefined) => {
  const nextStart = nextWord ? nextWord.start : word.end + 0.3;
  const available = Math.min(word.end, nextStart) - word.start - 0.02;
  const total = Math.min(0.24, Math.max(0.08, available));
  return { d1: total * 0.35, d2: total * 0.65 };
};

export const CaptionGlitchRgb = ({
  words = DEFAULT_WORDS,
  color = "#ffffff",
  glitchRedColor = "#ff003c",
  glitchCyanColor = "#00e5ff",
  shadowColor = "rgba(0,0,0,0.52)",
  fontSize = 88,
  fontWeight = 700,
  background = "transparent",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: CaptionGlitchRgbProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const fontFamily = "'Space Grotesk', sans-serif";
  const maxTextWidth = width - 200;

  const rawGroups = useMemo(() => buildGroups(words), [words]);

  const groups = useMemo(
    () =>
      rawGroups.map(([ws, we], gi) => {
        const nextStart =
          gi + 1 < rawGroups.length
            ? words[rawGroups[gi + 1][0]].start
            : durationInFrames / fps;
        const end = Math.min(words[we].end + 0.24, nextStart - 0.04);
        return { end, start: words[ws].start, wordEnd: we, wordStart: ws };
      }),
    [rawGroups, words, durationInFrames, fps]
  );

  const groupFontSizes = useMemo(
    () =>
      groups.map((g) => {
        const groupText = words
          .slice(g.wordStart, g.wordEnd + 1)
          .map((w) => w.text.toUpperCase())
          .join(" ");
        return fitFontSize(
          groupText,
          fontSize,
          fontWeight,
          fontFamily,
          maxTextWidth
        );
      }),
    [groups, words, fontSize, fontWeight, fontFamily, maxTextWidth]
  );

  const wordGlitchData = useMemo(
    () =>
      groups.map((g, gi) => {
        const groupWords = words.slice(g.wordStart, g.wordEnd + 1);
        return groupWords.map((w, i) => {
          const wi = g.wordStart + i;
          const nextWord = words[wi + 1];
          const plan = glitchPlan(w, nextWord);
          const rng = makeRng(wi * 777 + 13);
          const travel = -(8 + rng() * 8);
          const shadowMag = 5 + rng() * 7;
          const sm = +shadowMag.toFixed(1);
          const nextStart = nextWord ? nextWord.start : g.end;
          const aftershockEnd = Math.min(g.end - 0.08, nextStart - 0.04);
          const pulses: { start: number; travel: number; shadow: number }[] =
            [];

          if (shouldAftershock(w) && aftershockEnd - w.end > 0.22) {
            let pulseStart = w.end + 0.08;
            let pulseIndex = 0;
            while (pulseStart + 0.1 < aftershockEnd) {
              const pulseTravel = -(3 + rng() * 5);
              const pulseShadow = +(3 + rng() * 5).toFixed(1);
              pulses.push({
                shadow: pulseShadow,
                start: pulseStart,
                travel: pulseTravel,
              });
              pulseIndex += 1;
              pulseStart += pulseIndex % 2 === 0 ? 0.18 : 0.24;
            }
          }

          return {
            computedSize: groupFontSizes[gi],
            d1: plan.d1,
            d2: plan.d2,
            index: wi,
            pulses,
            shadowMag: sm,
            text: w.text.toUpperCase(),
            travel,
            wordStart: w.start,
          };
        });
      }),
    [groups, words, groupFontSizes]
  );

  const containerStyle: CSSProperties = {
    background,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  const hasAnyPulses = wordGlitchData.some((gw) =>
    gw.some((w) => w.pulses.length > 0)
  );

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes cgr-grp-show {
            to { visibility: visible; }
          }
          @keyframes cgr-grp-hide {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
          }
          @keyframes cgr-grp-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes cgr-glitch {
            from {
              transform: translateX(var(--cgr-travel));
              text-shadow:
                var(--cgr-sm) 0 ${glitchRedColor},
                calc(var(--cgr-sm) * -1) 0 ${glitchCyanColor},
                0 5px 18px ${shadowColor};
            }
            to {
              transform: translateX(0);
              text-shadow: 0 5px 18px ${shadowColor};
            }
          }
          ${
            hasAnyPulses
              ? `@keyframes cgr-pulse {
            from {
              transform: translateX(var(--cgr-p-travel));
              text-shadow:
                var(--cgr-p-shadow) 0 ${glitchRedColor},
                calc(var(--cgr-p-shadow) * -1) 0 ${glitchCyanColor},
                0 5px 18px ${shadowColor};
            }
            to {
              transform: translateX(0);
              text-shadow: 0 5px 18px ${shadowColor};
            }
          }`
              : ""
          }
        `}</style>

        <div
          aria-hidden
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 54%, rgba(0,0,0,0.5) 100%)`,
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
            zIndex: 1,
          }}
        />
        <div
          aria-hidden
          style={{
            background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.16) 3px, rgba(0,0,0,0.16) 4px)`,
            inset: 0,
            opacity: 0.55,
            pointerEvents: "none",
            position: "absolute",
            zIndex: 5,
          }}
        />

        <div
          style={
            {
              inset: 0,
              pointerEvents: "none",
              position: "absolute",
              zIndex: 10,
            } as CSSProperties
          }
        >
          {groups.map((g, gi) => {
            const groupStartMs = (g.start * 1000) / safeSpeed;
            const groupEndMs = (g.end * 1000) / safeSpeed;
            const gw = wordGlitchData[gi];

            return (
              <div
                key={gi}
                style={{
                  alignItems: "flex-end",
                  animation: [
                    `cgr-grp-show 1ms linear ${groupStartMs}ms both`,
                    `cgr-grp-fade-in 120ms ease-out ${groupStartMs}ms both`,
                    `cgr-grp-hide 100ms ease-in ${groupEndMs - 100}ms forwards`,
                  ].join(", "),
                  bottom: 120,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  justifyContent: "center",
                  left: 0,
                  padding: "0 100px",
                  position: "absolute",
                  right: 0,
                  visibility: "hidden",
                  width: "100%",
                }}
              >
                {gw.map((wd) => {
                  const wordStartMs = (wd.wordStart * 1000) / safeSpeed;
                  const d1Ms = wd.d1 * 1000;
                  const d2Ms = wd.d2 * 1000;

                  const pulseAnimations = wd.pulses.map((p) => {
                    const pulseStartMs = (p.start * 1000) / safeSpeed;
                    return `cgr-pulse 45ms linear ${pulseStartMs}ms both, cgr-glitch 75ms cubic-bezier(0.16,1,0.3,1) ${pulseStartMs + 45}ms both`;
                  });

                  return (
                    <span
                      key={wd.index}
                      style={
                        {
                          "--cgr-sm": `${wd.shadowMag}px`,
                          "--cgr-travel": `${wd.travel}px`,
                          animation: [
                            `cgr-glitch ${d1Ms}ms linear ${wordStartMs}ms both`,
                            `cgr-glitch ${d2Ms}ms cubic-bezier(0.16,1,0.3,1) ${wordStartMs + d1Ms}ms both`,
                            ...pulseAnimations,
                          ].join(", "),
                          color,
                          display: "inline-block",
                          fontFamily,
                          fontSize: wd.computedSize,
                          fontWeight,
                          letterSpacing: "0.03em",
                          lineHeight: 0.96,
                          textShadow: `0 5px 18px ${shadowColor}`,
                          textTransform: "uppercase",
                          willChange: "transform, text-shadow",
                        } as CSSProperties
                      }
                    >
                      {wd.text}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    </Timegroup>
  );
};
