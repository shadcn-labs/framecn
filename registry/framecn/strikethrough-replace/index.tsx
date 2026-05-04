"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

export interface StrikethroughReplaceProps {
  from: string;
  to: string;
  lineColor?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export const StrikethroughReplace = ({
  from,
  to,
  lineColor = "#ff5e3a",
  fontSize = 48,
  color = "#171717",
  fontWeight = 600,
  _speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: StrikethroughReplaceProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const strikeDurationMs = 0.4 * durationMs;
  const fadeDurationMs = 0.2 * durationMs;
  const fadeDelayMs = 0.4 * durationMs;

  const containerStyle = {
    alignItems: "center",
    background: "white",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
  } as CSSProperties;

  const textStyle: CSSProperties = {
    color,
    fontFamily: FONT_FAMILY,
    fontSize,
    fontWeight,
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",
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
          @keyframes framecn-strike-line {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes framecn-strike-from-fade {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes framecn-strike-to-enter {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div
          style={{
            alignItems: "center",
            display: "inline-flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* From text with strikethrough */}
          <span
            style={{
              ...textStyle,
              animation: `framecn-strike-from-fade ${fadeDurationMs}ms ease-out ${fadeDelayMs}ms forwards`,
              position: "absolute",
            }}
          >
            {from}
            <span
              aria-hidden
              style={{
                animation: `framecn-strike-line ${strikeDurationMs}ms linear forwards`,
                background: lineColor,
                borderRadius: 2,
                height: Math.max(2, Math.round(fontSize * 0.08)),
                left: 0,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "100%",
              }}
            />
          </span>

          {/* To text */}
          <span
            style={{
              ...textStyle,
              animation: `framecn-strike-to-enter ${fadeDurationMs}ms ease-out ${fadeDelayMs}ms backwards`,
            }}
          >
            {to}
          </span>
        </div>
      </>
    </Timegroup>
  );
};
