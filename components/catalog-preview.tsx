"use client";

import { LockIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { getPreviewMedia } from "@/lib/preview-media";
import type { PreviewTheme } from "@/lib/preview-media";

/** Shown instead of a preview when Pro sources are not synced (e.g. forks). */
export const LockedPreview = () => (
  <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 text-xs">
    <LockIcon className="size-4" />
    framecn Pro
  </div>
);

const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const getPageVisible = () => document.visibilityState === "visible";
const getServerPageVisible = () => false;

export const CatalogPreview = ({
  name,
  active = false,
  theme,
}: {
  name: string;
  active?: boolean;
  theme?: PreviewTheme;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [failedVideo, setFailedVideo] = useState<string>();
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();
  const motionAllowed = useMediaQuery(
    "(prefers-reduced-motion: no-preference)"
  );
  const pageVisible = useSyncExternalStore(
    subscribeToVisibility,
    getPageVisible,
    getServerPageVisible
  );
  // An unresolved system theme must not start a request for the light variant.
  const previewTheme =
    theme ??
    (mounted && (resolvedTheme === "light" || resolvedTheme === "dark")
      ? resolvedTheme
      : undefined);
  const media = previewTheme ? getPreviewMedia(name, previewTheme) : undefined;
  const unavailable = !!previewTheme && (!media || failedVideo === media.video);
  const source =
    media && !unavailable && visible && pageVisible && motionAllowed && active
      ? media.video
      : undefined;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    if (container.current) {
      observer.observe(container.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element || !source) {
      return;
    }

    let cancelled = false;
    // Assign only while playing is allowed; preload="none" alone does not
    // release a previously loaded clip or its decoded frames.
    element.src = source;
    const play = async () => {
      try {
        await element.play();
      } catch (error) {
        if (
          cancelled ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        console.error(`Could not play catalog preview: ${source}`, error);
        setFailedVideo(source);
      }
    };
    void play();

    return () => {
      cancelled = true;
      element.pause();
      element.removeAttribute("src");
      element.load();
    };
  }, [source]);

  let preview: React.ReactNode = null;
  if (unavailable) {
    preview = (
      <div className="text-muted-foreground flex size-full items-center justify-center text-xs">
        Preview unavailable
      </div>
    );
  } else if (media) {
    preview = (
      <video
        key={media.video}
        ref={video}
        width={960}
        height={540}
        className="size-full object-contain"
        poster={visible && pageVisible ? media.poster : undefined}
        preload="none"
        muted
        playsInline
        loop
        onError={(event) => {
          if (event.currentTarget.error) {
            console.error(
              `Could not load catalog preview: ${media.video}`,
              event.currentTarget.error
            );
            setFailedVideo(media.video);
          }
        }}
      />
    );
  }
  return (
    <div
      ref={container}
      className="pointer-events-none aspect-video overflow-hidden bg-card"
      aria-hidden="true"
    >
      {preview}
    </div>
  );
};
