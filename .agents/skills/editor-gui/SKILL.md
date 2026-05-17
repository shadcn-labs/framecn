---
name: editor-gui
description: "Build video editing interfaces with Editframe's GUI components. Assemble timeline, scrubber, filmstrip, preview, playback controls, and transform handles."
license: MIT
metadata:
  author: editframe
  version: "1.0"
---


# Editor Toolkit

Build video editing interfaces by composing GUI components. Each component is a self-contained building block that connects to your composition via `target` attributes. The composition itself is built with the `composition` skill — these components provide the controls and views around it.

## Quick Start

```html
<ef-timegroup id="my-video" mode="fixed" duration="5s">
  <ef-video src="/video.mp4" duration="5s"></ef-video>
</ef-timegroup>

<ef-controls target="my-video">
  <ef-toggle-play></ef-toggle-play>
  <ef-scrubber></ef-scrubber>
  <ef-time-display></ef-time-display>
</ef-controls>
```

## Getting Started

- [references/editor-toolkit.md](references/editor-toolkit.md) — How to compose editor components

## Preview & Canvas

- [references/preview.md](references/preview.md) — Preview container with focus tracking
- [references/canvas.md](references/canvas.md) — Interactive canvas with selection and drag-and-drop
- [references/pan-zoom.md](references/pan-zoom.md) — Pan and zoom container with gestures
- [references/focus-overlay.md](references/focus-overlay.md) — Highlight focused element
- [references/fit-scale.md](references/fit-scale.md) — Responsive aspect-ratio scaling

## Playback Controls

- [references/controls.md](references/controls.md) — Context bridge for disconnected controls
- [references/play.md](references/play.md) — Play button
- [references/pause.md](references/pause.md) — Pause button
- [references/toggle-play.md](references/toggle-play.md) — Combined play/pause toggle
- [references/toggle-loop.md](references/toggle-loop.md) — Loop toggle

## Timeline

- [references/timeline.md](references/timeline.md) — Full-featured timeline editor
- [references/filmstrip.md](references/filmstrip.md) — Visual timeline with tracks
- [references/scrubber.md](references/scrubber.md) — Seek control
- [references/time-display.md](references/time-display.md) — Current time / duration display
- [references/timeline-ruler.md](references/timeline-ruler.md) — Time ruler with frame markers
- [references/trim-handles.md](references/trim-handles.md) — Interactive trim controls
- [references/thumbnail-strip.md](references/thumbnail-strip.md) — Video thumbnail preview strip

## Transform & Manipulation

- [references/transform-handles.md](references/transform-handles.md) — Resize and rotation handles
- [references/resizable-box.md](references/resizable-box.md) — Resizable container with drag handles
- [references/dial.md](references/dial.md) — Rotary angle input

## Overlay System

- [references/overlay-layer.md](references/overlay-layer.md) — Container for positioned overlays
- [references/overlay-item.md](references/overlay-item.md) — Track and follow target elements

## Editor Shells

- [references/workbench.md](references/workbench.md) — Full editor UI with preview, timeline, hierarchy, and export
- [references/hierarchy.md](references/hierarchy.md) — Layer panel with selection and drag-and-drop
- [references/active-root-temporal.md](references/active-root-temporal.md) — Display active root element ID
