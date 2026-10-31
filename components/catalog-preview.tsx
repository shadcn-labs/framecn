"use client";

import { LockIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { VideoPreview } from "@/components/video-preview";
import { getDefaults, resolveComposition } from "@/lib/customizer-config";
import registry from "@/registry/__index__";

/** Shown instead of a preview when Pro sources are not synced (e.g. forks). */
export const LockedPreview = () => (
  <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 text-xs">
    <LockIcon className="size-4" />
    framecn Pro
  </div>
);

export const CatalogPreview = ({
  name,
  active = false,
}: {
  name: string;
  active?: boolean;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const instanceId = useId().replaceAll(":", "");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    if (container.current) {
      observer.observe(container.current);
    }
    return () => observer.disconnect();
  }, []);
  const entry = registry[name];
  const config = entry?.config;
  const defaults = config ? getDefaults(config.controls) : {};
  const { durationInFrames, height, width } = config
    ? resolveComposition(config, defaults)
    : { durationInFrames: 90, height: 720, width: 1280 };
  return (
    <div
      ref={container}
      className="pointer-events-none aspect-video overflow-hidden bg-card"
      aria-hidden="true"
    >
      {entry ? (
        visible && (
          <VideoPreview
            previewId={`gallery-${name}-${instanceId}`}
            Component={entry.Component}
            componentProps={{
              ...defaults,
              durationInFrames,
              fps: config?.fps ?? 30,
              height,
              width,
            }}
            durationInFrames={durationInFrames}
            fps={config?.fps}
            previewBackdrop={config?.previewBackdrop}
            width={width}
            height={height}
            compact
            autoPlay={active}
          />
        )
      ) : (
        <LockedPreview />
      )}
    </div>
  );
};
