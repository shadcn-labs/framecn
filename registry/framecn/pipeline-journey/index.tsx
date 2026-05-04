"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

const COLUMNS = [
  { count: 3, id: "todo", title: "Todo" },
  { count: 2, id: "in_progress", title: "In Progress" },
  { count: 4, id: "done", title: "Done" },
];

const COL_WIDTH = 320;
const COL_GAP = 40;
const BOARD_TOP = 120;
const BOARD_LEFT = 120;
const CARD_W = 280;
const CARD_H = 88;

const colCenter = (index: number) => {
  const x = BOARD_LEFT + index * (COL_WIDTH + COL_GAP) + COL_WIDTH / 2;
  const y = BOARD_TOP + 90;
  return { x, y };
};

const PlaceholderCard = ({ opacity = 1 }: { opacity?: number }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      height: CARD_H,
      marginBottom: 12,
      opacity,
      padding: 14,
      width: CARD_W,
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        borderRadius: 4,
        height: 10,
        width: "70%",
      }}
    />
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        borderRadius: 4,
        height: 8,
        width: "45%",
      }}
    />
    <div style={{ flex: 1 }} />
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        borderRadius: 999,
        height: 28,
        width: 28,
      }}
    />
  </div>
);

export interface PipelineJourneyProps {
  cardLabel?: string;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const PipelineJourney = ({
  cardLabel = "Build pipeline",
  accentColor = "#22c55e",
  _speed = 1,
  fps = 30,
  durationInFrames = 200,
  width = 1280,
  height = 720,
  className,
}: PipelineJourneyProps) => {
  const safeSpeed = Math.max(0.01, _speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const _frameMs = 1000 / fps;

  // Phases
  const flight1StartMs = ((30 / fps) * 1000) / safeSpeed;
  const flight1EndMs = ((70 / fps) * 1000) / safeSpeed;
  const _waitEndMs = ((110 / fps) * 1000) / safeSpeed;
  const flight2StartMs = ((110 / fps) * 1000) / safeSpeed;
  const flight2EndMs = ((150 / fps) * 1000) / safeSpeed;
  const confettiStartMs = ((150 / fps) * 1000) / safeSpeed;

  const todoCenter = colCenter(0);
  const progCenter = colCenter(1);
  const doneCenter = colCenter(2);

  const containerStyle: CSSProperties = {
    background: "#090b0d",
    color: "white",
    fontFamily: FONT_FAMILY,
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
          @keyframes framecn-pipe-fly1 {
            from { left: ${todoCenter.x}px; top: ${todoCenter.y}px; }
            to { left: ${progCenter.x}px; top: ${progCenter.y - 80}px; }
          }
          @keyframes framecn-pipe-fly2 {
            from { left: ${progCenter.x}px; top: ${progCenter.y}px; }
            to { left: ${doneCenter.x}px; top: ${doneCenter.y - 80}px; }
          }
          @keyframes framecn-pipe-land {
            from { transform: scale(0.92); }
            to { transform: scale(1); }
          }
          @keyframes framecn-pipe-flash {
            0%, 100% { background: rgba(255,255,255,0); }
            50% { background: ${accentColor}44; }
          }
          @keyframes framecn-pipe-confetti {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${300 + Math.random() * 200}px) rotate(${Math.random() * 720}deg); opacity: 0; }
          }
        `}</style>

        {/* Subtle grid bg */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            left: BOARD_LEFT,
            letterSpacing: "-0.02em",
            position: "absolute",
            top: 48,
          }}
        >
          Sprint board
        </div>

        {/* Columns */}
        {COLUMNS.map((col, i) => {
          let flashAnimation = "none";
          if (i === 1) {
            flashAnimation = `framecn-pipe-flash 400ms ease-in-out ${flight1EndMs - 100}ms backwards`;
          } else if (i === 2) {
            flashAnimation = `framecn-pipe-flash 400ms ease-in-out ${flight2EndMs - 100}ms backwards`;
          }
          return (
            <div
              key={col.id}
              style={{
                animation: flashAnimation,
                background: `rgba(255,255,255,${i === 1 ? "0.06)" : "0.02)"}`,
                border: `1px solid rgba(255,255,255,${i === 1 ? "0.08)" : "0.04)"}`,
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: 480,
                left: BOARD_LEFT + i * (COL_WIDTH + COL_GAP),
                padding: 20,
                position: "absolute",
                top: BOARD_TOP,
                width: COL_WIDTH,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    opacity: 0.85,
                  }}
                >
                  {col.title}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 999,
                    fontFamily: MONO_FAMILY,
                    fontSize: 12,
                    opacity: 0.5,
                    padding: "2px 8px",
                  }}
                >
                  {col.count}
                </div>
              </div>
              {Array.from({ length: col.count }).map((_, k) => (
                <PlaceholderCard key={k} />
              ))}
            </div>
          );
        })}

        {/* Flying card */}
        <div
          style={{
            animation: `
              framecn-pipe-fly1 ${flight1EndMs - flight1StartMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards,
              framecn-pipe-land 300ms cubic-bezier(0.16, 1, 0.3, 1) ${flight1EndMs}ms backwards,
              framecn-pipe-fly2 ${flight2EndMs - flight2StartMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${flight2StartMs}ms backwards,
              framecn-pipe-land 300ms cubic-bezier(0.16, 1, 0.3, 1) ${flight2EndMs}ms backwards
            `,
            background: "#18181b",
            border: `1px solid ${accentColor}`,
            borderRadius: 14,
            boxShadow: `0 ${30}px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            height: CARD_H,
            padding: 16,
            position: "absolute",
            width: CARD_W,
            willChange: "transform",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: MONO_FAMILY,
                fontSize: 11,
                opacity: 0.5,
              }}
            >
              REMO-128
            </div>
            <div
              style={{
                background: accentColor,
                borderRadius: 999,
                boxShadow: `0 0 12px ${accentColor}`,
                height: 8,
                width: 8,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {cardLabel}
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                color: accentColor,
                fontFamily: MONO_FAMILY,
                fontSize: 12,
                opacity: (frame / fps) % 2 === 0 ? 1 : 0,
              }}
            >
              00:{String(Math.floor((frame / fps) % 60)).padStart(2, "0")}
            </div>
            <div
              style={{
                fontSize: 11,
                opacity: 0.4,
              }}
            >
              assignee
            </div>
          </div>
        </div>

        {/* Confetti */}
        {Array.from({ length: 36 }).map((_, i) => {
          const _angle = (i / 36) * Math.PI * 2;
          const _dist = 60 + ((i * 13) % 220);
          const size = 6 + ((i * 7) % 8);
          let color = "#60a5fa";
          if (i % 3 === 0) {
            color = accentColor;
          } else if (i % 3 === 1) {
            color = "#fbbf24";
          }
          return (
            <div
              key={i}
              style={{
                animation: `framecn-pipe-confetti ${1500}ms ease-out ${confettiStartMs + i * 30}ms backwards`,
                background: color,
                borderRadius: 2,
                height: size * 0.6,
                left: doneCenter.x,
                position: "absolute",
                top: doneCenter.y,
                width: size,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </>
    </Timegroup>
  );
};
