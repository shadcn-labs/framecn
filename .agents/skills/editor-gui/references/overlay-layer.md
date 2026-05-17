---
description: "Container that positions overlay items absolutely over a composition, anchoring them to their target elements during playback."
---


# ef-overlay-layer

## Attributes

- **panZoomTransform** ({ x: number, y: number, scale: number }) - Pan/zoom transform (fallback when context unavailable)

## Methods

- **registerOverlayItem(item: EFOverlayItem): void** - Register an overlay item for coordinated updates
- **unregisterOverlayItem(item: EFOverlayItem): void** - Unregister an overlay item

# OverlayLayer

Container for positioned overlays that track element positions in a canvas or composition.

## Import

```tsx
import { OverlayLayer } from "@editframe/react";
```

## Basic Usage

Overlay layer provides a coordinate system for overlays:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden">
  <ef-overlay-layer class="absolute inset-0 pointer-events-none">
    <ef-overlay-item target="#target-box" class="border-2 border-blue-500 pointer-events-auto">
      <div class="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">Label</div>
    </ef-overlay-item>
  </ef-overlay-layer>

  <div id="target-box" class="absolute top-8 left-8 w-32 h-24 bg-gray-200 rounded"></div>
</div>
```
```tsx
import { OverlayLayer, OverlayItem, Preview, Timegroup, Video } from "@editframe/react";

export const App = () => {
  return (
    <div className="relative w-full h-screen">
      <Preview className="w-full h-full" />

      <OverlayLayer className="absolute inset-0 pointer-events-none">
        <OverlayItem elementId="video-1">
          <div className="border-2 border-blue-500" />
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
        <Video id="video-1" src="/assets/video.mp4" className="size-full" />
      </Timegroup>
    </div>
  );
};
```

## With Pan/Zoom

Overlay layer automatically syncs with ef-pan-zoom transforms:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden">
  <ef-pan-zoom class="w-full h-full">
    <div class="w-[1200px] h-[800px] bg-gray-100">
      <div id="element-1" class="absolute top-12 left-12 w-40 h-32 bg-blue-500 text-white flex items-center justify-center rounded">
        Element 1
      </div>
      <div id="element-2" class="absolute top-48 left-48 w-40 h-32 bg-green-500 text-white flex items-center justify-center rounded">
        Element 2
      </div>
    </div>
  </ef-pan-zoom>

  <ef-overlay-layer class="absolute inset-0 pointer-events-none">
    <ef-overlay-item target="#element-1" class="border-2 border-blue-600"></ef-overlay-item>
    <ef-overlay-item target="#element-2" class="border-2 border-green-600"></ef-overlay-item>
  </ef-overlay-layer>
</div>
```

Pan and zoom the canvas - overlays stay perfectly positioned on their targets.
```tsx
import { PanZoom, OverlayLayer, OverlayItem } from "@editframe/react";

export const ZoomableEditor = () => {
  return (
    <div className="relative w-full h-screen">
      <PanZoom className="w-full h-full" autoFit>
        <Preview className="w-[1920px] h-[1080px]" />

        {/* OverlayLayer automatically syncs with PanZoom transform */}
        <OverlayLayer className="absolute inset-0">
          <OverlayItem elementId="text-1">
            <div className="border-2 border-green-500" />
          </OverlayItem>
        </OverlayLayer>

        <Timegroup mode="fixed" duration="5s" className="w-[1920px] h-[1080px]">
          <Text
            id="text-1"
            duration="5s"
            className="absolute top-20 left-20 text-white text-4xl"
          >
            Title Text
          </Text>
        </Timegroup>
      </PanZoom>
    </div>
  );
};
```

## Architecture

Overlay layer runs a single RAF loop that:

1. Reads the current pan/zoom transform
2. Applies transform to the layer container
3. Updates all registered overlay items
4. Schedules next frame

This ensures all overlays update synchronously without individual RAF loops.

## Transform Context

Overlay layer consumes pan/zoom transform from context when nested inside ef-pan-zoom:

```html
<ef-pan-zoom>
  <!-- Transform provided via context -->
  <ef-overlay-layer>
    <ef-overlay-item target="#element"></ef-overlay-item>
  </ef-overlay-layer>
</ef-pan-zoom>
```

For sibling relationships, overlay layer reads transform directly from the DOM:

```html
<div class="relative">
  <ef-pan-zoom>
    <!-- Pan/zoom content -->
  </ef-pan-zoom>

  <!-- Sibling overlay layer reads transform from ef-pan-zoom -->
  <ef-overlay-layer class="absolute inset-0">
    <ef-overlay-item target="#element"></ef-overlay-item>
  </ef-overlay-layer>
</div>
```
OverlayLayer automatically discovers and syncs with PanZoom transforms via Lit context. When placed inside a PanZoom component, no manual transform wiring is needed.

## Fallback Transform

Provide transform as property for testing or standalone usage:

```javascript
const overlayLayer = document.querySelector('ef-overlay-layer');
overlayLayer.panZoomTransform = { x: 0, y: 0, scale: 1 };
```

## Coordinate System

Overlay layer creates a coordinate space that:

- Matches the transformed canvas position
- Allows overlay items to use absolute positioning
- Updates every frame via RAF loop
- Supports pointer events through `pointer-events: auto` on overlay items

