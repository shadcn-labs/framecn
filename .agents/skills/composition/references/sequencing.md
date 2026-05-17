---
description: "Create sequential scene playback using seq-mode timegroups, with automatic cuts and configurable transition timing between scenes."
---


# Sequencing Scenes

Create multi-scene compositions using `mode="sequence"` on a timegroup.

## Basic Sequence

Children play one after another. Total duration is the sum of all children.

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[300px] bg-black">
  <ef-timegroup mode="fixed" duration="2s" class="bg-red-500 text-white text-3xl flex items-center justify-center">
    <p>Scene 1</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="bg-blue-500 text-white text-3xl flex items-center justify-center">
    <p>Scene 2</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="2s" class="bg-green-500 text-white text-3xl flex items-center justify-center">
    <p>Scene 3</p>
  </ef-timegroup>
</ef-timegroup>
```

## Sequences with Overlap

Add `overlap` to create shared time between adjacent items — the foundation for transitions.

```html live
<ef-timegroup mode="sequence" overlap="1s" class="w-[720px] h-[300px] bg-black">
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full bg-red-500 text-white text-3xl flex items-center justify-center">
    <p>Scene 1</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full bg-blue-500 text-white text-3xl flex items-center justify-center">
    <p>Scene 2</p>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full bg-green-500 text-white text-3xl flex items-center justify-center">
    <p>Scene 3</p>
  </ef-timegroup>
</ef-timegroup>
```

Total duration with overlap: `sum(children) - (overlap × (count - 1))`. Three 3s scenes with 1s overlap = 7s.

See [transitions.md](references/transitions.md) for crossfade and slide effects during overlap.

## Nested Sequences

A sequence can contain other sequences. The inner sequence resolves to a single duration.

```html
<ef-timegroup mode="sequence" overlap="1s">
  <ef-timegroup mode="sequence">
    <ef-timegroup mode="fixed" duration="3s">Sub A1</ef-timegroup>
    <ef-timegroup mode="fixed" duration="2s">Sub A2</ef-timegroup>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="4s">Scene B</ef-timegroup>
</ef-timegroup>
```

The inner sequence (5s total) is treated as a single 5s item in the outer sequence.

## Mixed Content

Sequences work with any element — video, images, text, or combinations:

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
  <ef-timegroup class="flex flex-col items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourceout="3s" class="absolute top-0 left-0 size-full object-contain z-0"></ef-video>
    <h1 class="relative text-white text-4xl bg-black/50 p-4">Video Scene</h1>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="bg-slate-900 flex items-center justify-center">
    <h1 class="text-white text-5xl">Text Interlude</h1>
  </ef-timegroup>
  <ef-timegroup class="flex items-center justify-center">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="5s" class="absolute top-0 left-0 size-full object-contain z-0"></ef-video>
    <h1 class="relative text-white text-4xl bg-black/50 p-4">Final Scene</h1>
  </ef-timegroup>
</ef-timegroup>
```

## Background Track Pattern

Wrap a sequence with a `contain` parent and add a `fit` sibling for a background that spans the full timeline:

```html
<ef-timegroup mode="contain">
  <ef-timegroup mode="sequence">
    <ef-timegroup mode="fixed" duration="3s">Intro</ef-timegroup>
    <ef-timegroup mode="fixed" duration="10s">Main</ef-timegroup>
    <ef-timegroup mode="fixed" duration="2s">Outro</ef-timegroup>
  </ef-timegroup>
  <ef-audio src="music.mp3" mode="fit"></ef-audio>
</ef-timegroup>
```

> **Note:** The `fit` element inherits the 15s total from its `contain` parent, which gets its duration from the `sequence` child.

## See Also

- [timegroup-modes.md](references/timegroup-modes.md) — mode explanations
- [transitions.md](references/transitions.md) — crossfade and slide transitions
- [time-model.md](references/time-model.md) — how time propagates through sequences
