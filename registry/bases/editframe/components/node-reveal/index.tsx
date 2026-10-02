"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

/**
 * The node enters from nothing rather than morphing in place, so these are all
 * ease-out curves, sorted weak to strong. `expo` is the default: it leaves at
 * full velocity and spends the rest of its time settling, which is the gesture
 * a launch title card wants.
 */
export const REVEAL_EASINGS = {
  circ: "cubic-bezier(0.075, 0.82, 0.165, 1)",
  cubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  expo: "cubic-bezier(0.19, 1, 0.22, 1)",
  linear: "linear",
  quad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  quart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  quint: "cubic-bezier(0.23, 1, 0.32, 1)",
} as const;

export type RevealEasingName = keyof typeof REVEAL_EASINGS;

const resolveEasing = (easing: string): string =>
  easing in REVEAL_EASINGS
    ? REVEAL_EASINGS[easing as RevealEasingName]
    : easing || REVEAL_EASINGS.expo;

const DEFAULT_SRC =
  "https://raw.githubusercontent.com/shadcn-labs/framecn/main/.github/assets/gh.png";

/** Opening at exactly 0 pops on the first frame; a couple of pixels does not. */
const FROM_SIZE = 2;

export interface NodeRevealProps {
  src?: string;
  lead?: string;
  trail?: string;
  size?: number;
  ratio?: string;
  fit?: "cover" | "contain" | "fill";
  nodeBackground?: string;
  radius?: number;
  handles?: boolean;
  handleSize?: number;
  handleColor?: string;
  /** Fraction of the cycle the lockup holds before the node opens. */
  openAt?: number;
  /** Fraction of the cycle at which the node has fully landed. */
  landAt?: number;
  gapFrom?: number;
  gapTo?: number;
  /** A `REVEAL_EASINGS` preset name, or any raw CSS easing value. */
  easing?: string;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  background?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

const parseRatio = (ratio: string): number => {
  const [w, h] = ratio.split(":").map(Number);

  if (!(Number.isFinite(w) && Number.isFinite(h)) || w <= 0 || h <= 0) {
    return 1;
  }

  return w / h;
};

/** Largest box with `ratio` that fits inside a `size` square. */
const fitBox = (ratio: number, size: number) => {
  const width = ratio >= 1 ? size : size * ratio;
  const height = ratio >= 1 ? size / ratio : size;

  return { height: Math.round(height), width: Math.round(width) };
};

const toPercent = (value: number): string =>
  Number((value * 100).toFixed(4)).toString();

/**
 * Hold, ease, rest. The easing is declared on the stop that *begins* the
 * opening segment, so a single animation can sit still and then move.
 */
const buildPhase = (
  name: string,
  from: string,
  to: string,
  openAt: number,
  landAt: number,
  easing: string
): string => `@keyframes ${name} {
  0% { ${from} animation-timing-function: linear; }
  ${toPercent(openAt)}% { ${from} animation-timing-function: ${easing}; }
  ${toPercent(landAt)}% { ${to} animation-timing-function: linear; }
  100% { ${to} }
}`;

const buildHandles = (
  name: string,
  openAt: number,
  landAt: number
): string => `@keyframes ${name} {
  0% { opacity: 0; animation-timing-function: linear; }
  ${toPercent(openAt + (landAt - openAt) * 0.7)}% { opacity: 0; animation-timing-function: ease-out; }
  ${toPercent(landAt)}% { opacity: 1; }
  100% { opacity: 1; }
}`;

const HANDLE_CORNERS = [
  { left: 0, top: 0 },
  { right: 0, top: 0 },
  { bottom: 0, left: 0 },
  { bottom: 0, right: 0 },
] as const;

/** Resolves geometry and phase props, which keeps the component body flat. */
const resolvePlan = ({
  size = 440,
  ratio = "1:1",
  openAt = 0.12,
  landAt = 0.55,
}: NodeRevealProps) => {
  const box = fitBox(parseRatio(ratio), size);
  const safeOpen = Math.min(0.9, Math.max(0, openAt));

  return {
    box,
    landAt: Math.min(1, Math.max(safeOpen + 0.05, landAt)),
    openAt: safeOpen,
  };
};

/** Node presentation defaults, kept out of the component body. */
const resolveNode = ({
  fit = "cover",
  nodeBackground = "#000000",
  radius = 0,
  handles = true,
  handleSize = 10,
  handleColor = "#ffffff",
}: NodeRevealProps) => ({
  fit,
  handleColor,
  handleSize,
  handles,
  nodeBackground,
  radius,
});

export const NodeReveal = (props: NodeRevealProps) => {
  const {
    src = DEFAULT_SRC,
    lead = "SHADCN",
    trail = "LABS",
    gapFrom = 6,
    gapTo = 56,
    easing = "expo",
    fontSize = 56,
    fontWeight = 500,
    color = "#ffffff",
    background = "#4e4e50",
    speed = 1,
    fps = 30,
    durationInFrames = 120,
    width = 1280,
    height = 720,
    className,
  } = props;

  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const cycleMs = durationMs / safeSpeed;

  const { box, landAt, openAt } = resolvePlan(props);
  const { fit, handleColor, handleSize, handles, nodeBackground, radius } =
    resolveNode(props);
  const revealEasing = resolveEasing(easing);

  const uid = `${box.width}x${box.height}-${Math.round(openAt * 100)}-${Math.round(landAt * 100)}-${gapTo}`;
  const nodeName = `framecn-node-reveal-box-${uid}`;
  const gapName = `framecn-node-reveal-gap-${uid}`;
  const handleName = `framecn-node-reveal-handles-${uid}`;

  const containerStyle: CSSProperties = {
    background,
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  const textStyle: CSSProperties = {
    color,
    fontSize,
    fontWeight,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    minWidth: 0,
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
${buildPhase(nodeName, `width: ${FROM_SIZE}px; height: ${FROM_SIZE}px;`, `width: ${box.width}px; height: ${box.height}px;`, openAt, landAt, revealEasing)}
${buildPhase(gapName, `column-gap: ${gapFrom}px;`, `column-gap: ${gapTo}px;`, openAt, landAt, revealEasing)}
${buildHandles(handleName, openAt, landAt)}
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
          {/* 1fr auto 1fr — the node sizes the middle column, so growing it
              is what drives the two words apart. Nothing animates the text. */}
          <div
            style={{
              alignItems: "center",
              animation: `${gapName} ${cycleMs}ms linear both`,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              padding: "0 32px",
              width: "100%",
            }}
          >
            <span style={{ ...textStyle, textAlign: "right" }}>{lead}</span>

            <div
              style={{
                animation: `${nodeName} ${cycleMs}ms linear both`,
                flexShrink: 0,
                height: FROM_SIZE,
                position: "relative",
                width: FROM_SIZE,
              }}
            >
              {/* Clipped artwork. The handles live outside it so they are
                  never cropped by the growing frame. */}
              <div
                style={{
                  background: nodeBackground,
                  borderRadius: radius,
                  inset: 0,
                  overflow: "hidden",
                  position: "absolute",
                }}
              >
                {src ? (
                  // A CSS background cannot carry a CORS request, so remote
                  // art has to be a real <img> here.
                  // eslint-disable-next-line next/no-img-element
                  <img
                    alt=""
                    crossOrigin="anonymous"
                    src={src}
                    style={{
                      display: "block",
                      height: "100%",
                      objectFit: fit,
                      width: "100%",
                    }}
                  />
                ) : null}
              </div>

              {/* Constant-size corner marks — real selection handles do not
                  scale with their selection. */}
              {handles
                ? HANDLE_CORNERS.map((corner) => (
                    <div
                      key={Object.keys(corner).join("-")}
                      style={{
                        ...corner,
                        animation: `${handleName} ${cycleMs}ms linear both`,
                        background: handleColor,
                        height: handleSize,
                        margin: -handleSize / 2,
                        position: "absolute",
                        width: handleSize,
                      }}
                    />
                  ))
                : null}
            </div>

            <span style={{ ...textStyle, textAlign: "left" }}>{trail}</span>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
