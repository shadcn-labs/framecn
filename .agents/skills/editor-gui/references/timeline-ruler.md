---
description: Time ruler with zoom-aware frame markers and time labels for precise timeline navigation in editor interfaces.
---


# ef-timeline-ruler

## Attributes

- **duration-ms** (number) - Total duration in milliseconds
- **fps** (number, default: 30) - Frame rate for frame marker display
- **content-width** (number) - Total width of timeline content in pixels

## Methods

- **quantizeToFrameTimeMs(timeMs, fps) => number** - Round time to nearest frame boundary
  - Returns: Time in milliseconds aligned to frame boundary
- **calculateFrameIntervalMs(fps) => number** - Calculate duration of one frame
  - Returns: Frame duration in milliseconds
- **calculatePixelsPerFrame(frameIntervalMs, pixelsPerMs) => number** - Calculate pixel width of one frame at current zoom
  - Returns: Frame width in pixels
- **shouldShowFrameMarkers(pixelsPerFrame, minSpacing?) => boolean** - Determine if frame markers should be visible at current zoom
  - Returns: True if frames have enough space to display

# TimelineRuler

Time ruler showing time labels and frame markers. Automatically adapts marker density based on zoom level.

## Import

```tsx
import { TimelineRuler } from "@editframe/react";
```

## Basic Usage

Ruler displays time markers and optional frame markers.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="ruler-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="mt-4">
  <div class="h-[24px] bg-gray-900 rounded-t-lg overflow-hidden relative">
    <ef-timeline-ruler
      duration-ms="10000"
      fps="30"
      content-width="400"
    ></ef-timeline-ruler>
  </div>
  <div class="p-4 bg-gray-800 rounded-b-lg">
    <ef-controls target="ruler-demo" class="flex gap-4 items-center">
      <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
      <ef-time-display class="text-white font-mono"></ef-time-display>
    </ef-controls>
  </div>
</div>
```
The ruler is typically used inside Timeline or Filmstrip components, but can be used standalone:

```tsx
import { TimelineRuler } from "@editframe/react";

<div className="h-6 bg-gray-900 relative">
  <TimelineRuler
    durationMs={10000}
    fps={30}
    className="w-full h-full"
  />
</div>
```

## Frame Markers at High Zoom

Frame markers appear when zoomed in enough for precision editing.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="frames-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="3s" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="mt-4 space-y-4">
  <div>
    <div class="text-white text-sm mb-2">Standard zoom - no frame markers:</div>
    <div class="h-[24px] bg-gray-900 rounded-lg overflow-auto">
      <ef-timeline-ruler
        duration-ms="3000"
        fps="30"
        content-width="120"
      ></ef-timeline-ruler>
    </div>
  </div>
  <div>
    <div class="text-white text-sm mb-2">High zoom - frame markers visible:</div>
    <div class="h-[24px] bg-gray-900 rounded-lg overflow-auto">
      <ef-timeline-ruler
        duration-ms="3000"
        fps="30"
        content-width="600"
      ></ef-timeline-ruler>
    </div>
  </div>
</div>
```

## With Custom FPS

Show frame markers at different frame rates:

```tsx
{/* 24fps cinema */}
<TimelineRuler
  durationMs={10000}
  fps={24}
  className="w-full h-6"
/>

{/* 60fps high frame rate */}
<TimelineRuler
  durationMs={10000}
  fps={60}
  className="w-full h-6"
/>
```

## With Scroll Container

Sync ruler with scrollable timeline:

```tsx
import { useRef } from "react";
import { TimelineRuler } from "@editframe/react";

export const ScrollableRuler = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col">
      {/* Ruler */}
      <div className="h-6 bg-gray-900">
        <TimelineRuler
          durationMs={30000}
          fps={30}
          scrollContainerRef={scrollRef}
          className="w-full h-full"
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="overflow-x-auto h-64 bg-gray-800"
      >
        <div style={{ width: '3000px' }}>
          {/* Timeline content */}
        </div>
      </div>
    </div>
  );
};
```

## Used in Timeline

Ruler is automatically included in `ef-timeline` and `ef-filmstrip`.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="timeline-ruler">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
  <ef-text class="absolute bottom-4 left-4 text-white text-2xl">
    Timeline with Ruler
  </ef-text>
</ef-timegroup>
<div class="mt-4 h-[300px] bg-gray-900 rounded-lg overflow-hidden">
  <ef-timeline target="timeline-ruler"></ef-timeline>
</div>
```
Ruler is automatically included in Timeline:

```tsx
import { Timeline, Timegroup, Video } from "@editframe/react";

{/* Timeline includes ruler by default */}
<Timeline className="w-full h-96" />

{/* Hide ruler if not needed */}
<Timeline
  showRuler={false}
  className="w-full h-96"
/>
```

## Adaptive Time Labels

Time labels automatically adjust spacing based on zoom level. The ruler shows appropriate intervals:

- **High zoom** — 0.1s, 0.25s, 0.5s intervals
- **Medium zoom** — 1s, 2s, 5s intervals
- **Low zoom** — 10s, 30s, 60s intervals

Labels format as "Xs" or "X.Xs" depending on precision needed.

## Frame Marker Behavior

Frame markers appear when:
1. Zoom level is high enough (each frame is at least 5px wide by default)
2. FPS is set (defaults to 30fps)

Frame markers are lighter than time markers to distinguish hierarchy.

At very high zoom, you can see individual frame boundaries for frame-accurate editing.

```tsx
import { useState } from "react";
import { TimelineRuler } from "@editframe/react";

