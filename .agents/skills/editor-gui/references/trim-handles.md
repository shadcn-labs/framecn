---
description: Draggable in-point and out-point handles for trimming media element duration directly on the composition timeline.
---


# ef-trim-handles

## Attributes

- **mode** (string, default: standalone) - Layout mode ("standalone" or "track")
- **element-id** (string) - ID of element being trimmed (included in events)
- **pixels-per-ms** (number) - Zoom level for pixel-to-time conversion
- **value** (TrimValue) - Current trim value ({startMs, endMs})
- **intrinsic-duration-ms** (number) - Total duration of source media
- **show-overlays** (boolean, default: true) - Show darkened overlay on trimmed regions
- **seek-target** (string) - ID of element to seek when trimming

# TrimHandles

Interactive trim handles for adjusting the start and end points of media elements. Provides visual feedback and emits events for timeline integration.

## Import

```tsx
import { TrimHandles } from "@editframe/react";
```

## Basic Usage

Trim handles on a video element.

```html live
<div class="space-y-4">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="trim-demo">
    <ef-video
      src="https://assets.editframe.com/bars-n-tone.mp4"
      class="size-full object-contain"
      id="trim-video"
    ></ef-video>
  </ef-timegroup>

  <div class="p-4 bg-gray-900 rounded-lg">
    <div class="text-white text-sm mb-2">Drag handles to trim video:</div>
    <div class="h-[60px] relative bg-gray-800 rounded-lg">
      <ef-trim-handles
        element-id="trim-video"
        intrinsic-duration-ms="10000"
        seek-target="trim-demo"
      ></ef-trim-handles>
    </div>
    <ef-controls target="trim-demo" class="flex gap-2 mt-3">
      <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
      <ef-time-display class="text-white font-mono"></ef-time-display>
    </ef-controls>
  </div>
</div>

<script>
  const handles = document.querySelector('ef-trim-handles');
  const video = document.getElementById('trim-video');

  handles.addEventListener('trim-change', (e) => {
    const { value } = e.detail;
    video.setAttribute('trimstart', `${value.startMs}ms`);
    video.setAttribute('trimend', `${value.endMs}ms`);
  });
</script>
```
```tsx
import { useState } from "react";
import { TrimHandles, Video } from "@editframe/react";

export const TrimExample = () => {
  const [trim, setTrim] = useState({ startMs: 0, endMs: 0 });

  return (
    <div className="relative h-24 bg-gray-800">
      <TrimHandles
        elementId="video-1"
        value={trim}
        intrinsicDurationMs={10000}
        pixelsPerMs={0.04}
        onTrimChange={(e) => setTrim(e.detail.value)}
      />

      <Video
        id="video-1"
        src="/video.mp4"
        trimStart={`${trim.startMs}ms`}
        trimEnd={`${trim.endMs}ms`}
      />
    </div>
  );
};
```

## With Timeline

Trim handles are automatically enabled in `ef-timeline` when `enable-trim` is set.

```html
<ef-timeline target="composition" enable-trim></ef-timeline>
```

The timeline handles trim events internally and updates element attributes.
TrimHandles are automatically included when trim mode is enabled:

```tsx
import { Timeline, Timegroup, Video } from "@editframe/react";

<Timeline
  enableTrim
  className="w-full h-96"
/>

<Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
  <Video src="/video.mp4" />
</Timegroup>
```

## Track Mode

In track mode, handles are pinned to container edges for timeline integration.

