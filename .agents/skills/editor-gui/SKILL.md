---
name: editor-gui
description: Build video editing interfaces using Editframe's GUI web components. Assemble timeline, scrubber, filmstrip, preview, and playback controls like lego bricks. Use when creating video editors, editing tools, or when user mentions timeline, scrubber, preview, playback controls, trim handles, or wants to build editing UIs.
---

# Editor GUI Components

Build bespoke video editing interfaces by composing discrete GUI components. Each component is a self-contained building block that connects to your composition via targets.

## Core Principle

GUI components are **lego bricks**. They don't contain content—they provide controls and views for content defined by Elements (EFTimegroup, EFVideo, EFText, etc.). Connect them using `target` attributes.

## Quick Start: Minimal Player

```html
<ef-timegroup id="my-video" mode="fixed" duration="5s">
  <ef-video src="/video.mp4" duration="5s"></ef-video>
</ef-timegroup>

<ef-controls target="my-video">
  <ef-toggle-play></ef-toggle-play>
  <ef-scrubber></ef-scrubber>
  <ef-time-display></ef-time-display>
</ef-controls>
```

## Component Reference

### Preview & Canvas

```html
<!-- Basic preview (renders composition at current time) -->
<ef-preview target="my-canvas"></ef-preview>

<!-- Canvas with pan/zoom container -->
<ef-pan-zoom>
  <ef-canvas id="my-canvas">
    <ef-timegroup>...</ef-timegroup>
  </ef-canvas>
</ef-pan-zoom>

<!-- Visual transform handles for selected elements -->
<ef-transform-handles></ef-transform-handles>
```

### Playback Controls

```html
<!-- Controls container (provides context to children) -->
<ef-controls target="my-timegroup">
  <!-- Individual controls -->
  <ef-play></ef-play>
  <ef-pause></ef-pause>
  <ef-toggle-play></ef-toggle-play>
  <ef-toggle-loop></ef-toggle-loop>
  <ef-scrubber></ef-scrubber>
  <ef-time-display></ef-time-display>
</ef-controls>

<!-- Or use controls standalone with explicit targets -->
<ef-toggle-play target="my-timegroup"></ef-toggle-play>
<ef-scrubber target="my-timegroup"></ef-scrubber>
```

#### Toggle Play with Custom Slots

```html
<ef-toggle-play>
  <button slot="play">▶ Play</button>
  <button slot="pause">⏸ Pause</button>
</ef-toggle-play>
```

### Timeline

```html
<!-- Full timeline with tracks, ruler, zoom -->
<ef-timeline 
  target="my-canvas"
  show-ruler
  show-playback-controls
  pixels-per-ms="0.1"
></ef-timeline>

<!-- Just the ruler -->
<ef-timeline-ruler target="my-canvas"></ef-timeline-ruler>

<!-- Trim handles for timeline editing -->
<ef-trim-handles></ef-trim-handles>
```

### Filmstrip & Thumbnail Strip

```html
<!-- Thumbnail strip navigation -->
<ef-filmstrip target="my-timegroup"></ef-filmstrip>

<!-- Thumbnail strip visualization (for tracks) -->
<ef-thumbnail-strip></ef-thumbnail-strip>
```

ThumbnailStrip standalone props (for use outside timeline):

| Prop | Type | Description |
|------|------|-------------|
| `targetElement` | `Element \| null` | Direct ref to an EFVideo or EFTimegroup |
| `target` | `string` | ID-based target (alternative to targetElement) |
| `useIntrinsicDuration` | `boolean` | Use media's intrinsic duration instead of timeline duration |
| `thumbnailHeight` | `number` | Thumbnail height in px (default 24) |

### Trim

TrimHandles in standalone mode overlays on any container (e.g. a ThumbnailStrip):

