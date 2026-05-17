---
description: "Button component that toggles loop playback on and off, with visual state reflecting whether the composition will loop."
---


# ef-toggle-loop

## Attributes

- **target** (string) - ID of the element to control (optional if nested in composition)

# ToggleLoop

Button to toggle loop playback. Shows different content based on loop state.
Button to toggle looping playback on and off.

## Import

```tsx
import { ToggleLoop } from "@editframe/react";
```

## Basic Usage

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="size-full object-contain"></ef-video>

  <div class="absolute bottom-4 left-4 flex gap-2">
    <ef-toggle-play>
      <button slot="play" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">▶</button>
      <button slot="pause" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">⏸</button>
    </ef-toggle-play>

    <ef-toggle-loop>
      <button slot="on" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">🔁 Loop On</button>
      <button slot="off" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">🔁 Loop Off</button>
    </ef-toggle-loop>
  </div>
</ef-timegroup>
```
```tsx
import { ToggleLoop, Preview } from "@editframe/react";

<div className="flex flex-col gap-2">
  <Preview className="w-full h-[600px]" />

  <ToggleLoop>
    <button slot="off" className="px-4 py-2 bg-gray-600 text-white rounded">
      Enable Loop
    </button>
    <button slot="on" className="px-4 py-2 bg-blue-600 text-white rounded">
      Disable Loop
    </button>
  </ToggleLoop>
</div>
```

## Slots

### on

Content shown when loop is enabled. Clicking disables loop.

### off

Content shown when loop is disabled. Clicking enables loop.
### Named Slots

ToggleLoop uses named slots to display different content based on loop state:

- `slot="off"` - Displayed when looping is disabled
- `slot="on"` - Displayed when looping is enabled

The component automatically switches between the two based on the current loop state.

## Icon-Only Toggle

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="size-full object-contain"></ef-video>

  <div class="absolute top-4 right-4 flex gap-2">
    <ef-toggle-loop>
      <button slot="on" class="w-10 h-10 rounded-full bg-green-600/80 backdrop-blur flex items-center justify-center text-white hover:bg-green-600">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 1l4 4-4 4"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <path d="M7 23l-4-4 4-4"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
      </button>
      <button slot="off" class="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white/60 hover:bg-black/80">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 1l4 4-4 4"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <path d="M7 23l-4-4 4-4"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
      </button>
    </ef-toggle-loop>
  </div>
</ef-timegroup>
```
Simple icon button:

```tsx
<ToggleLoop className="w-10 h-10">
  <button
    slot="off"
    className="w-full h-full rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 17H7V14L3 18L7 22V19H19V13H17M7 7H17V10L21 6L17 2V5H5V11H7V7Z"/>
    </svg>
  </button>
  <button
    slot="on"
    className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 17H7V14L3 18L7 22V19H19V13H17M7 7H17V10L21 6L17 2V5H5V11H7V7Z"/>
    </svg>
  </button>
</ToggleLoop>
```

## Compact Toggle

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="size-full object-contain"></ef-video>

  <ef-toggle-loop class="absolute top-4 left-4">
    <button slot="on" class="px-3 py-1 text-xs bg-green-600 text-white rounded-full font-semibold hover:bg-green-700">
      Loop: ON
    </button>
    <button slot="off" class="px-3 py-1 text-xs bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700">
      Loop: OFF
    </button>
  </ef-toggle-loop>
</ef-timegroup>
```

## With ef-controls

Use with `ef-controls` to control a non-ancestor element:

```html
<ef-timegroup id="my-video" mode="contain" class="w-full h-96">
  <ef-video src="video.mp4" sourceout="3s" class="size-full"></ef-video>
</ef-timegroup>

<ef-controls target="my-video" class="flex gap-2">
  <ef-toggle-play>
    <button slot="play">Play</button>
    <button slot="pause">Pause</button>
  </ef-toggle-play>

  <ef-toggle-loop>
    <button slot="on">Loop: ON</button>
    <button slot="off">Loop: OFF</button>
  </ef-toggle-loop>
</ef-controls>
```

## Target Attribute

Directly target an element by ID without `ef-controls`:

```html
<ef-timegroup id="video-1" mode="contain">
  <ef-video src="video.mp4"></ef-video>
</ef-timegroup>

