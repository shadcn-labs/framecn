"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface ProgressStepsProps {
  steps?: { label: string }[];
  orientation?: "horizontal" | "vertical";
  activeColor?: string;
  inactiveColor?: string;
  background?: string;
  textColor?: string;
  stepDuration?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const ProgressSteps = ({
  steps = [{ label: "Connect" }, { label: "Process" }, { label: "Deploy" }],
  orientation = "horizontal",
  activeColor = "#22c55e",
  inactiveColor = "#27272a",
  background = "#0a0a0a",
  textColor = "white",
  stepDuration = 30,
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1000,
  height = 500,
  className,
}: ProgressStepsProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const isHorizontal = orientation === "horizontal";

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    height,
    justifyContent: "center",
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
      <style>{`
        @keyframes framecn-progress-node {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes framecn-progress-line {
          from {
            stroke-dashoffset: var(--segment-length);
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          fontFamily:
            "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          gap: 0,
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* SVG layer for connecting lines */}
        <svg
          style={{
            left: isHorizontal ? 22 : "50%",
            overflow: "visible",
            pointerEvents: "none",
            position: "absolute",
            top: isHorizontal ? "50%" : 22,
            transform: isHorizontal ? "translateY(-50%)" : "translateX(-50%)",
          }}
          width={isHorizontal ? 920 : 4}
          height={isHorizontal ? 4 : 520}
        >
          {/* Background track */}
          {steps.slice(0, -1).map((_, i) => {
            const segmentLength = isHorizontal
              ? 920 / (steps.length - 1)
              : 520 / (steps.length - 1);
            return (
              <line
                key={`bg-${i}`}
                x1={isHorizontal ? i * segmentLength : 2}
                y1={isHorizontal ? 2 : i * segmentLength}
                x2={isHorizontal ? (i + 1) * segmentLength : 2}
                y2={isHorizontal ? 2 : (i + 1) * segmentLength}
                stroke={inactiveColor}
                strokeWidth={4}
                strokeLinecap="round"
                style={{ opacity: 0.6 }}
              />
            );
          })}
        </svg>

        {steps.map((step, i) => {
          const delay =
            (((i * stepDuration) / durationInFrames) * durationMs) / safeSpeed;
          const nodeRadius = 22;
          const segmentLength = isHorizontal
            ? 920 / (steps.length - 1)
            : 520 / (steps.length - 1);

          return (
            <div
              key={i}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: isHorizontal ? "column" : "row",
                gap: 14,
                height: isHorizontal ? "auto" : segmentLength,
                marginBottom:
                  !isHorizontal && i === steps.length - 1 ? 0 : -segmentLength,
                marginRight:
                  isHorizontal && i === steps.length - 1 ? 0 : -segmentLength,
                position: "relative",
                width: isHorizontal ? segmentLength : "auto",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  animation: `framecn-progress-node ${durationMs * 0.2}ms ease-out ${delay}ms forwards`,
                  background: i === 0 ? activeColor : inactiveColor,
                  border: `2px solid ${activeColor}`,
                  borderRadius: 999,
                  boxShadow: `0 0 0 6px ${activeColor}1a`,
                  display: "flex",
                  height: nodeRadius * 2,
                  justifyContent: "center",
                  opacity: 0,
                  transformOrigin: "center",
                  width: nodeRadius * 2,
                }}
              >
                {i > 0 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                style={{
                  animation: `framecn-progress-node ${durationMs * 0.2}ms ease-out ${delay + 100}ms forwards`,
                  color: textColor,
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  opacity: 0,
                  position: isHorizontal ? "absolute" : "static",
                  top: isHorizontal ? nodeRadius * 2 + 14 : undefined,
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Timegroup>
  );
};
