---
description: "Layer panel that displays the composition element tree with collapsible groups, selection highlighting, and drag-to-reorder."
---


# ef-hierarchy

## Attributes

- **target** (string) - ID of the target element (ef-canvas or ef-timegroup)
- **header** (string) - Header text displayed at top of hierarchy
- **show-header** (boolean, default: false) - Show or hide the header
- **hideSelectors** (string[]) - CSS selectors for elements to hide from hierarchy
- **showSelectors** (string[]) - CSS selectors for elements to include in hierarchy (overrides hide)

## Methods

- **select(elementId: string | null): void** - Select an element in the hierarchy
- **getSelectedElementId(): string | null** - Get the currently selected element ID
  - Returns: string | null
- **setHighlightedElement(element: HTMLElement | null): void** - Set the highlighted (hovered) element
- **getHighlightedElement(): HTMLElement | null** - Get the currently highlighted element
  - Returns: HTMLElement | null

# Hierarchy

Layer panel showing composition structure with selection and expansion controls.
Tree view displaying composition element hierarchy and layer structure.

> **Note**: The Hierarchy component is currently not exported from `@editframe/react`. This documentation describes the underlying `ef-hierarchy` HTML element. To use it in React, you'll need to use the HTML element directly or wait for official React component export.

## Basic Usage

Display a hierarchy of elements in a target container:

```html live
<div class="flex gap-4 h-[400px]">
  <ef-hierarchy target="canvas-1" header="Layers" show-header class="w-64 border border-gray-300 rounded"></ef-hierarchy>

  <ef-canvas id="canvas-1" class="flex-1 bg-gray-100 relative">
    <ef-timegroup id="scene-1" class="absolute top-4 left-4 w-48 h-32 bg-blue-500 text-white p-4">
      <h2>Scene 1</h2>
    </ef-timegroup>
    <ef-timegroup id="scene-2" class="absolute top-40 left-4 w-48 h-32 bg-green-500 text-white p-4">
      <h2>Scene 2</h2>
    </ef-timegroup>
  </ef-canvas>
</div>
```
## HTML Element Usage

```tsx
import { useRef, useEffect } from "react";

export const App = () => {
  const hierarchyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hierarchy = hierarchyRef.current;
    if (hierarchy) {
      // Access methods via ref
      (hierarchy as any).select("video-1");
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Hierarchy panel */}
      <div className="w-64 border-r bg-gray-50">
        <ef-hierarchy
          ref={hierarchyRef as any}
          target="canvas"
          header="Layers"
          show-header
        />
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ef-canvas id="canvas">
          <ef-timegroup mode="contain" className="w-[1920px] h-[1080px]">
            <ef-video id="video-1" src="/assets/video.mp4" className="size-full" />
            <ef-text id="title" duration="5s" className="text-white text-4xl">
              Title
            </ef-text>
          </ef-timegroup>
        </ef-canvas>
      </div>
    </div>
  );
};
```

## Target Binding

Hierarchy can target any element containing composition elements:

### Canvas Target

Show hierarchy of canvas elements:

```html
<ef-hierarchy target="my-canvas"></ef-hierarchy>
<ef-canvas id="my-canvas">
  <!-- Canvas elements appear in hierarchy -->
</ef-canvas>
```

### Timegroup Target

Show hierarchy of a single timegroup:

```html
<ef-hierarchy target="root-timegroup"></ef-hierarchy>
<ef-timegroup id="root-timegroup">
  <!-- Nested elements appear in hierarchy -->
</ef-timegroup>
```

## Editor Layout

```tsx
export const EditorWithHierarchy = () => {
  return (
    <div className="h-screen grid grid-cols-[250px_1fr_250px]">
      {/* Left: Hierarchy */}
      <div className="border-r bg-gray-50 overflow-auto">
        <ef-hierarchy
          target="editor-canvas"
          header="Layers"
          show-header
        />
      </div>

      {/* Center: Preview */}
      <div className="flex flex-col">
        <div className="flex-1 p-4">
          <ef-preview />
        </div>
        <div className="h-64 border-t">
          <ef-filmstrip target="root-timegroup" />
        </div>
      </div>

      {/* Right: Properties */}
      <div className="border-l bg-gray-50 p-4">
        <h3 className="font-semibold mb-2">Properties</h3>
        {/* Properties panel content */}
      </div>

      {/* Composition */}
      <ef-canvas id="editor-canvas">
        <ef-timegroup
          id="root-timegroup"
          mode="sequence"
          className="w-[1920px] h-[1080px]"
        >
          {/* Elements */}
        </ef-timegroup>
      </ef-canvas>
    </div>
  );
};
```

