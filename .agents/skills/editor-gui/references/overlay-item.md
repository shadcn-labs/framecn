---
description: "Individual overlay element that tracks a specific composition element, following its position and size during playback."
---


# ef-overlay-item

## Attributes

- **element-id** (string) - Element ID to track (searches data-element-id or data-timegroup-id)
- **target** (string | HTMLElement) - CSS selector or element reference to track

## Methods

- **updatePosition(): void** - Update position based on target element (called by parent layer)

# OverlayItem

Individual overlay that tracks and follows a target element's position.

## Import

```tsx
import { OverlayItem } from "@editframe/react";
import type { OverlayItemProps } from "@editframe/react";
```

## Basic Usage

Track an element with an overlay:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden">
  <ef-overlay-layer class="absolute inset-0 pointer-events-none">
    <ef-overlay-item target="#box-1" class="border-2 border-blue-500 pointer-events-auto">
      <div class="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        Selected Box
      </div>
    </ef-overlay-item>
  </ef-overlay-layer>

  <div id="box-1" class="absolute top-12 left-12 w-40 h-32 bg-blue-100 border-2 border-blue-300 rounded"></div>
  <div id="box-2" class="absolute top-48 left-48 w-40 h-32 bg-green-100 border-2 border-green-300 rounded"></div>
</div>
```
```tsx
import { OverlayLayer, OverlayItem, Timegroup, Video } from "@editframe/react";

export const App = () => {
  return (
    <div className="relative">
      <OverlayLayer className="absolute inset-0">
        <OverlayItem elementId="my-video">
          <div className="border-2 border-blue-500" />
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="contain" className="w-[1920px] h-[1080px]">
        <Video id="my-video" src="/assets/video.mp4" className="size-full" />
      </Timegroup>
    </div>
  );
};
```

## Target Selection

Overlay items support multiple ways to specify targets:

### CSS Selector

Use any valid CSS selector:

```html
<ef-overlay-item target="#my-element"></ef-overlay-item>
<ef-overlay-item target=".selected"></ef-overlay-item>
<ef-overlay-item target="ef-video[src*='intro']"></ef-overlay-item>
```

### Element Reference

Pass element directly via JavaScript:

```javascript
const overlay = document.querySelector('ef-overlay-item');
const element = document.getElementById('my-element');
overlay.target = element;
```

### Element ID Attribute

Use element-id for canvas elements with data attributes:

```html
<ef-canvas>
  <div data-element-id="element-1"></div>
  <ef-timegroup data-timegroup-id="group-1"></ef-timegroup>
</ef-canvas>

<ef-overlay-layer>
  <ef-overlay-item element-id="element-1"></ef-overlay-item>
  <ef-overlay-item element-id="group-1"></ef-overlay-item>
</ef-overlay-layer>
```
### By Element ID

Use `elementId` for Editframe elements with data attributes:

```tsx
<OverlayItem elementId="my-video">
  <div className="border-2 border-blue-500" />
</OverlayItem>
```

### Custom Target Selector

```tsx
import { OverlayItem } from "@editframe/react";

export const CustomTarget = () => {
  return (
    <OverlayLayer className="absolute inset-0">
      {/* Track by custom selector */}
      <OverlayItem target=".my-custom-class">
        <div className="border-2 border-red-500" />
      </OverlayItem>

      {/* Track by direct element reference */}
      <OverlayItem target={elementRef.current}>
        <div className="border-2 border-green-500" />
      </OverlayItem>
    </OverlayLayer>
  );
};
```

## Overlay Content

Add any content inside the overlay item:

### Selection Border

```html
<ef-overlay-item target="#element" class="border-2 border-blue-500 rounded"></ef-overlay-item>
```

### Labels and Badges

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-overlay-layer class="absolute inset-0 pointer-events-none">
    <ef-overlay-item target="#video-element" class="pointer-events-none">
      <div class="absolute -top-7 left-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-t flex items-center gap-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
        Video
      </div>
      <div class="absolute -bottom-6 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
        320x240
      </div>
    </ef-overlay-item>
  </ef-overlay-layer>

  <div id="video-element" class="absolute top-16 left-16 w-64 h-48 bg-black rounded shadow-lg flex items-center justify-center text-gray-400">
    Video Player
  </div>
</div>
```

### Handles and Controls

```html
<ef-overlay-item target="#element" class="pointer-events-auto">
  <button class="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full -mt-2 -mr-2"></button>
  <button class="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full -mb-2 -mr-2"></button>
</ef-overlay-item>
```
### Selection Highlight

