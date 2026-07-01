"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { Input } from "@/registry/bases/editframe/ui/input";
import { Button } from "@/registry/bases/editframe/ui/button";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

export interface OpencodeProps {
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const TERMINAL_LINES = [
  { text: "$ opencode", type: "command" as const },
  { text: "  Starting OpenCode v1.0.0...", type: "log" as const },
  { text: "  Connected to workspace", type: "success" as const },
  { text: "", type: "log" as const },
  { text: "> Generate a landing page", type: "input" as const },
  { text: "", type: "log" as const },
  { text: "  Analyzing project structure...", type: "log" as const },
  { text: "  Found 12 files in src/", type: "log" as const },
  { text: "  Creating components...", type: "log" as const },
  { text: "  ✓ hero.tsx", type: "success" as const },
  { text: "  ✓ features.tsx", type: "success" as const },
  { text: "  ✓ pricing.tsx", type: "success" as const },
  { text: "  ✓ footer.tsx", type: "success" as const },
  { text: "", type: "log" as const },
  { text: "  Done! 4 files created.", type: "success" as const },
];

const TYPE_COLORS: Record<string, string> = {
  command: "#fafafa",
  input: "#c4b5fd",
  log: "#a1a1aa",
  success: "#22c55e",
};

export function Opencode({
  accentColor = "#7c3aed",
  speed = 1,
  fps = 30,
  durationInFrames = 210,
  width = 1280,
  height = 720,
  className,
}: OpencodeProps) {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;
  const lineHeight = 26;

  const lineTimings = TERMINAL_LINES.map((line, index) => {
    let startFrame = 10;
    for (let i = 0; i < index; i++) {
      startFrame += TERMINAL_LINES[i].type === "command" ? 12 : 6;
    }
    const typingFrames = line.type === "command" ? 8 : 0;
    return {
      startMs: (startFrame / safeSpeed) * frameMs,
      text: line.text,
      type: line.type,
      typingMs: (typingFrames / safeSpeed) * frameMs,
    };
  });

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "#09090b",
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
          @keyframes framecn-oc-type {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes framecn-oc-appear {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-oc-cursor {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
        `}</style>

        {/* Background */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(124,58,237,0.08), transparent 60%)",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* Terminal window */}
        <div
          style={{
            background: "rgba(15,15,17,0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            fontFamily: MONO_FAMILY,
            height: 480,
            overflow: "hidden",
            width: 720,
          }}
        >
          {/* Title bar */}
          <div
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 8,
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
              opencode — zsh
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
            {lineTimings.map((timing, index) => {
              const line = TERMINAL_LINES[index];
              const steps = line.type === "command" ? 8 : 1;
              return (
                <div
                  key={index}
                  style={{
                    animation: `framecn-oc-appear ${durationMs}ms ${timing.startMs}ms forwards`,
                    color: TYPE_COLORS[line.type] || "#a1a1aa",
                    display: "flex",
                    fontSize: 14,
                    height: lineHeight,
                    opacity: 0,
                    whiteSpace: "pre",
                  }}
                >
                  {line.type === "command" && (
                    <span style={{ color: accentColor, marginRight: 8 }}>
                      {line.text.charAt(0)}
                    </span>
                  )}
                  <span
                    style={{
                      animation:
                        line.type === "command"
                          ? `framecn-oc-type ${timing.typingMs}ms steps(${steps}) ${timing.startMs}ms forwards`
                          : undefined,
                      display: "inline-block",
                      overflow: "hidden",
                      whiteSpace: "pre",
                      width: line.type === "command" ? 0 : undefined,
                    }}
                  >
                    {line.type === "command" ? line.text.slice(1) : line.text}
                  </span>
                  {line.type === "command" && (
                    <span
                      style={{
                        animation: `framecn-oc-cursor 1000ms linear ${timing.startMs + timing.typingMs}ms infinite`,
                        background: "#fafafa",
                        display: "inline-block",
                        height: 14,
                        marginLeft: 2,
                        width: 7,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    </Timegroup>
  );
}
