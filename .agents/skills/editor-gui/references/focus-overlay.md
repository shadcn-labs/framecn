---
description: Visual focus indicator that highlights and outlines the currently selected element in an Editframe composition preview.
---


# ef-focus-overlay


## Properties

- **focusedElement** (HTMLElement | null) - Currently focused element (consumed from context)

# FocusOverlay

Visual indicator that highlights the focused element in a composition.

## Import

```tsx
import { FocusOverlay } from "@editframe/react";
```

## Basic Usage

Display focus overlay in a preview:

```html
<ef-preview target="composition">
  <ef-focus-overlay></ef-focus-overlay>
</ef-preview>

<ef-timegroup id="composition">
  <!-- Focus overlay tracks focused element -->
</ef-timegroup>
```
```tsx
import { FocusOverlay, Preview, Timegroup, Video } from "@editframe/react";

export const App = () => {
  return (
    <div className="relative w-full h-screen">
      <Preview className="w-full h-full">
        <FocusOverlay className="absolute inset-0" />
      </Preview>

      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/assets/video1.mp4" />
        <Video src="/assets/video2.mp4" />
      </Timegroup>
    </div>
  );
};
```

## Focus Context

Focus overlay consumes focused element from context:

```html
<ef-preview target="composition">
  <!-- Preview provides focusedElement context -->
  <ef-focus-overlay></ef-focus-overlay>
</ef-preview>
```

When an element receives focus, the overlay highlights it.
FocusOverlay consumes the `focusedElement` from Preview context:

- Preview provides `focusedElementContext`
- FocusOverlay subscribes to context changes
- Automatically updates when focus changes
- No manual wiring required

## Visual Appearance

Overlay displays:

- **Outline**: 2px solid border
- **Background**: Semi-transparent fill
- **Blend mode**: Multiply for visibility over content
- **Opacity**: 0.4

## Positioning

Overlay uses fixed positioning and tracks element bounds via `getBoundingClientRect()`:

```javascript
// Internal positioning (automatic)
const rect = focusedElement.getBoundingClientRect();
overlay.style.top = `${rect.top}px`;
overlay.style.left = `${rect.left}px`;
overlay.style.width = `${rect.width}px`;
overlay.style.height = `${rect.height}px`;
```

## Animation Frame Loop

Focus overlay updates position every frame:

```javascript
// Internal RAF loop
const drawOverlay = () => {
  if (focusedElement) {
    updatePosition();
    requestAnimationFrame(drawOverlay);
  }
};
```

Ensures overlay stays synchronized with moving or transforming elements.

## Visibility

Overlay automatically shows/hides based on focus state:

- **Focused element exists**: Overlay visible
- **No focused element**: Overlay hidden (`display: none`)

## Styling

Focus overlay uses CSS custom properties:

```css
ef-focus-overlay {
  /* Outline color */
  --ef-focus-overlay-color: #2196f3;

  /* Background color */
  --ef-focus-overlay-background: #2196f3;
}
```

Override to match your design:

```html
<style>
  ef-focus-overlay {
    --ef-focus-overlay-color: #ff5722;
    --ef-focus-overlay-background: #ff5722;
  }
</style>

<ef-focus-overlay></ef-focus-overlay>
```
```tsx
import { FocusOverlay } from "@editframe/react";

export const StyledFocusOverlay = () => {
  return (
    <Preview className="w-full h-full">
      <FocusOverlay
        className="absolute inset-0"
        style={{
          "--ef-focus-overlay-color": "#10b981",
          "--ef-focus-overlay-background": "rgba(16, 185, 129, 0.2)"
        } as React.CSSProperties}
      />
    </Preview>
  );
};
```

## Programmatic Control

Set focused element via context provider:

```javascript
const preview = document.querySelector('ef-preview');
const element = document.getElementById('my-element');

// Focus is typically managed by preview
element.focus();
```

## Pointer Events

Focus overlay has `pointer-events: none` to avoid blocking interaction with underlying elements.

## Use Cases

### Preview Focus Tracking

```html
<ef-preview target="composition">
  <ef-focus-overlay></ef-focus-overlay>
</ef-preview>
```

Overlay highlights the element that has browser focus.

### Custom Focus Indicators

```html
<style>
  ef-focus-overlay {
    --ef-focus-overlay-color: #00ff00;
    --ef-focus-overlay-background: rgba(0, 255, 0, 0.2);
  }
</style>

<ef-preview target="composition">
  <ef-focus-overlay></ef-focus-overlay>
</ef-preview>
```

## In Editor Layout

```tsx
import { FocusOverlay, Preview, Controls, Workbench } from "@editframe/react";

export const Editor = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Preview with focus indicator */}
      <div className="flex-1 relative">
        <Preview className="w-full h-full">
          <FocusOverlay className="absolute inset-0" />
        </Preview>
      </div>

      {/* Controls */}
      <div className="p-4">
        <Controls className="w-full" />
      </div>

      {/* Timeline */}
      <div className="h-64">
        <Workbench />
      </div>
    </div>
  );
};
```

## Multiple Preview Panes

```tsx
import { FocusOverlay, Preview } from "@editframe/react";

export const SplitView = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Main preview with focus */}
      <div className="relative">
        <h3 className="mb-2">Main View</h3>
        <Preview className="w-full aspect-video">
          <FocusOverlay className="absolute inset-0" />
        </Preview>
      </div>

      {/* Secondary preview without focus overlay */}
      <div className="relative">
        <h3 className="mb-2">Reference View</h3>
        <Preview className="w-full aspect-video" />
      </div>
    </div>
  );
};
```

## Focus-Aware Editing

