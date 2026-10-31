"use client";

import type { Timegroup } from "@editframe/react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import type { ComponentRef } from "react";

import { VideoPreview } from "@/components/video-preview";
import { getDefaults, resolveComposition } from "@/lib/customizer-config";
import registry from "@/registry/__index__";

type Timeline = ComponentRef<typeof Timegroup>;

declare global {
  interface Window {
    __FRAMECN_PREVIEW_RENDER__?: {
      name: string;
      theme: "light" | "dark";
      width: number;
      height: number;
      fps: number;
      durationInFrames: number;
      seek: (frame: number) => Promise<void>;
    };
  }
}

const OUTPUT_FPS = 24;
const WIDTH = 960;
const HEIGHT = 540;

// The stable wrapper marks when Next's lazy component has really mounted, not just its timeline shell.
const RenderComposition = ({
  __previewComponentId,
  ...props
}: Record<string, unknown>) => {
  const { Component } = registry[String(__previewComponentId)];
  return (
    <div data-preview-composition className="size-full">
      <Component {...props} />
    </div>
  );
};

const paintCommittedFrame = () => {
  // eslint-disable-next-line typescript/no-invalid-void-type -- This promise models a paint completion event without a payload.
  const { promise, resolve } = Promise.withResolvers<void>();
  requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  return promise;
};

export const PreviewRenderStage = ({
  name,
  theme,
}: {
  name: string;
  theme: "light" | "dark";
}) => {
  const stage = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();
  const config = registry[name]?.config;
  const defaults = useMemo(
    () => (config ? getDefaults(config.controls) : {}),
    [config]
  );
  const composition = useMemo(
    () => (config ? resolveComposition(config, defaults) : null),
    [config, defaults]
  );
  const sourceFps = config?.fps ?? 30;
  const outputFrames = composition
    ? Math.ceil((composition.durationInFrames / sourceFps) * OUTPUT_FPS)
    : 0;

  useEffect(() => {
    const container = stage.current;
    if (!container || !composition || !config) {
      return;
    }
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timer: number | undefined;
    setTheme(theme);

    const prepare = async () => {
      try {
        const { promise, resolve, reject } = Promise.withResolvers<Timeline>();
        const findComposition = () => {
          const root = container.querySelector<Timeline>(
            "#framecn-render-preview-timeline"
          );
          const content = container.querySelector("[data-preview-composition]");
          if (root && content?.firstElementChild) {
            observer?.disconnect();
            clearTimeout(timer);
            resolve(root);
          }
        };
        observer = new MutationObserver(findComposition);
        observer.observe(container, { childList: true, subtree: true });
        timer = window.setTimeout(() => {
          observer?.disconnect();
          reject(
            new Error(
              `Composition ${name} did not mount. Sync its source before rendering.`
            )
          );
        }, 90_000);
        findComposition();
        const timeline = await promise;
        timeline.pause();
        await document.fonts.ready;
        await Promise.all(
          [...container.querySelectorAll("img")]
            .filter((image) => image.getAttribute("src"))
            .map(async (image) => {
              image.loading = "eager";
              await image.decode();
            })
        );
        await timeline.seekForRender(0, { strictVideoPaint: true });
        await paintCommittedFrame();
        if (cancelled) {
          return;
        }
        window.__FRAMECN_PREVIEW_RENDER__ = {
          durationInFrames: outputFrames,
          fps: OUTPUT_FPS,
          height: HEIGHT,
          name,
          seek: async (frame) => {
            if (
              !Number.isInteger(frame) ||
              frame < 0 ||
              frame >= outputFrames
            ) {
              throw new RangeError("Render frame is out of range");
            }
            await timeline.seekForRender(frame / OUTPUT_FPS, {
              strictVideoPaint: true,
            });
            // Flush React frame-context subscribers and the CSS/3D paint before the screenshot.
            await paintCommittedFrame();
          },
          theme,
          width: WIDTH,
        };
      } catch (error) {
        if (!cancelled) {
          container.dataset.renderError =
            error instanceof Error
              ? error.message
              : "Preview preparation failed";
          console.error("Preview render preparation failed", error);
        }
      }
    };
    void prepare();
    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timer);
      delete window.__FRAMECN_PREVIEW_RENDER__;
    };
  }, [composition, config, name, outputFrames, setTheme, theme]);

  if (!config || !composition) {
    throw new Error(
      `Preview source missing for ${name}. Run pnpm pro:sync before rendering.`
    );
  }
  return (
    <div
      ref={stage}
      className="bg-card overflow-hidden"
      style={{ height: HEIGHT, width: WIDTH }}
    >
      <VideoPreview
        previewId="framecn-render-preview"
        Component={RenderComposition}
        componentProps={{
          ...defaults,
          ...composition,
          __previewComponentId: name,
          fps: sourceFps,
        }}
        durationInFrames={composition.durationInFrames}
        fps={sourceFps}
        previewBackdrop={config.previewBackdrop}
        width={composition.width}
        height={composition.height}
        compact
      />
    </div>
  );
};
