"use client";

import { useEffect, useRef, useState } from "react";

import { VideoPreview } from "@/components/video-preview";
import { getDefaults } from "@/lib/customizer-config";
import registry from "@/registry/__index__";

export const CatalogPreview = ({
  name,
  active = false,
}: {
  name: string;
  active?: boolean;
}) => {
  const container = useRef<HTMLDivElement>(null);
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
  return (
    <div
      ref={container}
      className="pointer-events-none aspect-video overflow-hidden bg-card"
      aria-hidden="true"
    >
      {visible && entry && (
        <VideoPreview
          previewId={`gallery-${name}`}
          Component={entry.Component}
          componentProps={{
            ...defaults,
            durationInFrames: config?.durationInFrames ?? 90,
            fps: config?.fps ?? 30,
            height: 720,
            width: 1280,
          }}
          durationInFrames={config?.durationInFrames}
          fps={config?.fps}
          previewBackdrop={config?.previewBackdrop}
          compact
          autoPlay={active}
        />
      )}
    </div>
  );
};
