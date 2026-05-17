---
description: "Compose Preview, Controls, Filmstrip, Workbench, and Hierarchy components to build fully custom video editor interfaces."
---


# Building Custom Editors
# Building Custom Editors in React

Build video editor interfaces by composing GUI elements. Start with a minimal editor and progressively add features.

## Import

```tsx
import {
  Timegroup, Video, Text, Audio,
  Preview, Controls, TogglePlay, Scrubber,
  TimeDisplay, ToggleLoop, Filmstrip, Hierarchy,
  Workbench, PanZoom, FitScale
} from "@editframe/react";
```

## Minimal Editor (Preview + Controls)

The simplest functional editor needs only preview and controls:

```html live
<div class="h-screen flex flex-col bg-gray-900">
  <!-- Preview Area -->
  <div class="flex-1 flex items-center justify-center p-8">
    <ef-preview class="w-full max-w-[1280px] aspect-video bg-black rounded-lg shadow-2xl">
      <ef-timegroup id="minimal-comp" mode="sequence" class="w-[1920px] h-[1080px]">
        <ef-timegroup mode="fixed" duration="3s" class="flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
          <ef-text duration="3s" class="text-white text-6xl font-bold">Scene 1</ef-text>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="3s" class="flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-600">
          <ef-text duration="3s" class="text-white text-6xl font-bold">Scene 2</ef-text>
        </ef-timegroup>
      </ef-timegroup>
    </ef-preview>
  </div>

  <!-- Controls Bar -->
  <div class="bg-gray-800 border-t border-gray-700 p-4">
    <ef-controls target="minimal-comp" class="flex items-center gap-4 max-w-4xl mx-auto">
      <ef-toggle-play>
        <button slot="play" class="w-10 h-10 flex items-center justify-center text-white hover:text-blue-400 transition">▶</button>
        <button slot="pause" class="w-10 h-10 flex items-center justify-center text-white hover:text-blue-400 transition">⏸</button>
      </ef-toggle-play>
      <ef-time-display class="text-white text-sm font-mono min-w-[120px]"></ef-time-display>
      <ef-scrubber class="flex-1"></ef-scrubber>
      <ef-toggle-loop>
        <button slot="off" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition">↻</button>
        <button slot="on" class="w-10 h-10 flex items-center justify-center text-green-400 hover:text-white transition">↻</button>
      </ef-toggle-loop>
    </ef-controls>
  </div>
</div>
```
```tsx
const MinimalEditor = () => (
  <div className="h-screen flex flex-col bg-gray-900">
    <div className="flex-1 flex items-center justify-center p-8">
      <Preview className="w-full max-w-[1280px] aspect-video bg-black rounded-lg shadow-2xl">
        <Timegroup id="comp" mode="sequence" className="w-[1920px] h-[1080px]">
          <Timegroup mode="fixed" duration="3s" className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <Text duration="3s" className="text-white text-6xl font-bold">Scene 1</Text>
          </Timegroup>
          <Timegroup mode="fixed" duration="3s" className="flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-600">
            <Text duration="3s" className="text-white text-6xl font-bold">Scene 2</Text>
          </Timegroup>
        </Timegroup>
      </Preview>
    </div>

    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <Controls target="comp" className="flex items-center gap-4 max-w-4xl mx-auto">
        <TogglePlay
          play={<button className="w-10 h-10 text-white hover:text-blue-400">▶</button>}
          pause={<button className="w-10 h-10 text-white hover:text-blue-400">⏸</button>}
        />
        <TimeDisplay className="text-white text-sm font-mono min-w-[120px]" />
        <Scrubber className="flex-1" />
        <ToggleLoop
          off={<button className="text-gray-400 hover:text-white">↻</button>}
          on={<button className="text-green-400 hover:text-white">↻</button>}
        />
      </Controls>
    </div>
  </div>
);
```

## Adding Timeline (Preview + Controls + Filmstrip)

Add visual timeline feedback with `ef-filmstrip`:

```html live
<div class="h-screen flex flex-col bg-gray-900">
  <!-- Preview Area -->
  <div class="flex-1 flex items-center justify-center p-4">
    <ef-preview class="w-full max-w-[1280px] aspect-video bg-black rounded-lg shadow-2xl">
      <ef-timegroup id="timeline-comp" mode="sequence" class="w-[1920px] h-[1080px]">
        <ef-timegroup mode="fixed" duration="2s" class="flex items-center justify-center bg-blue-600">
          <ef-text duration="2s" class="text-white text-5xl font-bold">Intro</ef-text>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="4s" class="relative">
          <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="4s" class="absolute inset-0 size-full object-cover"></ef-video>
          <ef-text duration="4s" class="absolute bottom-8 left-8 text-white text-4xl font-bold bg-black/50 px-4 py-2 rounded">Main Content</ef-text>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="2s" class="flex items-center justify-center bg-purple-600">
          <ef-text duration="2s" class="text-white text-5xl font-bold">Outro</ef-text>
        </ef-timegroup>
      </ef-timegroup>
    </ef-preview>
  </div>

  <!-- Controls Bar -->
  <div class="bg-gray-800 border-t border-gray-700 px-4 py-2">
    <ef-controls target="timeline-comp" class="flex items-center gap-3 max-w-4xl mx-auto">
      <ef-toggle-play>
        <button slot="play" class="w-8 h-8 text-white">▶</button>
        <button slot="pause" class="w-8 h-8 text-white">⏸</button>
      </ef-toggle-play>
      <ef-time-display class="text-white text-sm font-mono"></ef-time-display>
      <ef-scrubber class="flex-1 h-2"></ef-scrubber>
      <ef-toggle-loop>
        <button slot="off" class="text-gray-400">↻</button>
        <button slot="on" class="text-green-400">↻</button>
      </ef-toggle-loop>
    </ef-controls>
  </div>

  <!-- Timeline Panel -->
  <div class="h-64 bg-gray-900 border-t border-gray-800">
    <ef-filmstrip target="timeline-comp" pixels-per-ms="0.1"></ef-filmstrip>
  </div>
</div>
```
Add visual timeline feedback with `Filmstrip`:

```tsx
const TimelineEditor = () => (
  <div className="h-screen flex flex-col bg-gray-900">
    <div className="flex-1 flex items-center justify-center p-4">
      <Preview className="w-full max-w-[1280px] aspect-video bg-black rounded-lg shadow-2xl">
        <Timegroup id="timeline-comp" mode="sequence" className="w-[1920px] h-[1080px]">
          <Timegroup mode="fixed" duration="2s" className="flex items-center justify-center bg-blue-600">
            <Text duration="2s" className="text-white text-5xl font-bold">Intro</Text>
          </Timegroup>
          <Timegroup mode="fixed" duration="4s" className="relative">
            <Video src="/assets/main.mp4" sourceIn="0s" sourceOut="4s" className="absolute inset-0 size-full object-cover" />
            <Text duration="4s" className="absolute bottom-8 left-8 text-white text-4xl font-bold bg-black/50 px-4 py-2 rounded">Main Content</Text>
          </Timegroup>
        </Timegroup>
      </Preview>
    </div>

    <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
      <Controls target="timeline-comp" className="flex items-center gap-3 max-w-4xl mx-auto">
        <TogglePlay play={<button className="text-white">▶</button>} pause={<button className="text-white">⏸</button>} />
        <TimeDisplay className="text-white text-sm font-mono" />
        <Scrubber className="flex-1 h-2" />
      </Controls>
    </div>

    <div className="h-64 bg-gray-900 border-t border-gray-800">
      <Filmstrip target="timeline-comp" pixelsPerMs={0.1} />
    </div>
  </div>
);
```

## Adding Layers (Preview + Controls + Filmstrip + Hierarchy)

Add layer management with `ef-hierarchy`:

