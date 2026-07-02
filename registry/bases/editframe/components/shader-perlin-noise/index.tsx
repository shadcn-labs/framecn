"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";
import { PerlinNoise } from "@paper-design/shaders-react";
import type { PerlinNoiseProps } from "@paper-design/shaders-react";
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

export type ShaderPerlinNoiseProps = Omit<PerlinNoiseProps, "frame" | "ref">;

export interface ShaderPerlinNoiseWithLayout extends ShaderPerlinNoiseProps {
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

const ShaderPerlinNoiseScene = ({
  speed = 1,
  colorBack = "#12121a",
  colorFront = "#6a6a85",
  proportion = 0.35,
  softness = 0.1,
  className,
  width = 1280,
  height = 720,
  ...rest
}: ShaderPerlinNoiseProps & { width?: number; height?: number }) => {
  const frame = useShaderFrame(speed);

  return (
    <ShaderCanvas className={className}>
      <PerlinNoise
        speed={0}
        frame={frame}
        colorBack={colorBack}
        colorFront={colorFront}
        proportion={proportion}
        softness={softness}
        fit="cover"
        width={width}
        height={height}
        {...rest}
      />
    </ShaderCanvas>
  );
};

export const ShaderPerlinNoise = ({
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
  ...rest
}: ShaderPerlinNoiseWithLayout) => (
  <ShaderLayout
    className={className}
    durationInFrames={durationInFrames}
    fps={fps}
    height={height}
    width={width}
  >
    <ShaderPerlinNoiseScene
      className={className}
      height={height}
      speed={speed}
      width={width}
      {...rest}
    />
  </ShaderLayout>
);
