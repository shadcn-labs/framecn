---
description: "Composition preview container with automatic focus tracking, zoom-to-fit behavior, and overlay layer integration."
---


# ef-preview

## Attributes

- **target** (string) - ID of timegroup to preview (inherited from EFTargetable)

# Preview

Preview container with automatic focus tracking for interactive composition editing.
Video preview player component for viewing compositions.

## Import

```tsx
import { Preview } from "@editframe/react";
```

## Basic Usage

Wrap a composition to enable preview mode:

```html live
<ef-preview class="w-[720px] h-[480px] bg-gray-100 border border-gray-300 rounded">
  <ef-timegroup mode="contain" class="size-full bg-black">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
  </ef-timegroup>
</ef-preview>
```

The preview element provides a viewing area with a crosshair cursor by default.
```tsx
import { Configuration, Preview, Timegroup, Video } from "@editframe/react";

export const App = () => {
  return (
    <Configuration mediaEngine="local">
      <div className="flex">
        {/* Preview player */}
        <div className="flex-1">
          <Preview className="w-full h-[600px]" />
        </div>

        {/* Composition */}
        <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
          <Video src="/assets/video.mp4" />
        </Timegroup>
      </div>
    </Configuration>
  );
};
```

## With Controls

## Focus Tracking

`ef-preview` tracks which temporal element (timegroup, video, audio, etc.) is currently under the cursor:

```html live
<div>
  <ef-preview id="focus-demo" class="w-[720px] h-[480px] bg-gray-100 border border-gray-300 rounded">
    <ef-timegroup mode="contain" class="size-full bg-black">
      <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
      <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded">
        <p class="text-sm font-semibold">Hover over elements</p>
        <p id="focus-output" class="text-xs text-gray-600 mt-1">Focused: None</p>
      </div>
    </ef-timegroup>
  </ef-preview>
  <script>
    const preview = document.getElementById('focus-demo');
    const output = document.getElementById('focus-output');

    // Listen for focus changes via custom event
    preview.addEventListener('pointerover', (e) => {
      if (e.target !== preview) {
        output.textContent = `Focused: ${e.target.tagName.toLowerCase()}`;
      }
    });
    preview.addEventListener('pointerout', () => {
      output.textContent = 'Focused: None';
    });
  </script>
</div>
```

## Context Provision

`ef-preview` provides the currently focused element via Lit context. This enables other components to react to focus changes:

```typescript
import { consume } from '@lit/context';
import { focusedElementContext } from '@editframe/elements';

@consume({ context: focusedElementContext })
focusedElement?: HTMLElement;
```

For example, a selection overlay can highlight the focused element, or a properties panel can show details about the focused element.

## Target Binding

Use the `target` attribute to bind the preview to a specific timegroup:

```html live
<div>
  <ef-timegroup id="preview-target" mode="contain" class="w-[720px] h-[480px] bg-black">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
    <div class="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded">
      <p class="text-sm font-semibold">Target Composition</p>
    </div>
  </ef-timegroup>

  <ef-preview target="preview-target" class="w-[360px] h-[240px] mt-4 bg-gray-100 border border-gray-300 rounded">
    <!-- Preview mirrors the target timegroup above -->
  </ef-preview>
</div>
```

This allows the preview to display a timegroup defined elsewhere in the DOM.

## Focus Detection Behavior

Focus is determined by finding the closest temporal element in the DOM tree:

1. User hovers over an element
2. Preview searches up the DOM tree from the hovered element
3. First temporal ancestor is marked as focused (timegroup, video, audio, image, etc.)
4. Non-temporal elements (like `<div>`) are skipped

This means hovering over text inside a video element will focus the video, not the text.

## Focus Overlay Integration

Combine with `ef-focus-overlay` to visually highlight the focused element:

```html live
<ef-preview class="w-[720px] h-[480px] bg-gray-100 border border-gray-300 rounded relative">
  <ef-timegroup mode="contain" class="size-full bg-black">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur border-2 border-white/50 px-6 py-4 rounded-lg">
      <p class="text-white text-lg font-semibold">Hover to focus</p>
    </div>
  </ef-timegroup>
  <!-- Focus overlay would go here in a real editor -->
</ef-preview>
```

## Building an Editor

Use `ef-preview` as the foundation for a composition editor:

```html live
<div class="bg-gray-900 p-4 rounded-lg">
  <div class="flex gap-4">
    <!-- Preview area -->
    <ef-preview class="flex-1 bg-gray-800 border border-gray-700 rounded">
      <ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
        <ef-timegroup mode="fixed" duration="3s" class="absolute size-full flex items-center justify-center">
          <div class="text-white text-4xl font-bold">Scene 1</div>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="3s" class="absolute size-full flex items-center justify-center">
          <div class="text-white text-4xl font-bold">Scene 2</div>
        </ef-timegroup>
      </ef-timegroup>
    </ef-preview>

    <!-- Properties panel -->
    <div class="w-64 bg-gray-800 border border-gray-700 rounded p-4">
      <h3 class="text-white font-semibold mb-2">Properties</h3>
      <p class="text-gray-400 text-sm">Hover elements to inspect</p>
    </div>
  </div>
</div>
```

## Styling

The preview element has these default styles:
- `display: block` - Block-level container
- `position: relative` - For positioning overlays
- `cursor: crosshair` - Visual feedback for interactive mode

Override with classes:

```html
<ef-preview class="w-full h-screen cursor-default">
  <!-- Content -->
</ef-preview>
```

## Events

Focus tracking uses standard pointer events internally:
- `pointerover` - Element gains focus
- `pointerout` - Element loses focus

Listen to these events on the preview element to react to focus changes:

```javascript
const preview = document.querySelector('ef-preview');

preview.addEventListener('pointerover', (e) => {
  if (e.target !== preview) {
    console.log('Focused:', e.target);
  }
});

preview.addEventListener('pointerout', (e) => {
  console.log('Lost focus');
});
```

## Focus Clearing

Focus is cleared when:
- Moving outside the preview entirely
- Moving to the preview element itself (not a child)
- Moving to an element that's not within a temporal

This ensures focus only highlights meaningful composition elements.

## Use Cases

**Video Editor:** Display composition with interactive element selection
```html
<ef-preview>
  <ef-timegroup mode="contain">
    <ef-video src="video.mp4"></ef-video>
  </ef-timegroup>
</ef-preview>
```

**Properties Inspector:** Show details about focused elements
```html
<ef-preview id="editor">
  <ef-timegroup><!-- composition --></ef-timegroup>
</ef-preview>
<div id="properties-panel"><!-- shows focused element props --></div>
```

**Selection System:** Highlight and select elements for editing
```html
<ef-preview>
  <ef-timegroup>
    <ef-video id="clip1"></ef-video>
    <ef-text id="title"></ef-text>
  </ef-timegroup>
</ef-preview>
```

## Nested Previews

Previews can be nested — each maintains its own focus state:

```html
<ef-preview class="outer">
  <ef-timegroup>
    <ef-preview class="inner">
      <ef-timegroup><!-- nested composition --></ef-timegroup>
    </ef-preview>
  </ef-timegroup>
</ef-preview>
```

The inner preview tracks focus independently of the outer preview.

```tsx
import { Preview, Controls } from "@editframe/react";

<div className="flex flex-col">
  <Preview className="w-full h-[600px] bg-black" />
  <Controls className="w-full" />
</div>
```

## Styled Preview

```tsx
<Preview className="w-[1280px] h-[720px] bg-gray-900 border border-gray-700 rounded-lg shadow-xl" />
```

## Split View

```tsx
import { Preview, Timegroup, Video, Text } from "@editframe/react";

export const SplitView = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Left: Preview */}
      <div>
        <h2 className="text-xl mb-2">Preview</h2>
        <Preview className="w-full aspect-video bg-black rounded" />
      </div>

      {/* Right: Composition */}
      <div>
        <h2 className="text-xl mb-2">Composition</h2>
        <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
          <Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
            <Video src="/assets/video.mp4" className="size-full" />
            <Text duration="5s" className="text-white text-4xl">
              Title
            </Text>
          </Timegroup>
        </Timegroup>
      </div>
    </div>
  );
};
```

## Full Editor Layout

```tsx
import { Preview, Controls, Workbench } from "@editframe/react";

export const Editor = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top: Preview */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <Preview className="max-w-[1280px] max-h-[720px] w-full bg-black rounded shadow-2xl" />
      </div>

      {/* Middle: Controls */}
      <div className="px-4 py-2">
        <Controls className="w-full" />
      </div>

      {/* Bottom: Timeline */}
      <div className="h-64 border-t border-gray-700">
        <Workbench />
      </div>
    </div>
  );
};
```

## Responsive Preview

```tsx
<Preview className="w-full aspect-video max-w-[1920px] mx-auto bg-black" />
```

## Notes

- Preview automatically connects to the timeline
- Shows real-time playback of your composition
- Scales to fit the container while maintaining aspect ratio
- Use with `Controls` component for playback buttons
