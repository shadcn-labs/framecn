"use client";

import { Timegroup } from "@editframe/react";
import type { ReactNode, CSSProperties } from "react";

export interface ChangelogBiteProps {
  label?: string;
  title?: string;
  oldContent?: ReactNode;
  newContent?: ReactNode;
  format?: "square" | "portrait";
  background?: string;
  cardBackground?: string;
  accent?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

/* -------------------------------------------------------------------------- */
/*                              Default content                               */
/* -------------------------------------------------------------------------- */

const DefaultOldPanel = ({ accent }: { accent: string }) => (
  <div
    style={{
      background: "#0a090e",
      color: "#71717a",
      fontFamily: MONO_FAMILY,
      fontSize: 22,
      inset: 0,
      lineHeight: 1.55,
      padding: "44px 52px",
      position: "absolute",
      whiteSpace: "pre",
    }}
  >
    <div>{"function diff(a, b) {"}</div>
    <div>{"  if (a === b) return null;"}</div>
    <div>{"  return {"}</div>
    <div>{"    before: a,"}</div>
    <div>{"    after: b,"}</div>
    <div>{"}"}</div>
    <div>{"}"}</div>
    <div
      style={{
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.35)",
        borderRadius: 999,
        color: "#ef4444",
        display: "inline-block",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.12em",
        marginTop: 24,
        padding: "6px 14px",
      }}
    >
      BEFORE
    </div>
    {/* swallow lint */}
    <span style={{ display: "none" }}>{accent}</span>
  </div>
);

const DefaultNewPanel = ({ accent }: { accent: string }) => (
  <div
    style={{
      background:
        "radial-gradient(ellipse at 50% 30%, rgba(255,179,142,0.10) 0%, rgba(10,9,14,1) 70%)",
      color: "#e4e4e7",
      fontFamily: MONO_FAMILY,
      fontSize: 22,
      inset: 0,
      lineHeight: 1.55,
      padding: "44px 52px",
      position: "absolute",
      whiteSpace: "pre",
    }}
  >
    <div>
      <span style={{ color: "#c4b5fd" }}>function</span>{" "}
      <span style={{ color: "#fcd34d" }}>diff</span>
      {"(a, b) {"}
    </div>
    <div>
      {"  return "}
      <span style={{ color: "#86efac" }}>visualDiff</span>
      {"(a, b);"}
    </div>
    <div>{"}"}</div>
    <div
      style={{
        background: `${accent}1a`,
        border: `1px solid ${accent}55`,
        borderRadius: 999,
        color: accent,
        display: "inline-block",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.12em",
        marginTop: 24,
        padding: "6px 14px",
      }}
    >
      AFTER
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                              Pulsing pill                                  */
/* -------------------------------------------------------------------------- */

const PulsingPill = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      alignItems: "center",
      background: `${color}1a`,
      border: `1px solid ${color}55`,
      borderRadius: 999,
      color,
      display: "flex",
      fontSize: 16,
      fontWeight: 600,
      gap: 12,
      letterSpacing: "0.02em",
      padding: "10px 18px 10px 14px",
    }}
  >
    <div style={{ height: 12, position: "relative", width: 12 }}>
      <div
        style={{
          animation: `framecn-changelog-pill-ring 2000ms ease-out infinite`,
          background: color,
          borderRadius: "50%",
          inset: 0,
          position: "absolute",
        }}
      />
      <div
        style={{
          animation: `framecn-changelog-pill-dot 2000ms ease-in-out infinite`,
          background: color,
          borderRadius: "50%",
          inset: 0,
          position: "absolute",
        }}
      />
    </div>
    {label}
  </div>
);

export const ChangelogBite = ({
  label = "New",
  title = "Inline diff view",
  oldContent,
  newContent,
  format = "square",
  background = "#141318",
  cardBackground = "rgba(20, 19, 24, 0.92)",
  accent = "#FFB38E",
  _speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1080,
  height = 1080,
  className,
}: ChangelogBiteProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const enterMs = (10 * frameMs) / safeSpeed;
  const exitStartMs = ((durationInFrames - 15) * frameMs) / safeSpeed;
  const wipeStartMs = (60 * frameMs) / safeSpeed;
  const wipeDurationMs = (50 * frameMs) / safeSpeed;

  const isSquare = format === "square";
  const cardWidth = 880;
  const cardHeight = isSquare ? 880 : 1100;

  const oldNode = oldContent ?? <DefaultOldPanel accent={accent} />;
  const newNode = newContent ?? <DefaultNewPanel accent={accent} />;

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
          @keyframes framecn-changelog-enter {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes framecn-changelog-exit {
            to { opacity: 0; transform: scale(0.95); }
          }
          @keyframes framecn-changelog-wipe {
            from { clip-path: inset(0 100% 0 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          @keyframes framecn-changelog-pill-dot {
            0%, 100% { transform: scale(0.92); }
            50% { transform: scale(1.08); }
          }
          @keyframes framecn-changelog-pill-ring {
            from { transform: scale(1); opacity: 0.6; }
            to { transform: scale(2.6); opacity: 0; }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-changelog-enter ${enterMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards, framecn-changelog-exit ${15 * frameMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${exitStartMs}ms forwards`,
            background: cardBackground,
            border: `1px solid ${accent}33`,
            borderRadius: 56,
            boxShadow: `0 30px 120px ${accent}22, 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            height: cardHeight,
            overflow: "hidden",
            padding: 56,
            position: "relative",
            width: cardWidth,
          }}
        >
          {/* Header row */}
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 22,
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </div>
            <PulsingPill label={label} color={accent} />
          </div>

          {/* Diff stage */}
          <div
            style={{
              background: "rgba(8,7,12,0.6)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 32,
              flex: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* New (bottom layer) */}
            <div style={{ inset: 0, position: "absolute" }}>{newNode}</div>

            {/* Old (top layer, clipped left-to-right) */}
            <div
              style={{
                animation: `framecn-changelog-wipe ${wipeDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${wipeStartMs}ms backwards`,
                inset: 0,
                position: "absolute",
                willChange: "clip-path",
              }}
            >
              {oldNode}
            </div>

            {/* Frosted glass shutter */}
            <div
              style={{
                WebkitBackdropFilter: "blur(18px)",
                animation: `framecn-changelog-wipe ${wipeDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${wipeStartMs}ms backwards`,
                backdropFilter: "blur(18px)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.0) 100%)",
                bottom: 0,
                left: "calc(100% - 60px)",
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                width: 120,
              }}
            />

            {/* Accent seam line */}
            <div
              style={{
                animation: `framecn-changelog-wipe ${wipeDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${wipeStartMs}ms backwards`,
                background: accent,
                bottom: 0,
                boxShadow: `0 0 18px ${accent}aa`,
                opacity: 0.55,
                pointerEvents: "none",
                position: "absolute",
                right: 0,
                top: 0,
                width: 1.5,
              }}
            />
          </div>

          {/* Footer caption */}
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              display: "flex",
              fontFamily: MONO_FAMILY,
              fontSize: 16,
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                animation: `framecn-changelog-wipe ${wipeDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${wipeStartMs}ms backwards`,
              }}
            >
              before
            </span>
            <span
              style={{
                animation: `framecn-changelog-wipe ${wipeDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${wipeStartMs}ms backwards`,
              }}
            >
              after
            </span>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
