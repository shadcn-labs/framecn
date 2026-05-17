---
description: Interactive resize and rotation handles for transforming composition elements with mouse drag in the preview canvas.
---


# ef-transform-handles

## Attributes

- **bounds** (TransformBounds) (required) - Bounding box to display handles for
- **target** (string | HTMLElement) - Target element (for rotation calculation)
- **canvas-scale** (number, default: 1) - Canvas zoom scale (fallback when context unavailable)
- **enable-rotation** (boolean, default: false) - Show rotation handle
- **enable-resize** (boolean, default: true) - Show resize handles
- **enable-drag** (boolean, default: true) - Enable drag to move
- **corners-only** (boolean, default: false) - Show only corner handles (hide edge handles)
- **lock-aspect-ratio** (boolean, default: false) - Maintain aspect ratio during resize
- **rotation-step** (number) - Snap rotation to degrees (e.g. 15 for 15deg increments)
- **min-size** (number, default: 10) - Minimum width/height during resize

## Properties

- **interactionMode** ('idle' | 'dragging' | 'resizing' | 'rotating') - Current interaction state

# TransformHandles

Interactive resize and rotation handles for elements.

## Import

```tsx
import { TransformHandles } from "@editframe/react";
```

## Basic Usage

Display handles for a positioned element:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-transform-handles
    .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
    enable-rotation
    enable-resize
  ></ef-transform-handles>
</div>
```

Drag handles to resize, drag rotation handle to rotate.
```tsx
import { TransformHandles, OverlayLayer, OverlayItem } from "@editframe/react";

export const App = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    rotation: 0
  });

  return (
    <div className="relative w-full h-screen">
      <OverlayLayer className="absolute inset-0">
        <OverlayItem elementId="video-1">
          <TransformHandles
            bounds={bounds}
            onBoundsChange={(e) => setBounds(e.detail)}
          />
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
        <Video
          id="video-1"
          src="/assets/video.mp4"
          className="absolute"
          style={{
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
            height: bounds.height,
            transform: `rotate(${bounds.rotation}deg)`
          }}
        />
      </Timegroup>
    </div>
  );
};
```

## Bounds

Transform handles require bounds in screen coordinates:

```javascript
const handles = document.querySelector('ef-transform-handles');

handles.bounds = {
  x: 100,        // Left position
  y: 100,        // Top position
  width: 200,    // Width
  height: 150,   // Height
  rotation: 0    // Optional rotation in degrees
};
```
Bounds define position, size, and optional rotation:

```typescript
interface TransformBounds {
  x: number;        // Top-left x position
  y: number;        // Top-left y position
  width: number;    // Width
  height: number;   // Height
  rotation?: number; // Rotation in degrees
}
```

## Resize Handles

Enable resize with corner and edge handles:

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-resize
></ef-transform-handles>
```

### Corner Handles

Four corner handles resize proportionally by default:

- **Northwest**: Top-left corner
- **Northeast**: Top-right corner
- **Southwest**: Bottom-left corner
- **Southeast**: Bottom-right corner

### Edge Handles

Four edge handles resize in one dimension:

- **North**: Top edge (height only)
- **East**: Right edge (width only)
- **South**: Bottom edge (height only)
- **West**: Left edge (width only)

### Corners Only

Hide edge handles, show only corners:

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-resize
  corners-only
></ef-transform-handles>
```
```tsx
import { TransformHandles } from "@editframe/react";

