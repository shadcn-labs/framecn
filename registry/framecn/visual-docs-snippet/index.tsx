"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface VisualDocsSnippetProps {
  cursorStart?: { x: number; y: number };
  cursorTarget?: { x: number; y: number };
  clickFrame?: number;
  tooltipTitle?: string;
  tooltipBody?: string;
  buttonLabel?: string;
  accent?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const BrowserChrome = ({ chromeHeight }: { chromeHeight: number }) => (
  <div
    style={{
      alignItems: "center",
      background: "rgba(20,19,24,0.95)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      gap: 14,
      height: chromeHeight,
      paddingLeft: 18,
      paddingRight: 18,
      position: "relative",
    }}
  >
    <div style={{ display: "flex", gap: 8 }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div
          key={c}
          style={{
            background: c,
            borderRadius: "50%",
            height: 11,
            opacity: 0.85,
            width: 11,
          }}
        />
      ))}
    </div>
    <div
      style={{
        alignItems: "center",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        color: "rgba(255,255,255,0.55)",
        display: "flex",
        flex: 1,
        fontFamily:
          "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        height: 28,
        marginLeft: 12,
        paddingLeft: 14,
      }}
    >
      ⌕ remocn.dev/runs/new
    </div>
  </div>
);

const CursorSVG = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 3L5 19L9.5 14.5L12.5 21L15 20L12 13.5L18.5 13.5L5 3Z"
      fill="white"
      stroke="#000"
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
  </svg>
);

const BROWSER = {
  chromeHeight: 48,
  height: 540,
  left: 100,
  top: 90,
  width: 1080,
};

const BUTTON = {
  cx: 640,
  cy: 360,
  height: 64,
  width: 220,
};

