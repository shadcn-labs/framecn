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
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FPS, H, W } from "@/lib/customizer-config";
import {
  FrameProvider,
  FramecnUIProvider,
  resolveFramecnTheme,
} from "@/lib/framecn-ui";
import type { BaseColorName, ThemeName, IconLibrary } from "@/lib/framecn-ui";
import { UiPreviewScaleContext } from "@/lib/ui-demo-cursor";
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

export interface VideoAppearance {
  mode?: "system" | "light" | "dark";
  baseColor?: BaseColorName;
  themeName?: ThemeName | "base";
  iconLibrary?: IconLibrary;
}

const VideoPreviewClient = ({
  previewId,
  Component,
  componentProps,
  durationInFrames = DEFAULT_UI_PREVIEW_DURATION_FRAMES,
  fps = FPS,
  previewBackdrop,
  previewScale = 1,
  appearance,
}: {
  previewId: string;
  Component: RegistryComponent;
  componentProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  previewBackdrop?: BackdropFill;
  previewScale?: number;
  appearance?: VideoAppearance;
}) => {
  const Scene =
    previewBackdrop && !(previewBackdrop.type === "color" && appearance)
      ? withBackdrop(Component, previewBackdrop)
      : Component;
  const { resolvedTheme } = useTheme();
  const systemMode = resolvedTheme === "dark" ? "dark" : "light";
  const mode =
    appearance?.mode === "dark" || appearance?.mode === "light"
      ? appearance.mode
      : systemMode;
  const baseColor = appearance?.baseColor ?? "neutral";
  const themeName =
    appearance?.themeName === "base"
      ? baseColor
      : (appearance?.themeName ?? baseColor);
  const colors = resolveFramecnTheme(mode, baseColor, themeName);

  return (
    <div className="overflow-hidden rounded-lg bg-code px-1 pt-1">
      <Preview id={previewId} className="aspect-video">
        <FitScale className="rounded-md">
          <FrameProvider
            durationMs={(durationInFrames / fps) * 1000}
            fps={fps}
            style={{
              height: H,
              overflow: "hidden",
              width: W,
            }}
          >
            {appearance ? (
              <FramecnUIProvider
                mode={mode}
                baseColor={baseColor}
                themeName={themeName}
                iconLibrary={appearance.iconLibrary}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: colors.background,
                    color: colors.foreground,
                    display: "flex",
                    inset: 0,
                    justifyContent: "center",
                    position: "absolute",
                    transform:
                      previewScale === 1 ? undefined : `scale(${previewScale})`,
                  }}
                >
                  <UiPreviewScaleContext value={previewScale}>
                    <Scene {...componentProps} />
                  </UiPreviewScaleContext>
                </div>
              </FramecnUIProvider>
            ) : (
              <Scene {...componentProps} />
            )}
          </FrameProvider>
        </FitScale>
      </Preview>
      <PreviewControls previewId={previewId} />
    </div>
  );
};

// Editframe GUI elements upgrade their DOM before React hydration; mount the
// player client-side so shared query-state icons and browser-only timing agree.
export const VideoPreview = dynamic(() => Promise.resolve(VideoPreviewClient), {
  loading: () => (
    <div
      className="overflow-hidden rounded-lg bg-code px-1 pt-1"
      aria-label="Loading video preview"
    >
      <div className="aspect-video rounded-md bg-muted" />
      <div className="h-11" />
    </div>
  ),
  ssr: false,
});
