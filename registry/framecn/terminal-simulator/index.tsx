"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export type TerminalLineType = "command" | "log" | "success" | "error";

export interface TerminalLine {
  text: string;
  type: TerminalLineType;
  delay?: number;
  pause?: number;
}

export interface TerminalSimulatorProps {
  lines?: TerminalLine[];
  prompt?: string;
  title?: string;
  background?: string;
  chromeColor?: string;
  fontSize?: number;
  charsPerFrame?: number;
  chunkSize?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const DEFAULT_LINES: TerminalLine[] = [
  { delay: 0, text: "npm run build", type: "command" },
  { delay: 6, text: "Resolving dependencies...", type: "log" },
  { delay: 4, text: "> remocn@1.0.0 build", type: "log" },
  { delay: 4, text: "> next build", type: "log" },
  { delay: 12, text: "Compiling...", type: "log" },
  { delay: 14, text: "Compiled successfully in 4.2s", type: "success" },
  { delay: 10, text: "Generating static pages (24/24)", type: "log" },
  { delay: 12, text: "Build completed without errors", type: "success" },
];

const TYPE_COLORS: Record<TerminalLineType, string> = {
  command: "#fafafa",
  error: "#ef4444",
  log: "#a1a1aa",
  success: "#22c55e",
};

const autoPause = (line: TerminalLine): number => {
  if (line.pause !== undefined) {
    return line.pause;
  }
  if (line.text.trimEnd().endsWith("...")) {
    return 18;
  }
  return 0;
};

const Light = ({ color }: { color: string }) => (
  <div
    style={{
      background: color,
      borderRadius: "50%",
      height: 12,
      opacity: 0.85,
      width: 12,
    }}
  />
);

export const TerminalSimulator = ({
  lines = DEFAULT_LINES,
  prompt = "$",
  title = "~/projects/remocn",
  background = "#0a0a0a",
  chromeColor = "#1a1a1a",
  fontSize = 18,
  charsPerFrame = 1,
  chunkSize = 1,
  speed = 1,
  fps = 30,
  durationInFrames = 200,
  className,
}: TerminalSimulatorProps) => {
  const lineHeight = Math.round(fontSize * 1.6);
  const windowWidth = 900;
  const windowHeight = 480;
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const lineTimings = lines.map((line, index) => {
    let startFrame = 10;
    for (let i = 0; i < index; i += 1) {
      const delay = lines[i].delay ?? 8;
      startFrame += delay;
      const typingFrames = Math.ceil(
        lines[i].text.length / (chunkSize * charsPerFrame)
      );
      startFrame += typingFrames + autoPause(lines[i]);
    }
    const typingFrames = Math.ceil(
      line.text.length / (chunkSize * charsPerFrame)
    );
    return {
      startMs: (startFrame / speed) * frameMs,
      text: line.text,
      type: line.type,
      typingMs: (typingFrames / speed) * frameMs,
    };
  });

  const terminalStyle: CSSProperties = {
    alignItems: "center",
    background: "#050505",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
  };

  const scrollKeyframes = (() => {
    const visibleLines = 8;
    const points: { percent: number; y: number }[] = [];
    for (let i = visibleLines; i < lines.length; i += 1) {
      const percent = (lineTimings[i].startMs / durationMs) * 100;
      points.push({ percent, y: -(i - visibleLines + 1) * lineHeight });
    }
    if (points.length === 0) {
      return "";
    }
    let kf =
      "@keyframes terminal-scroll {\n  0% { transform: translateY(0); }\n";
    for (const p of points) {
      kf += `  ${p.percent.toFixed(2)}% { transform: translateY(${p.y}px); }\n`;
    }
    kf += `  100% { transform: translateY(${points.at(-1)?.y ?? 0}px); }\n}`;
    return kf;
  })();

  const cursorKeyframes = `@keyframes terminal-cursor {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }`;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={terminalStyle}
    >
      <>
        <style>{`
          ${scrollKeyframes}
          ${cursorKeyframes}
          ${lineTimings
            .map(
              (_, i) => `@keyframes terminal-type-${i} {
            from { width: 0; }
            to { width: ${lines[i].text.length}ch; }
          }`
            )
            .join("\n")}
        `}</style>
        <div
          style={{
            background,
            borderRadius: 12,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
            height: windowHeight,
            overflow: "hidden",
            width: windowWidth,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: chromeColor,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 8,
              height: 40,
              padding: "0 16px",
            }}
          >
            <Light color="#ff5f57" />
            <Light color="#febc2e" />
            <Light color="#28c840" />
            <div
              style={{
                color: "#71717a",
                flex: 1,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflow: "hidden",
              padding: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                animation: scrollKeyframes
                  ? `terminal-scroll ${durationMs}ms linear forwards`
                  : undefined,
                left: 20,
                position: "absolute",
                right: 20,
                top: 20,
              }}
            >
              {lineTimings.map((timing, index) => {
                const line = lines[index];
                const steps = Math.max(
                  1,
                  Math.ceil(line.text.length / chunkSize)
                );
                return (
                  <div
                    key={index}
                    style={{
                      alignItems: "center",
                      animation: `terminal-line-appear ${durationMs}ms ${timing.startMs}ms forwards`,
                      color: TYPE_COLORS[line.type],
                      display: "flex",
                      fontSize,
                      height: lineHeight,
                      opacity: 0,
                      whiteSpace: "pre",
                    }}
                  >
                    {line.type === "command" && (
                      <span style={{ color: "#22c55e", marginRight: 8 }}>
                        {prompt}
                      </span>
                    )}
                    <span
                      style={{
                        animation: `terminal-type-${index} ${timing.typingMs}ms steps(${steps}) ${timing.startMs}ms forwards`,
                        display: "inline-block",
                        overflow: "hidden",
                        whiteSpace: "pre",
                        width: 0,
                      }}
                    >
                      {line.text}
                    </span>
                    <span
                      style={{
                        animation: `terminal-cursor 1000ms linear ${timing.startMs + timing.typingMs}ms infinite`,
                        background: TYPE_COLORS[line.type],
                        display: "inline-block",
                        height: fontSize,
                        marginLeft: 2,
                        width: fontSize * 0.55,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
