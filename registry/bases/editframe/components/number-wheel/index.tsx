"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";
import { useMemo } from "react";

const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

export interface NumberWheelProps {
  from?: number;
  to?: number;
  fontSize?: number;
  color?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export interface OdometerProps {
  current: number;
  fontSize: number;
  color: string;
  fps?: number;
  durationInFrames?: number;
}

const WHEEL_ROLL_START = 0.9;
const rollFraction = (current: number, place: number): number => {
  const v = current / 10 ** place;
  const frac = v - Math.floor(v);
  if (frac <= WHEEL_ROLL_START) {
    return 0;
  }
  return (frac - WHEEL_ROLL_START) / (1 - WHEEL_ROLL_START);
};

function computeWheel(
  current: number,
  place: number,
  springEased: (t: number) => number
): number {
  if (current <= 0) {
    return 0;
  }
  if (place === 0) {
    return current % 10;
  }
  const digit = Math.floor(current / 10 ** place) % 10;
  const t = rollFraction(current, place);
  if (t <= 0) {
    return digit;
  }
  return digit + springEased(t);
}
const placeOpacity = (current: number, place: number): number => {
  if (place === 0) {
    return 1;
  }
  const threshold = 10 ** place;
  return Math.max(
    0,
    Math.min(1, (current - threshold * 0.9) / (threshold * 0.1))
  );
};
const springEase = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

function OdometerColumns({
  current,
  templateValue,
  fontSize,
  color,
  fps,
  durationInFrames,
}: {
  current: number;
  templateValue: number;
  fontSize: number;
  color: string;
  fps: number;
  durationInFrames: number;
}) {
  const template = templateValue.toLocaleString("en-US");
  const cellHeight = fontSize * 1.1;

  const cells: React.ReactNode[] = [];
  let place = 0;
  for (let i = template.length - 1; i >= 0; i--) {
    const ch = template[i];
    if (ch === ",") {
      cells.unshift(
        <span
          key={`c${i}`}
          style={{
            color: "currentColor",
            display: "inline-block",
            fontSize: "0.85em",
            opacity: placeOpacity(current, place),
            textAlign: "center",
            width: "0.32em",
          }}
        >
          ,
        </span>
      );
    } else {
      const wheel = computeWheel(current, place, springEase);
      const wheelValue = Math.max(0, Math.min(9.99, wheel));
      cells.unshift(
        <span
          key={`d${i}`}
          style={{
            display: "inline-block",
            height: cellHeight,
            opacity: placeOpacity(current, place),
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
              transform: `translateY(${-wheelValue * cellHeight}px)`,
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

  return (
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
      {cells}
    </div>
  );
}

export function Odometer({
  current,
  fontSize,
  color,
  fps = 30,
  durationInFrames = 90,
}: OdometerProps) {
  const value = Math.max(0, Math.round(current));
  return (
    <OdometerColumns
      current={current}
      templateValue={value}
      fontSize={fontSize}
      color={color}
      fps={fps}
      durationInFrames={durationInFrames}
    />
  );
}

export function NumberWheel({
  from = 0,
  to = 24_813,
  fontSize = 120,
  color = "#171717",
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  className,
}: NumberWheelProps) {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;

  const start = Math.max(0, Math.round(from));
  const end = Math.max(0, Math.round(to));

  const countPortion = 0.8;
  const countAnimMs = durationMs * countPortion;

  const keyframesCSS = `@keyframes framecn-nw-count {
  0% { --nw-progress: 0; }
  100% { --nw-progress: 1; }
}`;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
  };

  const maxVal = Math.max(start, end);

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-nw-digit {
            0% { transform: translateY(0); }
            100% { transform: translateY(${-(end - start) * (fontSize * 1.1)}px); }
          }
        `}</style>
        <NumberWheelAnimated
          start={start}
          end={end}
          maxVal={maxVal}
          fontSize={fontSize}
          color={color}
          durationMs={durationMs}
          countAnimMs={countAnimMs}
        />
      </>
    </Timegroup>
  );
}

function NumberWheelAnimated({
  start,
  end,
  maxVal,
  fontSize,
  color,
  durationMs,
  countAnimMs,
}: {
  start: number;
  end: number;
  maxVal: number;
  fontSize: number;
  color: string;
  durationMs: number;
  countAnimMs: number;
}) {
  const cellHeight = fontSize * 1.1;
  const template = maxVal.toLocaleString("en-US");

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
      if (ch !== ",") {
        const keyframeLines: string[] = [];
        for (const step of progressSteps) {
          const wheel = computeWheel(step.current, place, springEase);
          const wheelValue = Math.max(0, Math.min(9.99, wheel));
          keyframeLines.push(
            `  ${step.pct.toFixed(2)}% { transform: translateY(${-wheelValue * cellHeight}px); }`
          );
        }
        anims.push(
          `@keyframes framecn-nw-place-${place} {\n${keyframeLines.join("\n")}\n}`
        );
        place++;
      }
    }
    return anims.join("\n\n");
  }, [template, progressSteps, cellHeight]);

  const opacityAnimations = useMemo(() => {
    const anims: string[] = [];
    let place = 0;
    for (let i = template.length - 1; i >= 0; i--) {
      const ch = template[i];
      if (ch !== ",") {
        const keyframeLines: string[] = [];
        for (const step of progressSteps) {
          const opacity = placeOpacity(step.current, place);
          keyframeLines.push(
            `  ${step.pct.toFixed(2)}% { opacity: ${opacity}; }`
          );
        }
        anims.push(
          `@keyframes framecn-nw-opacity-${place} {\n${keyframeLines.join("\n")}\n}`
        );
        place++;
      }
    }
    return anims.join("\n\n");
  }, [template, progressSteps]);

  const cells: React.ReactNode[] = [];
  let place = 0;
  for (let i = template.length - 1; i >= 0; i--) {
    const ch = template[i];
    if (ch === ",") {
      const opacityKeyframes = progressSteps
        .map((s) => {
          const op = placeOpacity(s.current, place);
          return `  ${s.pct.toFixed(2)}% { opacity: ${op}; }`;
        })
        .join("\n");
      cells.unshift(
        <span
          key={`c${i}`}
          style={{
            animation: `framecn-nw-comma-${i} ${durationMs}ms linear forwards`,
            color: "currentColor",
            display: "inline-block",
            fontSize: "0.85em",
            textAlign: "center",
            width: "0.32em",
          }}
        >
          ,
        </span>
      );
    } else {
      cells.unshift(
        <span
          key={`d${i}`}
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
              animation: `framecn-nw-place-${place} ${durationMs}ms linear forwards`,
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

  return (
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
        {cells}
      </div>
    </>
  );
}