```html live
<div class="space-y-4">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="track-demo">
    <ef-video
      src="https://assets.editframe.com/bars-n-tone.mp4"
      class="size-full object-contain"
      id="track-video"
      trimstart="2s"
      trimend="3s"
    ></ef-video>
  </ef-timegroup>

  <div class="p-4 bg-gray-900 rounded-lg">
    <div class="text-white text-sm mb-2">Track mode (handles at edges):</div>
    <div class="h-[48px] relative bg-gray-800 rounded-lg overflow-hidden">
      <div style="position: absolute; left: 80px; right: 120px; top: 0; bottom: 0; background: rgba(59,130,246,0.2);">
        <ef-trim-handles
          mode="track"
          element-id="track-video"
          intrinsic-duration-ms="10000"
          pixels-per-ms="0.04"
        ></ef-trim-handles>
      </div>
    </div>
    <ef-controls target="track-demo" class="flex gap-2 mt-3">
      <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
      <ef-time-display class="text-white font-mono"></ef-time-display>
    </ef-controls>
  </div>
</div>

<script>
  const trackHandles = document.querySelectorAll('ef-trim-handles[mode="track"]')[0];
  const trackVideo = document.getElementById('track-video');

  if (trackHandles && trackVideo) {
    trackHandles.value = { startMs: 2000, endMs: 3000 };

    trackHandles.addEventListener('trim-change', (e) => {
      const { value } = e.detail;
      trackVideo.setAttribute('trimstart', `${value.startMs}ms`);
      trackVideo.setAttribute('trimend', `${value.endMs}ms`);
    });
  }
</script>
```
Handles pinned to track edges:

```tsx
import { TrimHandles } from "@editframe/react";

<div className="relative h-16 bg-gray-800">
  <TrimHandles
    mode="track"
    elementId="video-1"
    value={{ startMs: 1000, endMs: 2000 }}
    intrinsicDurationMs={10000}
    pixelsPerMs={0.04}
  />
</div>
```

## Standalone Mode

Handles positioned inline with trim values:

```tsx
<TrimHandles
  mode="standalone"
  elementId="video-1"
  value={{ startMs: 2000, endMs: 3000 }}
  intrinsicDurationMs={10000}
  pixelsPerMs={0.08}
/>
```

## Hide Overlays

Show handles without dimmed regions:

```tsx
<TrimHandles
  elementId="video-1"
  value={{ startMs: 1000, endMs: 1000 }}
  intrinsicDurationMs={10000}
  showOverlays={false}
/>
```

## With Seek Target

Automatically seek video when dragging:

```tsx
import { useState } from "react";
import { TrimHandles, Video } from "@editframe/react";

export const SeekingTrimExample = () => {
  const [trim, setTrim] = useState({ startMs: 0, endMs: 0 });

  return (
    <div>
      <Video
        id="preview-video"
        src="/video.mp4"
        className="w-full aspect-video mb-4"
      />

      <div className="relative h-16 bg-gray-800">
        <TrimHandles
          elementId="video-1"
          seekTarget="preview-video"
          value={trim}
          intrinsicDurationMs={10000}
          onTrimChange={(e) => setTrim(e.detail.value)}
        />
      </div>
    </div>
  );
};
```

## Trim Both Ends

Adjust start and end simultaneously:

```tsx
import { useState } from "react";
import { TrimHandles } from "@editframe/react";

export const DualTrimExample = () => {
  const [trim, setTrim] = useState({ startMs: 2000, endMs: 3000 });

  return (
    <div>
      <div className="mb-2 text-sm font-mono">
        Trimmed: {trim.startMs}ms to {10000 - trim.endMs}ms
      </div>

      <div className="relative h-16 bg-gray-800 rounded">
        <TrimHandles
          elementId="video-1"
          value={trim}
          intrinsicDurationMs={10000}
          pixelsPerMs={0.08}
          onTrimChange={(e) => setTrim(e.detail.value)}
        />
      </div>
    </div>
  );
};
```

## Region Dragging

In standalone mode, drag the region between handles to slide the trim window.

```html live
<div class="space-y-4">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="region-demo">
    <ef-video
      src="https://assets.editframe.com/bars-n-tone.mp4"
      sourcein="2s"
      sourceout="6s"
      class="size-full object-contain"
      id="region-video"
    ></ef-video>
  </ef-timegroup>

  <div class="p-4 bg-gray-900 rounded-lg">
    <div class="text-white text-sm mb-2">Drag region to slide trim window:</div>
    <div class="h-[60px] relative bg-gray-800 rounded-lg">
      <ef-trim-handles
        element-id="region-video"
        intrinsic-duration-ms="10000"
        seek-target="region-demo"
      ></ef-trim-handles>
    </div>
    <ef-controls target="region-demo" class="flex gap-2 mt-3">
      <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
      <ef-time-display class="text-white font-mono"></ef-time-display>
    </ef-controls>
  </div>
</div>

<script>
  const regionHandles = document.querySelectorAll('ef-trim-handles')[2];
  const regionVideo = document.getElementById('region-video');

  if (regionHandles && regionVideo) {
    regionHandles.value = { startMs: 2000, endMs: 4000 };

    regionHandles.addEventListener('trim-change', (e) => {
      const { value, type } = e.detail;

      if (type === 'region') {
        // Region drag - update sourcein/sourceout instead of trim
        const duration = 10000 - value.startMs - value.endMs;
        regionVideo.setAttribute('sourcein', `${value.startMs}ms`);
        regionVideo.setAttribute('sourceout', `${value.startMs + duration}ms`);
      }
    });
  }
</script>
```
Drag the region between handles to move both:

```tsx
import { useState } from "react";
import { TrimHandles } from "@editframe/react";

export const RegionDragExample = () => {
  const [trim, setTrim] = useState({ startMs: 2000, endMs: 2000 });

  const handleTrimChange = (e: CustomEvent<TrimChangeDetail>) => {
    console.log("Trim type:", e.detail.type); // "start", "end", or "region"
    setTrim(e.detail.value);
  };

  return (
    <div className="relative h-16 bg-gray-800">
      <TrimHandles
        mode="standalone"
        elementId="video-1"
        value={trim}
        intrinsicDurationMs={10000}
        pixelsPerMs={0.08}
        onTrimChange={handleTrimChange}
      />
    </div>
  );
};
```

## Custom Styling

Style handle appearance with CSS custom properties.

```html live
<div class="space-y-4">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="styled-demo">
    <ef-video
      src="https://assets.editframe.com/bars-n-tone.mp4"
      class="size-full object-contain"
      id="styled-video"
    ></ef-video>
  </ef-timegroup>

  <div class="p-4 bg-gray-900 rounded-lg">
    <div class="text-white text-sm mb-2">Custom styled handles:</div>
    <div class="h-[60px] relative bg-gray-800 rounded-lg">
      <ef-trim-handles
        id="styled-handles"
        element-id="styled-video"
        intrinsic-duration-ms="10000"
      ></ef-trim-handles>
    </div>
  </div>
</div>

<style>
  #styled-handles {
    --trim-handle-width: 12px;
    --trim-handle-color: rgba(139, 92, 246, 0.8);
    --trim-handle-active-color: #8b5cf6;
    --trim-overlay-color: rgba(0, 0, 0, 0.6);
  }
</style>

<script>
  const styledHandles = document.getElementById('styled-handles');
  const styledVideo = document.getElementById('styled-video');

  styledHandles.addEventListener('trim-change', (e) => {
    const { value } = e.detail;
    styledVideo.setAttribute('trimstart', `${value.startMs}ms`);
    styledVideo.setAttribute('trimend', `${value.endMs}ms`);
  });
</script>
```
Customize handle appearance:

```tsx
<TrimHandles
  elementId="video-1"
  value={{ startMs: 1000, endMs: 1000 }}
  intrinsicDurationMs={10000}
  className="custom-trim"
  style={{
    '--trim-handle-width': '12px',
    '--trim-handle-color': 'rgba(59, 130, 246, 0.8)',
    '--trim-handle-active-color': '#3b82f6',
    '--trim-overlay-color': 'rgba(0, 0, 0, 0.6)',
  } as React.CSSProperties}
/>
```

## Trim Modes

**Standalone mode** (`mode="standalone"`, default):
- Handles positioned absolutely based on trim values
- Shows draggable region between handles
- Best for full-width trim UI

**Track mode** (`mode="track"`):
- Handles pinned to container edges
- No draggable region
- Best for timeline track integration

## Event Handling

### trim-change Event

Fired continuously during drag operations.

```typescript
interface TrimChangeDetail {
  elementId: string;           // Element being trimmed
  type: 'start' | 'end' | 'region';  // Which handle/region moved
  value: {                     // New trim values
    startMs: number;
    endMs: number;
  };
}
```

### trim-change-end Event

Fired when drag completes (on pointer up).

```typescript
interface TrimChangeEndDetail {
  elementId: string;
  type: 'start' | 'end' | 'region';
}
```
Handle trim events:

```tsx
import { useState } from "react";
import { TrimHandles } from "@editframe/react";

export const TrimEventsExample = () => {
  const [trim, setTrim] = useState({ startMs: 0, endMs: 0 });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      <div className="mb-2 text-sm">
        {isDragging ? "Dragging..." : "Idle"}
      </div>

      <div className="relative h-16 bg-gray-800">
        <TrimHandles
          elementId="video-1"
          value={trim}
          intrinsicDurationMs={10000}
          onTrimChange={(e) => {
            setTrim(e.detail.value);
            setIsDragging(true);
          }}
          onTrimChangeEnd={(e) => {
            console.log("Final trim:", e.detail.value);
            setIsDragging(false);
          }}
        />
      </div>
    </div>
  );
};
```

## Trim Value Semantics

Trim values represent time trimmed from source media:
- `startMs` — Time trimmed from start
- `endMs` — Time trimmed from end
- Effective duration = `intrinsicDurationMs - startMs - endMs`

Example with 10 second source:
- `{startMs: 2000, endMs: 3000}` = play seconds 2-7 (5 second duration)
- `{startMs: 0, endMs: 0}` = play entire source (10 second duration)

## Seeking During Trim

When `seek-target` is set, the element seeks during trim operations:
When `seekTarget` is set, the element seeks during trim operations:
- Dragging start handle — seeks to trimmed start (0:00 of visible region)
- Dragging end handle — seeks to trimmed end (last frame of visible region)
- Dragging region — maintains relative position

## Controlled Trim

Full control over trim state:

```tsx
import { useState } from "react";
import { TrimHandles, Video } from "@editframe/react";

export const ControlledTrimExample = () => {
  const [trim, setTrim] = useState({ startMs: 0, endMs: 0 });
  const intrinsicDuration = 10000;

  const effectiveDuration = intrinsicDuration - trim.startMs - trim.endMs;

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-sm">Trim Start (ms)</label>
          <input
            type="number"
            value={trim.startMs}
            onChange={(e) => setTrim({ ...trim, startMs: Number(e.target.value) })}
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>

        <div>
          <label className="text-sm">Trim End (ms)</label>
          <input
            type="number"
            value={trim.endMs}
            onChange={(e) => setTrim({ ...trim, endMs: Number(e.target.value) })}
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>

        <div className="text-sm">
          <div>Effective Duration: {effectiveDuration}ms</div>
        </div>
      </div>

      <div className="relative h-16 bg-gray-800 rounded mb-4">
        <TrimHandles
          elementId="video-1"
          value={trim}
          intrinsicDurationMs={intrinsicDuration}
          pixelsPerMs={0.08}
          onTrimChange={(e) => setTrim(e.detail.value)}
        />
      </div>

      <Video
        id="video-1"
        src="/video.mp4"
        trimStart={`${trim.startMs}ms`}
        trimEnd={`${trim.endMs}ms`}
        className="w-full aspect-video"
      />
    </div>
  );
};
```

## Responsive Handles

Handles adapt to container width:

```tsx
<div className="w-full max-w-4xl mx-auto">
  <TrimHandles
    elementId="video-1"
    value={{ startMs: 1000, endMs: 1000 }}
    intrinsicDurationMs={10000}
    className="h-16"
  />
</div>
```

## CSS Custom Properties

Customize handle appearance:

```css
ef-trim-handles {
  --trim-handle-width: 8px;
  --trim-handle-color: rgba(255, 255, 255, 0.7);
  --trim-handle-active-color: #3b82f6;
  --trim-overlay-color: rgba(0, 0, 0, 0.4);
  --trim-handle-border-radius-start: 2px 0 0 2px;
  --trim-handle-border-radius-end: 0 2px 2px 0;
  --trim-selected-border-width: 0px;
  --trim-selected-border-color: transparent;
}
```

## Notes

- TrimHandles work in two modes: standalone (inline positioning) or track (pinned to edges)
- Handles constrain dragging to valid ranges
- Region between handles can be dragged to move both simultaneously
- Overlays show trimmed (non-visible) regions
- Use `seek-target` to update video preview while dragging
- Use `seekTarget` to update video preview while dragging
- Event types: "start", "end", or "region" indicate which handle was dragged
- Automatically accounts for zoom level via `pixels-per-ms`
- Automatically accounts for zoom level via `pixelsPerMs`
- CSS custom properties allow extensive styling customization
