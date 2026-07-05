"use client";

import { Timegroup } from "@editframe/react";
import { useTimingInfo } from "@editframe/react";
import { createContext, useContext, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

export const DEFAULT_FPS = 30;

interface FrameContextValue {
  frame: number;
  fps: number;
}

const FrameContext = createContext<FrameContextValue>({
  fps: DEFAULT_FPS,
  frame: 0,
});

export const useCurrentFrame = (): number => useContext(FrameContext).frame;

export const useVideoConfig = (): { fps: number } => {
  const { fps } = useContext(FrameContext);
  return { fps };
};

export interface FrameProviderProps {
  children: ReactNode;
  durationMs: number;
  fps?: number;
  className?: string;
  style?: CSSProperties;
}

export const FrameProvider = ({
  children,
  durationMs,
  fps = DEFAULT_FPS,
  className,
  style,
}: FrameProviderProps) => {
  const { ref, ownCurrentTimeMs } = useTimingInfo();
  const frame = Math.round((ownCurrentTimeMs / 1000) * fps);
  const value = useMemo(() => ({ fps, frame }), [frame, fps]);

  return (
    <Timegroup
      ref={ref}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={{
        height: "100%",
        inset: 0,
        position: "absolute",
        width: "100%",
        ...style,
      }}
    >
      <FrameContext.Provider value={value}>{children}</FrameContext.Provider>
    </Timegroup>
  );
};
