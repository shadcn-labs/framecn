---
description: "Video element with source trimming, volume control, muting, and frame-accurate playback for Editframe compositions."
---


# ef-video

## Attributes

- **src** (string) (required) - URL or path to video source
- **sourcein** (timestring) - Absolute start time in source media
- **sourceout** (timestring) - Absolute end time in source media
- **trimstart** (timestring) - Duration to trim from start
- **trimend** (timestring) - Duration to trim from end
- **duration** (timestring) - Override element duration
- **mute** (boolean, default: false) - Silence the audio track
- **volume** (number, default: 1) - Audio volume (0.0 to 1.0)

# Video

Video element with source trimming.
Display video clips with optional trimming.

## Import

```tsx
import { Video } from "@editframe/react";
```

## Basic Usage

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
```
```tsx
<Video src="/assets/clip.mp4" className="size-full object-cover" />
```

## Trimming Approaches

Two ways to trim video -- choose based on your workflow:

### Absolute Trimming (sourcein/sourceout)
### Absolute Trimming (sourceIn/sourceOut)

Show specific timestamps from source. Use when you know exact timecodes.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="2s" sourceout="6s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```
```tsx
{/* Show seconds 10-20 from source (10s clip) */}
<Video
  src="/assets/long-video.mp4"
  sourceIn="10s"
  sourceOut="20s"
  className="size-full object-cover"
/>
```

### Relative Trimming (trimstart/trimend)
### Relative Trimming (trimStart/trimEnd)

Remove time from start/end. Use when thinking "cut off X seconds".

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" trimstart="2s" trimend="3s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```
```tsx
{/* Remove 2s from start, 3s from end */}
<Video
  src="/assets/video.mp4"
  trimStart="2s"
  trimEnd="3s"
  className="size-full object-cover"
/>
```

**When to use each:**
- `sourcein`/`sourceout` — Working with timecodes, precise frame references
- `trimstart`/`trimend` — UI builders, "how much to cut off" thinking
- `sourceIn`/`sourceOut` - Working with timecode, precise frame references
- `trimStart`/`trimEnd` - UI builders, "how much to cut off" thinking

## With Volume Control

```tsx
<Video
  src="/assets/clip.mp4"
  volume={0.5}
  className="size-full"
/>
```

## Muted Video

```tsx
<Video
  src="/assets/clip.mp4"
  muted
  className="size-full object-cover"
/>
```

## Muted / Volume

```html
<ef-video src="video.mp4" mute class="size-full"></ef-video>
<ef-video src="video.mp4" volume="0.5" class="size-full"></ef-video>
```

## Picture-in-Picture

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-cover"></ef-video>
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="5s" class="absolute bottom-4 right-4 w-48 h-28 rounded-lg border-2 border-white"></ef-video>
</ef-timegroup>
```

## Full Scene Example

```tsx
import { Timegroup, Video, Text } from "@editframe/react";

export const VideoScene = () => {
  return (
    <Timegroup mode="contain" className="absolute w-full h-full">
      <Video
        src="/assets/background.mp4"
        sourceIn="5s"
        sourceOut="15s"
        className="size-full object-cover"
      />
      <Text className="absolute top-8 left-8 text-white text-3xl">
        Video Title
      </Text>
    </Timegroup>
  );
};
```

## Object Fit

Use Tailwind classes for positioning:

```tsx
{/* Cover - fills container, may crop */}
<Video src="/assets/video.mp4" className="size-full object-cover" />

{/* Contain - fits within container, may have letterbox */}
<Video src="/assets/video.mp4" className="size-full object-contain" />

{/* Fill - stretches to fill */}
<Video src="/assets/video.mp4" className="size-full object-fill" />
```

## Dynamic Videos

```tsx
interface VideoData {
  id: string;
  src: string;
  sourceIn: string;
  sourceOut: string;
}

const videos: VideoData[] = [
  { id: "1", src: "/assets/clip1.mp4", sourceIn: "0s", sourceOut: "5s" },
  { id: "2", src: "/assets/clip2.mp4", sourceIn: "3s", sourceOut: "8s" },
];

<Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
  {videos.map((video) => (
    <Timegroup key={video.id} mode="contain" className="absolute w-full h-full">
      <Video
        src={video.src}
        sourceIn={video.sourceIn}
        sourceOut={video.sourceOut}
        className="size-full object-cover"
      />
    </Timegroup>
  ))}
</Timegroup>
```

## Video Tutorial

Build a composition step by step — from a single clip to layered scenes.

### Step 1: Display a Basic Video

Place a video inside a root timegroup.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

### Step 2: Trim a Video

Two approaches — choose based on your workflow.

**Relative trimming** removes time from edges:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" trimstart="2s" trimend="2s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

**Absolute trimming** specifies exact timecodes:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="2s" sourceout="4s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

