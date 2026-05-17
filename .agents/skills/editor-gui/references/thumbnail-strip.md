---
description: Video thumbnail strip that generates and displays preview frames at regular intervals along the composition timeline.
---


# ef-thumbnail-strip

## Attributes

- **target** (string) (required) - ID of target video or root timegroup element
- **targetElement** (Element) - Direct reference to target element (alternative to target)
- **thumbnail-height** (number, default: 24) - Height of thumbnails in pixels
- **thumbnail-spacing-px** (number, default: 48) - Spacing between thumbnail centers in pixels
- **pixels-per-ms** (number) - Zoom level (overrides timeline context)
- **use-intrinsic-duration** (boolean, default: false) - Use source duration instead of trimmed duration

# ThumbnailStrip

Visual thumbnail strip showing preview frames from video or timegroup elements. Automatically generates and displays thumbnails at regular intervals along the timeline.

## Import

```tsx
import { ThumbnailStrip } from "@editframe/react";
```

## Basic Usage

Thumbnail strip for a video element.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="thumb-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="mt-4 h-[48px] bg-gray-900 rounded-lg overflow-auto">
  <ef-thumbnail-strip target="thumb-demo" thumbnail-height="48"></ef-thumbnail-strip>
</div>
<div class="mt-2 flex gap-2">
  <ef-controls target="thumb-demo">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  </ef-controls>
</div>
```
```tsx
import { ThumbnailStrip, Video } from "@editframe/react";

<div className="h-12 bg-gray-900 relative">
  <ThumbnailStrip target="video-1" />
</div>

<Video id="video-1" src="/video.mp4" className="size-full" />
```

## Adjustable Thumbnail Size

Control thumbnail height while maintaining aspect ratio.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="size-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="mt-4 space-y-2">
  <div class="text-white text-sm">24px height:</div>
  <div class="h-[24px] bg-gray-900 rounded-lg overflow-auto">
    <ef-thumbnail-strip target="size-demo" thumbnail-height="24"></ef-thumbnail-strip>
  </div>
  <div class="text-white text-sm mt-4">48px height:</div>
  <div class="h-[48px] bg-gray-900 rounded-lg overflow-auto">
    <ef-thumbnail-strip target="size-demo" thumbnail-height="48"></ef-thumbnail-strip>
  </div>
</div>
```
```tsx
<ThumbnailStrip
  target="video-1"
  thumbnailHeight={64}
  thumbnailSpacingPx={80}
  className="h-16"
/>
```

## Thumbnail Spacing

Control spacing between thumbnails.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="spacing-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="mt-4 space-y-2">
  <div class="text-white text-sm">Dense spacing (24px):</div>
  <div class="h-[48px] bg-gray-900 rounded-lg overflow-auto">
    <ef-thumbnail-strip
      target="spacing-demo"
      thumbnail-height="48"
      thumbnail-spacing-px="24"
    ></ef-thumbnail-strip>
  </div>
  <div class="text-white text-sm mt-4">Wide spacing (96px):</div>
  <div class="h-[48px] bg-gray-900 rounded-lg overflow-auto">
    <ef-thumbnail-strip
      target="spacing-demo"
      thumbnail-height="48"
      thumbnail-spacing-px="96"
    ></ef-thumbnail-strip>
  </div>
</div>
```

## Timeline Integration

Thumbnails automatically integrate with timeline zoom and scroll.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="timeline-thumbs">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="mt-4 h-[350px] bg-gray-900 rounded-lg overflow-hidden">
  <ef-timeline target="timeline-thumbs"></ef-timeline>
</div>
<div class="mt-2 text-white text-sm">
  Thumbnails automatically appear in video tracks. Zoom in to see more detail.
</div>
```
ThumbnailStrip is typically used inside Timeline:

```tsx
import { Timeline, Timegroup, Video } from "@editframe/react";

<Timeline className="w-full h-96" />

<Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
  <Video src="/video.mp4" />
</Timegroup>
```

## Timegroup Thumbnails

Generate thumbnails from entire compositions, not just video.

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black" id="comp-thumbs">
  <ef-timegroup class="flex items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="2s" class="absolute inset-0 size-full object-contain"></ef-video>
    <h1 class="text-white text-6xl font-bold bg-blue-600 p-6 rounded relative">One</h1>
  </ef-timegroup>
  <ef-timegroup class="flex items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="5s" sourceout="7s" class="absolute inset-0 size-full object-contain"></ef-video>
    <h1 class="text-white text-6xl font-bold bg-purple-600 p-6 rounded relative">Two</h1>
  </ef-timegroup>