## Registration

Overlay items auto-register with their parent layer:

```javascript
// Registration happens automatically in connectedCallback
const item = document.createElement('ef-overlay-item');
item.target = '#my-element';
overlayLayer.appendChild(item); // Item registers itself

// Unregistration happens in disconnectedCallback
item.remove(); // Item unregisters itself
```

Manual registration is possible but not required:

```javascript
const overlayLayer = document.querySelector('ef-overlay-layer');
const overlayItem = document.querySelector('ef-overlay-item');

overlayLayer.registerOverlayItem(overlayItem);
// Later...
overlayLayer.unregisterOverlayItem(overlayItem);
```

## Pointer Events

Overlay layer has `pointer-events: none` by default. Enable pointer events on individual items:

```html
<ef-overlay-layer>
  <ef-overlay-item target="#element" class="pointer-events-auto cursor-pointer">
    <button>Click me</button>
  </ef-overlay-item>
</ef-overlay-layer>
```
OverlayLayer has `pointer-events: none` by default. Child elements should set `pointer-events: auto` to receive interactions.

## With Transform Handles

```tsx
import { OverlayLayer, OverlayItem, TransformHandles } from "@editframe/react";

export const Editor = () => {
  const [bounds, setBounds] = useState({ x: 100, y: 100, width: 400, height: 300 });

  return (
    <div className="relative w-full h-screen">
      <Preview className="w-full h-full" />

      <OverlayLayer className="absolute inset-0">
        <OverlayItem elementId="selected-element">
          <TransformHandles
            bounds={bounds}
            enableRotation
            onBoundsChange={(e) => setBounds(e.detail)}
          />
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
        <Video
          id="selected-element"
          src="/assets/video.mp4"
          className="absolute"
          style={{
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
            height: bounds.height
          }}
        />
      </Timegroup>
    </div>
  );
};
```

## Multiple Overlays

```tsx
import { OverlayLayer, OverlayItem } from "@editframe/react";

export const MultiOverlay = () => {
  return (
    <div className="relative w-full h-screen">
      <Preview className="w-full h-full" />

      <OverlayLayer className="absolute inset-0">
        {/* Selection highlight */}
        <OverlayItem elementId="element-1">
          <div className="border-2 border-blue-500 bg-blue-500/10" />
        </OverlayItem>

        {/* Hover highlight */}
        <OverlayItem elementId="element-2">
          <div className="border-2 border-yellow-500 bg-yellow-500/10" />
        </OverlayItem>

        {/* Label */}
        <OverlayItem elementId="element-1">
          <div className="absolute -top-6 left-0 bg-black text-white px-2 py-1 text-xs rounded">
            Video Layer
          </div>
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video id="element-1" src="/assets/video1.mp4" />
        <Video id="element-2" src="/assets/video2.mp4" />
      </Timegroup>
    </div>
  );
};
```

## Custom Overlay Styling

```tsx
import { OverlayLayer, OverlayItem } from "@editframe/react";

export const StyledOverlays = () => {
  return (
    <OverlayLayer className="absolute inset-0">
      {/* Dashed border overlay */}
      <OverlayItem elementId="element-1">
        <div className="border-2 border-dashed border-purple-500" />
      </OverlayItem>

      {/* Gradient border overlay */}
      <OverlayItem elementId="element-2">
        <div
          className="border-4"
          style={{
            borderImage: "linear-gradient(45deg, #ff0080, #00ff80) 1"
          }}
        />
      </OverlayItem>

      {/* Shadow overlay */}
      <OverlayItem elementId="element-3">
        <div className="border-2 border-white shadow-2xl" />
      </OverlayItem>
    </OverlayLayer>
  );
};
```

## Performance

Single RAF loop ensures:

- No RAF proliferation (one loop for all overlays)
- No change detection overhead
- No delay between transform and overlay updates
- Synchronized updates across all overlay items

## Positioning

Overlay layer uses `position: absolute` and `inset: 0` to fill its container:

```html
<div class="relative w-full h-full">
  <!-- Overlay layer fills parent -->
  <ef-overlay-layer></ef-overlay-layer>
</div>
```
OverlayLayer must be positioned with `position: absolute` or `fixed` to properly overlay content.

## Transform Origin

Overlay layer uses `transform-origin: 0 0` to match canvas transform behavior.

## Architecture Notes

- OverlayLayer runs a single RAF loop that updates all child OverlayItems synchronously
- Automatically discovers and syncs with PanZoom transforms via Lit context
- Overlays track element positions in real-time using `getBoundingClientRect()`
- No change detection - updates happen every frame for smooth tracking
- Child elements should set `pointer-events: auto` to receive interactions

## Important Notes

- Must be positioned with `position: absolute` or `fixed`
- Use with ef-overlay-item children to track specific elements
- Automatically handles pan/zoom transforms when inside ef-pan-zoom
- Updates continuously - no manual refresh needed
- All overlay items update in sync to prevent visual glitches
- Must be positioned with `position: absolute` or `fixed`
- Use with OverlayItem children to track specific elements
- Automatically handles pan/zoom transforms when inside PanZoom
- Updates continuously - no manual refresh needed
- All OverlayItems update in sync to prevent visual glitches
