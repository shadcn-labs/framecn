---
description: "React hook for reading media metadata — duration, loading state, and dimensions — from Video and Audio composition elements."
---


# useMediaInfo


## Functions

- **useMediaInfo(mediaRef: RefObject<MediaElement>): MediaInfo** - Access media metadata from Video or Audio ref
  - Returns: MediaInfo object with intrinsicDurationMs and loading state


Access media metadata like duration and loading state from Video and Audio components.

## Import

```tsx
import { useMediaInfo } from "@editframe/react";
```

## Return Type

```tsx
interface MediaInfo {
  intrinsicDurationMs: number | undefined;  // Media duration in milliseconds
  loading: boolean;                         // True while metadata is loading
}
```

## Basic Usage

```tsx
import { useRef } from "react";
import { Video, useMediaInfo } from "@editframe/react";

const VideoWithDuration = () => {
  const videoRef = useRef(null);
  const { intrinsicDurationMs, loading } = useMediaInfo(videoRef);

  return (
    <>
      <Video
        ref={videoRef}
        src="/assets/video.mp4"
        className="size-full object-cover"
      />

      {loading ? (
        <div className="absolute top-4 right-4 text-white">
          Loading...
        </div>
      ) : (
        <div className="absolute top-4 right-4 text-white">
          Duration: {((intrinsicDurationMs || 0) / 1000).toFixed(1)}s
        </div>
      )}
    </>
  );
};
```

## With Audio

```tsx
import { useRef } from "react";
import { Audio, Waveform, useMediaInfo } from "@editframe/react";

const AudioWithInfo = () => {
  const audioRef = useRef(null);
  const { intrinsicDurationMs, loading } = useMediaInfo(audioRef);

  return (
    <>
      <Audio
        ref={audioRef}
        src="/assets/music.mp3"
      />

      {!loading && intrinsicDurationMs && (
        <>
          <Waveform target={audioRef} className="w-full h-24" />
          <div className="text-white text-center mt-2">
            {(intrinsicDurationMs / 1000).toFixed(1)} seconds
          </div>
        </>
      )}
    </>
  );
};
```

## Format Duration Display

```tsx
import { useRef } from "react";
import { Video, useMediaInfo } from "@editframe/react";

const formatDuration = (ms: number | undefined): string => {
  if (ms === undefined) return "--:--";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const VideoWithFormattedTime = () => {
  const videoRef = useRef(null);
  const { intrinsicDurationMs } = useMediaInfo(videoRef);

  return (
    <>
      <Video
        ref={videoRef}
        src="/assets/video.mp4"
        className="size-full object-cover"
      />

      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded">
        {formatDuration(intrinsicDurationMs)}
      </div>
    </>
  );
};
```

## Dynamic Timegroup Duration

Set timegroup duration based on media duration:

```tsx
import { useRef, useEffect, useState } from "react";
import { Timegroup, Video, useMediaInfo } from "@editframe/react";

const DynamicDurationScene = () => {
  const videoRef = useRef(null);
  const { intrinsicDurationMs, loading } = useMediaInfo(videoRef);
  const [duration, setDuration] = useState("10s");

  useEffect(() => {
    if (intrinsicDurationMs) {
      setDuration(`${intrinsicDurationMs}ms`);
    }
  }, [intrinsicDurationMs]);

  if (loading) {
    return <div className="text-white">Loading video...</div>;
  }

  return (
    <Timegroup mode="fixed" duration={duration} className="absolute w-full h-full">
      <Video
        ref={videoRef}
        src="/assets/video.mp4"
        className="size-full object-cover"
      />
    </Timegroup>
  );
};
```

## Loading States

```tsx
import { useRef } from "react";
import { Video, useMediaInfo } from "@editframe/react";

const VideoWithLoadingState = () => {
  const videoRef = useRef(null);
  const { intrinsicDurationMs, loading } = useMediaInfo(videoRef);

  return (
    <div className="relative w-full h-full">
      <Video
        ref={videoRef}
        src="/assets/large-video.mp4"
        className="size-full object-cover"
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-xl">
            Loading video metadata...
          </div>
        </div>
      )}

      {!loading && !intrinsicDurationMs && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
          <div className="text-white text-xl">
            Failed to load video
          </div>
        </div>
      )}
    </div>
  );
};
```

## Progress Indicator

```tsx
import { useRef } from "react";
import { Video, useMediaInfo, useTimingInfo } from "@editframe/react";

const VideoWithProgress = () => {
  const videoRef = useRef(null);
  const { ref: timegroupRef, ownCurrentTimeMs } = useTimingInfo();
  const { intrinsicDurationMs } = useMediaInfo(videoRef);

  const progress = intrinsicDurationMs
    ? (ownCurrentTimeMs / intrinsicDurationMs) * 100
    : 0;

  return (
    <div ref={timegroupRef} className="relative w-full h-full">
      <Video
        ref={videoRef}
        src="/assets/video.mp4"
        className="size-full object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
```

## Multiple Videos

```tsx
import { useRef } from "react";
import { Video, useMediaInfo } from "@editframe/react";

const MultiVideoInfo = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  const video1Info = useMediaInfo(video1Ref);
  const video2Info = useMediaInfo(video2Ref);

  const totalDuration =
    (video1Info.intrinsicDurationMs || 0) +
    (video2Info.intrinsicDurationMs || 0);

  return (
    <>
      <Video ref={video1Ref} src="/assets/clip1.mp4" className="size-full" />
      <Video ref={video2Ref} src="/assets/clip2.mp4" className="size-full" />

      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded">
        <div>Clip 1: {((video1Info.intrinsicDurationMs || 0) / 1000).toFixed(1)}s</div>
        <div>Clip 2: {((video2Info.intrinsicDurationMs || 0) / 1000).toFixed(1)}s</div>
        <div className="border-t border-white/30 mt-1 pt-1">
          Total: {(totalDuration / 1000).toFixed(1)}s
        </div>
      </div>
    </>
  );
};
```

## Conditional Rendering

Only show content when media is loaded:

```tsx
import { useRef } from "react";
import { Timegroup, Video, Text, useMediaInfo } from "@editframe/react";

const ConditionalScene = () => {
  const videoRef = useRef(null);
  const { loading } = useMediaInfo(videoRef);

  return (
    <Timegroup mode="contain" className="absolute w-full h-full">
      <Video
        ref={videoRef}
        src="/assets/video.mp4"
        className="size-full object-cover"
      />

      {!loading && (
        <Text
          duration="5s"
          className="absolute top-8 left-8 text-white text-3xl"
        >
          Video Title
        </Text>
      )}
    </Timegroup>
  );
};
```

## Error Handling

```tsx
import { useRef, useEffect, useState } from "react";
import { Video, useMediaInfo } from "@editframe/react";

const VideoWithErrorHandling = () => {
  const videoRef = useRef(null);
  const { intrinsicDurationMs, loading } = useMediaInfo(videoRef);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If still loading after 10 seconds, consider it an error
    if (loading) {
      const timeout = setTimeout(() => {
        if (loading && !intrinsicDurationMs) {
          setError(true);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [loading, intrinsicDurationMs]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-red-500 text-white">
        Failed to load video
      </div>
    );
  }

  return (
    <Video
      ref={videoRef}
      src="/assets/video.mp4"
      className="size-full object-cover"
    />
  );
};
```

## Notes

- The ref must point to a Video or Audio component from `@editframe/react`
- `intrinsicDurationMs` is `undefined` until metadata loads
- `loading` is `true` while media metadata is being fetched
- Updates automatically when the media source changes
- Duration is in milliseconds for consistency with other timing APIs
- Works with both local and remote media files