```tsx
import { OverlayLayer, OverlayItem } from "@editframe/react";

export const SelectionHighlight = () => {
  const [selectedId, setSelectedId] = useState<string | null>("video-1");

  return (
    <div className="relative">
      <OverlayLayer className="absolute inset-0">
        {selectedId && (
          <OverlayItem elementId={selectedId}>
            <div className="border-2 border-blue-500 bg-blue-500/10">
              <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                Selected
              </div>
            </div>
          </OverlayItem>
        )}
      </OverlayLayer>

      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video
          id="video-1"
          src="/assets/video1.mp4"
          onClick={() => setSelectedId("video-1")}
        />
        <Video
          id="video-2"
          src="/assets/video2.mp4"
          onClick={() => setSelectedId("video-2")}
        />
      </Timegroup>
    </div>
  );
};
```

### Multiple Overlays Per Element

```tsx
import { OverlayItem } from "@editframe/react";

export const MultipleOverlays = () => {
  return (
    <OverlayLayer className="absolute inset-0">
      {/* Border highlight */}
      <OverlayItem elementId="element-1">
        <div className="border-2 border-blue-500" />
      </OverlayItem>

      {/* Label */}
      <OverlayItem elementId="element-1">
        <div className="absolute -top-8 left-0 bg-black text-white px-2 py-1 text-xs rounded">
          Layer 1
        </div>
      </OverlayItem>

      {/* Transform handles */}
      <OverlayItem elementId="element-1">
        <TransformHandles bounds={bounds} />
      </OverlayItem>
    </OverlayLayer>
  );
};
```

## Position Updates

Overlay items are updated by their parent layer's RAF loop:

```javascript
const overlay = document.querySelector('ef-overlay-item');

// Listen for position changes
overlay.addEventListener('position-changed', (e) => {
  const { x, y, width, height, rotation } = e.detail;
  console.log('Overlay moved to:', x, y);
  console.log('Size:', width, height);
  console.log('Rotation:', rotation);
});
```
```tsx
import { OverlayItem } from "@editframe/react";
import type { OverlayItemPosition } from "@editframe/elements";

export const PositionTracker = () => {
  const [position, setPosition] = useState<OverlayItemPosition | null>(null);

  const handlePositionChange = (e: CustomEvent<OverlayItemPosition>) => {
    setPosition(e.detail);
  };

  return (
    <div className="relative">
      <OverlayLayer className="absolute inset-0">
        <OverlayItem
          elementId="tracked-element"
          onPositionChanged={handlePositionChange}
        >
          <div className="border-2 border-green-500">
            {position && (
              <div className="absolute -top-16 left-0 bg-black text-white p-2 text-xs font-mono">
                x: {position.x.toFixed(0)}, y: {position.y.toFixed(0)}<br />
                w: {position.width.toFixed(0)}, h: {position.height.toFixed(0)}<br />
                rotation: {position.rotation.toFixed(1)}deg
              </div>
            )}
          </div>
        </OverlayItem>
      </OverlayLayer>

      <Timegroup mode="fixed" duration="5s" className="w-[1920px] h-[1080px]">
        <Text
          id="tracked-element"
          duration="5s"
          className="absolute"
          style={{ transform: "rotate(15deg)" }}
        >
          Tracked Text
        </Text>
      </Timegroup>
    </div>
  );
};
```

## Rotation Support

Overlay items automatically track element rotation:

```html live
<div class="relative w-[600px] h-[400px] border border-gray-300 rounded overflow-hidden bg-gray-50">
  <ef-overlay-layer class="absolute inset-0 pointer-events-none">
    <ef-overlay-item target="#rotated-box" class="border-2 border-red-500"></ef-overlay-item>
  </ef-overlay-layer>

  <div id="rotated-box" class="absolute top-24 left-24 w-40 h-32 bg-red-100 rounded shadow" style="transform: rotate(15deg)">
    <div class="p-4 text-center">Rotated Element</div>
  </div>
</div>
```

The overlay automatically rotates to match its target.
Overlay items automatically track element rotation. The overlay rotates to match its target's transform.

## Visibility

Overlay items automatically hide when target is not found:

```javascript
const overlay = document.querySelector('ef-overlay-item');

// Target exists - overlay visible
overlay.target = '#existing-element';

// Target not found - overlay hidden (display: none)
overlay.target = '#nonexistent-element';

// Target removed - overlay hidden
const element = document.getElementById('existing-element');
element.remove();
```
- When `elementId` or `target` resolves to an element, the overlay is visible
- When the target element is not found or removed, the overlay hides automatically
- If the element is re-added to the DOM, the overlay reappears on the next frame

## Pointer Events

Enable pointer events for interactive overlays:

```html
<ef-overlay-item target="#element" class="pointer-events-auto cursor-move">
  <!-- Interactive content -->
</ef-overlay-item>
```

Overlay layer has `pointer-events: none`, so explicitly enable on items that need interaction.
Parent OverlayLayer has `pointer-events: none` by default. Enable pointer events on individual items that need interaction by adding appropriate className.