```html
<ef-trim-handles
  value='{"startMs": 0, "endMs": 0}'
  intrinsic-duration-ms="10000"
  seek-target="my-video"
></ef-trim-handles>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `TrimValue` | `{ startMs, endMs }` — ms trimmed from each end |
| `intrinsicDurationMs` | `number` | Total media duration in ms |
| `seekTarget` | `string` | ID of element to seek during drag |
| `showOverlays` | `boolean` | Show dimmed overlay on trimmed regions (default true) |

**Slots**: `handle-start`, `handle-end` — custom handle content (e.g. SVG icons).

**CSS custom properties**:

```css
--trim-handle-width: 16px;
--trim-handle-color: gold;
--trim-handle-active-color: gold;
--trim-handle-border-radius-start: 4px 0 0 4px;
--trim-handle-border-radius-end: 0 4px 4px 0;
--trim-overlay-color: rgba(0, 0, 0, 0.7);
--trim-selected-border-color: gold;
--trim-selected-border-width: 3px;
```

**Events**: `onTrimChange` — fires `CustomEvent<TrimChangeDetail>` where `TrimChangeDetail = { elementId, type, value: TrimValue }`.

### Hierarchy Panel

```html
<!-- Element tree panel -->
<ef-hierarchy 
  target="my-canvas" 
  show-header 
  header="LAYERS"
></ef-hierarchy>
```

### Workbench (Full Editor Shell)

```html
<!-- Complete editing environment with slots -->
<ef-workbench>
  <ef-hierarchy slot="hierarchy" target="my-canvas"></ef-hierarchy>
  <ef-pan-zoom slot="canvas">
    <ef-canvas id="my-canvas">...</ef-canvas>
  </ef-pan-zoom>
  <ef-timeline slot="timeline" target="my-canvas"></ef-timeline>
</ef-workbench>

<!-- Or use shorthand on timegroup -->
<ef-timegroup workbench mode="fixed" duration="10s">
  ...
</ef-timegroup>
```

## React Wrappers

```tsx
import { 
  Preview, 
  Timeline, 
  Controls,
  Scrubber, 
  TogglePlay, 
  TimeDisplay,
  Filmstrip,
  ThumbnailStrip,
  TrimHandles,
  Hierarchy,
  Workbench,
  Video,
  useMediaInfo,
  type TrimValue,
} from '@editframe/react';
import type { EFVideo } from '@editframe/elements';

function SimplePlayer({ timegroupId }) {
  return (
    <Controls target={timegroupId}>
      <TogglePlay />
      <Scrubber />
      <TimeDisplay />
    </Controls>
  );
}
```

## Hooks

### useMediaInfo

Returns intrinsic duration and loading state for a media element ref.

```tsx
const videoRef = useRef<EFVideo>(null);
const { intrinsicDurationMs, loading } = useMediaInfo(videoRef);
```

## Video Trim Props

Video (and all temporal elements) support trim props that clip playback:

```tsx
<Video
  src="/video.mp4"
  trimStartMs={2000}  // trim 2s from start
  trimEndMs={1500}    // trim 1.5s from end
/>
```

`trimStartMs` and `trimEndMs` are in milliseconds, trimmed from each end of the intrinsic duration.

## Composition Patterns

### Pattern 1: Minimal Preview + Controls

```tsx
import { Timegroup, Video, Controls, TogglePlay, Scrubber, TimeDisplay } from '@editframe/react';

export function VideoPlayer({ src }) {
  return (
    <div className="flex flex-col gap-2">
      <Timegroup id="player" mode="fixed" duration="10s">
        <Video src={src} duration="10s" style={{ width: '100%' }} />
      </Timegroup>
      
      <Controls target="player" className="flex items-center gap-2">
        <TogglePlay />
        <Scrubber className="flex-1" />
        <TimeDisplay />
      </Controls>
    </div>
  );
}
```

### Pattern 2: Timeline-Only Editor

```tsx
import { Canvas, Timegroup, Video, Timeline } from '@editframe/react';

export function TimelineEditor({ clips }) {
  return (
    <div className="flex flex-col h-screen">
      <Canvas id="editor" className="flex-1 bg-black">
        <Timegroup id="root" mode="sequence">
          {clips.map(clip => (
            <Video key={clip.id} src={clip.src} duration={clip.duration} />
          ))}
        </Timegroup>
      </Canvas>
      
      <Timeline 
        target="editor" 
        showRuler 
        showPlaybackControls 
        className="h-48 border-t"
      />
    </div>
  );
}
```

### Pattern 3: Filmstrip Navigator

```tsx
import { Timegroup, Video, Filmstrip, Controls, TogglePlay } from '@editframe/react';

