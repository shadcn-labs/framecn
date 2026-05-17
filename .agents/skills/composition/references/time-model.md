---
description: "How time propagation works in composition trees: duration inheritance, offset calculation, and element scheduling rules."
---


# Time Model

Editframe uses a declarative time model. You describe structure — the system computes all timing.

## Single Source of Truth

Only the root timegroup's `currentTime` is writable. All child times are computed from parent state. This guarantees synchronization — it's impossible for timelines to drift.

```javascript
const root = document.querySelector('ef-timegroup');
root.currentTime = 5.5; // All children update atomically
```

## Time Flows Down the Tree

Each timegroup computes its `ownCurrentTimeMs` (local time) from the parent's time based on its mode and position in the tree.

**Root writes `currentTime`** → parent computes child offsets → each child derives its local time → media elements map to source time.

In a sequence, a child at position 5s–8s receives `ownCurrentTimeMs = 0` when the root is at 5s, and `ownCurrentTimeMs = 3000` when the root is at 8s.

## Duration Calculation by Mode

Each mode computes duration differently:

| Mode | Duration rule |
|------|--------------|
| `fixed` | Explicit `duration` attribute |
| `sequence` | Sum of children minus overlaps |
| `contain` | Maximum child duration |
| `fit` | Inherited from parent |

Duration bubbles up — a `sequence` inside a `contain` resolves its sum, and the `contain` parent takes the max of that and its other children.

```html
<ef-timegroup mode="contain">
  <!-- sequence resolves to 8s (3+5) -->
  <ef-timegroup mode="sequence">
    <ef-timegroup mode="fixed" duration="3s">A</ef-timegroup>
    <ef-timegroup mode="fixed" duration="5s">B</ef-timegroup>
  </ef-timegroup>
  <!-- contain takes max(8s, 6s) = 8s -->
  <ef-timegroup mode="fixed" duration="6s">C</ef-timegroup>
</ef-timegroup>
```

## Trimming and the Timeline

When a video is trimmed, its effective duration changes, which propagates up through the tree:

- `sourcein="2s" sourceout="6s"` → effective duration is 4s
- `trimstart="1s" trimend="2s"` on a 10s source → effective duration is 7s

In a `sequence`, changing a trim value shifts all subsequent items automatically. In `contain`, it may change the overall duration if it was the longest child.

## Overlap Creates Shared Time

In `sequence` mode, `overlap` subtracts time between adjacent items, creating a region where both are active:

```
Scene A: |---------|
Scene B:      |---------|
overlap:      |---|
```

Total duration: `durationA + durationB - overlap`

During the overlap region, both scenes receive valid `ownCurrentTimeMs` values. Scene A is near its end, Scene B is near its start. This shared time is where transitions happen.

See [transitions.md](references/transitions.md) for using overlap with CSS animations.

## Two Coordinate Systems

Every element has two time perspectives:

- **`currentTimeMs`** — position in the root timeline (global). Same value for all elements at any given moment.
- **`ownCurrentTimeMs`** — position in the element's local timeline (local). Resets to 0 at the element's start.

Media elements add a third:

- **`currentSourceTimeMs`** — position in the source file, accounting for trims. Survives trim changes.

> **Note:** `ownCurrentTimeMs` is what you use in `addFrameTask` callbacks and CSS animations. It provides element-relative timing that works regardless of where the element sits in the composition.

## See Also

- [timegroup-modes.md](references/timegroup-modes.md) — mode examples
- [timegroup.md](references/timegroup.md) — attribute reference
- [sequencing.md](references/sequencing.md) — sequence patterns