<ef-toggle-loop target="video-1">
  <button slot="on">Loop ON</button>
  <button slot="off">Loop OFF</button>
</ef-toggle-loop>
```

## In Control Bar

Use in a horizontal control bar with other playback controls:

```tsx
import { TogglePlay, ToggleLoop, Scrubber, TimeDisplay } from "@editframe/react";

export const ControlBar = () => {
  return (
    <div className="bg-gray-800 p-3 flex items-center gap-4">
      <TogglePlay>
        <button slot="play" className="w-8 h-8 text-white">▶</button>
        <button slot="pause" className="w-8 h-8 text-white">⏸</button>
      </TogglePlay>

      <TimeDisplay className="text-white text-sm font-mono" />
      <Scrubber className="flex-1" />

      <ToggleLoop>
        <button
          slot="off"
          className="w-8 h-8 text-gray-400 hover:text-white transition"
          title="Enable loop"
        >
          🔁
        </button>
        <button
          slot="on"
          className="w-8 h-8 text-blue-400 hover:text-blue-300 transition"
          title="Disable loop"
        >
          🔁
        </button>
      </ToggleLoop>
    </div>
  );
};
```

## Styled Toggle

Custom styled button with state indication:

```tsx
<ToggleLoop>
  <button
    slot="off"
    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
  >
    <span className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
        <path d="M17 17H7V14L3 18L7 22V19H19V13H17M7 7H17V10L21 6L17 2V5H5V11H7V7Z"/>
      </svg>
      <span>Loop Off</span>
    </span>
  </button>
  <button
    slot="on"
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
  >
    <span className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 17H7V14L3 18L7 22V19H19V13H17M7 7H17V10L21 6L17 2V5H5V11H7V7Z"/>
      </svg>
      <span>Loop On</span>
    </span>
  </button>
</ToggleLoop>
```

## Minimal Toggle

Compact toggle for tight spaces:

```tsx
<ToggleLoop className="text-sm">
  <span slot="off" className="text-gray-400 cursor-pointer hover:text-white">
    Loop: Off
  </span>
  <span slot="on" className="text-blue-400 cursor-pointer hover:text-blue-300">
    Loop: On
  </span>
</ToggleLoop>
```

## With Custom Icons

Use any icon library:

```tsx
import { ToggleLoop } from "@editframe/react";
import { Repeat } from "lucide-react";

<ToggleLoop>
  <button
    slot="off"
    className="text-gray-400 hover:text-white transition"
  >
    <Repeat size={24} strokeWidth={1.5} />
  </button>
  <button
    slot="on"
    className="text-blue-400 hover:text-blue-300 transition"
  >
    <Repeat size={24} strokeWidth={2} />
  </button>
</ToggleLoop>
```

## Text-Only Toggle

Simple text button:

```tsx
<ToggleLoop>
  <button
    slot="off"
    className="px-3 py-1 text-sm text-gray-400 hover:text-white"
  >
    Enable Looping
  </button>
  <button
    slot="on"
    className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 font-semibold"
  >
    Looping Enabled
  </button>
</ToggleLoop>
```

## Badge Style Toggle

Display as a status badge:

```tsx
<ToggleLoop>
  <div
    slot="off"
    className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full cursor-pointer hover:bg-gray-600"
  >
    Loop: OFF
  </div>
  <div
    slot="on"
    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full cursor-pointer hover:bg-blue-700 shadow-md"
  >
    Loop: ON
  </div>
