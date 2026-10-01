"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_MONO =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

const DEFAULT_CODE = `import { Timegroup } from "@editframe/react";

// Generate a hero scene
export function Hero() {
  return (
    <Timegroup duration="1000ms" mode="fixed">
      <h1 style={{ opacity: 1 }}>Hello</h1>
    </Timegroup>
  );
}`;

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "function",
  "const",
  "let",
  "var",
  "return",
  "if",
  "else",
  "for",
  "while",
  "new",
  "class",
  "extends",
  "default",
  "true",
  "false",
  "null",
  "undefined",
]);

interface Token {
  text: string;
  kind: "code" | "comment" | "string" | "keyword" | "number";
}

const tokenizeLine = (line: string): Token[] => {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//")) {
    return [{ kind: "comment", text: line }];
  }

  const tokens: Token[] = [];
  const re = /("[^"]*"|'[^']*'|`[^`]*`|\b\d+\b|\b[A-Za-z_$][\w$]*\b|[^\w"']+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(line)) !== null) {
    const [t] = match;
    const [first] = t;
    if (first === '"' || first === "'" || first === "`") {
      tokens.push({ kind: "string", text: t });
    } else if (/^\d+$/.test(t)) {
      tokens.push({ kind: "number", text: t });
    } else if (/^[A-Za-z_$][\w$]*$/.test(t) && KEYWORDS.has(t)) {
      tokens.push({ kind: "keyword", text: t });
    } else {
      tokens.push({ kind: "code", text: t });
    }
  }
  return tokens;
};

const TOKEN_COLORS: Record<Token["kind"], string> = {
  code: "#e4e4e7",
  comment: "#52525b",
  keyword: "#c4b5fd",
  number: "#fcd34d",
  string: "#86efac",
};

export interface GlassCodeBlockProps {
  code?: string;
  title?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  background?: string;
  glassColor?: string;
  staggerFrames?: number;
  showTrafficLights?: boolean;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const Light = ({ color }: { color: string }) => (
  <div
    style={{
      background: color,
      borderRadius: "50%",
      height: 12,
      opacity: 0.6,
      width: 12,
    }}
  />
);

const CodeLine = ({
  line,
  index,
  fontSize,
  opacity,
  ty,
}: {
  line: string;
  index: number;
  fontSize: number;
  opacity: number;
  ty: number;
}) => {
  const tokens = tokenizeLine(line);
  if (tokens.length === 0) {
    return <div style={{ height: fontSize * 0.8, opacity }} />;
  }
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        opacity,
        transform: `translateY(${ty}px)`,
        whiteSpace: "pre",
      }}
    >
      <span style={{ color: "#3f3f46", userSelect: "none", width: 28 }}>
        {String(index + 1).padStart(2, " ")}
      </span>
      <span>
        {tokens.map((t, i) => (
          <span key={i} style={{ color: TOKEN_COLORS[t.kind] }}>
            {t.text}
          </span>
        ))}
      </span>
    </div>
  );
};

export const GlassCodeBlock = ({
  code = DEFAULT_CODE,
  title = "hero.tsx",
  width = 760,
  height = 460,
  fontSize = 16,
  background = "#0a0a0a",
  glassColor = "rgba(10, 10, 10, 0.6)",
  staggerFrames = 4,
  showTrafficLights = true,
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  className,
}: GlassCodeBlockProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const staggerMs = ((staggerFrames / fps) * 1000) / safeSpeed;

  const lines = code.split("\n");

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    height: 720,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 1280,
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
          @keyframes framecn-glass-code-line {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-glass-aura {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
        {/* Animated background aura */}
        <div
          style={{
            animation: `framecn-glass-aura 10s ease-in-out infinite`,
            background:
              "radial-gradient(circle at 30% 50%, rgba(56,189,248,0.22), transparent 50%), radial-gradient(circle at 70% 50%, rgba(168,85,247,0.18), transparent 55%)",
            inset: 0,
            position: "absolute",
          }}
        />

        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: 16,
            boxShadow: "0 50px 120px rgba(0,0,0,0.55)",
            height,
            padding: 1,
            position: "relative",
            width,
          }}
        >
          <div
            style={{
              WebkitBackdropFilter: "blur(16px)",
              backdropFilter: "blur(16px)",
              background: glassColor,
              borderRadius: 15,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              fontFamily: FONT_MONO,
              height: "100%",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {/* Chrome */}
            <div
              style={{
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 8,
                height: 40,
                padding: "0 16px",
              }}
            >
              {showTrafficLights && (
                <>
                  <Light color="#ff5f57" />
                  <Light color="#febc2e" />
                  <Light color="#28c840" />
                </>
              )}
              <div
                style={{
                  color: "#a1a1aa",
                  flex: 1,
                  fontSize: 12,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                }}
              >
                {title}
              </div>
            </div>

            {/* Code body */}
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                fontSize,
                gap: 4,
                lineHeight: 1.55,
                padding: "20px 24px",
              }}
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    animation: `framecn-glass-code-line ${staggerMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerMs}ms backwards`,
                  }}
                >
                  <CodeLine
                    line={line}
                    index={i}
                    fontSize={fontSize}
                    opacity={1}
                    ty={0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
