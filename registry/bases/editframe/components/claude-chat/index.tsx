"use client";

import { Timegroup } from "@editframe/react";
import { useState, useEffect } from "react";

import { useTypewriter } from "@/lib/framecn-ui";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface ClaudeChatProps {
  prompt?: string;
  response?: string;
  theme?: "light" | "dark";
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

interface Theme {
  page: string;
  cardBg: string;
  cardBorder: string;
  fg: string;
  fgMuted: string;
  inputBg: string;
  accent: string;
}

const THEMES: Record<"light" | "dark", Theme> = {
  dark: {
    accent: "#d4a574",
    cardBg: "#1e1e1e",
    cardBorder: "#333333",
    fg: "#e8e8e8",
    fgMuted: "#888888",
    inputBg: "#2a2a2a",
    page: "#121212",
  },
  light: {
    accent: "#c4956a",
    cardBg: "#ffffff",
    cardBorder: "#e0e0e0",
    fg: "#1a1a1a",
    fgMuted: "#666666",
    inputBg: "#f5f5f5",
    page: "#fafafa",
  },
};

const DEFAULT_PROMPT = "What are the key features of this codebase?";
const DEFAULT_RESPONSE =
  "This is a video component library built with Editframe. It provides composable UI primitives like buttons, inputs, dialogs, and complex compositions like chat flows, checkout flows, and more. Each component supports timeline-driven animations via CSS keyframes.";

const _ChevronDown = ({ color }: { color: string }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const PlusIcon = ({ color }: { color: string }) => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const MicIcon = ({ color }: { color: string }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill={color}>
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  </svg>
);

const SendIcon = ({ color }: { color: string }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill={color}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const ClaudeChat = ({
  prompt = DEFAULT_PROMPT,
  response = DEFAULT_RESPONSE,
  theme: themeName = "dark",
  speed = 1,
  fps = 30,
  durationInFrames = 300,
  className,
}: ClaudeChatProps) => {
  const theme = THEMES[themeName];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setFrame((prev) => {
        const next = prev + delta * fps * speed;
        return next >= durationInFrames ? 0 : next;
      });
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [fps, speed, durationInFrames]);

  const cursorStyle = useCursorPath([
    { at: 0, x: 100, y: 400 },
    { at: 30, duration: 15, x: 400, y: 350 },
    { at: 60, click: true, duration: 0, x: 400, y: 350 },
  ]);

  const typedPrompt = useTypewriter(prompt, frame, fps, { speed });

  const showResponse = frame > durationInFrames * 0.35;
  const responseProgress = showResponse
    ? Math.min(1, (frame - durationInFrames * 0.35) / (durationInFrames * 0.5))
    : 0;
  const visibleResponseChars = Math.floor(responseProgress * response.length);
  const visibleResponse = response.slice(0, visibleResponseChars);

  return (
    <Timegroup
      className={className}
      style={{
        fontFamily: FONT_FAMILY,
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: theme.page,
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            margin: "0 auto",
            maxWidth: 720,
            padding: "24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 24,
            }}
          >
            {showResponse && (
              <div
                style={{ alignItems: "flex-start", display: "flex", gap: 12 }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: theme.accent,
                    borderRadius: 6,
                    color: "white",
                    display: "flex",
                    flexShrink: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    height: 28,
                    justifyContent: "center",
                    width: 28,
                  }}
                >
                  C
                </div>
                <div style={{ color: theme.fg, fontSize: 15, lineHeight: 1.6 }}>
                  {visibleResponse}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: theme.inputBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "12px 16px",
            }}
          >
            <div style={{ color: theme.fg, fontSize: 15, minHeight: 24 }}>
              {typedPrompt.text}
            </div>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
                <PlusIcon color={theme.fgMuted} />
                <MicIcon color={theme.fgMuted} />
              </div>
              <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
                <SendIcon color={theme.fgMuted} />
              </div>
            </div>
          </div>
        </div>

        <Cursor style={cursorStyle} variant="pointer" theme={themeName} />
      </div>
    </Timegroup>
  );
};
