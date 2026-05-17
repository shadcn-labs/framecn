---
description: "Catalog of CSS ::part() selectors for styling internal shadow DOM elements of Editframe web components from external stylesheets."
---


# CSS Parts Reference

Editframe elements use Shadow DOM to encapsulate internal markup. Each component exposes named parts via the `part` attribute, letting you style internals with `::part()` CSS selectors without breaking encapsulation.

## ef-scrubber

| Part | Description |
|------|-------------|
| `scrubber` | Outer track container |
| `progress` | Filled portion indicating current position |
| `handle` | Draggable circular knob |
| `playhead` | Vertical line at the current time position |

```css
ef-scrubber::part(scrubber) { background: #1a1a2e; border-radius: 4px; }
ef-scrubber::part(progress) { background: #e94560; }
ef-scrubber::part(handle)   { background: #e94560; width: 14px; height: 14px; }
```

## ef-time-display

| Part | Description |
|------|-------------|
| `time` | Span containing the formatted `current / duration` text |

```css
ef-time-display::part(time) { font-family: monospace; color: #aaa; }
```

## ef-workbench

| Part | Description |
|------|-------------|
| `toolbar` | Top toolbar row with mode indicators and controls |
| `canvas` | Central preview area where the composition is rendered |

## ef-timeline

| Part | Description |
|------|-------------|
| `header` | Controls row above the tracks (playback, time display, zoom) |
| `tracks` | Scrollable viewport containing all track rows |
| `ruler` | Time ruler bar along the top of the tracks area |
| `playhead` | Vertical playhead line spanning all tracks |

## ef-timeline-row

| Part | Description |
|------|-------------|
| `label` | Row label area (element name, icon, detail text) |
| `track` | Row track area displaying the clip bar |

## ef-hierarchy

| Part | Description |
|------|-------------|
| `list` | Outer container wrapping the hierarchy tree |
| `header` | Optional header above the tree items |

## ef-hierarchy-item

| Part | Description |
|------|-------------|
| `row` | Item row container (receives `data-focused` and `data-selected` attributes) |
| `icon` | Element-type icon span |
| `label` | Element name text span |

## Combined Example

Style an entire editor theme by targeting parts across multiple elements:

```css
/* Dark coral theme */
ef-workbench::part(toolbar)  { background: #1a1a2e; }
ef-workbench::part(canvas)   { background: #0f0f1a; }

ef-scrubber::part(scrubber)  { background: #16213e; height: 6px; }
ef-scrubber::part(progress)  { background: #e94560; }
ef-scrubber::part(handle)    { background: #e94560; }

ef-timeline::part(header)    { background: #16213e; }
ef-timeline::part(ruler)     { background: #0f3460; }
ef-timeline::part(playhead)  { background: #e94560; }

ef-time-display::part(time)  { color: #e94560; font-variant-numeric: tabular-nums; }

ef-hierarchy-item::part(row):hover { background: rgba(255, 255, 255, 0.05); }
ef-hierarchy-item::part(label)     { font-size: 0.75rem; }
```

## Notes

- `::part()` selectors cannot be chained -- `::part(a)::part(b)` is invalid. Style each part independently.
- Parts work inside media queries, container queries, and `:host()` selectors.
- For nested shadow roots, use `exportparts` on the host to forward inner parts to outer consumers.