export function FilmstripViewer({ src }) {
  return (
    <div className="flex flex-col gap-4">
      <Timegroup id="viewer" mode="fixed" duration="30s">
        <Video src={src} duration="30s" style={{ width: '100%' }} />
      </Timegroup>
      
      <Filmstrip target="viewer" className="h-16" />
      
      <Controls target="viewer" className="flex justify-center">
        <TogglePlay />
      </Controls>
    </div>
  );
}
```

### Pattern 4: Trim Tool

```tsx
import { useId, useState, useRef } from "react";
import {
  Video,
  ThumbnailStrip,
  TrimHandles,
  TogglePlay,
  useMediaInfo,
  type TrimValue,
} from "@editframe/react";
import type { EFVideo } from "@editframe/elements";

export function TrimTool({ src }: { src: string }) {
  const videoId = useId();
  const videoRef = useRef<EFVideo>(null);
  const { intrinsicDurationMs } = useMediaInfo(videoRef);
  const [trim, setTrim] = useState<TrimValue>({ startMs: 0, endMs: 0 });
  const totalDuration = intrinsicDurationMs ?? 0;

  return (
    <div>
      <Video
        id={videoId}
        ref={videoRef}
        src={src}
        loop
        trimStartMs={trim.startMs}
        trimEndMs={trim.endMs}
        className="aspect-video w-full object-contain"
      />

      <div className="relative" style={{ height: 64 }}>
        <ThumbnailStrip
          targetElement={videoRef.current}
          useIntrinsicDuration
          thumbnailHeight={64}
          className="pointer-events-none absolute inset-0"
        />
        <TrimHandles
          value={trim}
          intrinsicDurationMs={totalDuration}
          seekTarget={videoId}
          onTrimChange={(e) => setTrim(e.detail.value)}
          className="absolute inset-0"
        >
          <span slot="handle-start">⟨</span>
          <span slot="handle-end">⟩</span>
        </TrimHandles>
      </div>

      <TogglePlay target={videoId}>
        <button slot="play">▶</button>
        <button slot="pause">⏸</button>
      </TogglePlay>
    </div>
  );
}
```

### Pattern 5: Multi-Layer Editor with Hierarchy

```tsx
import { Workbench, Hierarchy, PanZoom, Canvas, Timegroup, Timeline } from '@editframe/react';

export function LayeredEditor({ children }) {
  return (
    <Workbench className="h-screen">
      <Hierarchy slot="hierarchy" target="main-canvas" showHeader header="LAYERS" />
      
      <PanZoom slot="canvas">
        <Canvas id="main-canvas">
          <Timegroup id="root" mode="contain" duration="10s">
            {children}
          </Timegroup>
        </Canvas>
      </PanZoom>
      
      <Timeline slot="timeline" target="main-canvas" showRuler showPlaybackControls />
    </Workbench>
  );
}
```

## Target Linking

GUI components connect to content using IDs:

```html
<!-- Content with ID -->
<ef-canvas id="my-canvas">
  <ef-timegroup id="my-root">...</ef-timegroup>
</ef-canvas>

<!-- GUI components target by ID -->
<ef-timeline target="my-canvas"></ef-timeline>
<ef-hierarchy target="my-canvas"></ef-hierarchy>
<ef-controls target="my-root"></ef-controls>
<ef-filmstrip target="my-root"></ef-filmstrip>
```

| Component | Target Type | Purpose |
|-----------|-------------|---------|
| Timeline | Canvas ID | Shows all tracks from canvas content |
| Hierarchy | Canvas ID | Shows element tree from canvas |
| Controls | Timegroup ID | Play/pause/seek the timegroup |
| Filmstrip | Timegroup ID | Thumbnail navigation for timegroup |
| Preview | Canvas ID | Renders canvas at current time |

## Styling

All components accept `className` for styling:

```tsx
<Scrubber className="h-2 rounded-full" />
<TogglePlay className="w-10 h-10 bg-white rounded-full" />
<Timeline className="h-48 bg-gray-900" />
```

Components use CSS custom properties for theming:

```css
ef-timeline {
  --ef-timeline-bg: #1a1a1a;
  --ef-timeline-track-bg: #2a2a2a;
  --ef-timeline-playhead: #ff0000;
}

