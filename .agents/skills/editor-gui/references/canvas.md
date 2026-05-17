---
description: "Interactive canvas area with element selection, drag-and-drop repositioning, and transform handle integration."
---


# ef-canvas

## Attributes

- **data-element-id-attribute** (string, default: data-element-id) - Attribute name for element identification
- **enable-transform-handles** (boolean, default: true) - Show transform handles for selected elements

## Properties

- **selectionContext** (SelectionContext) - Selection state and methods (provided via Lit context)
- **highlightedElement** (HTMLElement | null) - Currently highlighted (hovered) element
- **activeRootTemporal** (TemporalMixinInterface & HTMLElement | null) - Root temporal element containing current selection

## Methods

- **registerElement(element: HTMLElement, id?: string): string** - Register an element for canvas management
  - Returns: Element ID
- **unregisterElement(element: HTMLElement | string): void** - Unregister an element
- **tryRegisterElement(element: HTMLElement): void** - Try to register element, auto-generating ID if needed
- **updateElementPosition(elementId: string, x: number, y: number): void** - Update element position in canvas coordinates
- **getElementData(elementId: string): CanvasElementData | null** - Get element metadata
  - Returns: CanvasElementData | null
- **getAllElementsData(): CanvasElementData[]** - Get metadata for all elements
  - Returns: CanvasElementData[]
- **screenToCanvasCoords(screenX: number, screenY: number): { x: number, y: number }** - Convert screen coordinates to canvas coordinates
- **canvasToScreenCoords(canvasX: number, canvasY: number): { x: number, y: number }** - Convert canvas coordinates to screen coordinates
- **setHighlightedElement(element: HTMLElement | null): void** - Set the highlighted (hovered) element

# Canvas / CanvasItem

Interactive canvas for managing, selecting, and manipulating elements with drag-and-drop and transform handles.

> **Note**: Canvas and CanvasItem components are currently not exported from `@editframe/react`. This documentation describes the underlying `ef-canvas` and `ef-canvas-item` HTML elements. To use them in React, you'll need to use the HTML elements directly or wait for official React component export.

## Basic Usage

Canvas automatically manages any child elements:

```html live
<div class="relative w-full h-[400px] border border-gray-300 rounded overflow-hidden">
  <ef-pan-zoom class="w-full h-full">
    <ef-canvas class="w-[1200px] h-[800px] bg-gray-100">
      <div id="box-1" class="absolute top-8 left-8 w-32 h-32 bg-blue-500 text-white flex items-center justify-center rounded">
        Box 1
      </div>
      <div id="box-2" class="absolute top-48 left-48 w-32 h-32 bg-green-500 text-white flex items-center justify-center rounded">
        Box 2
      </div>
      <div id="box-3" class="absolute top-8 left-48 w-32 h-32 bg-red-500 text-white flex items-center justify-center rounded">
        Box 3
      </div>
    </ef-canvas>
  </ef-pan-zoom>
</div>
```

Click to select, drag to move, use handles to resize and rotate.
```tsx
import { useRef } from "react";

export const App = () => {
  const canvasRef = useRef<HTMLElement>(null);

  const handleSelect = (e: CustomEvent) => {
    console.log("Selected:", e.detail);
  };

  return (
    <div className="h-screen flex">
      {/* Canvas with draggable items */}
      <div className="flex-1">
        <ef-canvas
          ref={canvasRef as any}
          onSelectionChange={handleSelect as any}
          enable-transform-handles
        >
          <ef-timegroup mode="contain" className="w-[1920px] h-[1080px]">
            <ef-canvas-item data-element-id="video-1">
              <ef-video
                src="/assets/video.mp4"
                className="absolute"
                style={{ left: "100px", top: "100px", width: "400px", height: "300px" }}
              />
            </ef-canvas-item>

            <ef-canvas-item data-element-id="text-1">
              <ef-text
                duration="5s"
                className="absolute text-white text-4xl"
                style={{ left: "200px", top: "50px" }}
              >
                Draggable Text
              </ef-text>
            </ef-canvas-item>
          </ef-timegroup>
        </ef-canvas>
      </div>
    </div>
  );
};
```

## Selection

