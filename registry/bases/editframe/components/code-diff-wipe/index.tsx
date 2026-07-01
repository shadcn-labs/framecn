"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const DEFAULT_BEFORE = `function getUser(id) {
  return fetch('/api/user/' + id)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.error) {
        throw new Error(data.error);
      }
      return data.user;
    });
}`;

const DEFAULT_AFTER = `async function getUser(id: string) {
  const res = await fetch(\`/api/user/\${id}\`);
  const { user, error } = await res.json();
  if (error) throw new Error(error);
  return user;
}`;

export interface CodeDiffWipeProps {
  before?: string;
  after?: string;
  language?: string;
  background?: string;
  accent?: string;
  transitionStart?: number;
  transitionDuration?: number;
  showHandle?: boolean;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const CodePane = ({
  code,
  background,
  label,
  labelColor,
  language,
  dimmed,
}: {
  code: string;
  background: string;
  label: string;
  labelColor: string;
  language: string;
  dimmed?: boolean;
}) => {
  const lines = code.split("\n");
  return (
    <div
      style={{
        background,
        display: "flex",
        flexDirection: "column",
        inset: 0,
        position: "absolute",
      }}
    >
      {/* Header */}
      <div
        style={{
          alignItems: "center",
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          height: 44,
          justifyContent: "space-between",
          padding: "0 18px",
        }}
      >
        <div
          style={{
            color: "#71717a",
            fontFamily:
              "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
            fontSize: 13,
          }}
        >
          {language}
        </div>
        <div
          style={{
            background: `${labelColor}1a`,
            border: `1px solid ${labelColor}55`,
            borderRadius: 999,
            color: labelColor,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            padding: "4px 10px",
          }}
        >
          {label}
        </div>
      </div>

      {/* Code */}
      <pre
        style={{
          color: dimmed ? "#71717a" : "#e4e4e7",
          flex: 1,
          fontFamily:
            "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
          fontSize: 16,
          lineHeight: 1.6,
          margin: 0,
          overflow: "hidden",
          padding: 24,
          whiteSpace: "pre",
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span
              style={{
                color: "#3f3f46",
                marginRight: 16,
                textAlign: "right",
                userSelect: "none",
                width: 32,
              }}
            >
              {i + 1}
            </span>
            <span>{line || " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
};

export const CodeDiffWipe = ({
  before = DEFAULT_BEFORE,
  after = DEFAULT_AFTER,
  language = "tsx",
  background = "#0a0a0a",
  accent = "#0ea5e9",
  transitionStart = 20,
  transitionDuration = 60,
  showHandle = true,
  speed = 1,
  fps = 30,
  durationInFrames = 120,
  width = 1280,
  height = 720,
  className,
}: CodeDiffWipeProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const startMs = transitionStart * frameMs;
  const durationMsCalc = (transitionDuration * frameMs) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "#050505",
    display: "flex",
    fontFamily:
      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
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
          @keyframes framecn-code-diff-wipe {
            from { clip-path: inset(0 100% 0 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          @keyframes framecn-code-diff-handle {
            from { left: 100%; }
            to { left: 0%; }
          }
        `}</style>
        <div
          style={{
            background,
            borderRadius: 14,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
            height: 560,
            overflow: "hidden",
            position: "relative",
            width: 980,
          }}
        >
          {/* AFTER (bottom layer) */}
          <CodePane
            code={after}
            background={background}
            label="AFTER"
            labelColor={accent}
            language={language}
          />

          {/* BEFORE (top layer, clipped) */}
          <div
            style={{
              animation: `framecn-code-diff-wipe ${durationMsCalc}ms cubic-bezier(0.16, 1, 0.3, 1) ${startMs}ms backwards`,
              inset: 0,
              position: "absolute",
            }}
          >
            <CodePane
              code={before}
              background={background}
              label="BEFORE"
              labelColor="#ef4444"
              language={language}
              dimmed
            />
          </div>

          {/* Handle */}
          {showHandle && (
            <div
              style={{
                animation: `framecn-code-diff-handle ${durationMsCalc}ms cubic-bezier(0.16, 1, 0.3, 1) ${startMs}ms backwards`,
                background: accent,
                bottom: 0,
                boxShadow: `0 0 24px ${accent}`,
                position: "absolute",
                top: 0,
                transform: "translateX(-1px)",
                width: 2,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: accent,
                  borderRadius: "50%",
                  boxShadow: `0 0 32px ${accent}aa`,
                  color: "#0a0a0a",
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 700,
                  height: 40,
                  justifyContent: "center",
                  left: "50%",
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 40,
                }}
              >
                {"<>"}
              </div>
            </div>
          )}
        </div>
      </>
    </Timegroup>
  );
};
