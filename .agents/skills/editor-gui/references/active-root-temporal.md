---
description: Component that displays the ID of whichever root temporal element is currently active based on canvas selection state.
---


# ef-active-root-temporal

## Attributes

- **canvas** (string) - Canvas element ID or selector to bind to

## Properties

- **activeRootTemporal** (TemporalMixinInterface & HTMLElement | null) - Currently active root temporal element

# ActiveRootTemporal

Displays the ID of the active root temporal element from a canvas.

> **Note**: The ActiveRootTemporal component is currently not exported from `@editframe/react`. This documentation describes the underlying `ef-active-root-temporal` HTML element. To use it in React, you'll need to use the HTML element directly or wait for official React component export.

## Import

When officially exported, usage will be:

```tsx
import { ActiveRootTemporal } from "@editframe/react";
```

## Basic Usage

Show the active root temporal ID:

```html
<ef-active-root-temporal canvas="my-canvas">None</ef-active-root-temporal>

<ef-canvas id="my-canvas">
  <ef-timegroup id="scene-1">
    <!-- Content -->
  </ef-timegroup>
  <ef-timegroup id="scene-2">
    <!-- Content -->
  </ef-timegroup>
</ef-canvas>
```

When you select an element in the canvas, the active root temporal ID displays.
```tsx
export const App = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header showing active timegroup */}
      <div className="p-4 bg-gray-800 text-white">
        <span className="mr-2">Active Timegroup:</span>
        <ef-active-root-temporal canvas="editor-canvas" />
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ef-canvas id="editor-canvas">
          <ef-timegroup id="root-tg" mode="sequence" className="w-[1920px] h-[1080px]">
            <ef-video src="/assets/video.mp4" />
          </ef-timegroup>
        </ef-canvas>
      </div>
    </div>
  );
};
```

## Canvas Binding

Bind to a canvas by ID or selector:

### By ID

```html
<ef-active-root-temporal canvas="my-canvas"></ef-active-root-temporal>
<ef-canvas id="my-canvas"></ef-canvas>
```

### By Selector

```html
<ef-active-root-temporal canvas=".editor-canvas"></ef-active-root-temporal>
<ef-canvas class="editor-canvas"></ef-canvas>
```

### Nearest Ancestor

Omit canvas attribute to use nearest ancestor:

```html
<ef-canvas>
  <ef-active-root-temporal></ef-active-root-temporal>
</ef-canvas>
```
### Auto-Detection

```tsx
export const AutoDetect = () => {
  return (
    <div>
      {/* Will find nearest ef-canvas ancestor */}
      <ef-canvas>
        <div className="p-2 bg-gray-100">
          <span>Current Root: </span>
          <ef-active-root-temporal />
        </div>

        <ef-timegroup id="auto-detected-root" mode="sequence">
          <ef-video src="/assets/video.mp4" />
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Active Root Temporal

The active root temporal is the topmost timegroup containing the selected element:

```html
<ef-canvas id="canvas">
  <ef-timegroup id="root-1">
    <ef-timegroup id="child-1">
      <div id="element-1">Content</div>
    </ef-timegroup>
  </ef-timegroup>
</ef-canvas>
```

When `element-1` is selected, active root temporal is `root-1`.

## Display Content

### Default Content

Show ID of active root temporal:

```html
<ef-active-root-temporal canvas="canvas"></ef-active-root-temporal>
<!-- Displays: "root-1" when root-1 is active -->
```

### Fallback Content

Provide fallback text for when no root is active:

```html
<ef-active-root-temporal canvas="canvas">
  No selection
</ef-active-root-temporal>
<!-- Displays: "No selection" when nothing is selected -->
```
### With Hierarchy

```tsx
export const EditorLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top bar with active root display */}
      <div className="p-2 bg-gray-800 text-white flex items-center gap-4">
        <span className="text-sm">Active Root:</span>
        <ef-active-root-temporal
          canvas="canvas"
          className="font-mono text-sm bg-gray-700 px-2 py-1 rounded"
        />
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex">
        <div className="w-64 border-r bg-gray-50">
          <ef-hierarchy target="canvas" />
        </div>

        <div className="flex-1">
          <ef-canvas id="canvas">
            <ef-timegroup id="scene-1" mode="contain" className="w-[1920px] h-[1080px]">
              <ef-video src="/assets/video.mp4" />
            </ef-timegroup>
          </ef-canvas>
        </div>
      </div>
    </div>
  );
};
```

### Styled Display

```tsx
export const StyledDisplay = () => {
  return (
    <div className="flex items-center gap-2 p-4 bg-gray-900 text-white">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
      <span className="text-sm text-gray-400">Active Scene:</span>
      <ef-active-root-temporal
        canvas="canvas"
        className="text-sm font-mono bg-gray-800 px-3 py-1 rounded border border-gray-700"
      />
    </div>
  );
};
```

### Breadcrumb Navigation

```tsx
export const BreadcrumbNav = () => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b text-sm">
      <span className="text-gray-500">Project</span>
      <span className="text-gray-400">/</span>
      <span className="text-gray-500">Composition</span>
      <span className="text-gray-400">/</span>
      <ef-active-root-temporal
        canvas="canvas"
        className="font-medium text-blue-600"
      />
    </div>
  );
};
```

## Events

Listen for changes:

```javascript
const canvas = document.querySelector('ef-canvas');