export const ZoomableRuler = () => {
  const [zoom, setZoom] = useState(0.04);

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button onClick={() => setZoom(zoom * 2)}>Zoom In</button>
        <button onClick={() => setZoom(zoom / 2)}>Zoom Out</button>
        <span className="text-sm">
          {zoom >= 0.1 ? "Frame markers visible" : "Zoom in to see frames"}
        </span>
      </div>

      <div className="h-6 bg-gray-900">
        <TimelineRuler
          durationMs={10000}
          fps={30}
          zoomScale={zoom * 1000}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
```

## Virtualization

The ruler uses canvas virtualization for performance with long timelines:
- Only renders visible region plus buffer
- Maximum canvas width of 2000px
- Smooth scrolling with 200px buffer on each side

This allows timelines of any length without performance degradation.

```tsx
{/* Handles long timelines efficiently */}
<TimelineRuler
  durationMs={600000} // 10 minutes
  fps={30}
  className="w-full h-6"
/>
```

## Helper Functions

The module exports utility functions for working with frames:

### quantizeToFrameTimeMs

Round time to the nearest frame boundary.

```typescript
import { quantizeToFrameTimeMs } from '@editframe/elements';

const fps = 30;
const rawTime = 1234; // 1.234 seconds
const frameTime = quantizeToFrameTimeMs(rawTime, fps);
// Returns: 1233 (exactly 37 frames at 30fps)
```

### calculateFrameIntervalMs

Get the duration of one frame.

```typescript
import { calculateFrameIntervalMs } from '@editframe/elements';

const fps = 30;
const frameDuration = calculateFrameIntervalMs(fps);
// Returns: 33.333... (1000ms / 30fps)
```

### calculatePixelsPerFrame

Calculate pixel width of a frame at current zoom.

```typescript
import { calculatePixelsPerFrame } from '@editframe/elements';

const frameIntervalMs = 33.33; // 30fps
const pixelsPerMs = 0.2; // zoom level
const frameWidth = calculatePixelsPerFrame(frameIntervalMs, pixelsPerMs);
// Returns: 6.666 pixels per frame
```

### shouldShowFrameMarkers

Determine if frame markers should be visible.

```typescript
import { shouldShowFrameMarkers } from '@editframe/elements';

const pixelsPerFrame = 6.5;
const shouldShow = shouldShowFrameMarkers(pixelsPerFrame);
// Returns: true (frame is wider than 5px minimum)

const pixelsPerFrame = 2;
const shouldShow = shouldShowFrameMarkers(pixelsPerFrame);
// Returns: false (frame too narrow to display markers)
```

## CSS Custom Properties

Ruler appearance uses theme variables:

```css
ef-timeline-ruler {
  --ef-color-text-muted: #9ca3af;
  --ef-color-border-subtle: #6b7280;
}
```

## Custom Styling

Style the ruler appearance:

```tsx
<TimelineRuler
  durationMs={20000}
  fps={30}
  className="w-full h-8 bg-gradient-to-b from-gray-900 to-gray-800"
  style={{
    '--ef-color-text-muted': 'rgb(156, 163, 175)',
    '--ef-color-border-subtle': 'rgb(107, 114, 128)',
  } as React.CSSProperties}
/>
```

## Time Label Format

Time labels automatically adjust format:

```tsx
<div className="space-y-4">
  {/* Short duration: shows decimals */}
  <TimelineRuler durationMs={5000} fps={30} className="w-full h-6 bg-gray-900" />

  {/* Medium duration: shows seconds */}
  <TimelineRuler durationMs={30000} fps={30} className="w-full h-6 bg-gray-900" />

  {/* Long duration: shows minutes */}
  <TimelineRuler durationMs={300000} fps={30} className="w-full h-6 bg-gray-900" />
</div>
```

## Marker Visibility

Frame markers only appear when there's enough space:

```tsx
import { TimelineRuler } from "@editframe/react";

<div className="space-y-4">
  <div>
    <p className="text-sm mb-1">Zoomed out - only time labels</p>
    <TimelineRuler
      durationMs={30000}
      fps={30}
      zoomScale={40}
      className="w-full h-6 bg-gray-900"
    />
  </div>

  <div>
    <p className="text-sm mb-1">Zoomed in - time labels and frame markers</p>
    <TimelineRuler
      durationMs={30000}
      fps={30}
      zoomScale={200}
      className="w-full h-6 bg-gray-900"
    />
  </div>
</div>
```

## Responsive Ruler

Ruler adapts to container width:

```tsx
<div className="w-full max-w-4xl mx-auto">
  <TimelineRuler
    durationMs={15000}
    fps={30}
    className="w-full h-6 bg-gray-900 rounded"
  />
</div>
```

## Usage Context

The ruler is typically used as part of larger timeline components rather than standalone. It automatically reads zoom and scroll state from timeline context.

For custom timeline implementations, provide `duration-ms`, `fps`, and `content-width` explicitly.

## Notes

- Ruler is typically used within Timeline or Filmstrip
- Frame markers appear automatically at high zoom levels
- Uses virtualized rendering for performance with long timelines
- Time labels adjust format based on duration and zoom
- Minimum spacing prevents marker overlap
- Syncs with scroll container via ref or selector
- Canvas-based rendering for smooth performance