Canvas provides multiple selection modes:

### Single Selection

Click an element to select it:

```javascript
const canvas = document.querySelector('ef-canvas');

// Listen for selection changes
canvas.selectionContext.addEventListener('selectionchange', () => {
  const selected = Array.from(canvas.selectionContext.selectedIds);
  console.log('Selected:', selected);
});
```

### Multi-Selection

Hold **Shift** to add to selection:

- **Click**: Select single element (clear others)
- **Shift + Click**: Add element to selection
- **Ctrl/Cmd + Click**: Toggle element selection

### Box Selection

Click and drag on empty space to select multiple elements:

```html live
<div class="relative w-full h-[400px] border border-gray-300 rounded overflow-hidden">
  <ef-pan-zoom class="w-full h-full">
    <ef-canvas class="w-[1200px] h-[800px] bg-gray-100">
      <div id="item-1" class="absolute top-12 left-12 w-24 h-24 bg-blue-500 rounded"></div>
      <div id="item-2" class="absolute top-12 left-48 w-24 h-24 bg-green-500 rounded"></div>
      <div id="item-3" class="absolute top-12 left-84 w-24 h-24 bg-red-500 rounded"></div>
      <div id="item-4" class="absolute top-48 left-12 w-24 h-24 bg-purple-500 rounded"></div>
      <div id="item-5" class="absolute top-48 left-48 w-24 h-24 bg-yellow-500 rounded"></div>
      <div id="item-6" class="absolute top-48 left-84 w-24 h-24 bg-pink-500 rounded"></div>
    </ef-canvas>
  </ef-pan-zoom>
</div>
```

Drag on empty space to draw selection box. Hold **Shift** to add to existing selection.
### Multi-Select

```tsx
export const MultiSelectCanvas = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;

    const handleSelectionChange = (e: CustomEvent) => {
      setSelectedIds(Array.from(e.detail.selectedIds || []));
    };

    canvas.addEventListener("selectionchange" as any, handleSelectionChange);
    return () => {
      canvas.removeEventListener("selectionchange" as any, handleSelectionChange);
    };
  }, []);

  return (
    <div>
      <div className="p-4 bg-gray-100">
        <div className="font-semibold mb-2">Selected Elements:</div>
        {selectedIds.length === 0 ? (
          <div className="text-gray-500">None</div>
        ) : (
          <ul className="list-disc list-inside">
            {selectedIds.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        )}
      </div>

      <ef-canvas id="canvas">
        <ef-timegroup mode="contain" className="w-[1920px] h-[1080px]">
          <ef-canvas-item data-element-id="video-1">
            <ef-video src="/assets/video1.mp4" />
          </ef-canvas-item>
          <ef-canvas-item data-element-id="video-2">
            <ef-video src="/assets/video2.mp4" />
          </ef-canvas-item>
          <ef-canvas-item data-element-id="text-1">
            <ef-text duration="5s">Title</ef-text>
          </ef-canvas-item>
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Drag and Drop

Canvas supports dragging selected elements:

### Single Element Drag

Click and drag an element to move it:

```javascript
// Element position updates automatically
// No event handlers needed
```

### Multi-Element Drag

Select multiple elements and drag any selected element to move all:

```javascript
const canvas = document.querySelector('ef-canvas');

// Select multiple elements
canvas.selectionContext.select('box-1');
canvas.selectionContext.addToSelection('box-2');
canvas.selectionContext.addToSelection('box-3');

// Drag any selected element - all move together
```

### Drag Threshold

Canvas uses a 5-pixel drag threshold to distinguish clicks from drags.

## Transform Handles

Canvas shows transform handles for selected elements:

### Single Selection

Handles for resize and rotate:

- **Corner handles**: Resize proportionally
- **Edge handles**: Resize in one dimension
- **Rotation handle**: Rotate around center

### Multi-Selection

Handles for the bounding box:

- **Corner handles**: Scale all elements proportionally
- **Rotation handle**: Rotate all elements around group center

### Disable Handles

```html
<ef-canvas enable-transform-handles="false">
  <!-- No transform handles shown -->