canvas.addEventListener('activeroottemporalchange', (e) => {
  const { activeRootTemporal } = e.detail;
  console.log('Active root:', activeRootTemporal?.id);
});
```

The canvas fires this event, not ef-active-root-temporal.
The canvas fires `activeroottemporalchange` when the active root changes:

```typescript
interface ActiveRootTemporalChangeDetail {
  id: string | null;
  element: HTMLElement | null;
}
```

Listen to this event to track changes:

```tsx
useEffect(() => {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const handleChange = (e: CustomEvent) => {
    console.log("New active root:", e.detail.id);
  };

  canvas.addEventListener("activeroottemporalchange", handleChange);
  return () => {
    canvas.removeEventListener("activeroottemporalchange", handleChange);
  };
}, []);
```

## Use Cases

### Timeline Scrubbing

Use active root temporal to determine which timeline to scrub:

```javascript
const activeRootDisplay = document.querySelector('ef-active-root-temporal');
const canvas = document.querySelector('ef-canvas');

canvas.addEventListener('activeroottemporalchange', (e) => {
  const rootTemporal = e.detail.activeRootTemporal;

  if (rootTemporal) {
    // Update scrubber to control this timegroup
    scrubber.target = rootTemporal.id;
  }
});
```

### Playback Controls

Connect playback controls to active root:

```javascript
const canvas = document.querySelector('ef-canvas');
const controls = document.querySelector('ef-controls');

canvas.addEventListener('activeroottemporalchange', (e) => {
  if (e.detail.activeRootTemporal) {
    controls.target = e.detail.activeRootTemporal.id;
  }
});
```

### Context Display

Show which composition is active:

```html
<div class="toolbar">
  <span class="label">Active Composition:</span>
  <ef-active-root-temporal canvas="canvas" class="font-mono">
    None
  </ef-active-root-temporal>
</div>
```
- **Editor breadcrumbs**: Show current timegroup in navigation
- **Scene indicator**: Display active scene in multi-scene compositions
- **Context display**: Show editing context to users
- **Debug info**: Display active root for development
- **Status bar**: Show current focus in status/toolbar

## Multiple Canvases

Use separate instances for multiple canvases:

```html
<ef-active-root-temporal canvas="canvas-1">None</ef-active-root-temporal>
<ef-canvas id="canvas-1"></ef-canvas>

<ef-active-root-temporal canvas="canvas-2">None</ef-active-root-temporal>
<ef-canvas id="canvas-2"></ef-canvas>
```

Each instance tracks its own canvas independently.
```tsx
export const MultiCanvas = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Canvas 1 */}
      <div className="space-y-2">
        <div className="p-2 bg-blue-100">
          Canvas 1 Root:
          <ef-active-root-temporal canvas="canvas-1" />
        </div>
        <ef-canvas id="canvas-1">
          <ef-timegroup id="canvas-1-root" mode="contain">
            <ef-video src="/assets/video1.mp4" />
          </ef-timegroup>
        </ef-canvas>
      </div>

      {/* Canvas 2 */}
      <div className="space-y-2">
        <div className="p-2 bg-green-100">
          Canvas 2 Root:
          <ef-active-root-temporal canvas="canvas-2" />
        </div>
        <ef-canvas id="canvas-2">
          <ef-timegroup id="canvas-2-root" mode="contain">
            <ef-video src="/assets/video2.mp4" />
          </ef-timegroup>
        </ef-canvas>
      </div>
    </div>
  );
};
```

## Selection Behavior

Active root temporal updates when:

- Element is selected in canvas
- Selection changes to different element
- Selection is cleared

Selection of nested elements always resolves to their root temporal ancestor.

## Finding Root Temporal

The canvas walks up the DOM tree from selected element to find the topmost timegroup:

```javascript
// Simplified algorithm
let current = selectedElement;
let rootTemporal = null;