ef-scrubber {
  --ef-scrubber-track: #333;
  --ef-scrubber-fill: #fff;
  --ef-scrubber-thumb: #fff;
}
```

## File Locations

```
elements/packages/elements/src/gui/
├── EFConfiguration.ts    # Root config wrapper
├── EFWorkbench.ts        # Full editor shell
├── EFControls.ts         # Control container
├── EFPlay.ts             # Play button
├── EFPause.ts            # Pause button  
├── EFTogglePlay.ts       # Play/pause toggle
├── EFToggleLoop.ts       # Loop toggle
├── EFScrubber.ts         # Time scrubber
├── EFTimeDisplay.ts      # Time display
├── EFFilmstrip.ts        # Thumbnail strip
├── EFPreview.ts          # Preview renderer
├── hierarchy/
│   └── EFHierarchy.ts    # Layer panel
└── timeline/
    ├── EFTimeline.ts     # Main timeline
    ├── EFTimelineRuler.ts # Time ruler
    └── EFTrimHandles.ts  # Trim handles

elements/packages/react/src/gui/
├── Workbench.ts          # React wrapper
├── Timeline.ts           # React wrapper
├── Controls.ts           # React wrapper
├── Scrubber.ts           # React wrapper
└── ...                   # All components have React wrappers
```

## Agent Panel & ef-edit Event System

EFWorkbench includes a built-in right-column **Agent Sync panel** (`ef-agent-panel`) that accumulates GUI edits and generates a copyable prompt for coding agents.

### How it works

1. When a user drags, resizes, or rotates an element in EFCanvas, the canvas dispatches an `ef-edit` CustomEvent with `bubbles: true, composed: true`.
2. EFWorkbench listens for `ef-edit` on itself (event bubbles up), then calls `agentPanel.addEdit(event.detail)`.
3. The panel accumulates edits, renders a list, and exposes a "Copy Prompt" button.

### ef-edit event payload (EditEvent)

```ts
interface EditEvent {
  operation: ElementMovedOperation | ElementResizedOperation | ElementRotatedOperation;
  description: string;   // human-readable sentence
  selector: string;      // CSS path stopping at infrastructure tags
  elementHtml: string;   // cleaned outerHTML (runtime attrs stripped)
  timestamp: number;
}
```

### Dispatching ef-edit

```ts
import { createEditCustomEvent } from './editEvents.js';
element.dispatchEvent(createEditCustomEvent(editEvent));
```

### Listening from outside

```ts
// Bubbles + composed — listen on workbench or any ancestor
workbench.addEventListener('ef-edit', (e: CustomEvent<EditEvent>) => {
  console.log(e.detail.description, e.detail.selector);
});
```

### Selector path rules

- `buildSelectorPath()` walks up the DOM stopping at INFRASTRUCTURE_TAGS (`ef-canvas`, `ef-workbench`, `ef-pan-zoom`, etc.)
- Auto-generated IDs (containing 8+ digits) are omitted; nth-of-type is used instead
- `getElementHtml()` strips `style`, `data-element-id`, `data-selected`, and auto-generated ids from outerHTML

### Agent panel API

```ts
agentPanel.addEdit(editEvent: EditEvent): void   // called by EFWorkbench
agentPanel.clearEdits(): void
```

### File locations

```
elements/packages/elements/src/gui/
├── EFAgentPanel.ts    # Lit component for the panel
├── editEvents.ts      # EditEvent types, buildSelectorPath, buildAgentPrompt
```

## Sandboxes

Test individual components:

```bash
elements/scripts/npm run sandbox
```

Browse to component sandboxes:
- `src/gui/EFScrubber.sandbox.ts`
- `src/gui/EFTimeline.sandbox.ts`
- `src/gui/EFFilmstrip.sandbox.ts`
- `src/gui/EFControls.sandbox.ts`
