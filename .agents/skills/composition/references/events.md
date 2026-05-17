---
description: Catalog of all custom DOM events dispatched by Editframe elements for building interactive player and editor UI components.
---


# Custom Events




Editframe elements dispatch custom events to enable interactive UI components. Events follow the DOM event bubbling model with `bubbles: true` and `composed: true` to traverse shadow DOM boundaries.

## Event Categories

### Transform & Manipulation Events

Events fired during user interactions with transform handles, trim controls, and resize operations.

#### trim-change

Fired by `ef-trim-handles` when trim handles are dragged. Use this to update element trim values in real-time.

```typescript
interface TrimChangeDetail {
  elementId: string;
  type: "start" | "end" | "region";
  value: TrimValue;
}

interface TrimValue {
  startMs: number;
  endMs: number;
}
```

**Example: Listen to trim changes**

```html live
<ef-configuration apiHost="https://api.editframe.com">
  <ef-timegroup id="composition" duration="5000" width="1920" height="1080" background="black">
    <ef-video
      id="video1"
      src="https://assets.editframe.com/sample-5s.mp4"
      duration="5000"
      trim-start-ms="500"
      trim-end-ms="500"
    ></ef-video>
  </ef-timegroup>

  <ef-trim-handles
    element-id="video1"
    intrinsic-duration-ms="5000"
  ></ef-trim-handles>

  <script>
    document.querySelector('ef-trim-handles').addEventListener('trim-change', (e) => {
      const { type, value } = e.detail;
      console.log(`Trim ${type}: ${value.startMs}ms - ${value.endMs}ms`);

      // Update video element
      const video = document.getElementById('video1');
      video.trimStartMs = value.startMs;
      video.trimEndMs = value.endMs;
    });
  </script>
</ef-configuration>
```

#### bounds-change

Fired by `ef-transform-handles` and `ef-resizable-box` when element bounds change through user interaction.

```typescript
interface TransformBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}
```

**Example: Listen to bounds changes**

```html
<ef-transform-handles
  .bounds=${{ x: 100, y: 100, width: 200, height: 150 }}
  enable-rotation
></ef-transform-handles>

<script>
  document.querySelector('ef-transform-handles').addEventListener('bounds-change', (e) => {
    const { bounds } = e.detail;
    console.log('New bounds:', bounds);

    // Update target element position/size
    targetElement.style.left = `${bounds.x}px`;
    targetElement.style.top = `${bounds.y}px`;
    targetElement.style.width = `${bounds.width}px`;
    targetElement.style.height = `${bounds.height}px`;
  });
</script>
```

#### rotation-change

Fired by `ef-transform-handles` when the rotation handle is dragged. Provides the new rotation value in degrees.

```typescript
interface RotationChangeDetail {
  rotation: number; // Degrees (0-360)
}
```

#### change (dial)

Fired by `ef-dial` when the dial value changes through user interaction. Provides the new angle value.

```typescript
interface DialChangeDetail {
  value: number; // Degrees (0-360)
}
```

**Example: Dial with rotation control**

```html
<ef-dial value="45"></ef-dial>

<script>
  document.querySelector('ef-dial').addEventListener('change', (e) => {
    const { value } = e.detail;
    console.log('Dial rotation:', value, '°');

    // Apply rotation to element
    targetElement.style.transform = `rotate(${value}deg)`;
  });
</script>
```

### Timeline & Playback Events

Events fired during timeline scrubbing, track manipulation, and playback control.

#### seek

Fired by `ef-scrubber` when the playhead position changes. Detail contains the new time in milliseconds.

```html
<ef-scrubber target="composition"></ef-scrubber>

<script>
  document.querySelector('ef-scrubber').addEventListener('seek', (e) => {
    const timeMs = e.detail;
    console.log('Seek to:', timeMs, 'ms');
  });
</script>
```

#### scrub-segment-loading

Fired by `ef-video` during scrub track loading to provide progress feedback for UI loading indicators.

```typescript
interface ScrubSegmentLoadingDetail {
  segmentId: number;
  timeRangeMs: [number, number];
  loaded: number;
  total: number;
  status: "loading" | "loaded";
}
```

**Example: Show loading progress**

```html
<ef-video id="myVideo" src="..."></ef-video>
<div id="progress" style="display: none;">Loading scrub preview...</div>

<script>
  document.getElementById('myVideo').addEventListener('scrub-segment-loading', (e) => {
    const { loaded, total, status } = e.detail;
    const progressEl = document.getElementById('progress');

    if (status === 'loading') {
      progressEl.style.display = 'block';
      progressEl.textContent = `Loading ${loaded}/${total}...`;
    } else {
      progressEl.style.display = 'none';
    }
  });
</script>
```

#### row-select

Fired by `ef-timeline-row` when a timeline row is clicked. Used to coordinate selection between timeline and canvas.

```typescript
interface RowSelectDetail {
  elementId: string;
  element: Element;
}
```

#### row-hover

