"use client";

import { PlayIcon } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { VideoPreview } from "@/components/video-preview";
import { cn } from "@/lib/utils";
import type { BackdropFill } from "@/registry/bases/editframe/components/backdrop";

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

/**
 * Editframe preview stage for docs — lazy-mounts the player when the stage
 * enters the viewport or the user clicks the poster.
 */
export const PreviewStage = ({
  name,
  Component,
  inputProps,
  durationInFrames,
  fps,
  previewBackdrop,
}: {
  name: string;
  Component: React.ComponentType<Record<string, unknown>>;
  inputProps: Record<string, unknown>;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
  previewBackdrop?: BackdropFill;
}) => {
  const previewId = useId().replaceAll(":", "");
  const [mounted, setMounted] = useState(false);
  const frameRef = useMemo(
    () => ({ current: null as HTMLDivElement | null }),
    []
  );

  useEffect(() => {
    if (mounted) {
      return;
    }
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, frameRef]);

  const WrappedComponent = useMemo(() => {
    if (!previewBackdrop) {
      return Component;
    }
    const Wrapped = (props: Record<string, unknown>) => (
      <div
        style={{
          ...backdropStyle(previewBackdrop),
          inset: 0,
          position: "absolute",
        }}
      >
        <Component {...props} />
      </div>
    );
    return Wrapped;
  }, [Component, previewBackdrop]);

  return (
    <div
      ref={(node) => {
        frameRef.current = node;
      }}
      className="aspect-video w-full overflow-hidden rounded-2xl bg-code"
    >
      {mounted ? (
        <div
          className={cn("size-full animate-in fade-in duration-300 ease-out")}
        >
          <VideoPreview
            previewId={previewId}
            Component={WrappedComponent}
            componentProps={inputProps}
            durationInFrames={durationInFrames}
            fps={fps}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setMounted(true)}
          aria-label={`Play preview of ${name}`}
          className={cn(
            "group flex size-full items-center justify-center bg-muted/40 transition-colors",
            "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors group-hover:bg-background">
            <PlayIcon className="size-5 translate-x-px fill-current" />
          </span>
        </button>
      )}
    </div>
  );
};
