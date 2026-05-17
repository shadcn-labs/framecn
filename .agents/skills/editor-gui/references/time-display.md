---
description: "Formatted time display showing current playback position and total duration, with configurable frame rate and format options."
---


# ef-time-display

## Attributes

- **target** (string) - ID of target temporal element to display time from
- **current-time-ms** (number) - Current time in milliseconds (overrides context)
- **duration-ms** (number) - Total duration in milliseconds (overrides context)

# TimeDisplay

Formatted time display showing current playback time and total duration in "M:SS / M:SS" format.

## Import

```tsx
import { TimeDisplay } from "@editframe/react";
```

Also available: `TimeDisplayProps` type for TypeScript.

## Basic Usage

Display time from a target element.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="time-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<div class="flex gap-4 items-center p-4 bg-gray-900 rounded-lg mt-4">
  <ef-controls target="time-demo">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  </ef-controls>
  <ef-time-display target="time-demo" class="text-white text-lg font-mono"></ef-time-display>
</div>
```
```tsx
import { Preview, TimeDisplay } from "@editframe/react";

<div className="flex flex-col gap-2">
  <Preview className="w-full h-[600px]" />
  <TimeDisplay className="text-white text-sm font-mono" />
</div>
```

The time display automatically connects to the nearest timeline context via Preview or Controls.

## Within Controls Context

Time display automatically reads from parent `ef-controls` context.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="context-demo">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<ef-controls target="context-demo" class="flex gap-4 items-center p-4 bg-gray-900 rounded-lg mt-4">
  <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  <ef-time-display class="text-white text-lg font-mono"></ef-time-display>
  <ef-scrubber class="flex-1"></ef-scrubber>
</ef-controls>
```

## Display Format

TimeDisplay shows time in `M:SS / M:SS` format:
- Minutes without leading zero
- Seconds with leading zero
- Current time followed by duration

Examples:
- `0:00 / 0:10` — 0 seconds of 10 seconds
- `1:05 / 2:30` — 1 minute 5 seconds of 2 minutes 30 seconds
- `12:00 / 15:45` — 12 minutes of 15 minutes 45 seconds

## In Control Bar

Typical control bar layout:

```tsx
import { TogglePlay, Scrubber, TimeDisplay } from "@editframe/react";

export const ControlBar = () => {
  return (
    <div className="bg-gray-800 p-4 flex items-center gap-4">
      <TogglePlay>
        <button slot="play" className="w-10 h-10 text-white">▶</button>
        <button slot="pause" className="w-10 h-10 text-white">⏸</button>
      </TogglePlay>

      <TimeDisplay className="text-white text-sm font-mono" />
      <Scrubber className="flex-1 h-2" />
    </div>
  );
};
```

## Custom Styling

Style the time display using standard CSS or the `time` part.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="styled-time">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<ef-controls target="styled-time" class="flex gap-4 items-center p-4 bg-gray-900 rounded-lg mt-4">
  <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
  <ef-time-display id="styled-display" class="px-4 py-2 bg-gray-800 rounded-lg"></ef-time-display>
</ef-controls>

<style>
  #styled-display::part(time) {
    font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #60a5fa;
    letter-spacing: 1px;
  }
</style>
```
Style the time display:

```tsx
<TimeDisplay className="text-white text-sm font-mono bg-black/30 px-2 py-1 rounded" />
```

## With Custom Colors

```tsx
<TimeDisplay className="text-blue-400 text-lg font-mono font-semibold" />
```

## Compact Display

Minimal time display:

```tsx
<TimeDisplay className="text-xs text-gray-400 font-mono" />
```

## Large Display

Prominent time display:

```tsx
<TimeDisplay className="text-2xl font-mono text-white font-bold tracking-wide" />
```

## With Background

Add background for better readability:

```tsx
<TimeDisplay className="text-white text-sm font-mono bg-gray-900 px-3 py-1.5 rounded-lg shadow-lg" />
```

## With Timeline Controls

Time display works seamlessly with other timeline controls.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black" id="full-controls">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
<ef-controls target="full-controls" class="flex flex-col gap-3 p-4 bg-gray-900 rounded-lg mt-4">
  <div class="flex gap-3 items-center">
    <ef-toggle-play class="px-3 py-1 bg-blue-600 text-white rounded"></ef-toggle-play>
    <ef-toggle-loop class="px-3 py-1 bg-gray-700 text-white rounded"></ef-toggle-loop>
    <ef-time-display class="text-white font-mono ml-auto"></ef-time-display>
  </div>
  <ef-scrubber></ef-scrubber>
</ef-controls>
```

## Standalone Usage

Provide explicit time values without a target.

```html
<ef-time-display
  current-time-ms="45000"
  duration-ms="180000"
  class="text-white font-mono"
></ef-time-display>
<!-- Displays: 0:45 / 3:00 -->
```
Override context with manual time values:

```tsx
<TimeDisplay
  currentTimeMs={5000}
  durationMs={30000}
  className="text-white text-sm font-mono"
/>
// Displays: "0:05 / 0:30"
```

This is useful for displaying time outside of a timeline context.

## CSS Custom Properties

Control appearance through CSS variables:

```css
ef-time-display {
  --ef-font-family: system-ui;
  --ef-font-size-xs: 0.75rem;
  --ef-text-color: white;
}
```

## In Corner Overlay

Position time display over video:

```tsx
import { Timegroup, Video, TimeDisplay } from "@editframe/react";

<Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative">
  <Video src="/assets/video.mp4" className="size-full object-contain" />

  <TimeDisplay className="absolute top-4 right-4 text-white text-sm font-mono bg-black/50 backdrop-blur px-3 py-1 rounded" />
</Timegroup>
```

## Centered Below Video

```tsx
import { Timegroup, Video, TimeDisplay } from "@editframe/react";

<div className="flex flex-col items-center gap-2">
  <Timegroup mode="contain" className="w-[720px] h-[480px] bg-black">
    <Video src="/assets/video.mp4" className="size-full object-contain" />
  </Timegroup>

  <TimeDisplay className="text-gray-300 text-base font-mono" />
</div>
```

## Full Editor Example

Complete video editor with time display:

```tsx
import {
  Preview,
  TogglePlay,
  ToggleLoop,
  Scrubber,
  TimeDisplay,
} from "@editframe/react";

export const VideoEditor = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="flex-1 flex items-center justify-center p-8">
        <Preview className="w-full max-w-[1280px] aspect-video bg-black rounded-lg" />
      </div>

      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <TogglePlay>
            <button slot="play" className="w-8 h-8 text-white hover:text-blue-400">
              ▶
            </button>
            <button slot="pause" className="w-8 h-8 text-white hover:text-gray-400">
              ⏸
            </button>
          </TogglePlay>

          <TimeDisplay className="text-white text-sm font-mono min-w-[120px]" />

          <div className="flex-1">
            <Scrubber className="w-full h-2" />
          </div>

          <ToggleLoop>
            <button slot="off" className="w-8 h-8 text-gray-400 hover:text-white">
              🔁
            </button>
            <button slot="on" className="w-8 h-8 text-green-400 hover:text-green-300">
              🔁
            </button>
          </ToggleLoop>
        </div>
      </div>
    </div>
  );
};
```

## Minimal Controls

Compact control layout:

```tsx
<div className="flex items-center gap-2 p-2 bg-black/80 rounded">
  <TogglePlay className="w-6 h-6 text-white">
    <button slot="play">▶</button>
    <button slot="pause">⏸</button>
  </TogglePlay>
  <TimeDisplay className="text-white text-xs font-mono" />
  <Scrubber className="flex-1 h-1" />
</div>
```

## With Custom Font

Use a custom monospace font:

```tsx
<TimeDisplay
  className="text-white text-sm"
  style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
/>
```

## Gradient Text

Styled with gradient:

```tsx
<TimeDisplay className="text-lg font-mono font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" />
```

## Side by Side Layout

Display controls horizontally:

```tsx
<div className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg">
  <TogglePlay className="shrink-0">
    <button slot="play" className="w-8 h-8 text-white">▶</button>
    <button slot="pause" className="w-8 h-8 text-white">⏸</button>
  </TogglePlay>

  <TimeDisplay className="shrink-0 text-white text-sm font-mono" />

  <Scrubber className="flex-1 h-2" />
</div>
```

## Stacked Layout

Display controls vertically:

```tsx
<div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
  <div className="flex items-center justify-between">
    <TogglePlay>
      <button slot="play" className="w-10 h-10 text-white">▶</button>
      <button slot="pause" className="w-10 h-10 text-white">⏸</button>
    </TogglePlay>

    <TimeDisplay className="text-white text-sm font-mono" />
  </div>

  <Scrubber className="w-full h-2" />
</div>
```

## With Preview Component

Use inside Preview wrapper:

```tsx
import { Preview, TimeDisplay } from "@editframe/react";

<div className="relative">
  <Preview className="w-full h-[600px]" />

  <div className="absolute bottom-4 left-4 right-4">
    <TimeDisplay className="text-white text-base font-mono bg-black/60 backdrop-blur px-4 py-2 rounded-lg text-center" />
  </div>
</div>
```

The Preview component provides context that TimeDisplay automatically consumes.

## CSS Shadow Parts

Style the internal time element using `::part()`:

```tsx
<TimeDisplay
  className={`
    font-mono
    [&::part(time)]:text-blue-400
    [&::part(time)]:font-bold
  `}
/>
```

### Available Part

| Part | Description |
|------|-------------|
| `time` | The time text element |

## TypeScript Types

```tsx
import type { TimeDisplayProps } from "@editframe/react";

const timeDisplayConfig: TimeDisplayProps = {
  currentTimeMs: 5000,
  durationMs: 30000,
  className: "text-white font-mono",
};
```

## Accessibility

The time display is readable by screen readers.
The time display is read by screen readers. For enhanced accessibility, consider adding a label:

```tsx
<div role="status" aria-label="Video playback time">
  <TimeDisplay className="text-white text-sm font-mono" />
</div>
```

## Edge Cases

TimeDisplay handles edge cases gracefully:
- `NaN` or `undefined` values show as `0:00 / 0:00`
- Negative values show as `0:00`
- Very long durations work correctly (e.g., `45:30` for 45.5 minutes)
- Updates smoothly during playback without flickering
