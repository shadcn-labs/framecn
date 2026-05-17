---
description: Visual timeline panel showing composition hierarchy as stacked tracks with time-proportional widths and playhead indicator.
---


# ef-filmstrip

## Attributes

- **target** (string) (required) - ID of target temporal element to visualize
- **pixels-per-ms** (number, default: 0.04) - Zoom level for timeline (pixels per millisecond)
- **hide-playhead** (boolean, default: false) - Hide the playhead indicator
- **disable-internal-scroll** (boolean, default: false) - Disable internal scrolling behavior
- **hide** (string) - Comma-separated CSS selectors for elements to hide
- **show** (string) - Comma-separated CSS selectors for elements to show (hides all others)

# Filmstrip

Visual timeline that displays the temporal structure of a composition. Shows tracks for each element in the hierarchy with playback visualization.

## Import

```tsx
import { Filmstrip } from "@editframe/react";
```

## Basic Usage

Display a timeline for a composition.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="filmstrip-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
  <ef-text class="absolute bottom-4 left-4 text-white text-3xl font-bold">
    Hello Timeline
  </ef-text>
</ef-timegroup>
<div class="mt-4 h-[200px] bg-gray-900 rounded-lg overflow-hidden">
  <ef-filmstrip target="filmstrip-demo"></ef-filmstrip>
</div>
<div class="mt-2 flex gap-2">
  <ef-controls target="filmstrip-demo">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  </ef-controls>
</div>
```
```tsx
import { Filmstrip, Timegroup, Video, Text } from "@editframe/react";

<div className="h-64 bg-gray-900">
  <Filmstrip className="w-full h-full" />

  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]" id="main-timeline">
    <Video src="/video1.mp4" />
    <Video src="/video2.mp4" />
  </Timegroup>
</div>
```

## With Target

Target a specific timeline:

```tsx
<Filmstrip
  target="composition-1"
  className="w-full h-48 bg-gray-800"
/>

<Timegroup id="composition-1" mode="sequence" className="w-[1920px] h-[1080px]">
  <Video src="/video.mp4" />
  <Text>Hello World</Text>
</Timegroup>
```

## Zoomed Timeline

Adjust zoom level with `pixels-per-ms``pixelsPerMs`.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="zoom-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="5s" class="size-full object-contain"></ef-video>
  <ef-text class="absolute top-4 left-4 text-white text-2xl font-bold">Zoomed View</ef-text>
</ef-timegroup>
<div class="mt-4 h-[200px] bg-gray-900 rounded-lg overflow-auto">
  <ef-filmstrip target="zoom-demo" pixels-per-ms="0.2"></ef-filmstrip>
</div>
<div class="mt-2 flex gap-2">
  <ef-controls target="zoom-demo">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  </ef-controls>
</div>
```
```tsx
import { useState } from "react";

export const ZoomableFilmstrip = () => {
  const [zoom, setZoom] = useState(0.04);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setZoom(zoom * 1.5)}>Zoom In</button>
        <button onClick={() => setZoom(zoom / 1.5)}>Zoom Out</button>
        <span>Zoom: {Math.round(zoom * 1000)}%</span>
      </div>

      <Filmstrip
        pixelsPerMs={zoom}
        className="w-full h-48"
      />
    </div>
  );
};
```

## Sequence Timeline

Filmstrip automatically shows sequential layout for `mode="sequence"` timegroups.

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black" id="sequence-demo">
  <ef-timegroup class="flex items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="2s" class="absolute inset-0 size-full object-contain"></ef-video>
    <h1 class="text-white text-4xl font-bold bg-blue-600 p-4 rounded relative">Scene 1</h1>
  </ef-timegroup>
  <ef-timegroup class="flex items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="5s" sourceout="7s" class="absolute inset-0 size-full object-contain"></ef-video>
    <h1 class="text-white text-4xl font-bold bg-purple-600 p-4 rounded relative">Scene 2</h1>
  </ef-timegroup>
  <ef-timegroup class="flex items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="8s" class="absolute inset-0 size-full object-contain"></ef-video>
    <h1 class="text-white text-4xl font-bold bg-green-600 p-4 rounded relative">Scene 3</h1>
  </ef-timegroup>
</ef-timegroup>
<div class="mt-4 h-[250px] bg-gray-900 rounded-lg overflow-hidden">
  <ef-filmstrip target="sequence-demo" pixels-per-ms="0.08"></ef-filmstrip>
</div>
<div class="mt-2 flex gap-2">
  <ef-controls target="sequence-demo">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  </ef-controls>
</div>
```

## Filtering Tracks

Control which elements appear in the timeline.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="filter-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
  <ef-text class="absolute top-4 left-4 text-white text-2xl">Title Text</ef-text>
  <ef-text class="absolute bottom-4 left-4 text-white text-sm helper-text">Helper text</ef-text>
  <ef-text class="absolute bottom-4 right-4 text-white text-sm watermark">Watermark</ef-text>
</ef-timegroup>
<div class="mt-4 space-y-2">
  <div class="text-white text-sm">Hiding helper text and watermark:</div>
  <div class="h-[200px] bg-gray-900 rounded-lg overflow-hidden">
    <ef-filmstrip target="filter-demo" hide=".helper-text, .watermark"></ef-filmstrip>
  </div>
</div>
<div class="mt-2 flex gap-2">
  <ef-controls target="filter-demo">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  </ef-controls>
</div>
```
Show only specific element types:

```tsx
{/* Hide waveforms */}
<Filmstrip
  hide="ef-waveform"
  className="w-full h-48"
/>

{/* Show only videos and images */}
<Filmstrip
  show="ef-video,ef-image"
  className="w-full h-48"
/>

{/* Hide multiple element types */}
<Filmstrip
  hide="ef-waveform,ef-surface,.helper-layer"
  className="w-full h-48"
/>
```

## Without Playhead

Hide the playhead indicator for static timeline views.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="static-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
  <ef-text class="absolute bottom-4 left-4 text-white text-3xl font-bold">Static View</ef-text>
</ef-timegroup>
<div class="mt-4 h-[150px] bg-gray-900 rounded-lg overflow-hidden">
  <ef-filmstrip target="static-demo" hide-playhead></ef-filmstrip>
</div>
```
```tsx
<Filmstrip
  hidePlayhead
  className="w-full h-48 bg-gray-900"
/>
```

## Styled Filmstrip

```tsx
<Filmstrip className="
  w-full
  h-56
  bg-gradient-to-b from-gray-900 to-gray-800
  border border-gray-700
  rounded-lg
  shadow-xl
" />
```

## Split View Editor

Filmstrip with preview:

```tsx
import { Preview, Filmstrip, Controls, Timegroup, Video } from "@editframe/react";

export const SplitEditor = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Preview */}
      <div className="flex-1 p-4">
        <Preview className="w-full h-full bg-black rounded" />
      </div>

      {/* Controls */}
      <div className="px-4 py-2">
        <Controls className="w-full" />
      </div>

      {/* Timeline */}
      <div className="h-64 border-t border-gray-700">
        <Filmstrip className="w-full h-full" />
      </div>

      {/* Composition */}
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/video1.mp4" />
        <Video src="/video2.mp4" />
      </Timegroup>
    </div>
  );
};
```

## Compact Timeline

Minimal filmstrip for review:

```tsx
<div className="flex flex-col gap-2">
  <h3>Timeline Preview</h3>
  <Filmstrip
    hidePlayhead={false}
    className="w-full h-24 bg-black/50 rounded"
  />
</div>
```

## Multi-Timeline View

Show multiple timelines:

```tsx
<div className="space-y-4">
  <div>
    <h4 className="text-sm mb-1">Main Timeline</h4>
    <Filmstrip
      target="timeline-main"
      className="w-full h-32 bg-gray-800 rounded"
    />
  </div>

  <div>
    <h4 className="text-sm mb-1">B-Roll</h4>
    <Filmstrip
      target="timeline-broll"
      className="w-full h-32 bg-gray-800 rounded"
    />
  </div>
</div>
```

## With React State

Integrate with React state:

```tsx
import { useState } from "react";
import { Filmstrip, Timegroup, Video } from "@editframe/react";

export const StateIntegratedFilmstrip = () => {
  const [hideWaveforms, setHideWaveforms] = useState(true);
  const [zoom, setZoom] = useState(0.04);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <label>
          <input
            type="checkbox"
            checked={hideWaveforms}
            onChange={(e) => setHideWaveforms(e.target.checked)}
          />
          Hide Waveforms
        </label>

        <input
          type="range"
          min="0.01"
          max="0.2"
          step="0.01"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
      </div>

      <Filmstrip
        hide={hideWaveforms ? "ef-waveform" : ""}
        pixelsPerMs={zoom}
        className="w-full h-48 bg-gray-900 rounded"
      />
    </div>
  );
};
```

## Features

**Automatic track generation** — Creates visual tracks for all temporal elements in the composition hierarchy.

**Playhead visualization** — Shows current playback position with a vertical line that follows playback.

**Zoom control** — Adjust timeline zoom with `pixels-per-ms``pixelsPerMs` to show more or less detail.

**Track filtering** — Show or hide specific elements using CSS selectors.

**Sequence support** — Automatically handles sequential timegroup layouts.

**Scroll support** — Long timelines are scrollable with the playhead staying visible.

## Relationship to EFTimeline

`ef-filmstrip` is a simplified wrapper around `ef-timeline` that shows only the tracks without:
Filmstrip is a simplified version of Timeline without:
- Hierarchy panel
- Playback controls
- Zoom controls
- Timeline ruler
- Time display

For full timeline editing features, use `ef-timeline` directly.
For full timeline editing features, use Timeline directly.

## CSS Custom Properties

Timeline appearance inherits from theme variables:

```css
ef-filmstrip {
  --ef-color-bg: #111827;
  --ef-color-border: #374151;
  --ef-color-playhead: #3b82f6;
  --ef-track-height: 24px;
}
```

## Notes

- Filmstrip is a simplified version of Timeline without controls
- Automatically connects to the active timeline in context
- Use `target` prop to specify a particular timegroup
- The `hide` and `show` props accept comma-separated CSS selectors
- Zoom level (`pixelsPerMs`) determines how much timeline fits in view
- Use with `Preview` and `Controls` for a complete editor
