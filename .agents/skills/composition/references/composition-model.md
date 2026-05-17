---
description: "Mental model for how timegroup trees, temporal scheduling, and element rendering work together in an Editframe composition."
---


## Timegroup tree structure

A composition is a tree of nested timegroups. The root timegroup acts as the top-level container, and every media element, text block, or nested timegroup sits as a child within it. This tree structure determines both the visual layering order and the temporal relationships between elements.

Timegroups can nest arbitrarily deep. A root timegroup might contain a video element, a text element, and a child timegroup that itself contains an image sequence. Each level of nesting creates a new timing scope: the parent controls when the child subtree starts and how long it runs, while the child manages the relative timing of its own children.

## Temporal scheduling

Time flows from the root of the tree down to the leaves. The root timegroup drives the master clock. When the root advances to a given time, each child receives a time value relative to its own start point. This relative time is called `ownCurrentTimeMs`.

An element does not know or care about the absolute position in the overall composition. It only knows its own local time. A video element at `ownCurrentTimeMs: 2000` is 2 seconds into its own playback, regardless of where it sits in the global timeline. This local-time model makes it straightforward to rearrange, nest, or reuse subtrees without recalculating offsets.

Each element also has a `startMs` and `durationMs` that define when it becomes active within its parent's timeline. Outside that window, the element is inactive and produces no output.

## Timegroup modes

A timegroup's mode determines how it calculates its own duration from its children:

- **sequence** -- Children play one after another. The timegroup's duration is the sum of all child durations. Each child's start time is the cumulative duration of all preceding siblings. This is the natural choice for slide decks, sequential scenes, or any content that plays in order.

- **fixed** -- The timegroup has an explicit duration set directly. Children are positioned within that fixed window. Content that extends beyond the boundary is clipped; content shorter than the boundary leaves dead time.

- **contain** -- The timegroup shrink-wraps to fit its longest child. All children start at time zero by default, and the timegroup's duration equals the maximum child duration. This is useful for layered compositions where multiple elements play simultaneously.

## Media elements

Video, audio, and image elements represent source media within the tree. Video and audio have intrinsic durations derived from their source files. An image has no intrinsic duration, so it displays for whatever duration its parent assigns.

Media elements decode their source material frame by frame during rendering. A video element at `ownCurrentTimeMs: 1500` seeks to the 1.5-second mark of its source file and produces the corresponding frame. Audio elements produce sample data for the current time window.

## Text and captions

Text elements render styled HTML content within the composition. They participate in the same timing model as media elements: they have a start time and duration, and they produce visual output when active.

Captions are a specialized form of text that synchronize individual words or phrases to specific time ranges. Each caption segment maps to a span of time, enabling word-level highlighting and timed appearance.

Both text and captions support animations through CSS transitions and frame tasks. A frame task is a function that runs on every frame, receiving the current time and allowing dynamic style changes such as fade-ins, position shifts, or color transitions.

## Surface

A surface element mirrors the rendered output of another element. Rather than producing its own content, it references a target element by ID and displays whatever that element currently renders.

This enables picture-in-picture layouts, reflection effects, and multi-view compositions without duplicating source media. The surface updates automatically as the target element's output changes over time.

## Context system

Elements communicate through a DOM-based context system. When a timegroup mounts, it provides a context that downstream elements and controls can consume. Playback controls such as play, pause, and scrubber components connect to a timegroup by reading from this context.

Controls can also target a specific timegroup using the `target` attribute with an element reference or selector. This allows a single interface to contain controls for multiple independent timegroups, each bound explicitly rather than through context inheritance.

The context system follows the DOM hierarchy. A control nested inside a timegroup automatically connects to the nearest ancestor timegroup unless an explicit target overrides that behavior.

## Rendering pipeline

During rendering, the tree is evaluated frame by frame at a fixed frame rate. At each frame:

1. The root timegroup advances to the next time position.
2. Time propagates down the tree. Each element receives its local `ownCurrentTimeMs`.
3. Active elements resolve their visual state: media elements decode a frame, text elements compute their styled output, surfaces sample their target.
4. The results composite into a single canvas in tree order, with later siblings drawing on top of earlier ones.
5. The final canvas pixel data is captured as one frame of the output video.

This process repeats for every frame in the composition's total duration. Audio is mixed in a parallel pass, combining all active audio sources according to the same timing model. The final output is a video file that faithfully reproduces the composition tree's state at every point in time.
