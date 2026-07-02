"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";
import { GodRays } from "@paper-design/shaders-react";
import type { GodRaysProps } from "@paper-design/shaders-react";
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

const NEUTRAL_COLORS = ["#5a5a7e", "#8a8a95", "#ffffff", "#3a3a5c"];
export type ShaderGodRaysProps = Omit<GodRaysProps, "frame" | "ref">;

export interface ShaderGodRaysWithLayout extends ShaderGodRaysProps {
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

const ShaderGodRaysScene = ({
  speed = 1,
  colorBack = "#12121a",
  colorBloom = "#3a3a5c",
  colors = NEUTRAL_COLORS,
  intensity = 0.8,
  density = 0.3,
  bloom = 0.4,
  className,
  width = 1280,
  height = 720,
  ...rest
}: ShaderGodRaysProps & { width?: number; height?: number }) => {
  const frame = useShaderFrame(speed);

  return (
    <ShaderCanvas className={className}>
      <GodRays
        speed={0}
        frame={frame}
        colorBack={colorBack}
        colorBloom={colorBloom}
        colors={colors}
        intensity={intensity}
        density={density}
        bloom={bloom}
        fit="cover"
        width={width}
        height={height}
        {...rest}
      />
    </ShaderCanvas>
  );
};

export const ShaderGodRays = ({
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
  ...rest
}: ShaderGodRaysWithLayout) => (
  <ShaderLayout
    className={className}
    durationInFrames={durationInFrames}
    fps={fps}
    height={height}
    width={width}
  >
    <ShaderGodRaysScene
      className={className}
      height={height}
      speed={speed}
      width={width}
      {...rest}
    />
  </ShaderLayout>
);