## Selection Integration

Hierarchy syncs with ef-canvas selection:

```html live
<div class="flex gap-4 h-[400px]">
  <ef-hierarchy target="canvas-2" show-header header="Layers" class="w-64 border border-gray-300 rounded"></ef-hierarchy>

  <ef-pan-zoom class="flex-1 border border-gray-300 rounded overflow-hidden">
    <ef-canvas id="canvas-2" class="w-[720px] h-[480px] bg-gray-100">
      <div id="box-1" class="absolute top-8 left-8 w-32 h-32 bg-blue-500 text-white flex items-center justify-center">Box 1</div>
      <div id="box-2" class="absolute top-48 left-48 w-32 h-32 bg-green-500 text-white flex items-center justify-center">Box 2</div>
      <div id="box-3" class="absolute top-8 left-48 w-32 h-32 bg-red-500 text-white flex items-center justify-center">Box 3</div>
    </ef-canvas>
  </ef-pan-zoom>
</div>
```

Click items in the hierarchy or canvas to select. Selection stays in sync.
```tsx
export const SelectionAwareHierarchy = () => {
  const hierarchyRef = useRef<HTMLElement>(null);

  const handleElementClick = (elementId: string) => {
    const hierarchy = hierarchyRef.current;
    if (hierarchy) {
      (hierarchy as any).select(elementId);
    }
  };

  useEffect(() => {
    const hierarchy = hierarchyRef.current;
    if (!hierarchy) return;

    const handleSelectionChange = (e: CustomEvent) => {
      console.log("Selected element:", e.detail.elementId);
    };

    hierarchy.addEventListener("hierarchy-select" as any, handleSelectionChange);
    return () => {
      hierarchy.removeEventListener("hierarchy-select" as any, handleSelectionChange);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r">
        <ef-hierarchy ref={hierarchyRef as any} target="canvas" />
      </div>

      <div className="flex-1">
        <ef-canvas id="canvas">
          <ef-timegroup mode="contain" className="w-[1920px] h-[1080px]">
            <ef-video
              id="video-1"
              src="/assets/video.mp4"
              onClick={() => handleElementClick("video-1")}
            />
          </ef-timegroup>
        </ef-canvas>
      </div>
    </div>
  );
};
```

## Filtering Elements

Control which elements appear in the hierarchy:

### Hide Selectors

Hide specific elements by selector:

```html
<ef-hierarchy
  target="canvas"
  .hideSelectors=${['.helper', '.invisible']}>
</ef-hierarchy>
```

### Show Selectors

Override hiding for specific elements:

```html
<ef-hierarchy
  target="canvas"
  .hideSelectors=${['.helper']}
  .showSelectors=${['.helper-visible']}>
</ef-hierarchy>
```
```tsx
export const FilteredHierarchy = () => {
  const hideSelectors = [".helper-element", "[data-hidden='true']"];

  return (
    <div className="w-64 h-screen border-r bg-gray-50">
      <ef-hierarchy
        target="canvas"
        hide-selectors={JSON.stringify(hideSelectors)}
      />
    </div>
  );
};
```

## Programmatic Control

Select elements via JavaScript:

```javascript
const hierarchy = document.querySelector('ef-hierarchy');

// Select an element
hierarchy.select('element-id');

// Get current selection
const selectedId = hierarchy.getSelectedElementId();

// Clear selection
hierarchy.select(null);

// Listen for selection changes
hierarchy.addEventListener('hierarchy-select', (e) => {
  console.log('Selected:', e.detail.elementId);
});
```

## Hover Highlighting

Hierarchy shows highlighted (hovered) elements:

```javascript
const hierarchy = document.querySelector('ef-hierarchy');

// Highlight an element
const element = document.getElementById('my-element');
hierarchy.setHighlightedElement(element);

// Get highlighted element
const highlighted = hierarchy.getHighlightedElement();

// Clear highlight
hierarchy.setHighlightedElement(null);
```

