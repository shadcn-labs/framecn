"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

const BAR_VALUES = [0.55, 0.78, 0.42, 0.92, 0.66];
const LINE_POINTS: [number, number][] = [
  [0, 70],
  [16, 55],
  [32, 62],
  [48, 38],
  [64, 45],
  [80, 22],
  [100, 12],
];

const STRUCTURE_END = 15;

const buildLinePath = () =>
  LINE_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

const formatNumber = (n: number) => n.toLocaleString("en-US");

export interface DashboardPopulateProps {
  accentColor?: string;
  kpiTarget?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const Tile = ({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: "linear-gradient(180deg, #131316 0%, #0d0d10 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: 24,
      position: "relative",
      ...style,
    }}
  >
    <div
      style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {title}
    </div>
    <div style={{ flex: 1, position: "relative" }}>{children}</div>
  </div>
);

export const DashboardPopulate = ({
  accentColor = "#22c55e",
  kpiTarget = 128_400,
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: DashboardPopulateProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const structureEndMs = STRUCTURE_END * frameMs;
  const kpiMs = ((60 / fps) * 1000) / safeSpeed;
  const barStaggerMs = ((4 / fps) * 1000) / safeSpeed;
  const lineMs = ((50 / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    background: "#09090b",
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT_FAMILY,
    gap: 24,
    height,
    overflow: "hidden",
    padding: 64,
    position: "relative",
    width,
  };

  const linePath = buildLinePath();
  const donutR = 70;
  const donutCircum = 2 * Math.PI * donutR;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-dashboard-structure {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes framecn-dashboard-kpi {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-dashboard-bar {
            from { height: 0; }
            to { height: var(--bar-h); }
          }
          @keyframes framecn-dashboard-line {
            from { stroke-dashoffset: 1; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes framecn-dashboard-donut {
            from { stroke-dashoffset: ${donutCircum}; }
            to { stroke-dashoffset: ${donutCircum * 0.28}; }
          }
        `}</style>

        {/* Subtle grid bg */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Header */}
        <div
          style={{
            alignItems: "center",
            animation: `framecn-dashboard-structure ${structureEndMs}ms ease-out backwards`,
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Overview
            </div>
            <div
              style={{
                fontSize: 14,
                marginTop: 4,
                opacity: 0.5,
              }}
            >
              Last 30 days
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: MONO_FAMILY,
              fontSize: 12,
              gap: 8,
            }}
          >
            {["1D", "7D", "30D", "ALL"].map((l, i) => (
              <div
                key={l}
                style={{
                  background:
                    i === 2
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "6px 12px",
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            flex: 1,
            gap: 24,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            position: "relative",
          }}
        >
          {/* KPI */}
          <Tile
            title="Revenue"
            style={{
              animation: `framecn-dashboard-structure ${structureEndMs}ms ease-out backwards`,
            }}
          >
            <div
              style={{
                animation: `framecn-dashboard-kpi ${kpiMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${structureEndMs}ms backwards`,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: "100%",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: MONO_FAMILY,
                  fontSize: 64,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                ${formatNumber(kpiTarget)}
              </div>
              <div
                style={{
                  alignItems: "center",
                  color: accentColor,
                  display: "flex",
                  fontSize: 14,
                  gap: 8,
                }}
              >
                <span style={{ fontWeight: 600 }}>+12.4%</span>
                <span style={{ color: "white", opacity: 0.5 }}>
                  vs last month
                </span>
              </div>
            </div>
          </Tile>

          {/* Bar chart */}
          <Tile
            title="Sessions"
            style={{
              animation: `framecn-dashboard-structure ${structureEndMs}ms ease-out backwards`,
            }}
          >
            <svg
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              style={{ height: "100%", width: "100%" }}
            >
              <line
                x1="0"
                y1="100"
                x2="200"
                y2="100"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              />
              {[25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="200"
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
              ))}
              {BAR_VALUES.map((v, i) => {
                const barH = v * 90;
                const barW = 24;
                const x = 16 + i * 36;
                const y = 100 - barH;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={3}
                    fill={accentColor}
                    opacity={0.85}
                    style={{
                      animation: `framecn-dashboard-bar ${(barH / 90) * kpiMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${structureEndMs + i * barStaggerMs}ms backwards`,
                      transformBox: "fill-box",
                      transformOrigin: `0 ${100 - y}px`,
                    }}
                  />
                );
              })}
            </svg>
          </Tile>

          {/* Line chart */}
          <Tile
            title="Active users"
            style={{
              animation: `framecn-dashboard-structure ${structureEndMs}ms ease-out backwards`,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ height: "100%", width: "100%" }}
            >
              <line
                x1="0"
                y1="100"
                x2="100"
                y2="100"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.4"
              />
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 1.5"
                />
              ))}
              <path
                d={linePath}
                fill="none"
                stroke={accentColor}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{
                  animation: `framecn-dashboard-line ${lineMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${structureEndMs + barStaggerMs * 5}ms backwards`,
                  strokeDasharray: 1,
                }}
              />
            </svg>
          </Tile>

          {/* Donut */}
          <Tile
            title="Conversion"
            style={{
              animation: `framecn-dashboard-structure ${structureEndMs}ms ease-out backwards`,
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r={donutR}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                />
                <circle
                  cx="90"
                  cy="90"
                  r={donutR}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="14"
                  strokeLinecap="round"
                  style={{
                    animation: `framecn-dashboard-donut ${lineMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${structureEndMs + barStaggerMs * 6}ms backwards`,
                    strokeDasharray: donutCircum,
                    transform: "rotate(-90deg)",
                    transformOrigin: "center",
                  }}
                />
              </svg>
              <div
                style={{
                  fontFamily: MONO_FAMILY,
                  fontSize: 36,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  position: "absolute",
                }}
              >
                72.0%
              </div>
            </div>
          </Tile>
        </div>
      </>
    </Timegroup>
  );
};
