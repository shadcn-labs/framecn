"use client";

import "@hyperframes/player";
import type { HyperframesPlayer as HyperframesPlayerType } from "@hyperframes/player";
import {
  PauseIcon,
  PlayIcon,
  Repeat1Icon,
  RepeatIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";
import registry from "@/registry/__index__";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const HyperframesPlayer = ({
  src,
  className,
  autoplay = false,
  loop = false,
  controls = true,
}: {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
}) => {
  const playerRef = useRef<HyperframesPlayerType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(loop);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const scrubberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const handleReady = (e: Event) => {
      const { detail } = e as CustomEvent;
      setDuration(detail?.duration ?? 0);
      setIsReady(true);
    };

    const handleTimeUpdate = (e: Event) => {
      const { detail } = e as CustomEvent;
      if (!isScrubbing) {
        setCurrentTime(detail?.currentTime ?? 0);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (!isLooping) {
        setCurrentTime(0);
      }
    };

    player.addEventListener("ready", handleReady);
    player.addEventListener("timeupdate", handleTimeUpdate);
    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);
    player.addEventListener("ended", handleEnded);

    return () => {
      player.removeEventListener("ready", handleReady);
      player.removeEventListener("timeupdate", handleTimeUpdate);
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("ended", handleEnded);
    };
  }, [isScrubbing, isLooping]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady) {
      return;
    }
    player.loop = isLooping;
  }, [isLooping, isReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady) {
      return;
    }
    if (autoplay) {
      player.play();
    }
  }, [autoplay, isReady]);

  const handlePlayPause = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isReady) {
      return;
    }
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isReady]);

  const handleReset = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isReady) {
      return;
    }
    player.seek(0);
    player.pause();
  }, [isReady]);

  const handleToggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const handleScrubberClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const player = playerRef.current;
      const scrubber = scrubberRef.current;
      if (!player || !scrubber || !isReady || duration === 0) {
        return;
      }

      const rect = scrubber.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const time = percentage * duration;
      player.seek(time);
      setCurrentTime(time);
    },
    [isReady, duration]
  );

  const handleScrubberMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsScrubbing(true);
      handleScrubberClick(e);

      const handleMouseMove = (ev: MouseEvent) => {
        const player = playerRef.current;
        const scrubber = scrubberRef.current;
        if (!player || !scrubber || !isReady || duration === 0) {
          return;
        }

        const rect = scrubber.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const time = percentage * duration;
        player.seek(time);
        setCurrentTime(time);
      };

      const handleMouseUp = () => {
        setIsScrubbing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleScrubberClick, isReady, duration]
  );

  useHotkeys("space", (e) => {
    e.preventDefault();
    handlePlayPause();
  });

  useHotkeys("r", (e) => {
    e.preventDefault();
    handleReset();
  });

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn("overflow-hidden rounded-lg bg-code px-1 pt-1", className)}
    >
      <div className="relative aspect-video overflow-hidden rounded-md bg-black">
        {/* @ts-expect-error hyperframes-player is a custom element */}
        <hyperframes-player
          ref={playerRef}
          src={src}
          muted
          style={{ display: "block", height: "100%", width: "100%" }}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}
      </div>

      {controls && (
        <div className="flex items-center gap-2 rounded-lg bg-code px-2 py-1.5 text-muted-foreground">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
            onClick={handlePlayPause}
            disabled={!isReady}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>

          <div
            ref={scrubberRef}
            className="relative min-w-0 flex-1 cursor-pointer rounded-full bg-border h-1.5 group"
            onMouseDown={handleScrubberMouseDown}
            role="slider"
            aria-label="Scrub timeline"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-[width] duration-75"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          <span className="min-w-22 justify-end font-mono text-xs tabular-nums text-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={isLooping ? "Disable loop" : "Enable loop"}
            aria-pressed={isLooping}
            title={isLooping ? "Loop is on" : "Loop is off"}
            onClick={handleToggleLoop}
            disabled={!isReady}
          >
            {isLooping ? <Repeat1Icon /> : <RepeatIcon />}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Reset"
                title="Reset"
                onClick={handleReset}
                disabled={!isReady}
              >
                <RotateCcwIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="pr-2 pl-3">
              <div className="flex items-center gap-3">
                Reset
                <Kbd>R</Kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export const HyperframesPreview = ({
  name,
  hideCode = false,
  className,
}: {
  name: string;
  hideCode?: boolean;
  className?: string;
}) => {
  const playCopy = useFeedback({ sound: "copy" });
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => playCopy(),
    timeout: 1500,
  });

  const handleCopyLink = useCallback(() => {
    copyToClipboard(window.location.href);
  }, [copyToClipboard]);

  useHotkeys("c", () => handleCopyLink(), {
    enabled: !isCopied,
    preventDefault: true,
  });

  const entry = registry.hyperframes[name];

  if (!entry) {
    return (
      <div className="not-prose mb-6 rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Unknown component: <code>{name}</code>
      </div>
    );
  }

  const player = <HyperframesPlayer src={entry.htmlPath} className="w-full" />;

  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
      {hideCode ? (
        player
      ) : (
        <Tabs defaultValue="preview" className="gap-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            {player}
          </TabsContent>

          <TabsContent value="code" className="mt-0">
            <div className="rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
              Source code viewer coming soon. The composition source is at{" "}
              <code className="text-foreground">{entry.htmlPath}</code>.
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
