"use client";

import {
  Controls,
  FitScale,
  Preview,
  Scrubber,
  TimeDisplay,
  Timegroup,
  ToggleLoop,
  TogglePlay,
} from "@editframe/react";
import { PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";
import { FPS, H, W } from "@/lib/customizer-config";
import type { BackdropFill } from "@/lib/customizer-config";
import { FrameProvider } from "@/registry/bases/editframe/lib/frame";

type RegistryComponent = React.ComponentType<Record<string, unknown>>;

const backdropStyle = (fill: BackdropFill): React.CSSProperties => {
  if (fill.type === "image") {
    return {
      backgroundImage: `url(${fill.src})`,
      backgroundPosition: "center",
      backgroundSize: fill.fit ?? "cover",
    };
  }
  return { background: fill.value };
};

const withBackdrop = (
  Component: RegistryComponent,
  fill: BackdropFill
): RegistryComponent => {
  const Wrapped = (props: Record<string, unknown>) => (
    <div
      style={{
        ...backdropStyle(fill),
        inset: 0,
        position: "absolute",
      }}
    >
      <Component {...props} />
    </div>
  );
  return Wrapped;
};

export const PreviewControls = ({ previewId }: { previewId: string }) => {
  const controlsRef = useRef<React.ComponentRef<typeof Controls>>(null);
  const [isLooping, setIsLooping] = useState(false);

  const readLoopFromControls = useCallback(() => {
    const el = controlsRef.current;
    setIsLooping(Boolean(el?.loop));
  }, []);

  /** Runs after EFControls / Lit propagate `loop` (slot click ordering vs React). */
  const reconcileLoopFromControls = useCallback(() => {
    window.setTimeout(() => {
      readLoopFromControls();
    }, 0);
  }, [readLoopFromControls]);

  useEffect(() => {
    let cancelled = false;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!cancelled) {
          readLoopFromControls();
        }
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [previewId, readLoopFromControls]);

  return (
    <Controls
      ref={controlsRef}
      target={previewId}
      className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground"
    >
      <TogglePlay className="inline-flex">
        <Button
          type="button"
          slot="play"
          variant="ghost"
          size="icon-sm"
          aria-label="Play preview"
          title="Play preview"
        >
          <PlayIcon />
        </Button>
        <Button
          type="button"
          slot="pause"
          variant="ghost"
          size="icon-sm"
          aria-label="Pause preview"
          title="Pause preview"
        >
          <PauseIcon />
        </Button>
      </TogglePlay>

      <Scrubber className="min-w-0 flex-1 [--ef-scrubber-background:var(--border)] [--ef-scrubber-progress-color:var(--foreground)]" />

      <TimeDisplay className="min-w-22 justify-end font-mono text-xs tabular-nums text-foreground" />

      <ToggleLoop className="inline-flex">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isLooping ? "Disable loop" : "Enable loop"}
          aria-pressed={isLooping}
          title={isLooping ? "Loop is on" : "Loop is off"}
          onClick={reconcileLoopFromControls}
        >
          {isLooping ? <Repeat1Icon /> : <RepeatIcon />}
        </Button>
      </ToggleLoop>
    </Controls>
  );
};

const VideoPreviewClient = ({
  previewId,
  Component,
  componentProps,
  durationInFrames = 90,
  fps = FPS,
  previewBackdrop,
  compact = false,
  autoPlay = false,
}: {
  previewId: string;
  Component: RegistryComponent;
  componentProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  previewBackdrop?: BackdropFill;
  compact?: boolean;
  autoPlay?: boolean;
}) => {
  const Scene = useMemo(
    () =>
      previewBackdrop ? withBackdrop(Component, previewBackdrop) : Component,
    [Component, previewBackdrop]
  );
  const rootRef = useRef<React.ComponentRef<typeof Timegroup>>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    let cancelled = false;
    const sync = async () => {
      await root.updateComplete;
      if (cancelled || !root.isConnected) {
        return;
      }
      root.loop = autoPlay;
      root.currentTimeMs = (durationInFrames / fps) * 500;
      if (autoPlay && motionAllowed) {
        root.play();
      } else {
        root.pause();
      }
    };
    void sync();
    return () => {
      cancelled = true;
      if (root.isConnected) {
        root.pause();
      }
    };
  }, [autoPlay, durationInFrames, fps, motionAllowed]);

  return compact ? (
    <div className="overflow-hidden">
      <Preview id={previewId} className="aspect-video">
        <FitScale>
          <Timegroup
            ref={rootRef}
            duration={`${(durationInFrames / fps) * 1000}ms`}
            mode="fixed"
            style={{
              height: H,
              overflow: "hidden",
              position: "relative",
              width: W,
            }}
          >
            <FrameProvider
              durationMs={(durationInFrames / fps) * 1000}
              fps={fps}
            >
              <Scene {...componentProps} />
            </FrameProvider>
          </Timegroup>
        </FitScale>
      </Preview>
    </div>
  ) : (
    // Card look: only the video sits on white; the player controls live on the muted shell.
    <Frame>
      <FrameContent className="overflow-hidden">
        <Preview id={previewId} className="aspect-video">
          <FitScale>
            <Timegroup
              ref={rootRef}
              duration={`${(durationInFrames / fps) * 1000}ms`}
              mode="fixed"
              style={{
                height: H,
                overflow: "hidden",
                position: "relative",
                width: W,
              }}
            >
              <FrameProvider
                durationMs={(durationInFrames / fps) * 1000}
                fps={fps}
              >
                <Scene {...componentProps} />
              </FrameProvider>
            </Timegroup>
          </FitScale>
        </Preview>
      </FrameContent>
      <PreviewControls previewId={previewId} />
    </Frame>
  );
};

// Editframe GUI elements upgrade their DOM before React hydration; mount the
// player client-side so shared query-state icons and browser-only timing agree.
export const VideoPreview = dynamic(() => Promise.resolve(VideoPreviewClient), {
  loading: () => (
    <Frame aria-label="Loading video preview">
      <FrameContent className="bg-muted aspect-video" />
      <div className="h-11" />
    </Frame>
  ),
  ssr: false,
});