</ef-timegroup>
<div class="mt-4 h-[60px] bg-gray-900 rounded-lg overflow-auto">
  <ef-thumbnail-strip target="comp-thumbs" thumbnail-height="60"></ef-thumbnail-strip>
</div>
```
## Target Video Element

Generate thumbnails for a specific video:

```tsx
import { ThumbnailStrip, Video } from "@editframe/react";

<div className="space-y-2">
  <div className="h-16 bg-gray-900 rounded">
    <ThumbnailStrip
      target="main-video"
      thumbnailHeight={48}
      thumbnailSpacingPx={64}
    />
  </div>

  <Video
    id="main-video"
    src="/video.mp4"
    className="w-full aspect-video"
  />
</div>
```

## Target Timegroup

Generate thumbnails for a composition:

```tsx
import { ThumbnailStrip, Timegroup, Video, Text } from "@editframe/react";

<div className="h-12 bg-gray-900">
  <ThumbnailStrip target="composition" />
</div>

<Timegroup id="composition" mode="contain" className="w-[1920px] h-[1080px]">
  <Video src="/background.mp4" className="size-full" />
  <Text className="absolute top-20 left-20 text-6xl text-white">
    Title
  </Text>
</Timegroup>
```

## Custom Zoom

Control thumbnail density:

For standalone use, provide explicit `pixels-per-ms` attribute.
```tsx
import { useState } from "react";
import { ThumbnailStrip, Video } from "@editframe/react";

export const ZoomableThumbnails = () => {
  const [zoom, setZoom] = useState(0.04);

  return (
    <div>
      <input
        type="range"
        min="0.01"
        max="0.2"
        step="0.01"
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        className="w-full mb-2"
      />

      <div className="h-12 bg-gray-900">
        <ThumbnailStrip
          target="video-1"
          pixelsPerMs={zoom}
        />
      </div>

      <Video id="video-1" src="/video.mp4" />
    </div>
  );
};
```

## Intrinsic Duration

By default, thumbnails show the trimmed region of video:
- `trimstart="2s"` means thumbnails start at 2 seconds into source
- Duration matches effective video duration

Set `use-intrinsic-duration` to show entire source file regardless of trim.
Use source video duration instead of trimmed duration:

```tsx
import { ThumbnailStrip, Video } from "@editframe/react";

<ThumbnailStrip
  target="trimmed-video"
  useIntrinsicDuration
  className="h-12"
/>

<Video
  id="trimmed-video"
  src="/video.mp4"
  trimStart="5s"
  trimEnd="10s"
/>
```

## With Direct Element Reference

Pass element reference directly:

```tsx
import { useRef, useEffect, useState } from "react";
import { ThumbnailStrip, Video } from "@editframe/react";

export const RefBasedThumbnails = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoElement, setVideoElement] = useState<Element | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      setVideoElement(videoRef.current);
    }
  }, []);

  return (
    <div>
      <div className="h-12 bg-gray-900 mb-2">
        <ThumbnailStrip targetElement={videoElement} />
      </div>

      <Video ref={videoRef} src="/video.mp4" />
    </div>
  );
};
```

## Styled Thumbnails

Customize appearance with CSS variables:

```tsx
<ThumbnailStrip
  target="video-1"
  className="h-16 bg-gradient-to-b from-gray-900 to-gray-800"
  style={{
    '--ef-thumbnail-gap': '4px',
    '--ef-color-bg-inset': 'rgba(100, 100, 100, 0.3)',
    '--ef-color-border-subtle': 'rgba(150, 150, 150, 0.5)',
  } as React.CSSProperties}
