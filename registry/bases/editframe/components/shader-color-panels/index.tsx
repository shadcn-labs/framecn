"use client";

import { Timegroup, useTimingInfo } from "@editframe/react";
import { ColorPanels } from "@paper-design/shaders-react";
import type { ColorPanelsProps } from "@paper-design/shaders-react";
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

const NEUTRAL_COLORS = ["#3a3a52", "#4a4a68", "#52527a", "#5a5a8a"];
export type ShaderColorPanelsProps = Omit<ColorPanelsProps, "frame" | "ref">;

export interface ShaderColorPanelsWithLayout extends ShaderColorPanelsProps {
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}

const ShaderColorPanelsScene = ({
  speed = 1,
  colors = NEUTRAL_COLORS,
  colorBack = "#12121a",
  density = 3,
  length = 1.1,
  className,
  width = 1280,
  height = 720,
  ...rest
}: ShaderColorPanelsProps & { width?: number; height?: number }) => {
  const frame = useShaderFrame(speed);

  return (
    <ShaderCanvas className={className}>
      <ColorPanels
        speed={0}
        frame={frame}
        colors={colors}
        colorBack={colorBack}
        density={density}
        length={length}
        fit="cover"
        width={width}
        height={height}
        {...rest}
      />
    </ShaderCanvas>
  );
};

export const ShaderColorPanels = ({
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  width = 1280,
  height = 720,
  className,
  ...rest
}: ShaderColorPanelsWithLayout) => (
  <ShaderLayout
    className={className}
    durationInFrames={durationInFrames}
    fps={fps}
    height={height}
    width={width}
  >
    <ShaderColorPanelsScene
      className={className}
      height={height}
      speed={speed}
      width={width}
      {...rest}
    />
  </ShaderLayout>
);