</ToggleLoop>
```

## Full Player Controls

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="size-full object-contain"></ef-video>

  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 p-4">
    <ef-scrubber class="h-1 bg-white/20 rounded-full mb-3"></ef-scrubber>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ef-toggle-play>
          <button slot="play" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button slot="pause" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
            </svg>
          </button>
        </ef-toggle-play>

        <ef-time-display class="text-white text-xs font-mono"></ef-time-display>
      </div>

      <ef-toggle-loop>
        <button slot="on" class="w-9 h-9 rounded-full bg-green-600/80 flex items-center justify-center text-white hover:bg-green-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
        <button slot="off" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-white/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
      </ef-toggle-loop>
    </div>
  </div>
</ef-timegroup>
```
Complete video editor with loop control:

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
            <button slot="play" className="w-10 h-10 text-white hover:text-blue-400">
              ▶
            </button>
            <button slot="pause" className="w-10 h-10 text-white hover:text-gray-400">
              ⏸
            </button>
          </TogglePlay>

          <TimeDisplay className="text-white text-sm font-mono min-w-[120px]" />

          <div className="flex-1">
            <Scrubber className="w-full h-2" />
          </div>

          <ToggleLoop>
            <button
              slot="off"
              className="w-10 h-10 text-gray-400 hover:text-white transition"
              title="Enable loop"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 17H7V14L3 18L7 22V19H19V13H17M7 7H17V10L21 6L17 2V5H5V11H7V7Z"/>
              </svg>
            </button>
            <button
              slot="on"
              className="w-10 h-10 text-green-400 hover:text-green-300 transition"
              title="Disable loop"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 17H7V14L3 18L7 22V19H19V13H17M7 7H17V10L21 6L17 2V5H5V11H7V7Z"/>
              </svg>
            </button>
          </ToggleLoop>
        </div>
      </div>
    </div>
  );
};
```

## State Indicator Badge

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="size-full object-contain"></ef-video>

  <ef-toggle-loop class="absolute bottom-4 right-4">
    <button slot="on" class="flex items-center gap-2 px-4 py-2 bg-green-600/90 backdrop-blur text-white rounded-full hover:bg-green-600 transition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
      <span class="text-sm font-semibold">Looping</span>
    </button>
    <button slot="off" class="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur text-white/70 rounded-full hover:bg-black/80 transition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
      <span class="text-sm font-semibold">Loop Off</span>
    </button>
  </ef-toggle-loop>
</ef-timegroup>
```

## Minimal Text Toggle

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="size-full object-contain"></ef-video>

  <ef-toggle-loop class="absolute top-4 right-4">
    <button slot="on" class="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700">
      ✓ LOOP
    </button>
    <button slot="off" class="px-3 py-1.5 bg-gray-700 text-gray-400 rounded text-xs font-bold hover:bg-gray-600">
      LOOP
    </button>
  </ef-toggle-loop>
</ef-timegroup>
```

## Corner Loop Indicator

Display loop state in corner:

```tsx
import { Timegroup, Video, ToggleLoop } from "@editframe/react";

<Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative">
  <Video src="/assets/video.mp4" className="size-full" />

  <ToggleLoop className="absolute top-4 right-4">
    <button
      slot="off"
      className="px-3 py-1 bg-black/50 backdrop-blur text-white/50 text-xs rounded hover:bg-black/70"
    >
      Loop
    </button>
    <button
      slot="on"
      className="px-3 py-1 bg-blue-600 backdrop-blur text-white text-xs rounded hover:bg-blue-700 font-semibold"
    >
      Loop ✓
    </button>
  </ToggleLoop>
</Timegroup>
```

## Settings Panel Toggle

Use in a settings panel:

```tsx
<div className="bg-gray-800 p-4 rounded-lg">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-white font-semibold">Loop Playback</h3>
      <p className="text-gray-400 text-sm">Repeat video when it ends</p>
    </div>

    <ToggleLoop>
      <button
        slot="off"
        className="w-12 h-6 bg-gray-600 rounded-full relative"
      >
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
      </button>
      <button
        slot="on"
        className="w-12 h-6 bg-blue-600 rounded-full relative"
      >
        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
      </button>
    </ToggleLoop>
  </div>
</div>
```

## Accessibility

Ensure proper labels that update with state:

```tsx
<ToggleLoop>
  <button slot="off" aria-label="Enable loop playback" className="w-10 h-10">
    <svg aria-hidden="true">...</svg>
  </button>
  <button slot="on" aria-label="Disable loop playback" className="w-10 h-10">
    <svg aria-hidden="true">...</svg>
  </button>
</ToggleLoop>
```

## Use Cases

- **Short videos** - Loop a short clip continuously
- **Product demos** - Let users watch the demo repeatedly
- **Animated backgrounds** - Seamlessly loop background videos
- **GIF replacements** - Loop video content like animated GIFs
Loop control is useful for:
- Video previews that should repeat
- Tutorial videos that users can watch multiple times
- Background video content
- Testing and development workflows
- Short animations that benefit from looping
