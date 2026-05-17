---
description: "Context bridge that routes playback control actions to non-ancestor timeline elements in complex, nested editor layouts."
---


# ef-controls

## Attributes

- **target** (string) (required) - ID of the target element to control

# Controls

Bridges playback contexts from a target element to its children, enabling controls that don't share a common ancestor with the composition.
Playback controls for timeline navigation.

## Import

```tsx
import { Controls } from "@editframe/react";
```

## Individual Control Components

```tsx
import {
  Play,
  Pause,
  TogglePlay,
  ToggleLoop,
  Scrubber,
  TimeDisplay,
} from "@editframe/react";
```

## Basic Usage

Control a composition from outside its DOM tree:

```html
<ef-timegroup id="my-composition" mode="sequence" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>

<ef-controls target="my-composition" class="flex gap-2 mt-4">
  <ef-toggle-play>
    <button slot="play" class="px-4 py-2 bg-blue-600 text-white rounded">Play</button>
    <button slot="pause" class="px-4 py-2 bg-gray-600 text-white rounded">Pause</button>
  </ef-toggle-play>
  <ef-time-display class="text-gray-300"></ef-time-display>
</ef-controls>
```
```tsx
import { Controls, Preview } from "@editframe/react";

<div className="flex flex-col">
  <Preview className="w-full h-[600px]" />
  <Controls className="w-full bg-gray-800 p-2" />
</div>
```

## Context Bridging

`ef-controls` provides these contexts to its children:

- **playing** - Current playback state (boolean)
- **loop** - Loop state (boolean)
- **currentTimeMs** - Current playhead position (number)
- **durationMs** - Total duration (number)
- **targetTemporal** - Reference to the controlled element
- **focusedElement** - Currently focused element

Child elements like `ef-play`, `ef-pause`, `ef-toggle-play`, `ef-scrubber`, and `ef-time-display` automatically consume these contexts.

## Non-Adjacent Controls

Use `ef-controls` when your playback controls are not descendants of the composition:

```html
<!-- Composition in one part of the page -->
<div class="video-area">
  <ef-timegroup id="video-player" mode="contain" class="w-full aspect-video">
    <ef-video src="video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</div>

<!-- Controls in a fixed toolbar -->
<div class="fixed bottom-0 left-0 right-0 bg-black p-4">
  <ef-controls target="video-player" class="flex justify-center gap-4">
    <ef-toggle-play>
      <button slot="play">▶</button>
      <button slot="pause">⏸</button>
    </ef-toggle-play>
    <ef-scrubber class="flex-1"></ef-scrubber>
    <ef-time-display></ef-time-display>
  </ef-controls>
</div>
```

## Target Types

`ef-controls` supports targeting:

- **ef-timegroup** - Control a composition directly
- **ef-video** - Control a single video element
- **ef-audio** - Control a single audio element
- **ef-preview** - Control via preview's context (if preview wraps the target)

## Multiple Control Sets

Multiple `ef-controls` elements can target the same composition:

```html
<ef-timegroup id="main" mode="contain">
  <!-- composition -->
</ef-timegroup>

<!-- Desktop controls -->
<ef-controls target="main" class="desktop-only">
  <ef-toggle-play>
    <button slot="play">Play</button>
    <button slot="pause">Pause</button>
  </ef-toggle-play>
</ef-controls>

<!-- Mobile controls -->
<ef-controls target="main" class="mobile-only">
  <ef-toggle-play>
    <button slot="play">▶</button>
    <button slot="pause">⏸</button>
  </ef-toggle-play>
</ef-controls>
```

## Without ef-controls

If controls are direct descendants of a timegroup, you don't need `ef-controls`:

```html
<ef-timegroup mode="contain">
  <ef-video src="video.mp4"></ef-video>

  <!-- These controls work without ef-controls because they're descendants -->
  <div class="absolute bottom-4 left-4 flex gap-2">
    <ef-toggle-play>
      <button slot="play">Play</button>
      <button slot="pause">Pause</button>
    </ef-toggle-play>
  </div>
</ef-timegroup>
```

Use `ef-controls` when the target is **not** an ancestor of the control elements.