export const CornersOnly = () => {
  const [bounds, setBounds] = useState({
    x: 150,
    y: 150,
    width: 400,
    height: 400,
    rotation: 0
  });

  return (
    <TransformHandles
      bounds={bounds}
      cornersOnly
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Rotation Handle

Enable rotation with top-center handle:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-transform-handles
    .bounds=${{ x: 150, y: 100, width: 200, height: 150, rotation: 15 }}
    enable-rotation
    enable-resize
  ></ef-transform-handles>
</div>
```

Drag the rotation handle to rotate the bounds.
```tsx
import { TransformHandles } from "@editframe/react";

export const RotatableElement = () => {
  const [bounds, setBounds] = useState({
    x: 200,
    y: 200,
    width: 300,
    height: 200,
    rotation: 0
  });

  return (
    <TransformHandles
      bounds={bounds}
      enableRotation
      onBoundsChange={(e) => setBounds(e.detail)}
      onRotationChange={(e) => console.log("Rotation:", e.detail)}
    />
  );
};
```

### Rotation Step

Snap rotation to specific increments:

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-rotation
  rotation-step="15"
></ef-transform-handles>
```

Rotation snaps to 15deg increments: 0deg, 15deg, 30deg, 45deg, etc.
```tsx
import { TransformHandles } from "@editframe/react";

export const SnappedRotation = () => {
  const [bounds, setBounds] = useState({
    x: 200,
    y: 200,
    width: 300,
    height: 300,
    rotation: 0
  });

  return (
    <TransformHandles
      bounds={bounds}
      enableRotation
      rotationStep={15} // Snap to 15deg increments
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Aspect Ratio Lock

Maintain aspect ratio during resize:

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-resize
  lock-aspect-ratio
></ef-transform-handles>
```

All resize operations maintain the original aspect ratio.
```tsx
import { TransformHandles } from "@editframe/react";

export const LockedAspect = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 640,
    height: 360, // 16:9 ratio
    rotation: 0
  });

  return (
    <TransformHandles
      bounds={bounds}
      lockAspectRatio
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Drag to Move

Enable dragging to move the bounds:

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-drag
></ef-transform-handles>
```

Click and drag the overlay to move.

### Disable Drag

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-drag="false"
></ef-transform-handles>
```
Click and drag the overlay area to move. Disable with `enableDrag={false}`:

```tsx
import { TransformHandles } from "@editframe/react";

export const ResizeOnly = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 300,
    height: 200
  });

  return (
    <TransformHandles
      bounds={bounds}
      enableDrag={false}
      enableRotation={false}
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Events

Listen for transformation events:

```javascript
const handles = document.querySelector('ef-transform-handles');

// Bounds changed (resize or move)
handles.addEventListener('bounds-change', (e) => {
  const { bounds } = e.detail;
  console.log('New bounds:', bounds);

  // Update element
  element.style.left = `${bounds.x}px`;
  element.style.top = `${bounds.y}px`;
  element.style.width = `${bounds.width}px`;
  element.style.height = `${bounds.height}px`;
});

// Rotation changed
handles.addEventListener('rotation-change', (e) => {
  const { rotation } = e.detail;
  console.log('New rotation:', rotation);

  // Update element
  element.style.transform = `rotate(${rotation}deg)`;
});
```
### onBoundsChange

```typescript
interface TransformBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}
```

### onRotationChange

```typescript
interface RotationChangeDetail {
  rotation: number; // Rotation in degrees
}
```

## Interaction Modes

Transform handles track current interaction:

```javascript
const handles = document.querySelector('ef-transform-handles');

console.log(handles.interactionMode);
// 'idle' | 'dragging' | 'resizing' | 'rotating'

// Only one mode active at a time
```
The `interactionMode` property reflects the current state: `'idle'`, `'dragging'`, `'resizing'`, or `'rotating'`. Only one mode is active at a time.

## Coordinate System

Transform handles work in screen pixel coordinates:

```javascript
// Bounds are in screen pixels (not canvas coordinates)
handles.bounds = {
  x: 100,      // Screen x
  y: 100,      // Screen y
  width: 200,  // Screen width
  height: 150  // Screen height
};

// Events dispatch screen coordinates
handles.addEventListener('bounds-change', (e) => {
  const { bounds } = e.detail;
  // bounds.x, bounds.y are screen coordinates
});
```

When using with canvas, convert between canvas and screen coordinates.
Bounds are in absolute pixel coordinates. When using with canvas, convert between canvas and screen coordinates as needed.

## Canvas Scale

Provide canvas scale for zoom-aware rendering:

```javascript
const handles = document.querySelector('ef-transform-handles');

// Set scale directly
handles.canvasScale = 1.5;

// Or via context (automatic with pan-zoom)
// <ef-pan-zoom>
//   <ef-transform-handles></ef-transform-handles>
// </ef-pan-zoom>
```

Canvas scale ensures handles render at consistent size regardless of zoom.
Use `canvasScale` when inside PanZoom to maintain handle size at any zoom level:

```tsx
import { PanZoom, TransformHandles, OverlayLayer, OverlayItem } from "@editframe/react";

export const ZoomableTransform = () => {
  const [bounds, setBounds] = useState({
    x: 200,
    y: 200,
    width: 400,
    height: 300,
    rotation: 0
  });
  const [scale, setScale] = useState(1);

  return (
    <PanZoom
      className="w-full h-full"
      onTransformChanged={(e) => setScale(e.detail.scale)}
    >
      <OverlayLayer className="absolute inset-0">
        <OverlayItem elementId="element-1">
          <TransformHandles
            bounds={bounds}
            canvasScale={scale} // Compensate for zoom
            enableRotation
            onBoundsChange={(e) => setBounds(e.detail)}
          />
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="fixed" duration="5s" className="w-[1920px] h-[1080px]">
        <Video
          id="element-1"
          src="/assets/video.mp4"
          className="absolute"
          style={{
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
            height: bounds.height,
            transform: `rotate(${bounds.rotation}deg)`
          }}
        />
      </Timegroup>
    </PanZoom>
  );
};
```

## Target Element

Provide target element for rotation calculations:

```javascript
const handles = document.querySelector('ef-transform-handles');
const element = document.getElementById('my-element');

// String selector
handles.target = '#my-element';

// Or element reference
handles.target = element;
```

Target element's center is used as rotation origin.

## Minimum Size

Set minimum bounds during resize:

```html
<ef-transform-handles
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  enable-resize
  min-size="50"
></ef-transform-handles>
```

Width and height cannot be resized below 50 pixels.
```tsx
import { TransformHandles } from "@editframe/react";

export const MinSizeConstraint = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 200
  });

  return (
    <TransformHandles
      bounds={bounds}
      minSize={100} // Cannot resize smaller than 100x100
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Styling

Transform handles use CSS custom properties:

```css
ef-transform-handles {
  /* Border color */
  --ef-transform-handles-border-color: #2196f3;

  /* Border during drag */
  --ef-transform-handles-dragging-border-color: #1976d2;

  /* Handle background */
  --ef-transform-handles-handle-color: #fff;

  /* Handle border */
  --ef-transform-handles-handle-border-color: #2196f3;

  /* Rotation handle color */
  --ef-transform-handles-rotate-handle-color: #4caf50;
}
```

## One-Way Data Flow

Transform handles follow one-way data flow:

1. Parent sets `bounds` prop
2. User interacts with handles
3. Handles dispatch events
4. Parent updates element
5. Parent updates `bounds` prop
6. Handles re-render

Never mutate the `bounds` prop directly from handle events.

## Wheel Events

Transform handles forward wheel events to parent pan-zoom for seamless zooming:

```html
<ef-pan-zoom>
  <ef-canvas>
    <!-- Wheel events on handles zoom the canvas -->
  </ef-canvas>
</ef-pan-zoom>
```

Mouse wheel over handles zooms the canvas instead of being blocked.

## Rotation Calculation

Rotation is calculated relative to target element's center:

```javascript
// For rotated elements
handles.target = element;
handles.bounds = {
  x: element.offsetLeft,
  y: element.offsetTop,
  width: element.offsetWidth,
  height: element.offsetHeight,
  rotation: getCurrentRotation(element)
};

// Rotation handle calculates delta from target center
```

## Usage with Canvas

Transform handles integrate with ef-canvas:

```javascript
const canvas = document.querySelector('ef-canvas');
const handles = document.querySelector('ef-transform-handles');

// Get element bounds from canvas
const data = canvas.getElementData('element-id');

// Convert to screen coordinates
const screenPos = canvas.canvasToScreenCoords(data.x, data.y);
const scale = panZoom.scale;

handles.bounds = {
  x: screenPos.x,
  y: screenPos.y,
  width: data.width * scale,
  height: data.height * scale,
  rotation: data.rotation
};

// Listen for changes
handles.addEventListener('bounds-change', (e) => {
  // Convert back to canvas coordinates
  const canvasPos = canvas.screenToCanvasCoords(e.detail.bounds.x, e.detail.bounds.y);
  canvas.updateElementPosition('element-id', canvasPos.x, canvasPos.y);
});
```

## Multi-Element Editor

```tsx
import { TransformHandles, OverlayLayer, OverlayItem } from "@editframe/react";

interface Element {
  id: string;
  bounds: TransformBounds;
}

export const MultiElementEditor = () => {
  const [elements, setElements] = useState<Element[]>([
    { id: "video-1", bounds: { x: 100, y: 100, width: 400, height: 300, rotation: 0 } },
    { id: "text-1", bounds: { x: 500, y: 200, width: 300, height: 100, rotation: 0 } }
  ]);
  const [selectedId, setSelectedId] = useState<string>("video-1");

  const updateBounds = (id: string, newBounds: TransformBounds) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, bounds: newBounds } : el
    ));
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  return (
    <div className="relative w-full h-screen">
      <OverlayLayer className="absolute inset-0">
        {selectedElement && (
          <OverlayItem elementId={selectedId}>
            <TransformHandles
              bounds={selectedElement.bounds}
              enableRotation
              onBoundsChange={(e) => updateBounds(selectedId, e.detail)}
            />
          </OverlayItem>
        )}
      </OverlayLayer>

      <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
        {elements.map((element) => (
          <Video
            key={element.id}
            id={element.id}
            src="/assets/video.mp4"
            className="absolute"
            style={{
              left: element.bounds.x,
              top: element.bounds.y,
              width: element.bounds.width,
              height: element.bounds.height,
              transform: `rotate(${element.bounds.rotation}deg)`
            }}
            onClick={() => setSelectedId(element.id)}
          />
        ))}
      </Timegroup>
    </div>
  );
};
```

## Keyboard Shortcuts

```tsx
import { TransformHandles } from "@editframe/react";

