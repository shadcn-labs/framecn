---
description: "Resizable box component with draggable edge and corner handles, supporting configurable minimum and maximum size constraints."
---


# ef-resizable-box

## Attributes

- **bounds** (BoxBounds) (required) - Bounding box dimensions and position
- **min-size** (number, default: 10) - Minimum width and height during resize

# ResizableBox

Resizable container with drag handles for interactive resizing and positioning.

## Import

```tsx
import { ResizableBox } from "@editframe/react";
```

## Basic Usage

Display a resizable box:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-resizable-box
    .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  >
    <div class="flex items-center justify-center text-gray-600">
      Drag handles to resize
    </div>
  </ef-resizable-box>
</div>
```
```tsx
import { ResizableBox } from "@editframe/react";

export const App = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 300,
    height: 200
  });

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <ResizableBox
        bounds={bounds}
        onBoundsChange={(e) => setBounds(e.detail)}
      />
    </div>
  );
};
```

## Bounds

Resizable box requires bounds relative to its container:

```javascript
const box = document.querySelector('ef-resizable-box');

box.bounds = {
  x: 100,      // Left position
  y: 100,      // Top position
  width: 200,  // Width
  height: 150  // Height
};
```
Bounds define the box position and size relative to its parent container:

```typescript
interface BoxBounds {
  x: number;      // Left position
  y: number;      // Top position
  width: number;  // Box width
  height: number; // Box height
}
```

## Resize Handles

Eight handles for resizing:

### Corner Handles

- **Northwest** (top-left)
- **Northeast** (top-right)
- **Southwest** (bottom-left)
- **Southeast** (bottom-right)

Corner handles resize both width and height.

### Edge Handles

- **North** (top edge) - height only
- **East** (right edge) - width only
- **South** (bottom edge) - height only
- **West** (left edge) - width only

## Drag to Move

Click and drag the box content (not handles) to move:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-resizable-box
    .bounds=${{ x: 100, y: 80, width: 180, height: 120 }}
  >
    <div class="flex items-center justify-center text-gray-600 cursor-grab active:cursor-grabbing">
      Drag to move
    </div>
  </ef-resizable-box>
</div>
```
Click and drag the box interior to reposition. Visual feedback shows appropriate cursors on hover.

## Events

Listen for bounds changes:

```javascript
const box = document.querySelector('ef-resizable-box');

box.addEventListener('bounds-change', (e) => {
  const { bounds } = e.detail;
  console.log('New bounds:', bounds);

  // bounds = { x, y, width, height }
});
```

Events fire during both resize and move operations.
The `onBoundsChange` callback fires during both resize and move operations:

```tsx
<ResizableBox
  bounds={bounds}
  onBoundsChange={(e) => {
    const newBounds = e.detail;
    console.log('New bounds:', newBounds);
    setBounds(newBounds);
  }}
/>
```

## Minimum Size

Set minimum dimensions during resize:

```html
<ef-resizable-box
  .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}
  min-size="50"
>
  Cannot resize below 50x50
</ef-resizable-box>
```
```tsx
import { ResizableBox } from "@editframe/react";

export const ConstrainedBox = () => {
  const [bounds, setBounds] = useState({
    x: 150,
    y: 150,
    width: 200,
    height: 200
  });

  return (
    <ResizableBox
      bounds={bounds}
      minSize={50} // Cannot resize smaller than 50x50
      onBoundsChange={(e) => setBounds(e.detail)}
    />
  );
};
```

## Container Constraints

Resizable box constrains to its parent container:

```html
<div class="relative w-[400px] h-[300px] border">
  <ef-resizable-box
    .bounds=${{ x: 20, y: 20, width: 100, height: 80 }}
  >
    Cannot move or resize outside parent
  </ef-resizable-box>
</div>
```

Box cannot be moved or resized beyond container boundaries.
Box automatically constrains to parent boundaries. It cannot be moved or resized beyond its positioned parent container.

## Visual Feedback

Box shows visual feedback during interaction:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-resizable-box
    .bounds=${{ x: 50, y: 50, width: 180, height: 120 }}
  >
    <div class="flex items-center justify-center">
      Interactive Box
    </div>
  </ef-resizable-box>
</div>
```

Border and background change during drag operations.

## Programmatic Control

Update bounds programmatically:

```javascript
const box = document.querySelector('ef-resizable-box');

// Animate size
let size = 100;
const interval = setInterval(() => {
  size += 10;
  if (size > 300) size = 100;

  box.bounds = {
    x: 50,
    y: 50,
    width: size,
    height: size * 0.75
  };
}, 100);
```

## Slotted Content

Add any content inside the box:

```html
<ef-resizable-box .bounds=${{ x: 50, y: 50, width: 200, height: 150 }}>
  <img src="image.jpg" class="w-full h-full object-cover">
