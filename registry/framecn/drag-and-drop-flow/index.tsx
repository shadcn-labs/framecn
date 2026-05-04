"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FileIcon = ({ color }: { color: string }) => (
  <svg width="44" height="56" viewBox="0 0 44 56" fill="none">
    <path
      d="M6 4a4 4 0 014-4h18l12 12v40a4 4 0 01-4 4H10a4 4 0 01-4-4V4z"
      fill="white"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M28 0v8a4 4 0 004 4h8"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="12"
      y="22"
      width="20"
      height="2"
      rx="1"
      fill={color}
      opacity="0.5"
    />
    <rect
      x="12"
      y="28"
      width="16"
      height="2"
      rx="1"
      fill={color}
      opacity="0.5"
    />
    <rect
      x="12"
      y="34"
      width="18"
      height="2"
      rx="1"
      fill={color}
      opacity="0.5"
    />
  </svg>
);

export interface DragAndDropFlowProps {
  accent?: string;
  dropzoneLabel?: string;
  fileName?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const DragAndDropFlow = ({
  accent = "#0ea5e9",
  dropzoneLabel = "Drop file to upload",
  fileName = "design.fig",
  background = "#fafafa",
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
}: DragAndDropFlowProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const dragEndMs = (durationInFrames * 0.45 * frameMs) / safeSpeed;
  const highlightEndMs = (durationInFrames * 0.55 * frameMs) / safeSpeed;
  const progressEndMs = (durationInFrames * frameMs) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    height,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width,
  };

  const dropzoneWidth = 420;
  const dropzoneHeight = 260;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-drag-file {
            from { transform: translate(-220px, -120px); opacity: 0; }
            to { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes framecn-drag-file-fade {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes framecn-drag-border {
            from { border-color: #d4d4d8; }
            to { border-color: ${accent}; }
          }
          @keyframes framecn-drag-progress {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes framecn-drag-bar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
        <div
          style={{
            alignItems: "center",
            animation: `framecn-drag-border ${highlightEndMs - dragEndMs}ms ease-out ${dragEndMs}ms backwards`,
            background: "white",
            border: `2.5px dashed ${accent}`,
            borderRadius: 18,
            color: "#71717a",
            display: "flex",
            flexDirection: "column",
            fontSize: 16,
            fontWeight: 500,
            gap: 14,
            height: dropzoneHeight,
            justifyContent: "center",
            position: "relative",
            width: dropzoneWidth,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke={accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              animation: `framecn-drag-border ${highlightEndMs - dragEndMs}ms ease-out ${dragEndMs}ms backwards`,
            }}
          >
            {dropzoneLabel}
          </span>

          {/* Progress bar */}
          <div
            style={{
              animation: `framecn-drag-progress 300ms ease-out ${highlightEndMs}ms backwards`,
              bottom: 32,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              left: 32,
              position: "absolute",
              right: 32,
            }}
          >
            <div
              style={{
                color: "#52525b",
                display: "flex",
                fontSize: 13,
                justifyContent: "space-between",
              }}
            >
              <span>{fileName}</span>
              <span>100%</span>
            </div>
            <div
              style={{
                background: "#e4e4e7",
                borderRadius: 999,
                height: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  animation: `framecn-drag-bar ${progressEndMs - highlightEndMs}ms ease-out ${highlightEndMs}ms backwards`,
                  background: accent,
                  borderRadius: 999,
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Animated file icon */}
        <div
          style={{
            animation: `framecn-drag-file ${dragEndMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards, framecn-drag-file-fade 300ms ease-out ${highlightEndMs}ms forwards`,
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
            left: "50%",
            marginLeft: -22,
            marginTop: -28,
            position: "absolute",
            top: "50%",
          }}
        >
          <FileIcon color={accent} />
        </div>
      </>
    </Timegroup>
  );
};