## Individual Controls

Build custom control layouts:

```tsx
import { TogglePlay, ToggleLoop, Scrubber, TimeDisplay } from "@editframe/react";

<div className="flex items-center gap-4 bg-gray-800 p-4">
  <TogglePlay className="w-10 h-10" />
  <TimeDisplay className="text-white text-sm font-mono" />
  <Scrubber className="flex-1" />
  <ToggleLoop className="w-10 h-10" />
</div>
```

## Styled Controls

```tsx
<div className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg shadow-lg">
  <TogglePlay className="text-white hover:text-blue-400 transition" />
  <Scrubber className="flex-1 h-2" />
  <TimeDisplay className="text-white text-xs font-mono bg-black/30 px-2 py-1 rounded" />
  <ToggleLoop className="text-white hover:text-green-400 transition" />
</div>
```

## Full Editor Controls

```tsx
import {
  Preview,
  TogglePlay,
  ToggleLoop,
  Scrubber,
  TimeDisplay
} from "@editframe/react";

export const VideoEditor = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Preview className="w-full max-w-[1280px] aspect-video bg-black rounded-lg" />
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-4 px-6 py-3">
          {/* Play/Pause */}
          <TogglePlay className="w-8 h-8 text-white hover:text-blue-400" />

          {/* Time Display */}
          <TimeDisplay className="text-white text-sm font-mono min-w-[120px]" />

          {/* Scrubber */}
          <div className="flex-1">
            <Scrubber className="w-full h-2" />
          </div>

          {/* Loop Toggle */}
          <ToggleLoop className="w-8 h-8 text-white hover:text-green-400" />
        </div>
      </div>
    </div>
  );
};
```

## Minimal Controls

```tsx
<div className="flex items-center gap-2 p-2 bg-black/80 rounded">
  <TogglePlay className="w-6 h-6 text-white" />
  <Scrubber className="flex-1" />
</div>
```

## Scrubber Component

The timeline scrubber for seeking:

```tsx
import { Scrubber } from "@editframe/react";

<Scrubber
  className="w-full h-2 bg-gray-700 rounded cursor-pointer"
/>
```

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--ef-scrubber-height` | `4px` | Track height |
| `--ef-scrubber-background` | `rgba(255, 255, 255, 0.2)` | Track background color |
| `--ef-scrubber-progress-color` | `#fff` | Progress bar and handle color |
| `--ef-scrubber-handle-size` | `12px` | Handle diameter |

### CSS Shadow Parts

Style internal elements from the outside using `::part()`:

| Part | Description |
|------|-------------|
| `scrubber` | The track container |
| `progress` | The filled progress bar |
| `handle` | The draggable seek handle |

```tsx
<Scrubber
  className={`
    w-full h-1.5 bg-white/20 rounded-full cursor-pointer
    [&::part(progress)]:bg-red-500
    [&::part(progress)]:rounded-full
    [&::part(handle)]:bg-white
    [&::part(handle)]:w-3
    [&::part(handle)]:h-3
    [&::part(handle)]:rounded-full
  `}
/>
```

## TimeDisplay Component

Shows current time and duration:

```tsx
import { TimeDisplay } from "@editframe/react";

<TimeDisplay className="text-white text-sm font-mono" />
// Displays: "00:05 / 00:30"
```

## TogglePlay Component

Play/pause button:

```tsx
import { TogglePlay } from "@editframe/react";

<TogglePlay className="w-10 h-10 text-white hover:text-blue-400" />
```

## ToggleLoop Component

Enable/disable looping:

```tsx
import { ToggleLoop } from "@editframe/react";

<ToggleLoop className="w-10 h-10 text-white hover:text-green-400" />
```

## Custom Control Bar

```tsx
const CustomControls = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Scrubber on top */}
        <Scrubber className="w-full h-1 mb-4" />

        {/* Buttons below */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TogglePlay className="w-12 h-12 text-white" />
            <TimeDisplay className="text-white text-lg font-mono" />
          </div>

          <ToggleLoop className="w-10 h-10 text-white" />
        </div>
      </div>
    </div>
  );
};
```
