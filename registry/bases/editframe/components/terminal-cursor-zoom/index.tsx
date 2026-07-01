"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const _FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

export interface TerminalCursorZoomProps {
  lines?: string[];
  prompt?: string;
  title?: string;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_LINES = [
  "npm run dev",
  "",
  "  VITE v5.2.0  ready in 312 ms",
  "",
  "  ➜  Local:   http://localhost:5173/",
  "  ➜  Network: http://192.168.1.42:5173/",
  "  ➜  press h + enter to show help",
];

export const TerminalCursorZoom = ({
  lines = DEFAULT_LINES,
  prompt = "$",
  title = "~/project",
  accentColor = "#22c55e",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 900,
  height = 480,
  className,
}: TerminalCursorZoomProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;
  const lineHeight = 26;

  const commandLine = lines[0] ?? "";
  const restLines = lines.slice(1);

  const commandTypingMs = (commandLine.length * 2 * frameMs) / safeSpeed;
  const commandStartMs = (10 * frameMs) / safeSpeed;
  const restStartMs =
    commandStartMs + commandTypingMs + (15 * frameMs) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "#050505",
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
          @keyframes framecn-tcz-type {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes framecn-tcz-appear {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes framecn-tcz-cursor-blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          @keyframes framecn-tcz-zoom {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}</style>

        {/* Subtle backdrop */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at center, #0f172a 0%, #050505 70%)",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Terminal window */}
        <div
          style={{
            animation: `framecn-tcz-zoom ${durationMs}ms ease-in-out`,
            background: "rgba(15,15,17,0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            fontFamily: MONO_FAMILY,
            height,
            overflow: "hidden",
            position: "relative",
            width,
          }}
        >
          {/* Title bar */}
          <div
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              height: 38,
              paddingLeft: 14,
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{
                  background: c,
                  borderRadius: "50%",
                  height: 11,
                  opacity: 0.65,
                  width: 11,
                }}
              />
            ))}
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                flex: 1,
                fontFamily: MONO_FAMILY,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {title}
            </div>
          </div>

          {/* Terminal body */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              padding: "16px 20px",
              position: "relative",
            }}
          >
            {/* Command line */}
            <div
              style={{
                color: "rgba(255,255,255,0.95)",
                display: "flex",
                fontSize: 15,
                height: lineHeight,
                whiteSpace: "pre",
              }}
            >
              <span style={{ color: accentColor, marginRight: 8 }}>
                {prompt}
              </span>
              <span
                style={{
                  animation: `framecn-tcz-type ${commandTypingMs}ms steps(${commandLine.length}) ${commandStartMs}ms forwards`,
                  overflow: "hidden",
                  whiteSpace: "pre",
                  width: 0,
                }}
              >
                {commandLine}
              </span>
              <span
                style={{
                  animation: `framecn-tcz-cursor-blink 1000ms linear ${commandStartMs + commandTypingMs}ms infinite`,
                  background: "rgba(255,255,255,0.85)",
                  display: "inline-block",
                  height: 15,
                  marginLeft: 2,
                  width: 8,
                }}
              />
            </div>

            {/* Output lines */}
            {restLines.map((line, i) => (
              <div
                key={i}
                style={{
                  animation: `framecn-tcz-appear ${durationMs}ms ${restStartMs + i * ((6 * frameMs) / safeSpeed)}ms forwards`,
                  color: line === "" ? "transparent" : "rgba(255,255,255,0.65)",
                  fontSize: 14,
                  height: lineHeight,
                  opacity: 0,
                  whiteSpace: "pre",
                }}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
