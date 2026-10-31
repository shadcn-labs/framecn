"use client";

import {
  Controls,
  FitScale,
  Preview,
  Scrubber,
  TimeDisplay,
  Timegroup,
  TimelineRoot,
  ToggleLoop,
  TogglePlay,
} from "@editframe/react";
import { PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { Button } from "@/components/ui/button";
import { Frame, FrameContent } from "@/components/ui/frame";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
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

interface PreviewTimelineProps {
  id: string;
  Component: RegistryComponent;
  componentProps: Record<string, unknown>;
  durationInFrames: number;
  fps: number;
  height: number;
  width: number;
  previewBackdrop?: BackdropFill;
  onRoot: React.RefCallback<React.ComponentRef<typeof Timegroup>>;
}

const PreviewTimeline = ({
  id,
  Component,
  componentProps,
  durationInFrames,
  fps,
  height,
  width,
  previewBackdrop,
  onRoot,
}: PreviewTimelineProps) => (
  <Timegroup
    id={id}
    ref={onRoot}
    duration={`${durationInFrames / fps}s`}
    fps={fps}
    mode="fixed"
    style={{
      height,
      overflow: "hidden",
      position: "relative",
      width,
    }}
  >
    <FrameProvider durationMs={(durationInFrames / fps) * 1000} fps={fps}>
      {previewBackdrop ? (
        <div
          style={{
            ...backdropStyle(previewBackdrop),
            inset: 0,
            position: "absolute",
          }}
        >
          <Component {...componentProps} />
        </div>
      ) : (
        <Component {...componentProps} />
      )}
    </FrameProvider>
  </Timegroup>
);

// TimelineRoot only forwards an id, including when it mounts render clones.
const createPreviewTimeline = (props: Omit<PreviewTimelineProps, "id">) =>
  function BoundPreviewTimeline({ id }: { id: string }) {
    return <PreviewTimeline {...props} id={id} />;
  };

const getServerLoopSnapshot = () => false;

export const PreviewControls = ({ previewId }: { previewId: string }) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const preview = document.querySelector(`#${previewId}`) ?? document.body;
      const observer = new MutationObserver(onChange);
      observer.observe(preview, {
        attributeFilter: ["loop"],
        attributes: true,
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    },
    [previewId]
  );
  const getLoopSnapshot = useCallback(
    () =>
      document
        .querySelector(`#${previewId}`)
        ?.querySelector("ef-timegroup")
        ?.hasAttribute("loop") ?? false,
    [previewId]
  );
  const isLooping = useSyncExternalStore(
    subscribe,
    getLoopSnapshot,
    getServerLoopSnapshot
  );

  return (
    <Controls
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
  width = W,
  height = H,
  compact = false,
  autoPlay = false,
}: {
  previewId: string;
  Component: RegistryComponent;
  componentProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  previewBackdrop?: BackdropFill;
  /** Composition size in pixels; the stage keeps its aspect ratio. */
  width?: number;
  height?: number;
  compact?: boolean;
  autoPlay?: boolean;
}) => {
  const [root, setRoot] = useState<React.ComponentRef<typeof Timegroup> | null>(
    null
  );
  const motionAllowed = useMediaQuery(
    "(prefers-reduced-motion: no-preference)"
  );
  const Timeline = useMemo(
    () =>
      createPreviewTimeline({
        Component,
        componentProps,
        durationInFrames,
        fps,
        height,
        onRoot: setRoot,
        previewBackdrop,
        width,
      }),
    [
      Component,
      componentProps,
      durationInFrames,
      fps,
      height,
      previewBackdrop,
      width,
    ]
  );
  useEffect(() => {
    if (!root) {
      return;
    }
    let cancelled = false;
    const sync = async () => {
      root.toggleAttribute("loop", autoPlay);
      await root.seek(0);
      if (cancelled || !root.isConnected) {
        return;
      }
      if (autoPlay && motionAllowed) {
        await root.play();
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
  }, [autoPlay, motionAllowed, root]);

  const stage = (
    <FitScale>
      <TimelineRoot id={`${previewId}-timeline`} component={Timeline} />
    </FitScale>
  );

  return compact ? (
    // Gallery cards stay 16:9; other formats letterbox inside them.
    <div className="overflow-hidden">
      <Preview id={previewId} className="aspect-video">
        {stage}
      </Preview>
    </div>
  ) : (
    // Card look: only the video sits on white; the player controls live on the muted shell.
    <Frame>
      <FrameContent className="overflow-hidden">
        <Preview id={previewId} style={{ aspectRatio: `${width} / ${height}` }}>
          {stage}
        </Preview>
      </FrameContent>
      <PreviewControls previewId={previewId} />
    </Frame>
  );
};

/** Placeholder that matches the shell VideoPreview paints once mounted. */
const VideoPreviewSkeleton = ({ compact = false }: { compact?: boolean }) =>
  compact ? (
    // Cards already draw the frame; only fill the video area so borders never nest.
    <div aria-hidden="true" className="bg-muted aspect-video w-full" />
  ) : (
    <Frame aria-label="Loading video preview">
      <FrameContent className="bg-muted aspect-video" />
      <div className="h-11" />
    </Frame>
  );

export const VideoPreview = (
  props: React.ComponentProps<typeof VideoPreviewClient>
) => {
  const mounted = useMounted();
  return mounted ? (
    <VideoPreviewClient {...props} />
  ) : (
    <VideoPreviewSkeleton compact={props.compact} />
  );
};
