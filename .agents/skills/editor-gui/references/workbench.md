---
description: "Full-featured video editor layout combining preview, timeline, hierarchy panel, and export controls in one component."
---


# ef-workbench

## Attributes

- **rendering** (boolean, default: false) - Enable render-only mode (no UI)

## Properties

- **rendering** (boolean, default: false) - Enable render-only mode (no UI)

## Methods

- **setPreviewPresentationMode(mode)** - Set preview rendering mode ("dom" or "canvas")
  - Returns: void
- **getPreviewPresentationMode()** - Get current preview rendering mode
  - Returns: PreviewPresentationMode
- **startExport(options)** - Start video export with progress tracking
  - Returns: Promise<void>
- **cancelExport()** - Cancel the current export
  - Returns: void

# Workbench

Complete video editor interface with preview, timeline, hierarchy panel, and export controls.
Full timeline editor UI with hierarchy and timeline views.

## Import

```tsx
import { Workbench } from "@editframe/react";
```

## Basic Usage

Wrap a composition to add a full editing interface:

```html live
<ef-workbench class="w-full h-screen">
  <ef-pan-zoom slot="canvas">
    <ef-fit-scale>
      <ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
        <ef-timegroup mode="fixed" duration="3s" class="flex items-center justify-center">
          <ef-text duration="3s" class="text-white text-4xl">First Scene</ef-text>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="3s" class="flex items-center justify-center">
          <ef-text duration="3s" class="text-white text-4xl">Second Scene</ef-text>
        </ef-timegroup>
      </ef-timegroup>
    </ef-fit-scale>
  </ef-pan-zoom>

  <ef-hierarchy slot="hierarchy"></ef-hierarchy>

  <div slot="timeline" class="h-full flex flex-col">
    <ef-controls class="flex items-center gap-2 p-2 border-b border-gray-700">
      <ef-toggle-play>
        <button slot="play" class="px-3 py-1 bg-blue-600 text-white rounded">Play</button>
        <button slot="pause" class="px-3 py-1 bg-gray-600 text-white rounded">Pause</button>
      </ef-toggle-play>
      <ef-time-display class="text-sm text-gray-300"></ef-time-display>
    </ef-controls>
    <ef-filmstrip class="flex-1"></ef-filmstrip>
  </div>
</ef-workbench>
```
The `workbench` prop on the root `Timegroup` automatically enables the workbench UI:

```tsx
import { Timegroup, Video, Text } from "@editframe/react";

export const Video = () => {
  return (
    <Timegroup
      workbench  // Enables workbench UI
      mode="sequence"
      className="w-[1920px] h-[1080px] bg-black"
    >
      <Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
        <Video src="/assets/intro.mp4" className="size-full" />
        <Text duration="5s" className="text-white text-4xl">Title</Text>
      </Timegroup>
    </Timegroup>
  );
};
```

## Workbench Layout

The workbench provides a three-panel layout:

- **Canvas** (center) - Preview with pan/zoom controls
- **Hierarchy** (left sidebar) - Layer panel showing composition structure
- **Timeline** (bottom) - Playback controls and timeline visualization

## Slots

### canvas

Main preview area. Should contain a timegroup wrapped in `ef-pan-zoom` and `ef-fit-scale`:

```html
<ef-pan-zoom slot="canvas">
  <ef-fit-scale>
    <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
      <!-- composition content -->
    </ef-timegroup>
  </ef-fit-scale>
</ef-pan-zoom>
```

### hierarchy

Left sidebar for layer management:

```html
<ef-hierarchy slot="hierarchy"></ef-hierarchy>
```

### timeline

Bottom panel for playback controls and timeline:

```html
<div slot="timeline" class="flex flex-col">
  <ef-controls class="border-b">
    <!-- playback controls -->
  </ef-controls>
  <ef-filmstrip class="flex-1"></ef-filmstrip>
</div>
```

## Standalone Workbench Component

Use `Workbench` component for custom layouts:

```tsx
import { Preview, Controls, Workbench } from "@editframe/react";

export const Editor = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top: Preview */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
        <Preview className="max-w-[1280px] w-full aspect-video bg-black" />
      </div>

      {/* Middle: Controls */}
      <div className="px-4 py-2 bg-gray-800">
        <Controls />
      </div>

      {/* Bottom: Timeline */}
      <div className="h-80 border-t border-gray-700">
        <Workbench className="w-full h-full" />
      </div>
    </div>
  );
};
```

## Features

The workbench provides:

- **Timeline view** - Visual timeline with all elements
- **Hierarchy view** - Tree structure of your composition
- **Playhead scrubbing** - Click timeline to seek
- **Element selection** - Click elements to select
- **Duration visualization** - See timing of all elements

## Preview Modes

Workbench supports two preview rendering modes:

- **DOM mode** (default) - Shows the real timegroup DOM directly
- **Canvas mode** - Renders to canvas each frame for consistent output

Toggle modes via the toolbar settings button.
The workbench supports different preview rendering modes:

```tsx
import { setPreviewPresentationMode, getPreviewPresentationMode } from "@editframe/react";

// Set DOM mode (default) - shows original DOM content
setPreviewPresentationMode("dom");

// Set Canvas mode - renders to canvas using active rendering path
setPreviewPresentationMode("canvas");

// Get current mode
const mode = getPreviewPresentationMode(); // "dom" | "canvas"
```

### DOM Mode

Shows the original DOM content directly. This is the default and recommended for most use cases:

```tsx
import { setPreviewPresentationMode } from "@editframe/react";

setPreviewPresentationMode("dom");
```

### Canvas Mode

Renders to canvas using the active rendering path. Useful for testing how content will appear in the final render:

```tsx
import { setPreviewPresentationMode } from "@editframe/react";

setPreviewPresentationMode("canvas");
```

## Render Mode

When `rendering="true"`, workbench hides the UI and shows only the canvas. Used for server-side rendering:

```html
<ef-workbench rendering>
  <ef-timegroup slot="canvas" mode="contain">
    <!-- composition -->
  </ef-timegroup>
</ef-workbench>
```
The `rendering` property indicates when the composition is in render mode (used by CLI/export flows):

```tsx
import { Timegroup } from "@editframe/react";

<Timegroup
  workbench
  rendering={isExporting}  // Set to true during export
  mode="sequence"
  className="w-[1920px] h-[1080px]"
>
  {/* Composition */}
</Timegroup>
```

When `rendering={true}`:
- The workbench UI is hidden
- The composition is optimized for export
- Frame generation is enabled
- Used by CLI tools and server-side rendering

## Export

Click the Export button in the toolbar to render the composition to video. Configure export settings in the popup:

- **Scale** - Resolution multiplier (25%, 50%, 75%, 100%)
- **Audio** - Include audio tracks
- **Range** - Export full duration or custom in/out range

Export uses browser WebCodecs API for local rendering. Progress updates show:
- Current frame / total frames
- Elapsed time / total duration
- Render speed multiplier
- Estimated time remaining
- Live preview thumbnail

## Theme

Workbench respects system theme by default. Toggle between light, dark, and system modes via the toolbar button.

## Performance Stats

Enable the performance overlay via toolbar settings to see:
- **FPS** - Actual frame rate
- **Render** - Average render time per frame (canvas mode)
- **Headroom** - Time budget remaining (canvas mode)
- **Resolution** - Current render resolution
- **Scale** - Resolution scale percentage (canvas mode)
- **CPU** - Compute pressure state
- **State** - Motion state (playing, scrubbing, or at rest)

Auto resolution mode dynamically adjusts render resolution during playback to maintain smooth performance.

## Fit to Content

Click the fit-to-content button in the toolbar to reset zoom and center the composition.

## Full Editor Layout

```tsx
import {
  Configuration,
  Preview,
  Controls,
  Workbench,
  Timegroup,
  Video,
  Audio,
  Text
} from "@editframe/react";

export const FullEditor = () => {
  return (
    <Configuration mediaEngine="local">
      <div className="h-screen flex flex-col bg-gray-950">
        {/* Header */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4">
          <h1 className="text-white text-xl font-bold">Video Editor</h1>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Preview area */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
            <Preview className="max-w-[1280px] w-full aspect-video bg-black rounded-lg shadow-2xl" />
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border-y border-gray-700">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <Controls />
            </div>
          </div>

          {/* Timeline */}
          <div className="h-80 bg-gray-900 border-t border-gray-800">
            <Workbench className="w-full h-full" />
          </div>
        </div>

        {/* Hidden composition */}
        <div className="hidden">
          <Timegroup workbench mode="sequence" className="w-[1920px] h-[1080px]">
            <Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
              <Video src="/assets/video.mp4" className="size-full object-cover" />
              <Text duration="5s" className="absolute top-8 text-white text-4xl">
                Title
              </Text>
              <Audio src="/assets/music.mp3" volume={0.3} />
            </Timegroup>
          </Timegroup>
        </div>
      </div>
    </Configuration>
  );
};
```

## Resizable Timeline

```tsx
import { useState } from "react";

export const ResizableEditor = () => {
  const [timelineHeight, setTimelineHeight] = useState(320);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <Preview className="w-full h-full" />
      </div>

      <div style={{ height: `${timelineHeight}px` }} className="border-t">
        <Workbench className="w-full h-full" />
      </div>
    </div>
  );
};
```

## Side-by-Side Layout

```tsx
export const SideBySideEditor = () => {
  return (
    <div className="h-screen grid grid-cols-2">
      {/* Left: Preview & Controls */}
      <div className="flex flex-col">
        <Preview className="flex-1 bg-black" />
        <Controls className="bg-gray-800 p-4" />
      </div>

      {/* Right: Timeline */}
      <div className="border-l border-gray-700">
        <Workbench className="w-full h-full" />
      </div>
    </div>
  );
};
```

## Notes

- The `workbench` prop on root `Timegroup` enables automatic UI
- Use `Workbench` component for custom layouts
- Timeline shows all elements and their timing
- Hierarchy shows nested structure
- Interactive scrubbing and element selection
- Preview modes are persisted to localStorage
- `rendering` state is typically controlled by export/CLI workflows