</ef-resizable-box>
```

Content fills the box dimensions automatically.

## Crop Region Selector

```tsx
import { ResizableBox } from "@editframe/react";

export const CropSelector = () => {
  const [cropBounds, setCropBounds] = useState({
    x: 50,
    y: 50,
    width: 400,
    height: 300
  });

  const handleCrop = () => {
    console.log("Crop region:", cropBounds);
    // Apply crop to video/image
  };

  return (
    <div className="relative">
      <img
        src="/assets/image.jpg"
        alt="Source"
        className="w-full h-auto"
      />

      <div className="absolute inset-0">
        <ResizableBox
          bounds={cropBounds}
          onBoundsChange={(e) => setCropBounds(e.detail)}
        />
      </div>

      <button
        onClick={handleCrop}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Apply Crop
      </button>
    </div>
  );
};
```

## Region Markers

```tsx
import { ResizableBox } from "@editframe/react";

interface Region {
  id: string;
  bounds: BoxBounds;
  color: string;
  label: string;
}

export const RegionMarkers = () => {
  const [regions, setRegions] = useState<Region[]>([
    { id: "1", bounds: { x: 100, y: 100, width: 200, height: 150 }, color: "blue", label: "Face" },
    { id: "2", bounds: { x: 400, y: 200, width: 150, height: 150 }, color: "red", label: "Object" }
  ]);
  const [selectedId, setSelectedId] = useState<string>("1");

  const updateRegion = (id: string, newBounds: BoxBounds) => {
    setRegions(regions.map(r =>
      r.id === id ? { ...r, bounds: newBounds } : r
    ));
  };

  const selectedRegion = regions.find(r => r.id === selectedId);

  return (
    <div className="relative w-full h-screen">
      <img
        src="/assets/photo.jpg"
        alt="Annotated"
        className="w-full h-full object-contain"
      />

      {/* Show all regions */}
      {regions.map((region) => (
        <div
          key={region.id}
          className={`absolute border-2 border-${region.color}-500`}
          style={{
            left: region.bounds.x,
            top: region.bounds.y,
            width: region.bounds.width,
            height: region.bounds.height,
            opacity: selectedId === region.id ? 1 : 0.5
          }}
          onClick={() => setSelectedId(region.id)}
        >
          <span className={`bg-${region.color}-500 text-white px-2 py-1 text-xs`}>
            {region.label}
          </span>
        </div>
      ))}

      {/* Editable selected region */}
      {selectedRegion && (
        <div
          className="absolute"
          style={{
            left: selectedRegion.bounds.x,
            top: selectedRegion.bounds.y
          }}
        >
          <ResizableBox
            bounds={selectedRegion.bounds}
            onBoundsChange={(e) => updateRegion(selectedId, e.detail)}
          />
        </div>
      )}
    </div>
  );
};
```

## Bounding Box Editor

```tsx
import { ResizableBox } from "@editframe/react";

export const BoundingBoxEditor = () => {
  const [boxes, setBoxes] = useState([
    { x: 50, y: 50, width: 150, height: 150 },
    { x: 250, y: 100, width: 200, height: 100 }
  ]);

  const updateBox = (index: number, newBounds: BoxBounds) => {
    setBoxes(boxes.map((box, i) => i === index ? newBounds : box));
  };

  const addBox = () => {
    setBoxes([
      ...boxes,
      { x: 100 + boxes.length * 50, y: 100, width: 150, height: 150 }
    ]);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {boxes.map((box, index) => (
        <ResizableBox
          key={index}
          bounds={box}
          onBoundsChange={(e) => updateBox(index, e.detail)}
        />
      ))}

      <button
        onClick={addBox}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Box
      </button>
    </div>
  );
};
```

## Selection Rectangle

```tsx
import { ResizableBox } from "@editframe/react";

export const SelectionTool = () => {
  const [selection, setSelection] = useState<BoxBounds | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const startSelection = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection({ x, y, width: 0, height: 0 });
    setIsSelecting(true);
  };

  return (
    <div
      className="relative w-full h-screen bg-gray-100"
      onMouseDown={startSelection}
    >
      {selection && (
        <ResizableBox
          bounds={selection}
          onBoundsChange={(e) => setSelection(e.detail)}
        />
      )}
    </div>
  );
};
```

## With Bounds Display

```tsx
import { ResizableBox } from "@editframe/react";

export const BoundsDisplay = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 300,
    height: 200
  });

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <ResizableBox
        bounds={bounds}
        onBoundsChange={(e) => setBounds(e.detail)}
      />

      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow font-mono text-sm">
        <div>x: {bounds.x.toFixed(0)}</div>
        <div>y: {bounds.y.toFixed(0)}</div>
        <div>width: {bounds.width.toFixed(0)}</div>
        <div>height: {bounds.height.toFixed(0)}</div>
        <div>area: {(bounds.width * bounds.height).toFixed(0)}px2</div>
      </div>
    </div>
  );
};
```

## Aspect Ratio Calculator

```tsx
import { ResizableBox } from "@editframe/react";

