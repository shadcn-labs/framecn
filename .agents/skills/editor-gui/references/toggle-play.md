---
description: Combined play/pause toggle button that switches between play and pause states with configurable icons and labels.
---


# ef-toggle-play

## Attributes

- **target** (string) - ID of the element to control (optional if nested in composition)

# TogglePlay

Combined play/pause button that toggles playback and switches content based on state.
Single button that toggles between play and pause states.

## Import

```tsx
import { TogglePlay } from "@editframe/react";
```

## Basic Usage

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-toggle-play class="absolute bottom-4 left-4">
    <button slot="play" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
      ▶ Play
    </button>
    <button slot="pause" class="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700">
      ⏸ Pause
    </button>
  </ef-toggle-play>
</ef-timegroup>
```
```tsx
import { TogglePlay, Timegroup, Video } from "@editframe/react";

<Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative">
  <Video src="/assets/video.mp4" className="size-full object-contain" />

  <TogglePlay className="absolute bottom-4 left-4">
    <button slot="play" className="px-4 py-2 bg-blue-600 text-white rounded">
      ▶ Play
    </button>
    <button slot="pause" className="px-4 py-2 bg-gray-600 text-white rounded">
      ⏸ Pause
    </button>
  </TogglePlay>
</Timegroup>
```

## Slots

### play

Content shown when paused. Clicking starts playback.

### pause

Content shown when playing. Clicking pauses playback.
### Named Slots

TogglePlay uses named slots to display different content based on playback state:

- `slot="play"` - Displayed when paused
- `slot="pause"` - Displayed when playing

The component automatically switches between the two based on the current playback state.

## Icon-Only Toggle

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-toggle-play class="absolute inset-0 flex items-center justify-center">
    <button slot="play" class="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
    <button slot="pause" class="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </ef-toggle-play>
</ef-timegroup>
```
Simple icon button that changes on click:

```tsx
<TogglePlay className="w-10 h-10">
  <button
    slot="play"
    className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  </button>
  <button
    slot="pause"
    className="w-full h-full rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
    </svg>
  </button>
</TogglePlay>
```

## Compact Toggle

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-toggle-play class="absolute bottom-4 left-4">
    <button slot="play" class="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
    <button slot="pause" class="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </ef-toggle-play>
</ef-timegroup>
```

## With ef-controls

Use with `ef-controls` to control a non-ancestor element:

```html
<ef-timegroup id="my-video" mode="contain" class="w-full h-96">
  <ef-video src="video.mp4" class="size-full"></ef-video>
</ef-timegroup>

<ef-controls target="my-video">
  <ef-toggle-play>
    <button slot="play" class="px-4 py-2 bg-blue-600 text-white rounded">Play</button>
    <button slot="pause" class="px-4 py-2 bg-gray-600 text-white rounded">Pause</button>
  </ef-toggle-play>
</ef-controls>
```

## Target Attribute

Directly target an element by ID without `ef-controls`:

```html
<ef-timegroup id="video-1" mode="contain">
  <ef-video src="video.mp4"></ef-video>
</ef-timegroup>

<ef-toggle-play target="video-1">
  <button slot="play">Play</button>
  <button slot="pause">Pause</button>
</ef-toggle-play>
```

## Center Overlay Toggle

Large button that appears over video:

```tsx
import { TogglePlay, Timegroup, Video } from "@editframe/react";

export const VideoPlayer = () => {
  return (
    <Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative">
      <Video src="/assets/video.mp4" className="size-full object-contain" />

      <TogglePlay className="absolute inset-0 flex items-center justify-center">
        <button
          slot="play"
          className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button
          slot="pause"
          className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition opacity-0 hover:opacity-100"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
          </svg>
        </button>
      </TogglePlay>
    </Timegroup>
  );
};
```

## With Text Labels

Toggle button with changing text:

```tsx
<TogglePlay>
  <button
    slot="play"
    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
  >
    ▶ Start Playing
  </button>
  <button
    slot="pause"
    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold"
  >
    ⏸ Pause
  </button>
</TogglePlay>
```

## Full Control Bar

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4">
    <div class="flex items-center gap-3">
      <ef-toggle-play>
        <button slot="play" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button slot="pause" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
          </svg>
        </button>
      </ef-toggle-play>

      <ef-scrubber class="flex-1 h-1 bg-white/20 rounded-full"></ef-scrubber>

      <ef-time-display class="text-white text-sm font-mono"></ef-time-display>
    </div>
  </div>
</ef-timegroup>
```
Use in a horizontal control bar:

```tsx
import { TogglePlay, Scrubber, TimeDisplay } from "@editframe/react";

export const ControlBar = () => {
  return (
    <div className="bg-gray-800 p-3 flex items-center gap-4">
      <TogglePlay>
        <button slot="play" className="w-8 h-8 text-white hover:text-blue-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button slot="pause" className="w-8 h-8 text-white hover:text-gray-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
          </svg>
        </button>
      </TogglePlay>

      <TimeDisplay className="text-white text-sm font-mono" />
      <Scrubber className="flex-1" />
    </div>
  );
};
```

## Styled Single Button

Use the same button element for both slots if you want a single button with changing icons:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-toggle-play class="absolute bottom-4 right-4">
    <button slot="play" class="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition">
      Play Video ▶
    </button>
    <button slot="pause" class="px-5 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full font-bold shadow-lg hover:scale-105 transition">
      Pause ⏸
    </button>
  </ef-toggle-play>
</ef-timegroup>
```
Custom styled button with smooth transitions:

```tsx
<TogglePlay>
  <button
    slot="play"
    className="group relative px-8 py-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
  >
    <span className="flex items-center gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <span>Play Video</span>
    </span>
  </button>
  <button
    slot="pause"
    className="group relative px-8 py-4 bg-gradient-to-br from-gray-600 to-gray-800 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
  >
    <span className="flex items-center gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
      <span>Pause</span>
    </span>
  </button>
</TogglePlay>
```

## Mobile-Friendly Controls

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-toggle-play class="absolute inset-0 flex items-center justify-center">
    <button slot="play" class="flex flex-col items-center gap-2 text-white">
      <div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <span class="text-sm font-semibold">Tap to play</span>
    </button>
    <button slot="pause" class="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </ef-toggle-play>
</ef-timegroup>
```

## With Custom Icons

Use any icon library:

```tsx
import { TogglePlay } from "@editframe/react";
import { PlayCircle, PauseCircle } from "lucide-react";

<TogglePlay className="text-white">
  <button slot="play" className="hover:text-blue-400 transition">
    <PlayCircle size={48} strokeWidth={1.5} />
  </button>
  <button slot="pause" className="hover:text-gray-400 transition">
    <PauseCircle size={48} strokeWidth={1.5} />
  </button>
</TogglePlay>
```

## Minimal Toggle

Compact toggle for tight spaces:

```tsx
<TogglePlay className="w-6 h-6">
  <div slot="play" className="text-blue-500 cursor-pointer">▶</div>
  <div slot="pause" className="text-gray-500 cursor-pointer">⏸</div>
</TogglePlay>
```

## With Preview Component

Use inside Preview for non-ancestor element control:

```tsx
import { Preview, TogglePlay } from "@editframe/react";

<div className="flex flex-col gap-2">
  <Preview className="w-full h-[600px]" />

  <TogglePlay>
    <button slot="play" className="w-full px-4 py-2 bg-green-600 text-white rounded">
      Play
    </button>
    <button slot="pause" className="w-full px-4 py-2 bg-gray-600 text-white rounded">
      Pause
    </button>
  </TogglePlay>
</div>
```

The Preview component provides context that TogglePlay automatically consumes.

## Full Editor Example

Complete video editor with toggle controls:

```tsx
import { Preview, TogglePlay, Scrubber, TimeDisplay, ToggleLoop } from "@editframe/react";

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
          <Scrubber className="flex-1 h-2" />
          <ToggleLoop className="w-10 h-10 text-white" />
        </div>
      </div>
    </div>
  );
};
```

## When to Use

- **Use `ef-toggle-play`** when you want a single button that changes appearance
- **Use separate `ef-play` and `ef-pause`** when you want independent buttons that auto-hide
- Both approaches provide the same functionality - choose based on your UI design
- Use `TogglePlay` for a single button that switches icons - simpler UI, single click target
- Use separate `Play` and `Pause` for independent buttons - clearer state indication
- TogglePlay is ideal for control bars and minimal UIs
- Separate buttons work better for overlay controls

## Accessibility

Ensure proper labels that update with state:

```tsx
<TogglePlay>
  <button slot="play" aria-label="Play video" className="w-10 h-10">
    <svg aria-hidden="true">...</svg>
  </button>
  <button slot="pause" aria-label="Pause video" className="w-10 h-10">
    <svg aria-hidden="true">...</svg>
  </button>
</TogglePlay>
```
