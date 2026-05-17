---
description: "How the four timegroup layout modes — par, seq, excl, and media — control duration, ordering, and child element scheduling."
---


# Timegroup Modes

Every `ef-timegroup` has a `mode` that determines how its duration is calculated and how children are arranged in time.

## Fixed

Explicit duration. The base case — you set the length directly.

```html live
<ef-timegroup mode="fixed" duration="3s" class="w-[720px] h-[300px] bg-slate-600 flex items-center justify-center">
  <p class="text-white text-4xl">3 Second Scene</p>
</ef-timegroup>
```

Use `fixed` when you know the exact duration: title cards, countdowns, static scenes.

## Sequence

Children play one after another. Duration is the sum of all children minus any overlap.

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[300px] bg-black">
  <ef-timegroup mode="fixed" duration="2s" class="bg-red-400 text-red-900 text-3xl flex items-center justify-center">
    <p>Scene 1 (2s)</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="bg-green-400 text-green-900 text-3xl flex items-center justify-center">
    <p>Scene 2 (3s)</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="1s" class="bg-blue-400 text-blue-900 text-3xl flex items-center justify-center">
    <p>Scene 3 (1s)</p>
  </ef-timegroup>
</ef-timegroup>
```

Use `sequence` for cut-based editing, slideshows, multi-scene videos. See [sequencing.md](references/sequencing.md).

## Contain

Children play simultaneously. Duration is the longest child.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[300px] bg-black">
  <ef-timegroup mode="fixed" duration="5s" class="absolute top-0 left-0 w-full h-1/2 bg-red-400 text-red-900 text-2xl flex items-center justify-center">
    <p>Layer A (5s)</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="8s" class="absolute top-1/2 left-0 w-full h-1/2 bg-green-400 text-green-900 text-2xl flex items-center justify-center">
    <p>Layer B (8s) — sets total to 8s</p>
  </ef-timegroup>
</ef-timegroup>
```

Use `contain` for layered compositions: video with overlays, picture-in-picture, parallel tracks.

## Fit

Inherits duration from parent. No duration of its own.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[300px] bg-black">
  <ef-timegroup mode="fixed" duration="4s" class="absolute top-0 left-0 w-full h-1/2 bg-amber-400 text-amber-900 text-2xl flex items-center justify-center">
    <p>Content (4s)</p>
  </ef-timegroup>
  <ef-timegroup mode="fit" class="absolute top-1/2 left-0 w-full h-1/2 bg-blue-900 text-blue-200 text-2xl flex items-center justify-center">
    <p>Fit background — spans full 4s</p>
  </ef-timegroup>
</ef-timegroup>
```

Use `fit` for backgrounds, watermarks, or any element that should span its parent's full duration.

## Decision Guide

| Scenario | Mode | Why |
|----------|------|-----|
| Title card with known length | `fixed` | Explicit control |
| Multi-scene video | `sequence` | Sequential playback |
| Video with text overlay | `contain` | Parallel layers |
| Background music/watermark | `fit` | Span parent duration |
| Scenes with transitions | `sequence` + `overlap` | Shared time for crossfades |

> **Note:** Modes compose — a `contain` parent with a `sequence` child and a `fit` background is a common pattern for videos with a background track spanning the full timeline.

## See Also

- [timegroup.md](references/timegroup.md) — attribute reference
- [time-model.md](references/time-model.md) — how time propagates through modes
- [sequencing.md](references/sequencing.md) — sequence patterns
