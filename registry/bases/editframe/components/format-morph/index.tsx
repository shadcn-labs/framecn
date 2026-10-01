"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

/**
 * Easing blueprint for an on-screen morph. The media never enters or exits —
 * it is already on screen and changing shape — so every curve here is from the
 * ease-in-out family, sorted weak to strong. Ease-out would make the shape leave
 * instantly and coast, which reads as a UI transition rather than as mass.
 *
 * `quint` is the default: it sits still longer at both ends and crosses the
 * middle hard, which is the punctuation a launch film wants. `quart` is the
 * calmer, more neutral choice.
 */
export const MORPH_EASINGS = {
  circ: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
  cubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  expo: "cubic-bezier(1, 0, 0, 1)",
  linear: "linear",
  quad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  quart: "cubic-bezier(0.77, 0, 0.175, 1)",
  quint: "cubic-bezier(0.86, 0, 0.07, 1)",
} as const;

export type MorphEasingName = keyof typeof MORPH_EASINGS;

/** Accepts a preset name, or any raw CSS easing (`cubic-bezier(...)`, `steps(...)`, `ease-out`). */
const resolveEasing = (easing: string): string =>
  easing in MORPH_EASINGS
    ? MORPH_EASINGS[easing as MorphEasingName]
    : easing || MORPH_EASINGS.quint;

export interface FormatMorphStage {
  /** Aspect ratio as `w:h`, e.g. `"16:9"`. */
  ratio: string;
  /** Tilt in degrees. Small values keep the morph alive without reading as skew. */
  rotate?: number;
  /** Overrides the font size derived from this stage's height. */
  fontSize?: number;
}

