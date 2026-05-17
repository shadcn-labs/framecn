---
name: composition
description: "Create video compositions with Editframe using HTML web components or React. Supports video, audio, images, text, captions, transitions, and cloud rendering."
license: MIT
metadata:
  author: editframe
  version: "2.0"
---


# Video Composition

Build video scenes with HTML web components (`<ef-timegroup>`, `<ef-video>`, etc.) or React (`<Timegroup>`, `<Video>`, etc.). Same composition model, same rendering pipeline — pick the syntax that fits your project.

Web component attributes use kebab-case (`sourcein`, `auto-init`). React props use camelCase (`sourceIn`, `autoInit`). Each element reference documents both.

## Quick Start

```html
<ef-configuration api-host="..." media-engine="local">
  <ef-timegroup mode="sequence">
    <ef-timegroup mode="fixed" duration="5s" class="absolute w-full h-full">
      <ef-video src="intro.mp4" class="size-full object-cover"></ef-video>
      <ef-text class="absolute top-8 text-white text-3xl">Title</ef-text>
    </ef-timegroup>
    <ef-timegroup mode="fixed" duration="5s" class="absolute w-full h-full">
      <ef-video src="main.mp4" sourcein="10s" sourceout="15s" class="size-full"></ef-video>
      <ef-audio src="music.mp3" volume="0.3"></ef-audio>
    </ef-timegroup>
  </ef-timegroup>
</ef-configuration>
```

```tsx
import { Timegroup, Video, Text, Audio } from "@editframe/react";

export const MyVideo = () => (
  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
    <Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
      <Video src="intro.mp4" className="size-full object-cover" />
      <Text className="absolute top-8 text-white text-3xl">Title</Text>
    </Timegroup>
    <Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
      <Video src="main.mp4" sourceIn="10s" sourceOut="15s" className="size-full" />
      <Audio src="music.mp3" volume={0.3} />
    </Timegroup>
  </Timegroup>
);
```

React requires a `TimelineRoot` wrapper — see [references/timeline-root.md](references/timeline-root.md).

## Duration Units

`5s` (seconds) | `1000ms` (milliseconds) | `2m` (minutes)

## Getting Started

Create a project: `npm create @editframe` (see the `editframe-create` skill)

- [references/getting-started.md](references/getting-started.md) — Your first composition

## Media Elements

- [references/video.md](references/video.md) — Video clips, trimming, effects
- [references/audio.md](references/audio.md) — Audio, volume
- [references/image.md](references/image.md) — Static images
- [references/text.md](references/text.md) — Animated text with splitting
- [references/captions.md](references/captions.md) — Subtitles with word highlighting
- [references/waveform.md](references/waveform.md) — Audio visualization

## Layout & Timing

- [references/timegroup.md](references/timegroup.md) — Container, sequencing, scenes
- [references/sequencing.md](references/sequencing.md) — Sequential scene playback
- [references/transitions.md](references/transitions.md) — Crossfades, slides, zoom transitions
- [references/surface.md](references/surface.md) — Mirror another element
- [references/css-variables.md](references/css-variables.md) — Time-based CSS animations

## Rendering

- [references/render-to-video.md](references/render-to-video.md) — Export to MP4 in the browser
- [references/render-api.md](references/render-api.md) — Render API and custom render data
- [references/scripting.md](references/scripting.md) — JavaScript behavior with initializer and frameTask
- [references/transcription.md](references/transcription.md) — Generate captions with WhisperX

See the `editframe-cli` skill for CLI rendering.

## React

- [references/timeline-root.md](references/timeline-root.md) — Required wrapper for React compositions
- [references/hooks.md](references/hooks.md) — useTimingInfo, usePanZoomTransform
- [references/use-media-info.md](references/use-media-info.md) — useMediaInfo hook

## Advanced

- [references/configuration.md](references/configuration.md) — Media engine and API host
- [references/r3f.md](references/r3f.md) — React Three Fiber 3D integration
- [references/server-rendering.md](references/server-rendering.md) — SSR with Next.js/Remix
- [references/entry-points.md](references/entry-points.md) — Package exports
- [references/events.md](references/events.md) — Custom event catalog
- [references/css-parts.md](references/css-parts.md) — Shadow DOM styling

## Styling

Elements use standard CSS/Tailwind. Position with `absolute`, size with `w-full h-full` or `size-full`.
