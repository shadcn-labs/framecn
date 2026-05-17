---
description: "Pause button that renders only when the composition is playing, auto-hiding when already paused for clean editor UIs."
---


# ef-pause

## Attributes

- **target** (string) - ID of the element to control (optional if nested in composition)

# Pause

Pause button that automatically hides when playback stops.

## Import

```tsx
import { Pause } from "@editframe/react";
```

## Basic Usage

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-pause class="absolute top-4 right-4">
    <button class="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </ef-pause>
</ef-timegroup>
```
```tsx
import { Pause, Timegroup, Video } from "@editframe/react";

<Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative">
  <Video src="/assets/video.mp4" className="size-full object-contain" />

  <Pause className="absolute top-4 right-4">
    <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </Pause>
</Timegroup>
```

## Auto-Hide Behavior

The pause button automatically sets `display: none` when playback stops. It becomes visible again when playing.

This allows you to create pause controls that only appear during playback without managing state manually.

## Custom Slot Content

Slot any content as the pause button:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-pause class="absolute bottom-4 right-4">
    <button class="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">
      ⏸ Pause
    </button>
  </ef-pause>
</ef-timegroup>
```
```tsx
<Pause className="absolute bottom-4 right-4">
  <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">
    ⏸ Pause
  </button>
</Pause>
```

## With ef-controls

Use with `ef-controls` to control a non-ancestor element:

```html
<ef-timegroup id="my-video" mode="contain" class="w-full h-96">
  <ef-video src="video.mp4" class="size-full"></ef-video>
</ef-timegroup>

<ef-controls target="my-video">
  <ef-pause>
    <button class="px-4 py-2 bg-red-600 text-white rounded">Pause</button>
  </ef-pause>
</ef-controls>
```

## Target Attribute

Directly target an element by ID without `ef-controls`:

```html
<ef-timegroup id="video-1" mode="contain">
  <ef-video src="video.mp4"></ef-video>
</ef-timegroup>

<ef-pause target="video-1">
  <button>Pause</button>
</ef-pause>
```

## With Preview Component

Use inside Preview for non-ancestor element control:

```tsx
import { Preview, Pause } from "@editframe/react";

<div className="flex flex-col gap-2">
  <Preview className="w-full h-[600px]" />

  <Pause>
    <button className="w-full px-4 py-2 bg-gray-700 text-white rounded">
      Pause Timeline
    </button>
  </Pause>
</div>
```

The Preview component provides context that Pause automatically consumes.

## Separate Play and Pause

Combine `ef-play` and `ef-pause` for independent buttons that show based on state:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <div class="absolute bottom-4 left-4 flex gap-2">
    <ef-play>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        ▶ Play
      </button>
    </ef-play>

    <ef-pause>
      <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ⏸ Pause
      </button>
    </ef-pause>
  </div>
</ef-timegroup>
```
Combine `Play` and `Pause` for independent buttons that show based on state:

```tsx
import { Play, Pause, Timegroup, Video } from "@editframe/react";

export const VideoWithControls = () => {
  return (
    <Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative">
      <Video src="/assets/video.mp4" className="size-full object-contain" />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <Play>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ▶ Play
          </button>
        </Play>

        <Pause>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            ⏸ Pause
          </button>
        </Pause>
      </div>
    </Timegroup>
  );
};
```

## Floating Pause Button

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative group">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-pause class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    <button class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </ef-pause>
</ef-timegroup>
```
Create a hover-triggered pause overlay:

```tsx
import { Pause, Timegroup, Video } from "@editframe/react";

<Timegroup mode="contain" className="w-[720px] h-[480px] bg-black relative group">
  <Video src="/assets/video.mp4" className="size-full object-contain" />

  <Pause className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
    </button>
  </Pause>
</Timegroup>
```

## Corner Pause Control

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-pause class="absolute top-4 left-4">
    <button class="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur text-white rounded-full hover:bg-black/80 transition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
      </svg>
      <span class="text-sm font-medium">Pause</span>
    </button>
  </ef-pause>
</ef-timegroup>
```
Position pause button with text label:

```tsx
<Pause className="absolute top-4 left-4">
  <button className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur text-white rounded-full hover:bg-black/80 transition">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
    </svg>
    <span className="text-sm font-medium">Pause</span>
  </button>
</Pause>
```

## Minimal Pause Icon

Simple icon-only pause button:

```tsx
<Pause className="absolute bottom-4 right-4">
  <button className="w-10 h-10 rounded-full bg-red-600/80 backdrop-blur flex items-center justify-center text-white hover:bg-red-600 transition">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
    </svg>
  </button>
</Pause>
```

## Custom Pause Icon

Use any icon library:

```tsx
import { Pause } from "@editframe/react";
import { PauseCircle } from "lucide-react";

<Pause className="absolute top-4 right-4">
  <button className="text-white hover:text-red-400 transition">
    <PauseCircle size={48} strokeWidth={1.5} />
  </button>
</Pause>
```

## Bottom Bar Pause

Create a pause button in a control bar:

```tsx
import { Pause } from "@editframe/react";

<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
  <Pause className="flex justify-center">
    <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
      Pause
    </button>
  </Pause>
</div>
```

## Toggle vs Separate Buttons

- Use `ef-toggle-play` for a single button that switches icons
- Use separate `ef-play` and `ef-pause` for independent buttons that show/hide based on state
- Use `TogglePlay` for a single button that switches icons
- Use separate `Play` and `Pause` for independent buttons that show/hide based on state
- Choose based on your UI design - both approaches work equally well

## Combining with Other Controls

Build a complete control panel:

```tsx
import { Play, Pause, Scrubber, TimeDisplay } from "@editframe/react";

export const ControlPanel = () => {
  return (
    <div className="bg-gray-800 p-4 flex items-center gap-4">
      <Play>
        <button className="w-10 h-10 text-white">▶</button>
      </Play>

      <Pause>
        <button className="w-10 h-10 text-white">⏸</button>
      </Pause>

      <TimeDisplay className="text-white text-sm font-mono" />
      <Scrubber className="flex-1" />
    </div>
  );
};
```

## Accessibility

Ensure the button inside Pause has proper labels:

```tsx
<Pause className="absolute top-4 right-4">
  <button
    aria-label="Pause video"
    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
    </svg>
  </button>
</Pause>
```