```tsx
import { FocusOverlay, Preview, Timegroup, Video, Text } from "@editframe/react";

export const FocusAwareEditor = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  return (
    <div className="flex gap-4">
      {/* Preview with focus overlay */}
      <div className="flex-1 relative">
        <Preview className="w-full aspect-video">
          <FocusOverlay className="absolute inset-0" />
        </Preview>

        <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
          <Video
            id="bg-video"
            src="/assets/background.mp4"
            duration="10s"
            className="size-full"
          />
          <Text
            id="title"
            duration="5s"
            className="absolute top-20 left-20 text-white text-4xl"
          >
            Title Text
          </Text>
        </Timegroup>
      </div>

      {/* Properties panel shows focused element info */}
      <div className="w-64 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Focused Element</h3>
        {focusedElement ? (
          <div className="text-sm space-y-1">
            <div>Tag: {focusedElement.tagName}</div>
            <div>ID: {focusedElement.id || "(none)"}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No element focused</div>
        )}
      </div>
    </div>
  );
};
```

## Custom Focus Styles

```tsx
import { FocusOverlay } from "@editframe/react";

export const CustomFocusStyles = () => {
  return (
    <div className="space-y-4">
      {/* Blue focus */}
      <Preview className="w-full aspect-video">
        <FocusOverlay
          className="absolute inset-0"
          style={{
            "--ef-focus-overlay-color": "#3b82f6",
            "--ef-focus-overlay-background": "rgba(59, 130, 246, 0.15)"
          } as React.CSSProperties}
        />
      </Preview>

      {/* Green focus */}
      <Preview className="w-full aspect-video">
        <FocusOverlay
          className="absolute inset-0"
          style={{
            "--ef-focus-overlay-color": "#10b981",
            "--ef-focus-overlay-background": "rgba(16, 185, 129, 0.15)"
          } as React.CSSProperties}
        />
      </Preview>

      {/* Red focus */}
      <Preview className="w-full aspect-video">
        <FocusOverlay
          className="absolute inset-0"
          style={{
            "--ef-focus-overlay-color": "#ef4444",
            "--ef-focus-overlay-background": "rgba(239, 68, 68, 0.15)"
          } as React.CSSProperties}
        />
      </Preview>
    </div>
  );
};
```

## Toggle Focus Overlay

```tsx
import { FocusOverlay, Preview } from "@editframe/react";

export const ToggleFocus = () => {
  const [showFocus, setShowFocus] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showFocus}
          onChange={(e) => setShowFocus(e.target.checked)}
          id="show-focus"
        />
        <label htmlFor="show-focus">Show focus overlay</label>
      </div>

      <div className="relative">
        <Preview className="w-full aspect-video">
          {showFocus && <FocusOverlay className="absolute inset-0" />}
        </Preview>
      </div>
    </div>
  );
};
```

## Blend Mode

Overlay uses `mix-blend-mode: multiply` to ensure visibility over both light and dark content:

```css
.overlay {
  mix-blend-mode: multiply;
  opacity: 0.4;
}
```

This creates a darkening effect that's visible regardless of background color.

## Update Lifecycle

Overlay updates in three scenarios:

1. **connectedCallback**: Start RAF loop
2. **updated**: Redraw when focusedElement context changes
3. **disconnectedCallback**: Cancel RAF loop

## Performance

Single RAF loop per overlay. RAF automatically pauses when no element is focused, resuming when focus changes.

## Comparison with Selection Overlay

**Focus overlay**:
- Tracks browser focus (single element)
- Used in preview/playback mode
- Highlights interactive element
- Provided by ef-preview context
- Provided by Preview context

**Selection overlay** (canvas):
- Tracks canvas selection (multiple elements)
- Used in editing mode
- Shows selected elements
- Provided by ef-canvas
- Provided by Canvas

## Context Requirement

Focus overlay requires a parent that provides `focusedElementContext`:

```html
<!-- Works - preview provides context -->
<ef-preview target="composition">
  <ef-focus-overlay></ef-focus-overlay>
</ef-preview>

<!-- Doesn't work - no context provider -->
<ef-focus-overlay></ef-focus-overlay>
```
FocusOverlay must be a child of Preview component. Preview provides the `focusedElementContext` that FocusOverlay consumes.

## Fixed Positioning

Overlay uses `position: fixed` to stay visible during scrolling and pan/zoom operations.

## Container Sizing

Overlay fills its container:

```css
ef-focus-overlay {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
```

Actual highlight overlay uses fixed positioning within.

## Debug Visibility

To debug focus overlay:

```javascript
const overlay = document.querySelector('ef-focus-overlay');

// Check if element is focused
console.log(overlay.focusedElement);

// Check overlay visibility
const overlayDiv = overlay.shadowRoot.querySelector('.overlay');
console.log(overlayDiv.style.display); // 'block' or 'none'
```

## Architecture

- Uses `position: fixed` for overlay positioning
- Runs continuous RAF loop for smooth tracking
- Reads `getBoundingClientRect()` from focused element
- Mix blend mode creates visual highlight effect
- Automatically hidden when no element focused

## CSS Customization

Customize appearance with CSS variables:

```css
.focus-overlay {
  --ef-focus-overlay-color: #3b82f6;           /* Border color */
  --ef-focus-overlay-background: rgba(59, 130, 246, 0.4);  /* Fill color */
}
```

## Important Notes

- Must be a child of Preview component
- Position is `fixed` to viewport (not Preview-relative)
- Updates every animation frame for smooth tracking
- Pointer events are disabled (`pointer-events: none`)
- Automatically syncs with Preview's focused element
- Use for visual feedback in editor interfaces
- Works with all composition elements (Video, Text, Image, etc.)