## Drag and Drop Reordering

Listen for reorder events when user drags items:

```javascript
const hierarchy = document.querySelector('ef-hierarchy');

hierarchy.addEventListener('hierarchy-reorder', (e) => {
  const { sourceId, targetId, position } = e.detail;
  // position is 'before', 'after', or 'inside'
  console.log(`Move ${sourceId} ${position} ${targetId}`);
});
```

## Expansion State

Hierarchy automatically expands all items on initialization. Users can collapse and expand items by clicking the disclosure triangle.

## Features

- **Tree structure**: Displays nested timegroups and elements
- **Expand/collapse**: Click to expand or collapse nested items
- **Selection sync**: Syncs with canvas selection state
- **Drag and drop**: Reorder elements by dragging (when supported)
- **Visual feedback**: Highlights selected and hovered elements
- **Context menu**: Right-click for element actions
- **Auto-scroll**: Scrolls to selected element

## Styling

Hierarchy uses CSS custom properties:

```css
ef-hierarchy {
  --hierarchy-bg: #fff;
  --hierarchy-border: #e0e0e0;
  --hierarchy-text: #000;
  --hierarchy-hover-bg: #f0f0f0;
  --hierarchy-selected-bg: #e3f2fd;
  --hierarchy-ancestor-selected-bg: #f5f5f5;
  --hierarchy-focused-bg: #bbdefb;
}
```

## Item Variants

Hierarchy automatically renders appropriate icons and labels for each element type:

- **ef-timegroup** - Container icon with duration
- **ef-video** - Video icon with filename
- **ef-audio** - Audio icon with filename
- **ef-image** - Image icon with filename
- **ef-text** - Text icon with preview
- **ef-captions** - Caption icon
- **ef-waveform** - Waveform icon
- **ef-surface** - Mirror icon
- **div** and other HTML - HTML tag name
The hierarchy displays specialized items for each element type:

- `ef-timegroup` - Timegroup container
- `ef-video` - Video layer
- `ef-audio` - Audio layer
- `ef-image` - Image layer
- `ef-text` - Text layer
- `ef-captions` - Captions layer
- `ef-surface` - Surface (mirror) layer
- `ef-waveform` - Waveform visualization

## Auto-Selection

When target changes, hierarchy automatically selects the first root timegroup if nothing is selected.

## Events

### hierarchy-select

Fired when an element is selected in the hierarchy:

```typescript
interface HierarchySelectDetail {
  elementId: string | null;
}
```

### hierarchy-reorder

Fired when elements are reordered:

```typescript
interface HierarchyReorderDetail {
  sourceId: string;
  targetId: string;
  position: "before" | "after" | "inside";
}
```

## Methods

### select()

Programmatically select an element:

```tsx
const hierarchy = hierarchyRef.current;
if (hierarchy) {
  (hierarchy as any).select("element-id");
}
```

### getSelectedElementId()

Get the currently selected element ID:

```tsx
const hierarchy = hierarchyRef.current;
if (hierarchy) {
  const selectedId = (hierarchy as any).getSelectedElementId();
  console.log("Selected:", selectedId);
}
```

## Integration with Canvas

The hierarchy component works with `ef-canvas` to provide:

- **Selection coordination**: Clicks in hierarchy select canvas elements
- **Highlight sync**: Hover in hierarchy highlights canvas elements
- **State sharing**: Uses Lit context for state synchronization
- **Direct DOM access**: Can work as sibling via target ID

## Important Notes

- Currently requires using HTML element syntax in React
- Target should be an `ef-canvas` or `ef-timegroup` element ID
- Automatically initializes with all items expanded
- Auto-selects first root timegroup on mount
- Filters can use CSS selectors or data attributes
- Selection state syncs bidirectionally with canvas
- Use `show-header` to display panel title
- Hierarchy updates automatically when DOM changes

## Future React Component

When officially exported as a React component, usage will be:

```tsx
import { Hierarchy } from "@editframe/react";

<Hierarchy
  target="canvas"
  header="Layers"
  showHeader
  hideSelectors={[".helper"]}
  onSelectionChange={(e) => console.log(e.detail)}
/>
```