/>
```

## Features

**Lazy loading** — Only generates thumbnails for visible region as you scroll.

**Viewport virtualization** — Efficiently handles timelines of any length.

**Smart caching** — Caches generated thumbnails and reuses them when possible.

**Adaptive spacing** — Maintains consistent visual spacing at all zoom levels.

**Frame-accurate** — Aligns thumbnails to frame boundaries for precision.

**Video support** — Extracts thumbnails directly from video files.

**Timegroup support** — Renders composition snapshots with all layers.

**Automatic aspect ratio** — Thumbnails match target element dimensions.

## Target Types

**Video elements** (`ef-video`):
**Video elements**:
- Extracts frames directly from video file
- Fast batch extraction
- Respects video trim settings

**Root timegroups** (top-level `ef-timegroup`):
**Root timegroups**:
- Renders entire composition to thumbnails
- Includes all layers (video, text, images)
- Lower resolution rendering for performance

## How It Works

The thumbnail strip uses different strategies based on target type:

**For videos:**
1. Uses `ThumbnailExtractor` for batch frame extraction
2. Decodes video to access raw frames
3. Caches extracted frames for reuse
4. Supports source time translation for trimmed videos

**For timegroups:**
1. Creates off-screen render clone of composition
2. Seeks to each timestamp and captures canvas
3. Generates at low resolution (0.25x scale) for performance
4. Reuses clone for subsequent thumbnail batches

## Thumbnail Positioning

Thumbnails use a stable grid system:
- Grid is anchored in timeline space (not viewport space)
- Scrolls naturally with timeline content
- On zoom, grid snaps to keep thumbnails near viewport edges
- Prevents visual slipping during zoom operations

Spacing between thumbnails is consistent at all zoom levels, but more thumbnails become visible as you zoom in.

## Performance Optimization

**Batch extraction** — Videos extract multiple frames in one pass.

**Viewport culling** — Only renders thumbnails in visible area plus buffer.

**Canvas pooling** — Reuses canvas elements across renders.

**Abort on scroll** — Cancels in-flight captures when viewport changes.

**Nearest neighbor** — Shows nearby cached thumbnails while loading exact frame.

```tsx
{/* Efficiently handles long videos */}
<ThumbnailStrip
  target="long-video"
  thumbnailSpacingPx={100}
  className="h-12"
/>

<Video id="long-video" src="/10-minute-video.mp4" />
```

## Trimmed Videos

By default, thumbnails show the trimmed region of video:
- `trimstart="2s"` means thumbnails start at 2 seconds into source
- Duration matches effective video duration

Set `use-intrinsic-duration` to show entire source file regardless of trim.
ThumbnailStrip respects video trim settings by default. Use `useIntrinsicDuration` to show the full source file regardless of trim.

## Timeline Context

When used inside a timeline, the strip automatically:
- Reads zoom level from timeline context
- Synchronizes with timeline scroll position
- Updates viewport window as timeline scrolls
- Respects timeline state without explicit binding

For standalone use, provide explicit `pixels-per-ms` attribute.
For standalone use, provide explicit `pixelsPerMs` prop.

## CSS Custom Properties

Customize appearance:

```css
ef-thumbnail-strip {
  --ef-thumbnail-gap: 2px;
  --ef-color-bg-inset: rgba(100, 100, 100, 0.3);
  --ef-color-border-subtle: rgba(150, 150, 150, 0.5);
  --ef-color-error: #ef4444;
}
```

## Error States

The component shows error messages for:
- No target specified
- Target element not found
- Invalid target type (must be video or root timegroup)

Example error: "Invalid target: 'ef-text' must be ef-video or root ef-timegroup"
```tsx
<div className="space-y-2">
  {/* No target specified */}
  <ThumbnailStrip className="h-12 bg-gray-900" />

  {/* Invalid target type */}
  <ThumbnailStrip target="not-a-video" className="h-12 bg-gray-900" />
</div>
```

## Usage in Timeline

Thumbnails are automatically rendered in video and timegroup tracks when inside `ef-timeline`. The timeline manages thumbnail strip lifecycle and positioning.

For custom track implementations, use `ef-thumbnail-strip` directly and manage zoom/scroll context.

## Multi-Video Timeline

Each video track gets its own thumbnail strip:

```tsx
import { Timeline, Timegroup, Video } from "@editframe/react";

<Timeline className="w-full h-96" />

<Timegroup mode="contain" className="w-[1920px] h-[1080px]">
  {/* Each video appears as a separate track with thumbnails */}
  <Video src="/video1.mp4" className="absolute top-0 left-0 w-full h-1/2" />
  <Video src="/video2.mp4" className="absolute bottom-0 left-0 w-full h-1/2" />
</Timegroup>
```

## Notes

- ThumbnailStrip targets either `ef-video` or root `ef-timegroup` elements
- Automatically generates thumbnails for visible viewport area
- Uses efficient batch extraction for videos
- Canvas rendering for timegroups at low resolution
- Thumbnails align to frame boundaries for accuracy
- Spacing adapts to zoom level
- Shows placeholder while thumbnails load
- Cache persists for smooth scrubbing
