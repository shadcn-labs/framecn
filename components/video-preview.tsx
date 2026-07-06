"use client";

import {
  Controls,
  FitScale,
  Preview,
  Scrubber,
  TimeDisplay,
  ToggleLoop,
  TogglePlay,
} from "@editframe/react";
import { PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FPS, H, W } from "@/lib/customizer-config";
import { FrameProvider } from "@/lib/framecn-ui";
import { DEFAULT_UI_PREVIEW_DURATION_FRAMES } from "@/lib/ui-preview-durations";
import type { BackdropFill } from "@/registry/bases/editframe/components/backdrop";

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

export const VideoPreview = ({
  previewId,
  Component,
  componentProps,
  durationInFrames = DEFAULT_UI_PREVIEW_DURATION_FRAMES,
  fps = FPS,
  previewBackdrop,
}: {
  previewId: string;
  Component: RegistryComponent;
  componentProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  previewBackdrop?: BackdropFill;
}) => {
  const Scene = previewBackdrop
    ? withBackdrop(Component, previewBackdrop)
    : Component;

  return (
    <div className="overflow-hidden rounded-lg bg-code px-1 pt-1">
      <Preview id={previewId} className="aspect-video">
        <FitScale className="rounded-md">
          <FrameProvider
            durationMs={(durationInFrames / fps) * 1000}
            fps={fps}
            style={{ height: H, width: W }}
          >
            <Scene {...componentProps} />
          </FrameProvider>
        </FitScale>
      </Preview>
      <PreviewControls previewId={previewId} />
    </div>
  );
};
