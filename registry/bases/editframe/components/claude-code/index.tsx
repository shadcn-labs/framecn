"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

const DEFAULT_CODE = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`;

export interface ClaudeCodeProps {
  code?: string;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const Mascot = ({ size = 48 }: { size?: number }) => (
  <div
    style={{
      alignItems: "center",
      background: "linear-gradient(135deg, #d4a574 0%, #c4956a 100%)",
      borderRadius: size * 0.3,
      display: "flex",
      height: size,
      justifyContent: "center",
      width: size,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
        fill="white"
        fillOpacity={0.9}
      />
    </svg>
  </div>
);

export const ClaudeCode = ({
  code = DEFAULT_CODE,
  accentColor = "#d4a574",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1280,
  height = 720,
  className,
}: ClaudeCodeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const _frameMs = 1000 / fps;

  const lines = code.split("\n");

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "#0a0a0a",
    display: "flex",
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
          @keyframes framecn-cc-line {
            from { opacity: 0; transform: translateX(-8px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes framecn-cc-aura {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes framecn-cc-cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* Background aura */}
        <div
          style={{
            animation: "framecn-cc-aura 12s ease-in-out infinite",
            background:
              "radial-gradient(circle at 30% 40%, rgba(212,165,116,0.15), transparent 50%), radial-gradient(circle at 70% 60%, rgba(168,85,247,0.1), transparent 50%)",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* IDE window */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: 16,
            boxShadow: "0 50px 120px rgba(0,0,0,0.6)",
            height: height - 80,
            padding: 1,
            position: "relative",
            width: width - 120,
          }}
        >
          <div
            style={{
              WebkitBackdropFilter: "blur(20px)",
              backdropFilter: "blur(20px)",
              background: "rgba(12,12,14,0.92)",
              borderRadius: 15,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              fontFamily: FONT_FAMILY,
              height: "100%",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 8,
                height: 44,
                padding: "0 16px",
              }}
            >
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  style={{
                    background: c,
                    borderRadius: "50%",
                    height: 12,
                    opacity: 0.65,
                    width: 12,
                  }}
                />
              ))}
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flex: 1,
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <Mascot size={22} />
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: MONO_FAMILY,
                    fontSize: 13,
                  }}
                >
                  Claude Code
                </span>
              </div>
            </div>

            {/* Content area */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Sidebar */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  padding: 12,
                  width: 200,
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    padding: "6px 8px",
                    textTransform: "uppercase",
                  }}
                >
                  Files
                </div>
                {["counter.tsx", "app.tsx", "index.tsx"].map((f, i) => (
                  <div
                    key={f}
                    style={{
                      background:
                        i === 0 ? "rgba(255,255,255,0.06)" : "transparent",
                      borderRadius: 6,
                      color:
                        i === 0
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(255,255,255,0.4)",
                      fontFamily: MONO_FAMILY,
                      fontSize: 13,
                      padding: "6px 8px",
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>

              {/* Code editor */}
              <div
                style={{
                  flex: 1,
                  fontFamily: MONO_FAMILY,
                  fontSize: 14,
                  lineHeight: 1.7,
                  overflow: "hidden",
                  padding: "16px 20px",
                  position: "relative",
                }}
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      animation: `framecn-cc-line 300ms ease-out ${i * 40}ms backwards`,
                      display: "flex",
                      gap: 0,
                      whiteSpace: "pre",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.15)",
                        userSelect: "none",
                        width: 32,
                      }}
                    >
                      {String(i + 1).padStart(2, " ")}
                    </span>
                    <span style={{ color: "#e4e4e7" }}>{line}</span>
                  </div>
                ))}
                {/* Cursor */}
                <span
                  style={{
                    animation: "framecn-cc-cursor-blink 1s step-end infinite",
                    background: accentColor,
                    display: "inline-block",
                    height: 18,
                    marginLeft: 32,
                    verticalAlign: "text-bottom",
                    width: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
