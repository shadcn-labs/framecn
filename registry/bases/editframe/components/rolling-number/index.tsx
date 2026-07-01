"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";
import { useMemo } from "react";

const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

export interface RollingNumberProps {
  from?: number;
  to?: number;
  fontSize?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  separator?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

const springEase = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

const formatWithSeparators = (
  n: number,
  separator: string
): string => {
  const parts = Math.round(n).toLocaleString("en-US").split(",");
  return parts.join(separator);
};

const placeOpacity = (current: number, place: number): number => {
  if (place === 0) return 1;
  const threshold = 10 ** place;
  return Math.max(
    0,
    Math.min(1, (current - threshold * 0.9) / (threshold * 0.1))
  );
};

function RollingDigit({
  digit,
  fontSize,
  color,
  cellHeight,
}: {
  digit: number;
  fontSize: number;
  color: string;
  cellHeight: number;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        height: cellHeight,
        overflow: "hidden",
        textAlign: "center",
        verticalAlign: "top",
        width: "0.62em",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${-digit * cellHeight}px)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, di) => (
          <span
            key={di}
            style={{ height: cellHeight, lineHeight: `${cellHeight}px` }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function RollingNumber({
  from = 0,
  to = 24_813,
  fontSize = 120,
  color = "#171717",
  prefix = "",
  suffix = "",
  separator = ",",
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: RollingNumberProps) {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = ((durationInFrames / fps) * 1000) / safeSpeed;
  const frameMs = 1000 / fps;

  const start = Math.max(0, Math.round(from));
  const end = Math.max(0, Math.round(to));
  const maxVal = Math.max(start, end);

  const template = formatWithSeparators(maxVal, separator);
  const cellHeight = fontSize * 1.1;

  const progressSteps = useMemo(() => {
    const steps: { pct: number; current: number }[] = [];
    const stepsCount = 20;
    for (let s = 0; s <= stepsCount; s++) {
      const t = s / stepsCount;
      const eased = t * t * (3 - 2 * t);
      const current = start + eased * (end - start);
      steps.push({ current, pct: t * 100 });
    }
    return steps;
  }, [start, end]);

  const digitAnimations = useMemo(() => {
    const anims: string[] = [];
    let place = 0;
    for (let i = template.length - 1; i >= 0; i--) {
      const ch = template[i];
      if (ch !== separator) {
        const keyframeLines: string[] = [];
        for (const step of progressSteps) {
          const digit = Math.floor(step.current / 10 ** place) % 10;
          keyframeLines.push(
            `  ${step.pct.toFixed(2)}% { transform: translateY(${-digit * cellHeight}px); }`
          );
        }
        anims.push(
          `@keyframes framecn-rn-place-${place} {\n${keyframeLines.join("\n")}\n}`
        );
        place++;
      }
    }
    return anims.join("\n\n");
  }, [template, progressSteps, cellHeight, separator]);

  const opacityAnimations = useMemo(() => {
    const anims: string[] = [];
    let place = 0;
    for (let i = template.length - 1; i >= 0; i--) {
      const ch = template[i];
      if (ch !== separator) {
        const keyframeLines: string[] = [];
        for (const step of progressSteps) {
          const opacity = placeOpacity(step.current, place);
          keyframeLines.push(
            `  ${step.pct.toFixed(2)}% { opacity: ${opacity}; }`
          );
        }
        anims.push(
          `@keyframes framecn-rn-opacity-${place} {\n${keyframeLines.join("\n")}\n}`
        );
        place++;
      }
    }
    return anims.join("\n\n");
  }, [template, progressSteps, separator]);

  const cells: React.ReactNode[] = [];
  let place = 0;
  for (let i = template.length - 1; i >= 0; i--) {
    const ch = template[i];
    if (ch === separator) {
      cells.unshift(
        <span
          key={`c${i}`}
          style={{
            color: "currentColor",
            display: "inline-block",
            fontSize: "0.85em",
            opacity: placeOpacity(maxVal, place),
            textAlign: "center",
            width: "0.32em",
          }}
        >
          {separator}
        </span>
      );
    } else {
      const digit = Math.floor(maxVal / 10 ** place) % 10;
      cells.unshift(
        <span
          key={`d${i}`}
          style={{
            display: "inline-block",
            height: cellHeight,
            opacity: placeOpacity(maxVal, place),
            overflow: "hidden",
            textAlign: "center",
            verticalAlign: "top",
            width: "0.62em",
          }}
        >
          <span
            style={{
              animation: `framecn-rn-place-${place} ${durationMs}ms linear forwards`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, di) => (
              <span
                key={di}
                style={{ height: cellHeight, lineHeight: `${cellHeight}px` }}
              >
                {d}
              </span>
            ))}
          </span>
        </span>
      );
      place++;
    }
  }

  const containerStyle: CSSProperties = {
    alignItems: "center",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
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
          ${digitAnimations}
          ${opacityAnimations}
        `}</style>
        <div
          style={{
            alignItems: "baseline",
            color,
            display: "flex",
            fontFamily: MONO_FAMILY,
            fontSize,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {prefix && <span>{prefix}</span>}
          {cells}
          {suffix && <span>{suffix}</span>}
        </div>
      </>
    </Timegroup>
  );
}
