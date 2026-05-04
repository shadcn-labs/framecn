"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

interface CodeEvent {
  code: string;
  ui: {
    background?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    fontWeight?: number;
    label?: string;
  };
}

const EVENTS: CodeEvent[] = [
  {
    code: "export function Button() {\n  return (\n    <button",
    ui: {},
  },
  { code: "\n      style={{", ui: {} },
  {
    code: '\n        background: "#3b82f6",',
    ui: { background: "#3b82f6" },
  },
  {
    code: '\n        color: "white",',
    ui: { color: "white" },
  },
  {
    code: '\n        padding: "12px 28px",',
    ui: { padding: "12px 28px" },
  },
  {
    code: '\n        borderRadius: "999px",',
    ui: { borderRadius: "999px" },
  },
  {
    code: "\n        fontWeight: 600,",
    ui: { fontWeight: 600 },
  },
  {
    code: "\n      }}\n    >\n      Ship it\n    </button>\n  );",
    ui: { label: "Ship it" },
  },
];

const CHARS_PER_FRAME = 1.6;

interface TimelineEntry extends CodeEvent {
  start: number;
  end: number;
}

const INITIAL_OFFSET = 8;
const DWELL_FRAMES = 5;

const buildTimeline = (): TimelineEntry[] => {
  let cursor = INITIAL_OFFSET;
  return EVENTS.map((ev) => {
    const start = cursor;
    const end = start + Math.ceil(ev.code.length / CHARS_PER_FRAME);
    cursor = end + DWELL_FRAMES;
    return { ...ev, end, start };
  });
};

const highlightLine = (line: string, accentColor: string) => {
  const tokens: { text: string; color: string }[] = [];
  const regex =
    /(\bexport\b|\bfunction\b|\breturn\b)|("[^"]*")|(\b[a-zA-Z_][a-zA-Z0-9_]*)(?==)|(\{|\}|\(|\)|<|>|\/|;)|([0-9]+)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null = regex.exec(line);
  while (m !== null) {
    if (m.index > lastIndex) {
      tokens.push({ color: "#e4e4e7", text: line.slice(lastIndex, m.index) });
    }
    if (m[1]) {
      tokens.push({ color: "#c084fc", text: m[1] });
    } else if (m[2]) {
      tokens.push({ color: "#86efac", text: m[2] });
    } else if (m[3]) {
      tokens.push({ color: accentColor, text: m[3] });
    } else if (m[4]) {
      tokens.push({ color: "#71717a", text: m[4] });
    } else if (m[5]) {
      tokens.push({ color: "#fbbf24", text: m[5] });
    }
    ({ lastIndex } = regex);
    m = regex.exec(line);
  }
  if (lastIndex < line.length) {
    tokens.push({ color: "#e4e4e7", text: line.slice(lastIndex) });
  }
  return tokens;
};

export interface LiveCodeCompilationProps {
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const LiveCodeCompilation = ({
  accentColor = "#3b82f6",
  speed = 1,
  fps = 30,
  durationInFrames = 290,
  width = 1280,
  height = 900,
  className,
}: LiveCodeCompilationProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;

  const timeline = buildTimeline();
  const lastEntry = timeline.at(-1);
  const buttonLabel = lastEntry.ui.label ?? "Button";

  const containerStyle: CSSProperties = {
    background: "#070708",
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  // Build keyframes for the code typing animation
  let keyframeCSS = "@keyframes framecn-live-code-typing {\n";
  for (const [i, entry] of timeline.entries()) {
    const startPercent = (entry.start / durationInFrames) * 100;
    const endPercent = (entry.end / durationInFrames) * 100;
    keyframeCSS += `  ${startPercent}% { width: ${i}ch; }\n`;
    keyframeCSS += `  ${endPercent}% { width: ${i + 1}ch; }\n`;
  }
  keyframeCSS += "}\n";

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-live-code-fade {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          ${keyframeCSS}
          @keyframes framecn-live-caret {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* Subtle backdrop gradient */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(59,130,246,0.08), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.06), transparent 60%)",
            inset: 0,
            position: "absolute",
          }}
        />

        {/* LEFT: Glass code window */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: 16,
            bottom: 48,
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            left: 48,
            padding: 1,
            position: "absolute",
            top: 48,
            width: 560,
          }}
        >
          <div
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(12,12,14,0.9)",
              borderRadius: 15,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 8,
                height: 38,
                padding: "0 16px",
              }}
            >
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  style={{
                    background: c,
                    borderRadius: 6,
                    height: 11,
                    opacity: 0.6,
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
                Button.tsx
              </div>
            </div>

            {/* Code body */}
            <div
              style={{
                color: "#e4e4e7",
                flex: 1,
                fontFamily: MONO_FAMILY,
                fontSize: 12.5,
                lineHeight: 1.65,
                overflow: "hidden",
                padding: "20px 24px",
              }}
            >
              {timeline.map((entry, i) => {
                const lineIndex = i;
                return (
                  <div
                    key={i}
                    style={{
                      animation: `framecn-live-code-fade ${frameMs * 3}ms ease-out ${entry.start * frameMs}ms backwards`,
                      display: "flex",
                      gap: 0,
                      whiteSpace: "pre",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.18)",
                        userSelect: "none",
                        width: 28,
                      }}
                    >
                      {lineIndex + 1}
                    </span>
                    <span>
                      {highlightLine(
                        entry.code.split("\n")[0] || "",
                        accentColor
                      ).map((t, j) => (
                        <span key={j} style={{ color: t.color }}>
                          {t.text}
                        </span>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div
          style={{
            alignItems: "center",
            animation: `framecn-live-code-fade ${frameMs * 10}ms ease-out ${timeline[0].start * frameMs}ms backwards`,
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18,
            bottom: 48,
            display: "flex",
            justifyContent: "center",
            padding: 48,
            position: "absolute",
            right: 48,
            top: 48,
            width: 560,
          }}
        >
          <button
            type="button"
            style={{
              animation: `framecn-live-code-fade ${frameMs * 10}ms ease-out ${timeline.at(-1).start * frameMs}ms backwards`,
              background: "#3b82f6",
              border: "none",
              borderRadius: "999px",
              boxShadow: "0 10px 30px rgba(59,130,246,0.3)",
              color: "white",
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 600,
              padding: "12px 28px",
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </>
    </Timegroup>
  );
};
