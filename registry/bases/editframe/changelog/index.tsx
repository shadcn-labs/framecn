"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface ChangelogEntry {
  date: string;
  version?: string;
  title: string;
  items: string[];
}

export interface ChangelogProps {
  heading?: string;
  tagline?: string;
  entries?: ChangelogEntry[];
  accent?: string;
  background?: string;
  cardBackground?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_ENTRIES: ChangelogEntry[] = [
  {
    date: "Jun 23, 2026",
    items: [
      "19 new remocn-adapted animation components",
      "Typography, transitions, and primitives categories",
      "Bitwise-free Park-Miller PRNG for particle effects",
    ],
    title: "New Animation Library",
    version: "v1.3",
  },
  {
    date: "Jun 8, 2026",
    items: [
      "16 caption components with oxlint compliance",
      "Unprefixed registry aliases (highlight, neon-glow…)",
    ],
    title: "Caption Components",
    version: "v1.2",
  },
  {
    date: "May 20, 2026",
    items: [
      "changelog-bite, browser-flow, hero-device-assemble",
      "Customizer panel with live prop controls",
    ],
    title: "Composition Pack",
    version: "v1.1",
  },
  {
    date: "May 5, 2026",
    items: ["Registry launched with 7 core Editframe components"],
    title: "Initial Release",
    version: "v1.0",
  },
];

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, 'SF Mono', monospace";

const MAX_VISIBLE = 4;

export const Changelog = ({
  heading = "Changelog",
  tagline = "What's new",
  entries = DEFAULT_ENTRIES,
  accent = "#FFB38E",
  background = "#0d0c10",
  cardBackground = "rgba(18,17,22,0.97)",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1920,
  height = 1080,
  className,
}: ChangelogProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const cardEnterDur = (12 * frameMs) / safeSpeed;
  const headerDur = (10 * frameMs) / safeSpeed;
  const headerDelay = (8 * frameMs) / safeSpeed;
  const dividerDelay = headerDelay + headerDur;
  const entryBaseDur = (18 * frameMs) / safeSpeed;
  const entryBaseDelay = (20 * frameMs) / safeSpeed;
  const entryStagger = (16 * frameMs) / safeSpeed;
  const exitDelay = ((durationInFrames - 20) * frameMs) / safeSpeed;
  const exitDur = (20 * frameMs) / safeSpeed;

  const visibleEntries = entries.slice(0, MAX_VISIBLE);
  const lineGrowDur = visibleEntries.length * entryStagger + entryBaseDur;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    fontFamily: FONT_FAMILY,
    height,
    justifyContent: "center",
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
          @keyframes framecn-cl-card-in {
            from { opacity: 0; transform: scale(0.96) translateY(12px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
          }
          @keyframes framecn-cl-card-out {
            to { opacity: 0; transform: scale(0.97) translateY(-8px); }
          }
          @keyframes framecn-cl-fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-cl-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes framecn-cl-line-grow {
            from { clip-path: inset(0 0 100% 0); }
            to   { clip-path: inset(0 0 0%   0); }
          }
          @keyframes framecn-cl-dot-pop {
            0%   { transform: scale(0);   opacity: 0; }
            60%  { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(1);   opacity: 1; }
          }
          @keyframes framecn-cl-pulse-ring {
            from { transform: scale(1); opacity: 0.7; }
            to   { transform: scale(3); opacity: 0;   }
          }
          @keyframes framecn-cl-pulse-core {
            0%, 100% { transform: scale(0.88); }
            50%      { transform: scale(1.12); }
          }
        `}</style>

        {/* Ambient glow */}
        <div
          style={{
            background: `radial-gradient(ellipse 1400px 700px at 50% 45%, ${accent}0c 0%, transparent 65%)`,
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
          }}
        />

        {/* Card */}
        <div
          style={{
            animation: [
              `framecn-cl-card-in ${cardEnterDur}ms cubic-bezier(0.16,1,0.3,1) backwards`,
              `framecn-cl-card-out ${exitDur}ms cubic-bezier(0.4,0,1,1) ${exitDelay}ms forwards`,
            ].join(", "),
            background: cardBackground,
            border: `1px solid rgba(255,255,255,0.06)`,
            borderRadius: 48,
            boxShadow: [
              `0 0 0 1px ${accent}18`,
              `0 40px 160px rgba(0,0,0,0.65)`,
              `inset 0 1px 0 rgba(255,255,255,0.05)`,
            ].join(", "),
            display: "flex",
            flexDirection: "column",
            height: 860,
            overflow: "hidden",
            padding: "52px 72px 60px",
            position: "relative",
            width: 1300,
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${accent}70 40%, ${accent}70 60%, transparent 100%)`,
              height: 1,
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          />

          {/* Header */}
          <div
            style={{
              alignItems: "flex-end",
              animation: `framecn-cl-fade-up ${headerDur}ms cubic-bezier(0.16,1,0.3,1) ${headerDelay}ms backwards`,
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  color: accent,
                  fontFamily: MONO_FAMILY,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {tagline}
              </div>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: "-0.022em",
                  lineHeight: 1,
                }}
              >
                {heading}
              </div>
            </div>

            {/* Pulsing pill */}
            <div
              style={{
                alignItems: "center",
                background: `${accent}12`,
                border: `1px solid ${accent}40`,
                borderRadius: 999,
                color: accent,
                display: "flex",
                fontSize: 14,
                fontWeight: 600,
                gap: 10,
                letterSpacing: "0.03em",
                padding: "11px 20px 11px 16px",
              }}
            >
              <div style={{ height: 10, position: "relative", width: 10 }}>
                <div
                  style={{
                    animation: `framecn-cl-pulse-ring 2s ease-out infinite`,
                    background: accent,
                    borderRadius: "50%",
                    inset: 0,
                    position: "absolute",
                  }}
                />
                <div
                  style={{
                    animation: `framecn-cl-pulse-core 2s ease-in-out infinite`,
                    background: accent,
                    borderRadius: "50%",
                    inset: 0,
                    position: "absolute",
                  }}
                />
              </div>
              Latest Updates
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              animation: `framecn-cl-fade-in 200ms ease ${dividerDelay}ms backwards`,
              background: "rgba(255,255,255,0.07)",
              height: 1,
              marginBottom: 44,
            }}
          />

          {/* Entries */}
          <div style={{ flex: 1, position: "relative" }}>
            {/* Vertical timeline line */}
            <div
              style={{
                animation: `framecn-cl-line-grow ${lineGrowDur}ms cubic-bezier(0.4,0,0.2,1) ${entryBaseDelay}ms backwards`,
                background: `linear-gradient(to bottom, ${accent}55, ${accent}18)`,
                bottom: 16,
                left: 203,
                position: "absolute",
                top: 12,
                width: 1.5,
              }}
            />

            {visibleEntries.map((entry, i) => {
              const entryDelay = entryBaseDelay + i * entryStagger;
              const dotDelay = entryDelay + 80;
              const isLatest = i === 0;

              const versionBg = isLatest
                ? `${accent}1e`
                : "rgba(255,255,255,0.06)";
              const versionBorder = isLatest
                ? `${accent}48`
                : "rgba(255,255,255,0.10)";
              const versionColor = isLatest ? accent : "rgba(255,255,255,0.45)";
              const dotSize = isLatest ? 12 : 8;
              const dotGlow = isLatest ? `0 0 14px ${accent}90` : "none";
              const dotBg = isLatest ? accent : `${accent}55`;

              return (
                <div
                  key={i}
                  style={{
                    alignItems: "flex-start",
                    animation: `framecn-cl-fade-up ${entryBaseDur}ms cubic-bezier(0.16,1,0.3,1) ${entryDelay}ms backwards`,
                    display: "flex",
                    height: 168,
                    position: "relative",
                  }}
                >
                  {/* Date + version col */}
                  <div
                    style={{
                      flexShrink: 0,
                      paddingRight: 28,
                      paddingTop: 2,
                      textAlign: "right",
                      width: 175,
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.38)",
                        fontFamily: MONO_FAMILY,
                        fontSize: 12,
                        letterSpacing: "0.03em",
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}
                    >
                      {entry.date}
                    </div>
                    {entry.version !== undefined && (
                      <div
                        style={{
                          background: versionBg,
                          border: `1px solid ${versionBorder}`,
                          borderRadius: 999,
                          color: versionColor,
                          display: "inline-block",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          padding: "3px 10px",
                        }}
                      >
                        {entry.version}
                      </div>
                    )}
                  </div>

                  {/* Timeline dot */}
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexShrink: 0,
                      justifyContent: "center",
                      paddingTop: 4,
                      width: 28,
                    }}
                  >
                    {isLatest && (
                      <div
                        style={{
                          animation: `framecn-cl-pulse-ring 2s ease-out ${dotDelay}ms infinite`,
                          background: accent,
                          borderRadius: "50%",
                          height: dotSize,
                          opacity: 0,
                          position: "absolute",
                          width: dotSize,
                        }}
                      />
                    )}
                    <div
                      style={{
                        animation: `framecn-cl-dot-pop 360ms cubic-bezier(0.16,1,0.3,1) ${dotDelay}ms backwards`,
                        background: dotBg,
                        borderRadius: "50%",
                        boxShadow: dotGlow,
                        height: dotSize,
                        width: dotSize,
                      }}
                    />
                  </div>

                  {/* Content col */}
                  <div
                    style={{
                      flex: 1,
                      paddingLeft: 28,
                    }}
                  >
                    <div
                      style={{
                        color: isLatest ? "#ffffff" : "rgba(255,255,255,0.85)",
                        fontSize: 17,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                        marginBottom: 10,
                      }}
                    >
                      {entry.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      {entry.items.map((item, j) => (
                        <div
                          key={j}
                          style={{
                            alignItems: "baseline",
                            color: "rgba(255,255,255,0.45)",
                            display: "flex",
                            fontSize: 14,
                            gap: 8,
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              color: `${accent}70`,
                              flexShrink: 0,
                              fontSize: 12,
                            }}
                          >
                            ›
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
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