export const KeyboardTransform = () => {
  const [bounds, setBounds] = useState({
    x: 200,
    y: 200,
    width: 300,
    height: 300,
    rotation: 0
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case "ArrowLeft":
          setBounds({ ...bounds, x: bounds.x - step });
          break;
        case "ArrowRight":
          setBounds({ ...bounds, x: bounds.x + step });
          break;
        case "ArrowUp":
          setBounds({ ...bounds, y: bounds.y - step });
          break;
        case "ArrowDown":
          setBounds({ ...bounds, y: bounds.y + step });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bounds]);

  return (
    <TransformHandles
      bounds={bounds}
      enableRotation
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Handle Features

- **8 resize handles**: nw, n, ne, e, se, s, sw, w
- **Rotation handle**: Top-center circular handle (when enabled)
- **Drag area**: Click anywhere inside bounds to drag
- **Visual feedback**: Handles highlight on hover
- **Smart cursors**: Automatically set appropriate resize cursors
- **Shift key**: Hold to maintain aspect ratio during resize

## CSS Customization

Use CSS variables to customize handle appearance:

```css
.transform-handles {
  --ef-transform-handles-border-color: #3b82f6;
  --ef-transform-handles-handle-color: #ffffff;
  --ef-transform-handles-handle-border-color: #3b82f6;
  --ef-transform-handles-rotate-handle-color: #10b981;
}
```

## Pointer Events

Transform handles have `pointer-events: auto` for interactivity. Parent overlay layer should have `pointer-events: none`.

## Important Notes

- Bounds are in absolute pixel coordinates
- Use `canvas-scale` when inside pan-zoom to maintain handle size
- Rotation is in degrees (0-360)
- `lock-aspect-ratio` maintains the initial aspect ratio
- Handles capture pointer events but allow wheel events to pass through
- Minimum size prevents resizing below practical limits
- Must be placed inside an OverlayItem within an OverlayLayer
- Bounds are in absolute pixel coordinates
- Use `canvasScale` when inside PanZoom to maintain handle size
- Rotation is in degrees (0-360)
- `lockAspectRatio` maintains the initial aspect ratio
- Handles capture pointer events but allow wheel events to pass through
- Minimum size prevents resizing below practical limits