</ef-canvas>
```

## Programmatic Control

Control canvas selection via JavaScript:

```javascript
const canvas = document.querySelector('ef-canvas');
const { selectionContext } = canvas;

// Select single element
selectionContext.select('element-id');

// Add to selection
selectionContext.addToSelection('another-id');

// Toggle selection
selectionContext.toggle('element-id');

// Clear selection
selectionContext.clear();

// Get selected IDs
const selected = Array.from(selectionContext.selectedIds);
```
```tsx
export const ProgrammaticCanvas = () => {
  const canvasRef = useRef<any>(null);

  const selectElement = (id: string) => {
    if (canvasRef.current) {
      canvasRef.current.selectElement(id);
    }
  };

  const getSelection = () => {
    if (canvasRef.current) {
      const selected = canvasRef.current.getSelectedElements();
      console.log("Selected elements:", selected);
    }
  };

  return (
    <div>
      <div className="p-4 space-x-2">
        <button onClick={() => selectElement("video-1")}>Select Video</button>
        <button onClick={() => selectElement("text-1")}>Select Text</button>
        <button onClick={getSelection}>Get Selection</button>
      </div>

      <ef-canvas ref={canvasRef} id="canvas">
        <ef-timegroup mode="contain" className="w-[1920px] h-[1080px]">
          <ef-canvas-item data-element-id="video-1">
            <ef-video src="/assets/video.mp4" />
          </ef-canvas-item>
          <ef-canvas-item data-element-id="text-1">
            <ef-text duration="5s">Text</ef-text>
          </ef-canvas-item>
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Update Element Bounds

```tsx
export const BoundsControl = () => {
  const canvasRef = useRef<any>(null);

  const updatePosition = (elementId: string, x: number, y: number) => {
    if (canvasRef.current) {
      canvasRef.current.updateElementBounds(elementId, {
        x,
        y,
        width: 400,
        height: 300
      });
    }
  };

  return (
    <div>
      <div className="p-4">
        <button onClick={() => updatePosition("video-1", 100, 100)}>
          Position 1
        </button>
        <button onClick={() => updatePosition("video-1", 500, 200)}>
          Position 2
        </button>
      </div>

      <ef-canvas ref={canvasRef}>
        <ef-timegroup mode="contain" className="w-[1920px] h-[1080px]">
          <ef-canvas-item data-element-id="video-1">
            <ef-video src="/assets/video.mp4" />
          </ef-canvas-item>
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Editor with Canvas

```tsx
export const CanvasEditor = () => {
  return (
    <div className="h-screen grid grid-cols-[250px_1fr]">
      {/* Hierarchy panel */}
      <div className="border-r bg-gray-50">
        <ef-hierarchy target="editor-canvas" header="Layers" show-header />
      </div>

      {/* Canvas area */}
      <div className="flex flex-col">
        <div className="flex-1 p-4 bg-gray-900">
          <ef-preview />
        </div>

        <ef-canvas id="editor-canvas" enable-transform-handles>
          <ef-timegroup mode="sequence" className="w-[1920px] h-[1080px]">
            <ef-canvas-item data-element-id="bg-video">
              <ef-video
                src="/assets/background.mp4"
                className="absolute inset-0 size-full"
              />
            </ef-canvas-item>

            <ef-canvas-item data-element-id="title">
              <ef-text
                duration="5s"
                className="absolute top-20 left-20 text-white text-5xl"
              >
                Video Title
              </ef-text>
            </ef-canvas-item>
          </ef-timegroup>
        </ef-canvas>
      </div>
    </div>
  );
};
```

## Element Registration

Canvas automatically registers child elements:

### Automatic Registration

All child elements are auto-registered with auto-generated IDs:

```html
<ef-canvas>
  <div>Auto-registered with generated ID</div>
</ef-canvas>
```

### Manual Registration

Provide explicit IDs for stable references:

```html
<ef-canvas>
  <div id="my-element">Registered as 'my-element'</div>
</ef-canvas>
```

### Programmatic Registration

Register elements via JavaScript:

```javascript
const canvas = document.querySelector('ef-canvas');
const element = document.createElement('div');

// Register with auto-generated ID
canvas.tryRegisterElement(element);

// Register with explicit ID
const id = canvas.registerElement(element, 'my-custom-id');

// Unregister
canvas.unregisterElement('my-custom-id');
```
Canvas identifies elements using data attributes:

- `data-element-id` - Primary element identifier (default)
- `data-timegroup-id` - For timegroup elements
- Custom attribute via `element-id-attribute` prop

## Position Management

Update element positions in canvas coordinates:

```javascript
const canvas = document.querySelector('ef-canvas');

// Update position (canvas coordinates)
canvas.updateElementPosition('element-id', 100, 200);

// Get element metadata
const data = canvas.getElementData('element-id');
console.log('Position:', data.x, data.y);
console.log('Size:', data.width, data.height);
console.log('Rotation:', data.rotation);

// Get all elements
const allElements = canvas.getAllElementsData();
```

## Coordinate Conversion

Convert between screen and canvas coordinates:

```javascript
const canvas = document.querySelector('ef-canvas');

// Screen to canvas
const canvasPos = canvas.screenToCanvasCoords(clientX, clientY);

// Canvas to screen
const screenPos = canvas.canvasToScreenCoords(canvasX, canvasY);
```

Coordinates account for pan/zoom transforms.

## Hover Highlighting

Canvas tracks hovered elements:

```javascript
const canvas = document.querySelector('ef-canvas');

// Get highlighted element
console.log(canvas.highlightedElement);

// Programmatically highlight
const element = document.getElementById('my-element');
canvas.setHighlightedElement(element);

// Clear highlight
canvas.setHighlightedElement(null);
```

Highlighted elements get `data-highlighted` attribute for styling:

```css
[data-highlighted] {
  outline: 2px solid blue;
}
```

## Selection Styling

Selected elements get `data-selected` attribute:

```css
[data-selected] {
  outline: 2px solid #2196f3;
}
```

## Pan/Zoom Integration

Canvas works seamlessly with ef-pan-zoom:

```html
<ef-pan-zoom>
  <ef-canvas>
    <!-- Elements stay correctly positioned during pan/zoom -->
  </ef-canvas>
</ef-pan-zoom>
```

Canvas automatically:

- Converts coordinates accounting for zoom
- Updates transform handles
- Maintains correct hit testing

## Active Root Temporal

Canvas tracks the root temporal element containing selection:

```javascript
const canvas = document.querySelector('ef-canvas');

// Get active root temporal
console.log(canvas.activeRootTemporal);

// Listen for changes
canvas.addEventListener('activeroottemporalchange', (e) => {
  console.log('Active root:', e.detail.activeRootTemporal);
});
```

Useful for timeline scrubbing and playback controls.

## Nested Elements

Canvas supports nested element hierarchies:

```html
<ef-canvas>
  <div id="parent" class="absolute top-0 left-0 w-64 h-48">
    <div id="child" class="absolute top-4 left-4 w-32 h-24">
      <!-- Nested element -->
    </div>
  </div>
</ef-canvas>
```

Both parent and child are selectable and draggable.

## Element Metadata

Canvas tracks element bounds and transforms:

```typescript
interface CanvasElementData {
  id: string;
  element: HTMLElement;
  x: number;        // Top-left x in canvas coordinates
  y: number;        // Top-left y in canvas coordinates
  width: number;    // Width in canvas units
  height: number;   // Height in canvas units
  rotation?: number; // Rotation in degrees
}
```

Metadata updates automatically when elements change.

## Coordinate System

Canvas uses a unified coordinate calculation:

- **Dimensions**: From `offsetWidth`/`offsetHeight` (unaffected by transforms)
- **Center**: From `getBoundingClientRect()` center (rotation-invariant)
- **Top-left**: Calculated from center minus half dimensions

This approach works correctly for rotated, scaled, and nested elements.

## Performance

Canvas optimizes for interactive editing:

- Single RAF loop for overlays and handles
- Pointer capture during drag operations
- Efficient hit testing with z-order respect
- No change detection overhead

## Deprecated: ef-canvas-item

The `ef-canvas-item` wrapper is deprecated. Use plain HTML elements:

```html
<!-- Old (deprecated) -->
<ef-canvas>
  <ef-canvas-item id="item-1">
    <div>Content</div>
  </ef-canvas-item>
</ef-canvas>

<!-- New (recommended) -->
<ef-canvas>
  <div id="item-1">Content</div>
</ef-canvas>
```

All DOM nodes in canvas are now automatically selectable.

## Events

### activeroottemporalchange

Fired when active root temporal changes. See the Active Root Temporal section above.
### selectionchange

Fired when selection changes:

```typescript
interface SelectionChangeDetail {
  selectedIds: Set<string>;
  previousIds: Set<string>;
}
```

### elementmoved

Fired when element is dragged:

```typescript
interface ElementMovedDetail {
  elementId: string;
  x: number;
  y: number;
}
```

### elementresized

Fired when element is resized:

```typescript
interface ElementResizedDetail {
  elementId: string;
  width: number;
  height: number;
}
```

### elementrotated

Fired when element is rotated:

```typescript
interface ElementRotatedDetail {
  elementId: string;
  rotation: number;
}
```

## Methods

### selectElement()

Select an element by ID:

```tsx
canvas.selectElement("element-id");
```

### getSelectedElements()

Get selected elements:

```tsx
const elements = canvas.getSelectedElements();
// Returns: HTMLElement[]
```

### updateElementBounds()

Update element transform:

```tsx
canvas.updateElementBounds("element-id", {
  x: 100,
  y: 100,
  width: 400,
  height: 300,
  rotation: 45
});
```

### clearSelection()

Clear all selections:

```tsx
canvas.clearSelection();
```

### deleteSelected()

Delete selected elements:

```tsx
canvas.deleteSelected();
```

## CSS Customization

```css
ef-canvas {
  --canvas-bg: #1f2937;
  --canvas-grid-color: rgba(255, 255, 255, 0.1);
  --canvas-selection-color: #3b82f6;
  --canvas-highlight-color: #10b981;
}
```

## Canvas Features

- **Click to select**: Click elements to select them
- **Drag to move**: Drag selected elements to reposition
- **Transform handles**: Resize and rotate with handles
- **Multi-select**: Hold Cmd/Ctrl to select multiple elements
- **Keyboard shortcuts**: Arrow keys to nudge, Delete to remove
- **Selection box**: Click and drag background for box selection
- **Snap to grid**: Optional grid snapping for precise placement

## CanvasItem Wrapper

`ef-canvas-item` is a wrapper that makes elements interactive:

- Registers element with canvas for selection
- Provides drag-and-drop behavior
- Manages transform handles display
- Tracks element bounds for manipulation
- Forwards pointer events to canvas

## Keyboard Shortcuts

- **Arrow keys**: Nudge selected element (1px or 10px with Shift)
- **Delete/Backspace**: Delete selected elements
- **Cmd/Ctrl + A**: Select all
- **Cmd/Ctrl + D**: Duplicate selected
- **Escape**: Clear selection
- **Cmd/Ctrl + Z**: Undo (if implemented)

## Integration Patterns

### With Hierarchy

```tsx
<div className="flex">
  <ef-hierarchy target="canvas" />
  <ef-canvas id="canvas">
    {/* content */}
  </ef-canvas>
</div>
```

### With OverlayLayer

```tsx
<ef-canvas>
  <ef-overlay-layer>
    <ef-overlay-item element-id="selected">
      <ef-transform-handles />
    </ef-overlay-item>
  </ef-overlay-layer>

  {/* content */}
</ef-canvas>
```

## Important Notes

- Canvas and CanvasItem are not yet exported from React package
- Use HTML element syntax in React until official export
- Canvas provides selection context via Lit context system
- Transform handles require `enable-transform-handles` prop
- Elements must be wrapped in `ef-canvas-item` to be interactive
- Canvas automatically manages overlay positioning
- Supports nested timegroups and complex hierarchies
- Selection state syncs with Hierarchy component

## Future React Components

When officially exported, usage will be:

```tsx
import { Canvas, CanvasItem } from "@editframe/react";

<Canvas enableTransformHandles onSelectionChange={handleChange}>
  <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
    <CanvasItem elementId="video-1">
      <Video src="/assets/video.mp4" />
    </CanvasItem>
  </Timegroup>
</Canvas>
```