## Coordinate System

Overlay items use absolute positioning relative to their parent overlay layer:

- **x, y**: Top-left position in layer coordinates
- **width, height**: Match target element dimensions
- **rotation**: Parsed from target element's transform

The parent layer handles transform synchronization with pan/zoom.

## Update Frequency

Position updates happen every animation frame (60fps) via the parent layer's RAF loop. No throttling or change detection - updates are always fresh.

## Performance

Overlay items are passive - they don't run their own RAF loops. The parent layer manages all updates in a single synchronized loop, preventing RAF proliferation.

## Target Validation

Overlay items verify target is still in the DOM:

```javascript
const overlay = document.querySelector('ef-overlay-item');
const element = document.getElementById('my-element');

overlay.target = element;  // Works - element in DOM

element.remove();          // Element removed
// Overlay automatically hides

document.body.appendChild(element);  // Element re-added
// Overlay reappears on next frame
```

## CSS Styling

Style the overlay item container:

```css
ef-overlay-item {
  /* Border and background */
  border: 2px solid blue;
  background: rgba(0, 0, 255, 0.1);

  /* Pointer interaction */
  pointer-events: auto;
  cursor: pointer;

  /* Transform origin (rotation center) */
  transform-origin: center;
}
```
### Hover State Overlay

```tsx
import { OverlayLayer, OverlayItem } from "@editframe/react";

export const HoverOverlay = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative">
      <OverlayLayer className="absolute inset-0 pointer-events-none">
        {hoveredId && (
          <OverlayItem elementId={hoveredId}>
            <div className="border-2 border-yellow-500 bg-yellow-500/5" />
          </OverlayItem>
        )}
      </OverlayLayer>

      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video
          id="video-1"
          src="/assets/video1.mp4"
          onMouseEnter={() => setHoveredId("video-1")}
          onMouseLeave={() => setHoveredId(null)}
        />
        <Video
          id="video-2"
          src="/assets/video2.mp4"
          onMouseEnter={() => setHoveredId("video-2")}
          onMouseLeave={() => setHoveredId(null)}
        />
      </Timegroup>
    </div>
  );
};
```

### Styled Overlays

```tsx
import { OverlayItem } from "@editframe/react";

export const StyledOverlays = () => {
  return (
    <OverlayLayer className="absolute inset-0">
      {/* Corner indicators */}
      <OverlayItem elementId="element-1">
        <div className="relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-blue-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-blue-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-blue-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-blue-500" />
        </div>
      </OverlayItem>

      {/* Glow effect */}
      <OverlayItem elementId="element-2">
        <div className="border-2 border-purple-500 shadow-lg shadow-purple-500/50" />
      </OverlayItem>
    </OverlayLayer>
  );
};
```

## TypeScript Usage

```tsx
import { OverlayItem } from "@editframe/react";
import type { OverlayItemProps } from "@editframe/react";
import type { OverlayItemPosition } from "@editframe/elements";

interface CustomOverlayProps extends OverlayItemProps {
  label?: string;
  color?: string;
}

export const CustomOverlay: React.FC<CustomOverlayProps> = ({
  elementId,
  label,
  color = "blue",
  ...props
}) => {
  const handlePositionChange = (e: CustomEvent<OverlayItemPosition>) => {
    console.log("Position:", e.detail);
  };

  return (
    <OverlayItem
      elementId={elementId}
      onPositionChanged={handlePositionChange}
      {...props}
    >
      <div className={`border-2 border-${color}-500`}>
        {label && (
          <div className="absolute -top-6 left-0 bg-black text-white px-2 py-1 text-xs">
            {label}
          </div>
        )}
      </div>
    </OverlayItem>
  );
};
```

## Position Change Event

The `position-changed` event provides:
The `onPositionChanged` callback receives an event with this detail structure:

```typescript
interface OverlayItemPosition {
  x: number;        // Left position relative to OverlayLayer
  y: number;        // Top position relative to OverlayLayer
  width: number;    // Element width
  height: number;   // Element height
  rotation: number; // Element rotation in degrees
}
```

## Important Notes

- Must be a child of an ef-overlay-layer element
- Updates position continuously in sync with parent's RAF loop
- Automatically handles element rotation transforms
- Hidden when target element is not found
- Position is relative to the overlay layer container
- Use `element-id` for canvas elements with data attributes
- Use `target` for custom DOM elements
- Must be a child of OverlayLayer component
- Updates position continuously in sync with parent's RAF loop
- Automatically handles element rotation transforms
- Hidden when target element is not found
- Position is relative to the OverlayLayer container
- Use `elementId` for Editframe elements with data attributes
- Use `target` prop for custom DOM elements