export interface FormatMorphProps {
  src?: string;
  gradient?: string;
  lead?: string;
  trail?: string;
  stages?: FormatMorphStage[];
  maxWidth?: number;
  maxHeight?: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  background?: string;
  radiusRatio?: number;
  holdRatio?: number;
  /** A `MORPH_EASINGS` preset name, or any raw CSS easing value. */
  easing?: string;
  lagMs?: number;
  gap?: number;
  shadow?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_STAGES: FormatMorphStage[] = [
  { ratio: "9:16", rotate: 4 },
  { ratio: "16:9", rotate: -3 },
  { ratio: "1:1", rotate: 0 },
];

const DEFAULT_SRC =
  "https://raw.githubusercontent.com/shadcn-labs/framecn/main/.github/assets/gh.png";

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, #ff6b6b 0%, #845ec2 48%, #4d8dff 100%)";

interface ResolvedStage {
  fontSize: number;
  height: number;
  radius: number;
  rotate: number;
  width: number;
}

const parseRatio = (ratio: string): number => {
  const [w, h] = ratio.split(":").map(Number);

  if (!(Number.isFinite(w) && Number.isFinite(h)) || w <= 0 || h <= 0) {
    return 1;
  }

  return w / h;
};

/** Largest box with `ratio` that fits inside the bounds. */
const fitBox = (ratio: number, maxWidth: number, maxHeight: number) => {
  let width = maxWidth;
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return { height: Math.round(height), width: Math.round(width) };
};

const resolveStage = (
  stage: FormatMorphStage,
  maxWidth: number,
  maxHeight: number,
  baseFontSize: number,
  radiusRatio: number
): ResolvedStage => {
  const { height, width } = fitBox(
    parseRatio(stage.ratio),
    maxWidth,
    maxHeight
  );
  /** Type tracks the media's height so the lockup stays proportionate. */
  const scale = 0.6 + 0.4 * (height / maxHeight);

  return {
    fontSize: Math.round(stage.fontSize ?? baseFontSize * scale),
    height,
    radius: Math.round(Math.min(width, height) * radiusRatio),
    rotate: stage.rotate ?? 0,
    width,
  };
};

const toPercent = (value: number): string =>
  Number(value.toFixed(4)).toString();

/** Stable per-instance suffix so two morphs on one page never share keyframes. */
const stageKey = (
  stages: ResolvedStage[],
  holdRatio: number,
  easing: string
): string =>
  `${stages.map((s) => `${s.width}x${s.height}r${s.radius}`).join("-")}-h${Math.round(holdRatio * 100)}-e${easing.replaceAll(/\W/g, "")}`;

/**
 * Builds hold-then-morph keyframes. Each stage owns an equal slot: it sits
 * still for `holdRatio` of that slot, then eases into the next stage. The last
 * stage returns to the first so the cycle loops seamlessly.
 */
const buildKeyframes = (
  name: string,
  stages: ResolvedStage[],
  holdRatio: number,
  easing: string,
  declare: (stage: ResolvedStage) => string
): string => {
  const slot = 100 / stages.length;
  const steps: string[] = [];

  for (const [index, stage] of stages.entries()) {
    const start = index * slot;
    const holdEnd = start + slot * holdRatio;

    steps.push(
      `${toPercent(start)}% { ${declare(stage)} animation-timing-function: linear; }`,
      `${toPercent(holdEnd)}% { ${declare(stage)} animation-timing-function: ${easing}; }`
    );
  }

  const [initial] = stages;

  steps.push(`100% { ${declare(initial)} }`);

  return `@keyframes ${name} {\n  ${steps.join("\n  ")}\n}`;
};

const mediaDeclaration = (stage: ResolvedStage): string =>
  `width: ${stage.width}px; height: ${stage.height}px; border-radius: ${stage.radius}px; transform: rotate(${stage.rotate}deg);`;

const typeDeclaration = (stage: ResolvedStage): string =>
  `font-size: ${stage.fontSize}px;`;

/** Resolves every layout-affecting prop into concrete per-stage geometry. */
const resolvePlan = ({
  stages = DEFAULT_STAGES,
  maxWidth = 460,
  maxHeight = 440,
  fontSize = 128,
  radiusRatio = 0.08,
  holdRatio = 0.45,
}: FormatMorphProps) => ({
  holdRatio: Math.min(0.95, Math.max(0, holdRatio)),
  resolved: (stages.length > 0 ? stages : DEFAULT_STAGES).map((stage) =>
    resolveStage(stage, maxWidth, maxHeight, fontSize, radiusRatio)
  ),
});

export const FormatMorph = (props: FormatMorphProps) => {
  const {
    src = DEFAULT_SRC,
    gradient = DEFAULT_GRADIENT,
    lead = "FRA",
    trail = "MECN",
    fontWeight = 500,
    color = "#ffffff",
    background = "#4e4e50",
    easing = "quint",
    lagMs = 40,
    gap = 20,
    shadow = "0 40px 100px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06)",
    speed = 1,
    fps = 30,
    durationInFrames = 180,
    width = 1280,
    height = 720,
    className,
  } = props;

  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const cycleMs = durationMs / safeSpeed;

  const { holdRatio: safeHold, resolved } = resolvePlan(props);
  const morphEasing = resolveEasing(easing);
  const [first] = resolved;

  const uid = stageKey(resolved, safeHold, morphEasing);
  const mediaName = `framecn-format-morph-media-${uid}`;
  const typeName = `framecn-format-morph-type-${uid}`;

  const containerStyle: CSSProperties = {
    background,
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  const textStyle: CSSProperties = {
    animation: `${typeName} ${cycleMs}ms linear ${lagMs}ms infinite both`,
    color,
    fontSize: first.fontSize,
    fontWeight,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    minWidth: 0,
    whiteSpace: "nowrap",
  };

  const mediaStyle: CSSProperties = {
    animation: `${mediaName} ${cycleMs}ms linear infinite both`,
    background: gradient,
    borderRadius: first.radius,
    boxShadow: shadow,
    flexShrink: 0,
    height: first.height,
    overflow: "hidden",
    transform: `rotate(${first.rotate}deg)`,
    width: first.width,
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
${buildKeyframes(mediaName, resolved, safeHold, morphEasing, mediaDeclaration)}
${buildKeyframes(typeName, resolved, safeHold, morphEasing, typeDeclaration)}
        `}</style>

        {/* The Timegroup host does not lay its children out as a flex
            container, so an inset-0 stage owns the centering. */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          {/* 1fr auto 1fr — the media column sizes itself, so resizing it
              physically displaces the type on either side. */}
          <div
            style={{
              alignItems: "center",
              columnGap: gap,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              padding: "0 32px",
              width: "100%",
            }}
          >
            <span style={{ ...textStyle, textAlign: "right" }}>{lead}</span>
            <div style={mediaStyle}>
              {src ? (
                // `crossOrigin` is required: a CSS background cannot carry a
                // CORS request, so remote art has to be a real <img> here.
                // eslint-disable-next-line next/no-img-element
                <img
                  alt=""
                  crossOrigin="anonymous"
                  src={src}
                  style={{
                    display: "block",
                    height: "100%",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              ) : null}
            </div>
            <span style={{ ...textStyle, textAlign: "left" }}>{trail}</span>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
