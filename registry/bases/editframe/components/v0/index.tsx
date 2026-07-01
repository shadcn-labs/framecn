"use client";

import { Timegroup } from "@editframe/react";
import { useEffect, useRef } from "react";

import { useTypewriter } from "@/lib/framecn-ui";
import { Caret } from "@/registry/bases/editframe/ui/caret";

const SANS_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface V0Props {
  greeting?: string;
  placeholder?: string;
  prompt?: string;
  modelName?: string;
  projectName?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

interface Theme {
  page: string;
  boxBg: string;
  boxBorder: string;
  fg: string;
  fgMuted: string;
  iconColor: string;
  btnBg: string;
  btnFg: string;
}

export const THEMES: Record<"light" | "dark", Theme> = {
  dark: {
    boxBg: "#0A0A0A",
    boxBorder: "#2A2A2A",
    btnBg: "#FFFFFF",
    btnFg: "#0A0A0A",
    fg: "#EDEDED",
    fgMuted: "#8A8A8A",
    iconColor: "#A0A0A0",
    page: "#000000",
  },
  light: {
    boxBg: "#FFFFFF",
    boxBorder: "#E3E3E3",
    btnBg: "#0D0D0D",
    btnFg: "#FFFFFF",
    fg: "#0D0D0D",
    fgMuted: "#8A8A8A",
    iconColor: "#5D5D5D",
    page: "#FFFFFF",
  },
};

export const TYPING_START_FRAME = 42;

export const TYPING_CPS = 22;

export const morphProgressAt = (
  frame: number,
  opts: { startFrame?: number; fps: number; speed: number }
): number => {
  const startFrame = opts.startFrame ?? TYPING_START_FRAME;
  const local = frame * opts.speed - startFrame;
  if (local <= 0) {
    return 0;
  }
  const t = Math.min(local / 15, 1);
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

function PlusIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <title>Add</title>
      <path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function V0LogoIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <title>v0</title>
      <rect
        x={2.5}
        y={2.5}
        width={19}
        height={19}
        rx={5}
        stroke={color}
        strokeWidth={1.8}
      />
      <rect
        x={7.5}
        y={7.5}
        width={9}
        height={9}
        rx={2.5}
        stroke={color}
        strokeWidth={1.8}
      />
    </svg>
  );
}

function ChevronDownIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <title>Expand</title>
      <path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <title>Voice input</title>
      <rect
        x={9}
        y={3}
        width={6}
        height={11}
        rx={3}
        stroke={color}
        strokeWidth={1.8}
      />
      <path
        d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <title>Send</title>
      <path
        d="M12 19V6M12 6l-6 6M12 6l6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function V0({
  greeting = "What do you want to create?",
  placeholder = "Ask v0 to build…",
  prompt = "a landing page for my SaaS with pricing and testimonials",
  modelName = "v0 Max",
  projectName = "Project",
  speed = 1,
  fps = 30,
  durationInFrames = 200,
  className,
}: V0Props) {
  const durationMs = (durationInFrames / fps) * 1000;
  const t = THEMES.dark;
  const refW = 1280;
  const refH = 720;
  const frameMs = 1000 / fps;
  const safeSpeed = Math.max(0.01, speed);

  const groupRef = useRef<any>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const micRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tg = groupRef.current;
    if (!tg) {
      return;
    }
    const cleanup = tg.addFrameTask((info: { ownCurrentTimeMs: number }) => {
      const frame = (info.ownCurrentTimeMs / 1000) * fps;
      const tw = useTypewriter(prompt, frame, fps, {
        cps: TYPING_CPS,
        speed: safeSpeed,
        startFrame: TYPING_START_FRAME,
      });
      const morph = morphProgressAt(frame, { fps, speed: safeSpeed });

      if (textRef.current) {
        textRef.current.textContent = tw.text;
      }

      if (micRef.current && arrowRef.current) {
        micRef.current.style.opacity = `${1 - morph}`;
        micRef.current.style.transform = `scale(${1 - 0.08 * morph})`;
        arrowRef.current.style.opacity = `${morph}`;
        arrowRef.current.style.transform = `scale(${0.85 + 0.15 * morph})`;
      }
    });
    return cleanup;
  }, [prompt, fps, safeSpeed]);

  const headingDelay = (4 * frameMs) / safeSpeed;
  const headingDur = ((20 - 4) * frameMs) / safeSpeed;
  const boxDelay = (10 * frameMs) / safeSpeed;
  const boxDur = ((26 - 10) * frameMs) / safeSpeed;

  const boxWidth = 880;
  const boxLeft = (refW - boxWidth) / 2;
  const boxTop = 270;
  const boxHeight = 150;
  const btnSize = 40;

  return (
    <Timegroup
      ref={groupRef}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background: "transparent",
          inset: 0,
          position: "absolute",
        } as React.CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecn-v0-heading {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-v0-box {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div
          style={{
            height: refH,
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: refW,
          }}
        >
          <div
            style={{
              animation: `framecn-v0-heading ${headingDur}ms cubic-bezier(0.22, 1, 0.36, 1) ${headingDelay}ms both`,
              color: t.fg,
              fontFamily: SANS_FAMILY,
              fontSize: 44,
              fontWeight: 700,
              left: 0,
              position: "absolute",
              textAlign: "center",
              top: 150,
              width: refW,
            }}
          >
            {greeting}
          </div>

          <div
            style={{
              animation: `framecn-v0-box ${boxDur}ms cubic-bezier(0.14, 1.12, 0.34, 1.4) ${boxDelay}ms both`,
              background: t.boxBg,
              border: `1px solid ${t.boxBorder}`,
              borderRadius: 16,
              boxShadow: "0 8px 40px -16px rgba(0,0,0,0.8)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              height: boxHeight,
              left: boxLeft,
              position: "absolute",
              top: boxTop,
              transformOrigin: "center top",
              width: boxWidth,
            }}
          >
            <div
              style={{
                alignItems: "flex-start",
                color: t.fg,
                display: "flex",
                flex: 1,
                fontFamily: SANS_FAMILY,
                fontSize: 18,
                overflow: "hidden",
                padding: "18px 20px",
              }}
            >
              <span style={{ color: t.fg, whiteSpace: "pre-wrap" }}>
                <span ref={textRef} />
                <Caret
                  color={t.fg}
                  blink
                  speed={safeSpeed}
                  height={20}
                  marginLeft={2}
                />
              </span>
            </div>

            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
              }}
            >
              <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
                <PlusIcon size={20} color={t.iconColor} />
                <div
                  style={{
                    alignItems: "center",
                    display: "inline-flex",
                    gap: 7,
                  }}
                >
                  <V0LogoIcon size={18} color={t.fg} />
                  <span
                    style={{
                      color: t.fg,
                      fontFamily: SANS_FAMILY,
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    {modelName}
                  </span>
                  <ChevronDownIcon size={14} color={t.fgMuted} />
                </div>
              </div>

              <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
                <div
                  style={{
                    alignItems: "center",
                    display: "inline-flex",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      color: t.fgMuted,
                      fontFamily: SANS_FAMILY,
                      fontSize: 15,
                    }}
                  >
                    {projectName}
                  </span>
                  <ChevronDownIcon size={14} color={t.fgMuted} />
                </div>

                <div
                  style={{
                    background: t.btnBg,
                    borderRadius: 10,
                    flexShrink: 0,
                    height: btnSize,
                    position: "relative",
                    width: btnSize,
                  }}
                >
                  <div
                    ref={micRef}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      inset: 0,
                      justifyContent: "center",
                      position: "absolute",
                    }}
                  >
                    <MicIcon size={20} color={t.btnFg} />
                  </div>
                  <div
                    ref={arrowRef}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      inset: 0,
                      justifyContent: "center",
                      opacity: 0,
                      position: "absolute",
                    }}
                  >
                    <ArrowUpIcon size={20} color={t.btnFg} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
}
