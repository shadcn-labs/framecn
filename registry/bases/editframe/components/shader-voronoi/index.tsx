"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";
import { Voronoi } from "@paper-design/shaders-react";
import type { VoronoiProps } from "@paper-design/shaders-react";
import { createContext, useCallback, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const ShaderTimingContext = createContext(0);

interface ShaderLayoutProps {
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
  children: ReactNode;
}

const ShaderLayout = ({
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
  children,
}: ShaderLayoutProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const durationMs = (durationInFrames / fps) * 1000;
  const containerStyle: CSSProperties = {
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      ref={ref}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <ShaderTimingContext.Provider value={ownCurrentTimeMs}>
        {children}
      </ShaderTimingContext.Provider>
    </Timegroup>
  );
};

const useShaderFrame = (speed = 1) => {
  const ownCurrentTimeMs = useContext(ShaderTimingContext);
  return ownCurrentTimeMs * speed;
};

const ShaderCanvas = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const [ready, setReady] = useState(false);
  const gate = useCallback((element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
  }, []);

  return (
    <div
      ref={gate}
      className={className}
      style={{ inset: 0, position: "absolute" }}
    >
      {ready ? children : null}
    </div>
  );
};

const NEUTRAL_COLORS = ["#3a3a5c", "#52527a"];
export type ShaderVoronoiProps = Omit<VoronoiProps, "frame" | "ref">;

export interface ShaderVoronoiWithLayout extends ShaderVoronoiProps {
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

const ShaderVoronoiScene = ({
  speed = 1,
  colors = NEUTRAL_COLORS,
  colorGap = "#12121a",
  distortion = 0.4,
  gap = 0.04,
  glow = 0,
  className,
  width = 1280,
  height = 720,
  ...rest
}: ShaderVoronoiProps & { width?: number; height?: number }) => {
  const frame = useShaderFrame(speed);

  return (
    <ShaderCanvas className={className}>
      <Voronoi
        speed={0}
        frame={frame}
        colors={colors}
        colorGap={colorGap}
        distortion={distortion}
        gap={gap}
        glow={glow}
        fit="cover"
        width={width}
        height={height}
        {...rest}
      />
    </ShaderCanvas>
  );
};

export const ShaderVoronoi = ({
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
  ...rest
}: ShaderVoronoiWithLayout) => (
  <ShaderLayout
    className={className}
    durationInFrames={durationInFrames}
    fps={fps}
    height={height}
    width={width}
  >
    <ShaderVoronoiScene
      className={className}
      height={height}
      speed={speed}
      width={width}
      {...rest}
    />
  </ShaderLayout>
);