export const VisualDocsSnippet = ({
  cursorStart = { x: 980, y: 560 },
  cursorTarget = { x: BUTTON.cx, y: BUTTON.cy },
  clickFrame = 110,
  tooltipTitle = "Generate runs",
  tooltipBody = "Click to start a new generation. The job will appear in the sidebar.",
  buttonLabel = "Generate",
  accent = "#FFB38E",
  background = "#141318",
  speed = 1,
  fps = 30,
  durationInFrames = 300,
  className,
}: VisualDocsSnippetProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;

  const cursorStartFrame = 30;
  const cursorEndFrame = clickFrame;
  const boundingBoxFrame = clickFrame + 5;
  const tooltipFrame = clickFrame + 20;
  const settleFrame = clickFrame + 90;

  const browserDurationMs = 30 * frameMs;
  const cursorMoveDurationMs = (cursorEndFrame - cursorStartFrame) * frameMs;
  const cursorStartDelayMs = cursorStartFrame * frameMs;
  const clickDelayMs = clickFrame * frameMs;
  const boundingBoxDelayMs = boundingBoxFrame * frameMs;
  const boundingBoxDurationMs = 18 * frameMs;
  const tooltipDelayMs = tooltipFrame * frameMs;
  const tooltipHeadDurationMs = 14 * frameMs;
  const tooltipBodyDurationMs = 14 * frameMs;
  const tooltipBodyDelayMs = 6 * frameMs;
  const settleDelayMs = settleFrame * frameMs;

  const boxPerimeter = (BUTTON.width + 24 + (BUTTON.height + 24)) * 2;

  const style = {
    background,
    display: "block",
    fontFamily: FONT_FAMILY,
    height: "100%",
    position: "relative",
    width: "100%",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={style}
    >
      <>
        <style>{`
          @keyframes framecn-vds-browser-enter {
            from {
              opacity: 0;
              transform: scale(0.98);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes framecn-vds-cursor-move {
            0% {
              left: ${cursorStart.x}px;
              top: ${cursorStart.y}px;
            }
            100% {
              left: ${cursorTarget.x}px;
              top: ${cursorTarget.y - 36 * Math.sin(Math.PI)}px;
            }
          }

          @keyframes framecn-vds-cursor-exit {
            0% {
              left: ${cursorTarget.x}px;
              top: ${cursorTarget.y}px;
            }
            100% {
              left: 1180px;
              top: 660px;
            }
          }

          @keyframes framecn-vds-click-bounce {
            0%, 100% { transform: translate(-2px, -2px) scale(1); }
            40% { transform: translate(-2px, -2px) scale(0.94); }
          }

          @keyframes framecn-vds-button-scale {
            0%, 100% { transform: scale(1); }
            40% { transform: scale(0.94); }
          }

          @keyframes framecn-vds-ripple {
            from {
              r: 0;
              opacity: 0.6;
            }
            to {
              r: 60;
              opacity: 0;
            }
          }

          @keyframes framecn-vds-box-draw {
            from {
              stroke-dashoffset: ${boxPerimeter};
            }
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes framecn-vds-box-fade {
            0% { opacity: 0; }
            33% { opacity: 1; }
            66% { opacity: 1; }
            100% { opacity: 0.6; }
          }

          @keyframes framecn-vds-tooltip-head {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes framecn-vds-tooltip-body {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes framecn-vds-tooltip-settle {
            from { opacity: 1; }
            to { opacity: 0.6; }
          }
        `}</style>

        {/* Browser frame */}
        <div
          style={{
            animation: `framecn-vds-browser-enter ${browserDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards`,
            background: "#0a090e",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18,
            boxShadow: "0 50px 120px rgba(0,0,0,0.55)",
            height: BROWSER.height,
            left: BROWSER.left,
            overflow: "hidden",
            position: "absolute",
            top: BROWSER.top,
            transformOrigin: "center 40%",
            width: BROWSER.width,
          }}
        >
          <BrowserChrome chromeHeight={BROWSER.chromeHeight} />

          <div
            style={{
              alignItems: "center",
              background: "#0a090e",
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              left: 0,
              paddingTop: 60,
              position: "absolute",
              right: 0,
              top: BROWSER.chromeHeight,
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
                letterSpacing: "0.04em",
              }}
            >
              Generations · 2 active
            </div>
            <div
              style={{
                color: "white",
                fontSize: 38,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                maxWidth: 720,
                textAlign: "center",
              }}
            >
              Run a new generation
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 15,
                lineHeight: 1.5,
                maxWidth: 480,
                textAlign: "center",
              }}
            >
              Pick a model, set a seed, and start a job. Results stream into the
              sidebar as they finish.
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div
          style={{
            alignItems: "center",
            animation: `
              framecn-vds-button-scale ${(14 * frameMs) / speed}ms cubic-bezier(0.16, 1, 0.3, 1) ${clickDelayMs}ms both,
              framecn-vds-browser-enter ${browserDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) backwards
            `,
            background: "white",
            borderRadius: 14,
            boxShadow: `0 12px 32px rgba(255,255,255,0.08)`,
            color: "#0a090e",
            display: "flex",
            fontSize: 17,
            fontWeight: 600,
            height: BUTTON.height,
            justifyContent: "center",
            left: BUTTON.cx - BUTTON.width / 2,
            position: "absolute",
            top: BUTTON.cy - BUTTON.height / 2,
            width: BUTTON.width,
          }}
        >
          {buttonLabel} →
        </div>

        {/* Click ripple */}
        <svg
          style={{
            animation: `${clickDelayMs}ms both`,
            height: 160,
            left: BUTTON.cx - 80,
            pointerEvents: "none",
            position: "absolute",
            top: BUTTON.cy - 80,
            width: 160,
          }}
        >
          <circle
            cx={80}
            cy={80}
            r={0}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            style={{
              animation: `framecn-vds-ripple ${(24 * frameMs) / speed}ms ease-out ${clickDelayMs}ms forwards`,
            }}
          />
        </svg>

        {/* Bounding box */}
        <svg
          style={{
            animation: `framecn-vds-box-fade ${(settleFrame - boundingBoxFrame + 10) * frameMs}ms ease-out ${boundingBoxDelayMs}ms forwards`,
            height: BUTTON.height + 24,
            left: BUTTON.cx - BUTTON.width / 2 - 12,
            pointerEvents: "none",
            position: "absolute",
            top: BUTTON.cy - BUTTON.height / 2 - 12,
            width: BUTTON.width + 24,
          }}
        >
          <rect
            x={1}
            y={1}
            width={BUTTON.width + 22}
            height={BUTTON.height + 22}
            rx={10}
            ry={10}
            fill="none"
            stroke={accent}
            strokeOpacity={0.85}
            strokeWidth={2}
            strokeDasharray={`${boxPerimeter} ${boxPerimeter}`}
            style={{
              animation: `framecn-vds-box-draw ${boundingBoxDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${boundingBoxDelayMs}ms both`,
            }}
          />
          {[
            [0, 0],
            [BUTTON.width + 24, 0],
            [0, BUTTON.height + 24],
            [BUTTON.width + 24, BUTTON.height + 24],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={4}
              fill={accent}
              style={{
                animation: `framecn-vds-box-fade ${boundingBoxDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${boundingBoxDelayMs}ms both`,
              }}
            />
          ))}
        </svg>

        {/* Tooltip */}
        <div
          style={{
            animation: `framecn-vds-tooltip-settle ${10 * frameMs}ms ease-out ${settleDelayMs}ms forwards`,
            backdropFilter: "blur(14px)",
            background: "rgba(20,19,24,0.92)",
            border: `1px solid ${accent}55`,
            borderRadius: 16,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
            fontFamily: FONT_FAMILY,
            left: BUTTON.cx + BUTTON.width / 2 + 56,
            padding: "20px 22px",
            position: "absolute",
            top: BUTTON.cy - 60,
            width: 320,
          }}
        >
          <div
            style={{
              animation: `framecn-vds-tooltip-head ${tooltipHeadDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${tooltipDelayMs}ms both`,
              color: "white",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: 6,
            }}
          >
            {tooltipTitle}
          </div>
          <div
            style={{
              animation: `framecn-vds-tooltip-body ${tooltipBodyDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${tooltipDelayMs + tooltipBodyDelayMs}ms both`,
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {tooltipBody}
          </div>
          <div
            style={{
              background: "rgba(20,19,24,0.92)",
              borderBottom: `1px solid ${accent}55`,
              borderLeft: `1px solid ${accent}55`,
              height: 14,
              left: -8,
              position: "absolute",
              top: 70,
              transform: "rotate(45deg)",
              width: 14,
            }}
          />
        </div>

        {/* Cursor */}
        <div
          style={{
            animation: `
              framecn-vds-cursor-move ${cursorMoveDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${cursorStartDelayMs}ms both,
              framecn-vds-cursor-exit ${(50 * frameMs) / speed}ms cubic-bezier(0.16, 1, 0.3, 1) ${clickDelayMs + 6 * frameMs}ms both,
              framecn-vds-click-bounce ${(14 * frameMs) / speed}ms cubic-bezier(0.16, 1, 0.3, 1) ${clickDelayMs}ms both
            `,
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.55))",
            left: cursorStart.x,
            position: "absolute",
            top: cursorStart.y,
            transform: "translate(-2px, -2px)",
            transformOrigin: "top left",
            zIndex: 9999,
          }}
        >
          <CursorSVG />
        </div>
      </>
    </Timegroup>
  );
};