export const AspectRatioTool = () => {
  const [bounds, setBounds] = useState({
    x: 100,
    y: 100,
    width: 640,
    height: 360
  });

  const aspectRatio = bounds.width / bounds.height;
  const commonRatios = [
    { name: "16:9", value: 16/9 },
    { name: "4:3", value: 4/3 },
    { name: "1:1", value: 1 }
  ];

  const closestRatio = commonRatios.reduce((prev, curr) =>
    Math.abs(curr.value - aspectRatio) < Math.abs(prev.value - aspectRatio)
      ? curr : prev
  );

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <ResizableBox
        bounds={bounds}
        onBoundsChange={(e) => setBounds(e.detail)}
      />

      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow">
        <div className="font-semibold mb-2">Aspect Ratio</div>
        <div className="text-2xl font-mono">{aspectRatio.toFixed(3)}</div>
        <div className="text-sm text-gray-600 mt-1">
          Closest: {closestRatio.name}
        </div>
      </div>
    </div>
  );
};
```

## Cursor Styles

Handles show appropriate resize cursors:

- **nw, se**: `nwse-resize` (diagonal)
- **ne, sw**: `nesw-resize` (diagonal)
- **n, s**: `ns-resize` (vertical)
- **e, w**: `ew-resize` (horizontal)
- **content**: `grab` / `grabbing` (move)

## Styling

Resizable box uses CSS custom properties:

```css
ef-resizable-box {
  /* Border color */
  --ef-resizable-box-border-color: #2196f3;

  /* Background color */
  --ef-resizable-box-bg-color: rgba(33, 150, 243, 0.2);

  /* Border during drag */
  --ef-resizable-box-dragging-border-color: #1976d2;

  /* Background during drag */
  --ef-resizable-box-dragging-bg-color: rgba(33, 150, 243, 0.3);

  /* Handle color */
  --ef-resizable-box-handle-color: #2196f3;
}
```

## ResizeObserver

Resizable box observes its parent container for size changes:

```javascript
// Box automatically updates constraints when container resizes
const container = box.offsetParent;

// Container dimensions tracked via ResizeObserver
```

## Comparison with Transform Handles

Use **ef-resizable-box** when:
Use **ResizableBox** when:

- You need a self-contained resizable container
- Box is the primary content (not an overlay)
- Container constraints are important
- Rotation is not needed

Use **ef-transform-handles** when:
Use **TransformHandles** when:

- You need to transform existing elements
- Overlay-style interaction is needed
- Rotation is required
- Multi-element selection is needed
- Integration with ef-canvas is needed
- Integration with Canvas is needed

## Pointer Events

Resizable box and its handles have `pointer-events: auto` and capture pointer events during interaction.

## Touch Support

Handles use `touch-action: none` for proper touch device support.

## Aspect Ratio

Resizable box does not lock aspect ratio by default. To maintain aspect ratio, handle the `bounds-change` event:

```javascript
const box = document.querySelector('ef-resizable-box');
const aspectRatio = box.bounds.width / box.bounds.height;

box.addEventListener('bounds-change', (e) => {
  const { bounds } = e.detail;

  // Maintain aspect ratio
  const newHeight = bounds.width / aspectRatio;
  box.bounds = {
    ...bounds,
    height: newHeight
  };
});
```
ResizableBox does not lock aspect ratio by default. To maintain aspect ratio, handle the `onBoundsChange` callback and adjust the bounds accordingly.

## Handle Features

- **8 resize handles**: nw, n, ne, e, se, s, sw, w (corners and edges)
- **Drag to move**: Click and drag the box interior to reposition
- **Visual feedback**: Handles show appropriate cursors on hover
- **Constrained sizing**: Respects `minSize` constraint
- **Boundary clipping**: Automatically constrained to parent container

## Event Details

The `onBoundsChange` event provides:

```typescript
interface BoxBounds {
  x: number;      // Left position
  y: number;      // Top position
  width: number;  // Box width
  height: number; // Box height
}
```

## Differences from TransformHandles

- **No rotation**: ResizableBox does not support rotation
- **Simpler API**: Only x, y, width, height (no rotation property)
- **Self-contained**: Doesn't require OverlayLayer/OverlayItem wrapper
- **Positioned in parent**: Uses parent's coordinate space directly

## Important Notes

- Position is relative to parent container
- Must have a positioned parent (relative, absolute, or fixed)
- Automatically constrained to parent boundaries
- All handles are always visible (no corners-only mode)
- Use for simple resize/drag operations without rotation
- For more advanced transforms, use ef-transform-handles
- For more advanced transforms, use TransformHandles component