while (current && current !== canvas) {
  if (current.tagName === 'EF-TIMEGROUP') {
    rootTemporal = current;
  }
  current = current.parentElement;
}

return rootTemporal;
```

## Null State

When no element is selected or selected element has no root temporal ancestor:

```javascript
const display = document.querySelector('ef-active-root-temporal');
console.log(display.activeRootTemporal); // null

// Text content shows fallback
console.log(display.textContent); // "None" (from slot content)
```

## Temporal Mixin Interface

Active root temporal is typed as `TemporalMixinInterface`:

```typescript
interface TemporalMixinInterface {
  id: string;
  durationMs: number;
  currentTimeMs: number;
  play(): void;
  pause(): void;
  // ... other temporal properties and methods
}
```

This ensures the element has timing capabilities.

## Canvas Property

Access the bound canvas element:

```javascript
const display = document.querySelector('ef-active-root-temporal');

// Canvas element reference (internal)
console.log(display.canvasElement); // EFCanvas instance
```

## With Selection Context

```tsx
export const SelectionAware = () => {
  const [activeRoot, setActiveRoot] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;

    const handleRootChange = (e: CustomEvent) => {
      setActiveRoot(e.detail?.id || null);
    };

    canvas.addEventListener("activeroottemporalchange" as any, handleRootChange);
    return () => {
      canvas.removeEventListener("activeroottemporalchange" as any, handleRootChange);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100">
        <div className="text-sm text-gray-600">Active Root ID:</div>
        <div className="font-mono">{activeRoot || "None"}</div>
      </div>

      <ef-canvas id="canvas">
        <ef-timegroup id="main-sequence" mode="sequence">
          <ef-timegroup id="scene-1" mode="contain">
            <ef-video src="/assets/video1.mp4" />
          </ef-timegroup>
          <ef-timegroup id="scene-2" mode="contain">
            <ef-video src="/assets/video2.mp4" />
          </ef-timegroup>
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Dynamic Root Display

```tsx
export const DynamicRootDisplay = () => {
  const canvasRef = useRef<any>(null);

  const selectRoot = (rootId: string) => {
    if (canvasRef.current) {
      canvasRef.current.selectElement(rootId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Root selector */}
      <div className="p-4 bg-gray-100 space-x-2">
        <button
          onClick={() => selectRoot("scene-1")}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Scene 1
        </button>
        <button
          onClick={() => selectRoot("scene-2")}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Scene 2
        </button>
      </div>

      {/* Active root display */}
      <div className="p-4 bg-white border rounded">
        <span className="text-gray-600">Current: </span>
        <ef-active-root-temporal canvas="canvas" className="font-semibold" />
      </div>

      {/* Canvas */}
      <ef-canvas ref={canvasRef} id="canvas">
        <ef-timegroup id="scene-1" mode="contain">
          <ef-video src="/assets/video1.mp4" />
        </ef-timegroup>
        <ef-timegroup id="scene-2" mode="contain">
          <ef-video src="/assets/video2.mp4" />
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Future React Component

When officially exported, usage will be:

```tsx
import { ActiveRootTemporal } from "@editframe/react";

<ActiveRootTemporal
  canvas="canvas-id"
  className="font-mono"
  onRootChange={(e) => console.log(e.detail)}
/>
```

## Styling

Style the display element:

```css
ef-active-root-temporal {
  display: inline-block;
  font-family: monospace;
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

## Reactive Updates

Display automatically updates when selection changes. No manual refresh needed.

## Disconnection

When disconnected, the element:

- Removes event listener from canvas
- Clears active root temporal reference
- Cleans up internal state

## Initialization

On connection, the element:

1. Finds canvas (by attribute, selector, or ancestor)
2. Reads initial active root temporal
3. Sets up event listener
4. Updates display

## Important Notes

- Canvas attribute can be ID or CSS selector
- Falls back to nearest ancestor canvas if not specified
- Only displays root temporal elements (top-level timegroups)
- Updates automatically - no manual refresh needed
- Shows element ID, not a friendly name
- Returns null when no root temporal is active
- Currently not exported from React package - use HTML element
- Canvas attribute can be ID or CSS selector
- Falls back to nearest ancestor canvas if not specified
- Only displays root temporal elements (top-level timegroups)
- Updates automatically - no manual refresh needed
- Shows element ID, not a friendly name
- Returns empty string when no root temporal is active