Fired by `ef-timeline-row` when mouse enters or leaves a row. Useful for highlighting elements in the preview during timeline hover.

```typescript
interface RowHoverDetail {
  element: Element | null; // null when mouse leaves
}
```

#### track-trim-change

Fired by timeline track items when their trim handles change. Bubbles up from the track item to the timeline.

### Selection & Hierarchy Events

Events fired when users interact with hierarchy panels, layer lists, or canvas selection tools.

#### hierarchy-select

Fired by `ef-hierarchy` when an element is selected in the hierarchy panel. Typically used to sync selection with canvas or preview.

```typescript
interface HierarchySelectDetail {
  elementId: string;
}
```

**Example: Sync hierarchy selection with canvas**

```html
<ef-hierarchy target="composition"></ef-hierarchy>

<script>
  document.querySelector('ef-hierarchy').addEventListener('hierarchy-select', (e) => {
    const { elementId } = e.detail;

    // Update canvas selection
    const canvas = document.querySelector('ef-canvas');
    const element = document.getElementById(elementId);
    if (element) {
      canvas.selectElement(element);
    }
  });
</script>
```

#### hierarchy-reorder

Fired by `ef-hierarchy` when elements are reordered via drag and drop. Use this to update the DOM structure.

```typescript
interface HierarchyReorderDetail {
  sourceId: string;
  targetId: string;
  position: "before" | "after" | "inside";
}
```

**Example: Handle reordering**

```html
<script>
  document.querySelector('ef-hierarchy').addEventListener('hierarchy-reorder', (e) => {
    const { sourceId, targetId, position } = e.detail;

    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);

    if (position === 'before') {
      target.parentElement.insertBefore(source, target);
    } else if (position === 'after') {
      target.parentElement.insertBefore(source, target.nextSibling);
    } else if (position === 'inside') {
      target.appendChild(source);
    }
  });
</script>
```

#### tree-select

Fired by `ef-tree` when a tree item is selected. Generic tree selection event for tree-based UI components.

```typescript
interface TreeSelectDetail {
  id: string;
  item: any;
}
```

#### selectionchange

Fired by canvas `SelectionModel` when the set of selected elements changes through user interaction.

```typescript
interface SelectionChangeDetail {
  selection: Set<Element>;
}
```

### Temporal & Content Events

Events fired by temporal elements during initialization, content changes, and state transitions.

#### readystatechange

Fired by temporal elements (`ef-timegroup`, `ef-video`, `ef-audio`, etc.) when their ready state changes during initialization.

```typescript
interface ReadyStateChangeDetail {
  readyState: string; // e.g., "loading", "interactive", "complete"
}
```

#### contentchange

Fired by temporal elements when their content structure changes (children added/removed, attributes modified).

#### child-duration-changed

Fired by media elements when a child element's duration changes, triggering recalculation of parent duration.

```typescript
interface ChildDurationChangedDetail {
  duration: number;
}
```

#### activeroottemporalchange

Fired by `ef-canvas` when the active root temporal element changes. Used to coordinate timeline and canvas state.

```typescript
interface ActiveRootTemporalChangeDetail {
  activeRootTemporal: Element | null;
}
```

## Event Handling Patterns

### Bubbling and Composed

All custom events are dispatched with `bubbles: true` and `composed: true`, allowing them to traverse shadow DOM boundaries and be caught by ancestor elements.

```html
<div id="app">
  <ef-timeline>
    <ef-timeline-row>
      <!-- Events bubble up from here -->
    </ef-timeline-row>
  </ef-timeline>
</div>

<script>
  // Can listen at any ancestor level
  document.getElementById('app').addEventListener('row-select', (e) => {
    console.log('Row selected:', e.detail.elementId);
  });
</script>
```

### TypeScript Event Types

Import event detail types for type-safe event handling:

```typescript
import type { TrimChangeDetail, DialChangeDetail } from "@editframe/elements";

element.addEventListener("trim-change", (e: CustomEvent<TrimChangeDetail>) => {
  const { type, value } = e.detail;
  // TypeScript knows the shape of e.detail
});
```

### Event Coordination

Many events are designed to work together for coordinated UI updates:

```typescript
// Coordinate timeline selection with canvas
hierarchy.addEventListener('hierarchy-select', (e) => {
  const element = document.getElementById(e.detail.elementId);
  canvas.selectElement(element);
});

// Coordinate canvas selection with transform handles
canvas.addEventListener('selectionchange', (e) => {
  const selected = Array.from(e.detail.selection)[0];
  if (selected) {
    transformHandles.bounds = getBoundsFromElement(selected);
  }
});
```

## Related

- [Trim Handles](/skills/editor-gui/trim-handles) - Trim handle component
- [Transform Handles](/skills/editor-gui/transform-handles) - Transform handle component
- [Dial](/skills/editor-gui/dial) - Rotary dial input
- [Hierarchy](/skills/editor-gui/hierarchy) - Hierarchy panel component
- [Timeline](/skills/editor-gui/timeline) - Timeline editor component