See the [Trimming Video](#trimming-video) section for detailed guidance on choosing between them.

### Step 3: Create a Simple Sequence

Use `mode="sequence"` to play clips one after another. The timeline duration is the sum of all children.

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="2s" class="size-full object-contain"></ef-video>
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="8s" class="size-full object-contain"></ef-video>
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="2s" sourceout="4s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

### Step 4: Layer Videos with Text

Nest timegroups inside a sequence. Each child timegroup holds a video background and text overlay.

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
  <ef-timegroup class="flex flex-col items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="3s" class="z-0 absolute top-0 left-0 size-full object-contain"></ef-video>
    <h1 class="relative bg-blue-500 text-4xl p-2 text-white">First Scene</h1>
  </ef-timegroup>
  <ef-timegroup class="flex flex-col items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="8s" class="z-0 absolute top-0 left-0 size-full object-contain"></ef-video>
    <h1 class="relative bg-blue-500 text-4xl p-2 text-white">Second Scene</h1>
  </ef-timegroup>
</ef-timegroup>
```

> **Note:** The video uses `absolute` positioning with `z-0` as a background layer. Text uses `relative` positioning to appear on top.

### Next Steps

- See [Trimming Video](#trimming-video) for a trimming deep-dive
- See [Video Effects](#video-effects) for CSS filters and animations

## Trimming Video

Two approaches to show only part of a video source. Choose based on your workflow.

### Relative Trimming (trimstart / trimend)

Remove time from the edges. Think: "cut off 2 seconds from the start."

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" trimstart="2s" trimend="3s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

Duration formula: `sourceDuration - trimstart - trimend`

A 10s source with `trimstart="2s" trimend="3s"` produces a 5s clip.

### Absolute Trimming (sourcein / sourceout)

Specify exact timestamps. Think: "show seconds 2 through 6."

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="2s" sourceout="6s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

Duration formula: `sourceout - sourcein`

`sourcein="2s" sourceout="6s"` produces a 4s clip starting at the 2-second mark.

### When to Use Each

| Approach | Use when... |
|----------|-------------|
| `trimstart` / `trimend` | Building UI with drag handles or sliders |
| | Thinking "how much to cut off" |
| | Adjusting existing clip duration |
| `sourcein` / `sourceout` | Working with known timecodes |
| | Referencing specific moments by timestamp |
| | Frame-perfect accuracy needed |

### Trimmed Clips in a Sequence

Trimming is most useful when building sequences from different parts of source media:

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="2s" class="size-full object-contain"></ef-video>
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="5s" sourceout="8s" class="size-full object-contain"></ef-video>
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="8s" class="size-full object-contain"></ef-video>
</ef-timegroup>
```

> **Note:** Both approaches produce the same visual result — they differ in mental model and how `currentSourceTimeMs` tracks source position. Relative trimming maps as `trimstart + ownCurrentTimeMs`, absolute as `sourcein + ownCurrentTimeMs`.

## Video Effects

Apply visual effects to video using standard CSS. The video element renders to a canvas, so all CSS properties apply directly.

### CSS Filters

Use Tailwind filter utilities or inline styles:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain blur-sm saturate-200 brightness-150 contrast-150"></ef-video>
</ef-timegroup>
```

Common filter classes:

| Effect | Class | Description |
|--------|-------|-------------|
| Blur | `blur-sm` / `blur-md` / `blur-lg` | Gaussian blur |
| Brightness | `brightness-50` / `brightness-150` | Darken or lighten |
| Contrast | `contrast-50` / `contrast-150` | Reduce or increase contrast |
| Grayscale | `grayscale` | Full desaturation |
| Sepia | `sepia` | Warm vintage tone |
| Saturate | `saturate-50` / `saturate-200` | Color intensity |

Combine multiple filters by listing classes:

```html
<ef-video src="video.mp4" class="grayscale contrast-125 brightness-110 size-full"></ef-video>
```

### CSS Transforms

Scale and rotate video elements:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black overflow-hidden">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain scale-125 rotate-3"></ef-video>
</ef-timegroup>
```

### CSS Animations

Animate any CSS property over time using `@keyframes`:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black overflow-hidden">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain" style="animation: 10s trippy"></ef-video>
  <style>
    @keyframes trippy {
      0% { filter: saturate(2) brightness(1.5) blur(10px); }
      100% { filter: saturate(1) brightness(1) blur(0); }
    }
  </style>
</ef-timegroup>
```

Animations run relative to the video's timeline — they're fully scrubbable.

### Combining Effects

Layer static filters with animations for complex looks:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black overflow-hidden">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain sepia" style="animation: 10s zoom-drift"></ef-video>
  <style>
    @keyframes zoom-drift {
      0% { transform: scale(1); }
      100% { transform: scale(1.2); }
    }
  </style>
</ef-timegroup>
```

> **Note:** Static CSS classes (like `sepia`) combine with animation keyframes. The animation overrides only the properties it targets.
