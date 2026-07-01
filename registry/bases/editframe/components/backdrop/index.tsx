"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties, ReactNode } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export type BackdropFill =
  | { type: "color"; value: string }
  | { type: "gradient"; value: string }
  | { type: "image"; src: string; fit?: "cover" | "contain" };

const getFillStyle = (fill: BackdropFill): CSSProperties => {
  if (fill.type === "color") {
    return { background: fill.value };
  }
  if (fill.type === "gradient") {
    return { background: fill.value };
  }
  return {
    backgroundImage: `url(${fill.src})`,
    backgroundPosition: "center",
    backgroundSize: fill.fit ?? "cover",
  };
};

const DefaultContent = () => (
  <span
    style={{
      color: "white",
      fontFamily: FONT_FAMILY,
      fontSize: 72,
      fontWeight: 700,
      letterSpacing: "-0.03em",
    }}
  >
    Backdrop
  </span>
);

export interface BackdropProps {
  fill?: BackdropFill;
  padding?: number;
  radius?: number;
  shadow?: string;
  background?: string;
  width?: number;
  height?: number;
  children?: ReactNode;
  className?: string;
  fps?: number;
  durationInFrames?: number;
  speed?: number;
}

export const Backdrop = ({
  fill,
  padding = 10,
  radius = 4,
  shadow,
  background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  children,
  className,
  fps = 30,
  durationInFrames = 90,
}: BackdropProps) => {
  const durationMs = (durationInFrames / fps) * 1000;

  const fillStyle = fill ? getFillStyle(fill) : { background };
  const backdropStyle = {
    ...fillStyle,
    ...(shadow ? { boxShadow: shadow } : {}),
    alignItems: "center",
    borderRadius: radius ? `${radius}%` : 0,
    display: "flex",
    inset: padding ? `${padding}%` : 0,
    justifyContent: "center",
    overflow: "hidden",
    position: "absolute",
  } as CSSProperties;

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background: "#f5f5f5",
          inset: 0,
          position: "absolute",
        } as CSSProperties
      }
    >
      <div style={backdropStyle}>{children ?? <DefaultContent />}</div>
    </Timegroup>
  );
};
