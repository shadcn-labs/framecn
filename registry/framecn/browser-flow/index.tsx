"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface BrowserFlowProps {
  url?: string;
  speed?: number;
  className?: string;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

const MacDots = ({ size = 12 }: { size?: number }) => (
  <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <div
        key={c}
        style={{
          background: c,
          borderRadius: "50%",
          height: size,
          opacity: 0.85,
          width: size,
        }}
      />
    ))}
  </div>
);

export const BrowserFlow = ({
  url = "remocn.dev",
  _speed = 1,
  className,
  fps = 30,
  durationInFrames = 270,
  width = 1280,
  height = 720,
}: BrowserFlowProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  // Animation timing (converted from frames)
  const typingStartMs = 4 * frameMs;
  const typingEndMs = 38 * frameMs;
  const typingDurationMs = (typingEndMs - typingStartMs) / safeSpeed;

  const progressStartMs = 40 * frameMs;
  const progressEndMs = 95 * frameMs;

  const pageStartMs = 95 * frameMs;
  const pageFadeDurationMs = 12 * frameMs;

  const scrollStartMs = 115 * frameMs;
  const scrollEndMs = 230 * frameMs;
  const scrollDurationMs = (scrollEndMs - scrollStartMs) / safeSpeed;

  const clickMs = (230 + 4) * frameMs;

  const containerStyle: CSSProperties = {
    background: "radial-gradient(ellipse at center, #11141c 0%, #050505 75%)",
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  const browserWidth = 1100;
  const browserHeight = 620;
  const chromeHeight = 56;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-browser-type {
            from { width: 0ch; }
            to { width: ${url.length}ch; }
          }
          @keyframes framecn-browser-cursor {
            0%, 50% { opacity: 1; }
            50.01%, 100% { opacity: 0; }
          }
          @keyframes framecn-browser-progress {
            0% { width: 0%; }
            23.5% { width: 15%; }
            58.8% { width: 15%; }
            100% { width: 100%; }
          }
          @keyframes framecn-browser-progress-fade {
            to { opacity: 0; }
          }
          @keyframes framecn-browser-page {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes framecn-browser-scroll {
            from { transform: translateY(0); }
            to { transform: translateY(-600px); }
          }
          @keyframes framecn-browser-cursor-move {
            0% { left: 380px; top: ${chromeHeight + 60}px; }
            100% { left: 50%; top: ${chromeHeight + 380}px; }
          }
          @keyframes framecn-browser-click {
            0%, 40% { transform: scale(1); }
            50%, 100% { transform: scale(0.85); }
          }
          @keyframes framecn-browser-btn-click {
            0%, 40% { transform: scale(1); }
            50%, 100% { transform: scale(0.98); }
          }
        `}</style>
        <div
          style={{
            background: "#0a0a0c",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            height: browserHeight,
            left: (width - browserWidth) / 2,
            overflow: "hidden",
            position: "absolute",
            top: (height - browserHeight) / 2,
            width: browserWidth,
          }}
        >
          {/* Chrome */}
          <div
            style={{
              alignItems: "center",
              background: "rgba(20,20,24,0.95)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 14,
              height: chromeHeight,
              paddingLeft: 18,
              paddingRight: 18,
              position: "relative",
            }}
          >
            <MacDots />
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                display: "flex",
                fontSize: 16,
                gap: 6,
                marginLeft: 8,
              }}
            >
              <span>‹</span>
              <span>›</span>
            </div>
            <div
              style={{
                alignItems: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(120,160,255,0.45)",
                borderRadius: 16,
                boxShadow: "0 0 0 3px rgba(120,160,255,0.12)",
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                flex: 1,
                fontFamily: MONO_FAMILY,
                fontSize: 13,
                height: 32,
                paddingLeft: 14,
                paddingRight: 14,
                position: "relative",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 8 }}>
                ⌕
              </span>
              <span
                style={{
                  animation: `framecn-browser-type ${typingDurationMs}ms steps(${url.length}) ${typingStartMs}ms backwards`,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {url}
              </span>
              <span
                style={{
                  animation: `framecn-browser-cursor 1000ms ease-in-out infinite ${typingStartMs}ms`,
                  background: "rgba(255,255,255,0.85)",
                  display: "inline-block",
                  height: 16,
                  marginLeft: 1,
                  width: 1.5,
                }}
              />
            </div>
            <div style={{ width: 60 }} />

            {/* Progress bar */}
            <div
              style={{
                animation: `framecn-browser-progress-fade ${durationMs - progressEndMs}ms ease-out ${progressEndMs}ms forwards`,
                bottom: 0,
                height: 2,
                left: 0,
                position: "absolute",
                right: 0,
              }}
            >
              <div
                style={{
                  animation: `framecn-browser-progress ${progressEndMs - progressStartMs}ms ease-out ${progressStartMs}ms backwards`,
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
                  boxShadow: "0 0 8px rgba(96,165,250,0.6)",
                  height: "100%",
                  transformOrigin: "left",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Page viewport */}
          <div
            style={{
              background: "#0a0a0c",
              bottom: 0,
              left: 0,
              overflow: "hidden",
              position: "absolute",
              right: 0,
              top: chromeHeight,
            }}
          >
            <div
              style={{
                animation: `framecn-browser-page ${pageFadeDurationMs}ms ease-out ${pageStartMs}ms backwards`,
              }}
            >
              <div
                style={{
                  animation: `framecn-browser-scroll ${scrollDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${scrollStartMs}ms backwards`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    height: 68,
                    justifyContent: "space-between",
                    padding: "0 60px",
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    remocn
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      display: "flex",
                      fontSize: 14,
                      gap: 28,
                    }}
                  >
                    <span>Components</span>
                    <span>Docs</span>
                    <span>GitHub</span>
                  </div>
                </div>

                {/* Hero */}
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    padding: "100px 60px 80px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(120,160,255,0.85)",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                  >
                    shadcn registry for Remotion
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: 64,
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.05,
                      maxWidth: 720,
                    }}
                  >
                    Production-ready video blocks.
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 17,
                      lineHeight: 1.5,
                      maxWidth: 520,
                    }}
                  >
                    Drop-in animations, transitions, and backgrounds for
                    Remotion. Own your code.
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    style={{
                      animation: `framecn-browser-btn-click 300ms cubic-bezier(0.16, 1, 0.3, 1) ${clickMs}ms backwards`,
                      background: "white",
                      border: "none",
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(255,255,255,0.1)",
                      color: "#0a0a0c",
                      fontFamily: FONT_FAMILY,
                      fontSize: 15,
                      fontWeight: 600,
                      marginTop: 12,
                      padding: "16px 32px",
                    }}
                  >
                    Browse components →
                  </button>
                </div>

                {/* Sections */}
                {[
                  { color: "#3b82f6", title: "Typography" },
                  { color: "#a855f7", title: "Backgrounds" },
                  { color: "#22c55e", title: "Transitions" },
                ].map((s) => (
                  <div
                    key={s.title}
                    style={{
                      alignItems: "center",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      display: "flex",
                      gap: 28,
                      margin: "40px 60px",
                      padding: "40px",
                    }}
                  >
                    <div
                      style={{
                        background: `${s.color}22`,
                        border: `1px solid ${s.color}55`,
                        borderRadius: 14,
                        height: 64,
                        width: 64,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          color: "white",
                          fontSize: 22,
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {s.title}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 14,
                        }}
                      >
                        Hand-tuned primitives, copied straight into your
                        project.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual cursor */}
        <div
          style={{
            animation: `framecn-browser-cursor-move ${scrollDurationMs + 300}ms cubic-bezier(0.16, 1, 0.3, 1) ${scrollStartMs}ms backwards`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
            height: 28,
            position: "absolute",
            transformOrigin: "top left",
            width: 22,
            zIndex: 9999,
          }}
        >
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
            <path
              d="M2 2L2 22L7 17.5L10.5 25L13.5 23.5L10 16L17 16L2 2Z"
              fill="white"
              stroke="black"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </>
    </Timegroup>
  );
};