```html live
<div class="h-screen flex bg-gray-900">
  <!-- Left Sidebar: Layers -->
  <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
    <div class="px-4 py-3 border-b border-gray-700">
      <h3 class="text-white font-semibold">Layers</h3>
    </div>
    <div class="flex-1 overflow-auto">
      <ef-hierarchy target="layers-comp" class="w-full"></ef-hierarchy>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    <!-- Preview Area -->
    <div class="flex-1 flex items-center justify-center p-4">
      <ef-preview class="w-full max-w-[1280px] aspect-video bg-black rounded-lg">
        <ef-timegroup id="layers-comp" mode="contain" class="w-[1920px] h-[1080px] bg-black">
          <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="absolute inset-0 size-full object-cover"></ef-video>
          <ef-text duration="8s" class="absolute top-8 left-8 text-white text-5xl font-bold">Title Text</ef-text>
          <ef-text duration="8s" class="absolute bottom-8 right-8 text-white text-sm">© 2024</ef-text>
        </ef-timegroup>
      </ef-preview>
    </div>

    <!-- Controls -->
    <div class="bg-gray-800 border-t border-gray-700 px-4 py-2">
      <ef-controls target="layers-comp" class="flex items-center gap-3 max-w-4xl mx-auto">
        <ef-toggle-play>
          <button slot="play" class="w-8 h-8 text-white">▶</button>
          <button slot="pause" class="w-8 h-8 text-white">⏸</button>
        </ef-toggle-play>
        <ef-time-display class="text-white text-sm font-mono"></ef-time-display>
        <ef-scrubber class="flex-1 h-2"></ef-scrubber>
      </ef-controls>
    </div>

    <!-- Timeline -->
    <div class="h-48 bg-gray-900 border-t border-gray-800">
      <ef-filmstrip target="layers-comp"></ef-filmstrip>
    </div>
  </div>
</div>
```
Add layer management with `Hierarchy`:

```tsx
const LayeredEditor = () => (
  <div className="h-screen flex bg-gray-900">
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-white font-semibold">Layers</h3>
      </div>
      <div className="flex-1 overflow-auto">
        <Hierarchy target="layers-comp" className="w-full" />
      </div>
    </div>

    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Preview className="w-full max-w-[1280px] aspect-video bg-black rounded-lg">
          <Timegroup id="layers-comp" mode="contain" className="w-[1920px] h-[1080px] bg-black">
            <Video src="/assets/video.mp4" className="absolute inset-0 size-full object-cover" />
            <Text duration="8s" className="absolute top-8 left-8 text-white text-5xl font-bold">Title Text</Text>
          </Timegroup>
        </Preview>
      </div>

      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
        <Controls target="layers-comp" className="flex items-center gap-3 max-w-4xl mx-auto">
          <TogglePlay play={<button className="text-white">▶</button>} pause={<button className="text-white">⏸</button>} />
          <TimeDisplay className="text-white text-sm font-mono" />
          <Scrubber className="flex-1 h-2" />
        </Controls>
      </div>

      <div className="h-48 bg-gray-900 border-t border-gray-800">
        <Filmstrip target="layers-comp" />
      </div>
    </div>
  </div>
);
```

## Full-Featured Editor (Using Workbench)

For a complete editor with all features, use `ef-workbench`:

```html live
<ef-workbench class="w-full h-screen">
  <ef-pan-zoom slot="canvas">
    <ef-fit-scale>
      <ef-timegroup mode="sequence" class="w-[1920px] h-[1080px]">
        <ef-timegroup mode="fixed" duration="3s" class="relative">
          <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="0s" sourceout="3s" class="absolute inset-0 size-full object-cover"></ef-video>
          <div class="absolute inset-0 flex items-center justify-center">
            <ef-text duration="3s" class="text-white text-6xl font-bold bg-black/50 px-8 py-4 rounded-xl">Opening</ef-text>
          </div>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="4s" class="relative">
          <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" sourcein="5s" sourceout="9s" class="absolute inset-0 size-full object-cover"></ef-video>
          <ef-text duration="4s" class="absolute top-12 left-12 text-white text-4xl font-bold">Main Content</ef-text>
          <ef-text duration="4s" class="absolute bottom-12 left-12 text-white text-xl">Subtitle text here</ef-text>
        </ef-timegroup>
        <ef-timegroup mode="fixed" duration="2s" class="flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <ef-text duration="2s" class="text-white text-6xl font-bold">Thanks!</ef-text>
        </ef-timegroup>
      </ef-timegroup>
    </ef-fit-scale>
  </ef-pan-zoom>

  <ef-hierarchy slot="hierarchy"></ef-hierarchy>

  <div slot="timeline" class="h-full flex flex-col">
    <ef-controls class="flex items-center gap-2 p-2 border-b border-gray-700 bg-gray-800">
      <ef-toggle-play>
        <button slot="play" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Play</button>
        <button slot="pause" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">Pause</button>
      </ef-toggle-play>
      <ef-time-display class="text-sm text-gray-300 font-mono"></ef-time-display>
      <ef-scrubber class="flex-1 mx-4"></ef-scrubber>
      <ef-toggle-loop>
        <button slot="off" class="px-3 py-2 text-gray-400 hover:text-white transition">Loop Off</button>
        <button slot="on" class="px-3 py-2 text-green-400 hover:text-white transition">Loop On</button>
      </ef-toggle-loop>
    </ef-controls>
    <ef-filmstrip class="flex-1" pixels-per-ms="0.08"></ef-filmstrip>
  </div>
</ef-workbench>
```
For a complete editor with all features, use `Workbench`:

```tsx
const FullEditor = () => (
  <Workbench className="w-full h-screen">
    <PanZoom slot="canvas">
      <FitScale>
        <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
          <Timegroup mode="fixed" duration="3s" className="relative">
            <Video src="/assets/intro.mp4" sourceIn="0s" sourceOut="3s" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Text duration="3s" className="text-white text-6xl font-bold bg-black/50 px-8 py-4 rounded-xl">Opening</Text>
            </div>
          </Timegroup>
          <Timegroup mode="fixed" duration="4s" className="relative">
            <Video src="/assets/main.mp4" sourceIn="5s" sourceOut="9s" className="absolute inset-0 size-full object-cover" />
            <Text duration="4s" className="absolute top-12 left-12 text-white text-4xl font-bold">Main Content</Text>
          </Timegroup>
          <Timegroup mode="fixed" duration="2s" className="flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <Text duration="2s" className="text-white text-6xl font-bold">Thanks!</Text>
          </Timegroup>
        </Timegroup>
      </FitScale>
    </PanZoom>

    <Hierarchy slot="hierarchy" />

    <div slot="timeline" className="h-full flex flex-col">
      <Controls className="flex items-center gap-2 p-2 border-b border-gray-700 bg-gray-800">
        <TogglePlay
          play={<button className="px-4 py-2 bg-blue-600 text-white rounded">Play</button>}
          pause={<button className="px-4 py-2 bg-gray-600 text-white rounded">Pause</button>}
        />
        <TimeDisplay className="text-sm text-gray-300 font-mono" />
        <Scrubber className="flex-1 mx-4" />
        <ToggleLoop
          off={<button className="text-gray-400">Loop Off</button>}
          on={<button className="text-green-400">Loop On</button>}
        />
      </Controls>
      <Filmstrip className="flex-1" pixelsPerMs={0.08} />
    </div>
  </Workbench>
);
```

## Custom Styling with CSS Parts

Style internal elements using `::part()` selectors:

```html live
<style>
  .custom-scrubber::part(scrubber) {
    background: rgba(255, 255, 255, 0.1);
    height: 6px;
    border-radius: 3px;
  }

  .custom-scrubber::part(progress) {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 3px;
  }

  .custom-scrubber::part(handle) {
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .custom-time::part(time) {
    font-family: 'Monaco', monospace;
    font-size: 14px;
    color: #60a5fa;
    letter-spacing: 0.5px;
  }
</style>

<div class="bg-gray-900 p-8 rounded-lg">
  <ef-preview class="w-full max-w-[960px] aspect-video bg-black rounded-lg mx-auto mb-4">
    <ef-timegroup id="styled-comp" mode="contain" class="w-[1920px] h-[1080px] bg-gradient-to-br from-indigo-600 to-purple-700">
      <ef-text duration="5s" class="flex items-center justify-center size-full text-white text-7xl font-bold">
        Custom Styled
      </ef-text>
    </ef-timegroup>
  </ef-preview>

  <ef-controls target="styled-comp" class="flex items-center gap-4 max-w-2xl mx-auto bg-gray-800 p-4 rounded-lg">
    <ef-toggle-play>
      <button slot="play" class="w-12 h-12 bg-blue-600 rounded-full text-white text-xl hover:bg-blue-700 transition">▶</button>
      <button slot="pause" class="w-12 h-12 bg-gray-600 rounded-full text-white text-xl hover:bg-gray-700 transition">⏸</button>
    </ef-toggle-play>
    <ef-time-display class="custom-time"></ef-time-display>
    <ef-scrubber class="custom-scrubber flex-1"></ef-scrubber>
  </ef-controls>
</div>
```

## Split-Panel Layout

Separate preview from composition with side-by-side layout:

```html live
<div class="h-screen flex flex-col bg-gray-900">
  <div class="flex-1 grid grid-cols-2 gap-4 p-4">
    <!-- Left: Preview -->
    <div class="flex flex-col">
      <h2 class="text-white text-xl mb-2 font-semibold">Preview</h2>
      <ef-preview class="flex-1 bg-black rounded-lg">
        <ef-timegroup id="split-target" mode="sequence" class="w-[1920px] h-[1080px]">
          <ef-timegroup mode="fixed" duration="3s" class="flex items-center justify-center bg-blue-600">
            <ef-text duration="3s" class="text-white text-5xl font-bold">First</ef-text>
          </ef-timegroup>
          <ef-timegroup mode="fixed" duration="3s" class="flex items-center justify-center bg-green-600">
            <ef-text duration="3s" class="text-white text-5xl font-bold">Second</ef-text>
          </ef-timegroup>
        </ef-timegroup>
      </ef-preview>
    </div>

    <!-- Right: Composition -->
    <div class="flex flex-col">
      <h2 class="text-white text-xl mb-2 font-semibold">Composition Structure</h2>
      <div class="flex-1 bg-gray-800 rounded-lg overflow-auto">
        <ef-hierarchy target="split-target"></ef-hierarchy>
      </div>
    </div>
  </div>

  <!-- Bottom: Controls + Timeline -->
  <div class="border-t border-gray-800">
    <div class="bg-gray-800 px-4 py-2">
      <ef-controls target="split-target" class="flex items-center gap-3 max-w-4xl mx-auto">
        <ef-toggle-play>
          <button slot="play" class="w-8 h-8 text-white">▶</button>
          <button slot="pause" class="w-8 h-8 text-white">⏸</button>
        </ef-toggle-play>
        <ef-time-display class="text-white text-sm font-mono"></ef-time-display>
        <ef-scrubber class="flex-1 h-2"></ef-scrubber>
      </ef-controls>
    </div>
    <div class="h-48 bg-gray-900">
      <ef-filmstrip target="split-target"></ef-filmstrip>
    </div>
  </div>
</div>
```

## Design Patterns

### Context Bridging

Controls work through DOM ancestry by default. Use `ef-controls` to bridge contexts when targets are not ancestors:

```html
<!-- Composition -->
<ef-timegroup id="my-video" mode="contain">
  <!-- content -->
</ef-timegroup>

<!-- Non-adjacent controls -->
<ef-controls target="my-video">
  <ef-toggle-play></ef-toggle-play>
  <ef-scrubber></ef-scrubber>
</ef-controls>
```
Controls work through DOM ancestry by default. Use the `target` prop to bridge contexts when controls are not ancestors:

```tsx
{/* Composition */}
<Timegroup id="my-video" mode="contain">
  {/* content */}
</Timegroup>

{/* Non-adjacent controls */}
<Controls target="my-video">
  <TogglePlay play={<button>▶</button>} pause={<button>⏸</button>} />
  <Scrubber />
</Controls>
```

### Progressive Enhancement

Build editors incrementally:
1. Start with Preview + Controls for basic playback
2. Add Filmstrip for visual timeline
3. Add Hierarchy for layer management
4. Add Workbench for complete editor UI

### Responsive Layouts

Use CSS Grid and Flexbox for responsive editor layouts:

```html
<div class="h-screen grid grid-rows-[1fr_auto_200px]">
  <ef-preview><!-- preview --></ef-preview>
  <ef-controls><!-- controls --></ef-controls>
  <ef-filmstrip><!-- timeline --></ef-filmstrip>
</div>
```

### Theming

Use CSS custom properties for consistent theming:

```css
:root {
  --ef-color-bg: #111827;
  --ef-color-border: #374151;
  --ef-color-text: #f9fafb;
  --ef-color-primary: #3b82f6;
}
```
### Responsive Layouts

Use CSS Grid and Flexbox for responsive editor layouts:

```tsx
<div className="h-screen grid grid-rows-[1fr_auto_200px]">
  <Preview>{/* preview */}</Preview>
  <Controls>{/* controls */}</Controls>
  <Filmstrip />
</div>
```

## Summary

- **Minimal**: Preview + Controls for basic playback
- **Timeline**: Add Filmstrip for visual timeline
- **Layers**: Add Hierarchy for layer management
- **Complete**: Use Workbench for full-featured editor
- **Custom**: Compose elements for custom layouts
- **Styling**: Use CSS parts for deep customization
