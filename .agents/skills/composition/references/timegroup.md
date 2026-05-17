---
description: "Container element for grouping and sequencing composition elements, controlling layout mode, duration, and playback behavior."
---


# ef-timegroup

## Attributes

- **mode** (string) (required) - Duration calculation mode
- **duration** (timestring) - Explicit duration (for fixed mode)
- **overlap** (timestring) - Overlap time between sequence items (e.g., "1s")
- **fps** (number, default: 30) - Frame rate for rendering
- **auto-init** (boolean, default: false) - Auto-seek to frame 0 on load (root only)
- **workbench** (boolean, default: false) - Enable timeline/hierarchy UI (root only)

## Methods

- **async renderToVideo(options?: RenderToVideoOptions): Promise<Uint8Array | undefined>** - Export timegroup to MP4 video using WebCodecs API
  - Returns: Promise<Uint8Array | undefined>
- **async createRenderClone(): Promise<RenderCloneResult>** - Create independent off-DOM clone for background rendering without affecting preview
  - Returns: Promise<RenderCloneResult>
- **addFrameTask(callback: FrameTaskCallback): () => void** - Register callback executed on each frame during rendering or playback
  - Returns: Cleanup function that removes the callback
- **async seek(timeMs: number): Promise<void>** - Seek to specific time position and wait for content to be ready
  - Returns: Promise<void>

# Timegroup

Container for sequencing and grouping elements.

## Import

```tsx
import { Timegroup } from "@editframe/react";
```

## Modes

- `fixed` - Uses `duration` attribute
- `fixed` - Uses `duration` prop
- `sequence` - Sum of children (sequential playback)
- `contain` - Longest child duration
- `fit` - Inherit from parent

## Root Timegroup

```html live
<ef-timegroup mode="sequence" workbench class="w-[720px] h-[480px] bg-black">
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full flex items-center justify-center">
    <ef-text duration="3s" class="text-white text-3xl">Scene 1</ef-text>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full flex items-center justify-center">
    <ef-text duration="3s" class="text-white text-3xl">Scene 2</ef-text>
  </ef-timegroup>
</ef-timegroup>
```
```tsx
import { Timegroup } from "@editframe/react";

export const Video = () => {
  return (
    <Timegroup workbench mode="sequence" className="w-[800px] h-[500px] bg-black">
      {/* scenes here */}
    </Timegroup>
  );
};
```

## Scene (Fixed Duration)

```html
<ef-timegroup mode="fixed" duration="5s" class="absolute w-full h-full">
  <ef-video src="clip.mp4" class="size-full object-cover"></ef-video>
  <ef-text class="absolute top-4 left-4 text-white">Overlay</ef-text>
</ef-timegroup>
```
```tsx
<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  <Video src="/assets/clip.mp4" className="size-full object-cover" />
  <Text className="absolute top-4 left-4 text-white">Overlay</Text>
</Timegroup>
```

## Nested Sequence

```html
<ef-timegroup mode="sequence">
  <ef-timegroup mode="fixed" duration="3s"><!-- Scene 1 --></ef-timegroup>
  <ef-timegroup mode="fixed" duration="5s"><!-- Scene 2 --></ef-timegroup>
  <ef-timegroup mode="fixed" duration="4s"><!-- Scene 3 --></ef-timegroup>
</ef-timegroup>
```
```tsx
<Timegroup mode="sequence">
  <Timegroup mode="fixed" duration="3s">
    {/* Scene 1 */}
  </Timegroup>
  <Timegroup mode="fixed" duration="5s">
    {/* Scene 2 */}
  </Timegroup>
  <Timegroup mode="fixed" duration="4s">
    {/* Scene 3 */}
  </Timegroup>
</Timegroup>
```

## Dynamic Content

Map over data to create scenes:

```tsx
const scenes = [
  { id: 1, text: "Scene 1", duration: "3s" },
  { id: 2, text: "Scene 2", duration: "5s" },
  { id: 3, text: "Scene 3", duration: "4s" },
];

<Timegroup workbench mode="sequence" className="w-[800px] h-[500px]">
  {scenes.map((scene) => (
    <Timegroup
      key={scene.id}
      mode="fixed"
      duration={scene.duration}
      className="absolute w-full h-full"
    >
      <Text className="text-white text-4xl">{scene.text}</Text>
    </Timegroup>
  ))}
</Timegroup>
```

## Sequence with Overlap

Use `overlap` to create transitions between items:

```html
<ef-timegroup mode="sequence" overlap="1s">
  <ef-timegroup mode="contain"><!-- Scene 1 --></ef-timegroup>
  <ef-timegroup mode="contain"><!-- Scene 2 --></ef-timegroup>
</ef-timegroup>
```
```tsx
<Timegroup mode="sequence" overlap="1s">
  <Timegroup mode="contain">{/* Scene 1 */}</Timegroup>
  <Timegroup mode="contain">{/* Scene 2 */}</Timegroup>
</Timegroup>
```

See [transitions.md](references/transitions.md) for crossfade examples.

## With useTimingInfo Hook

```tsx
import { Timegroup } from "@editframe/react";
import { useTimingInfo } from "@editframe/react";

const AnimatedScene = () => {
  const { ref, percentComplete, ownCurrentTimeMs } = useTimingInfo();

  return (
    <Timegroup ref={ref} mode="contain" className="absolute w-full h-full">
      <div style={{ opacity: percentComplete }}>
        Fading in... {(ownCurrentTimeMs / 1000).toFixed(2)}s
      </div>
    </Timegroup>
  );
};
```

## Methods

### renderToVideo()

Export the timegroup composition to MP4 video using the WebCodecs API. See [render-api.md](references/render-api.md) for complete documentation.

```typescript
async renderToVideo(options?: RenderToVideoOptions): Promise<Uint8Array | undefined>
```

**Basic Example:**

```typescript
const tg = document.querySelector('ef-timegroup');

await tg.renderToVideo({
  fps: 30,
  codec: 'avc',
  filename: 'output.mp4',
  onProgress: (progress) => {
    console.log(`${Math.round(progress.progress * 100)}% complete`);
  }
});
```

**RenderToVideoOptions:**
- `fps` - Frame rate (default: 30)
- `codec` - Video codec: "avc", "hevc", "vp9", "av1", "vp8" (default: "avc")
- `bitrate` - Video bitrate in bits/second (default: 5000000)
- `filename` - Download filename (default: "video.mp4")
- `scale` - Resolution multiplier (default: 1)
- `fromMs`, `toMs` - Time range to export
- `onProgress` - Progress callback receiving `RenderProgress` object
- `includeAudio` - Include audio tracks (default: true)
- `signal` - AbortSignal for cancellation
- `returnBuffer` - Return Uint8Array instead of downloading
- And more - see [render-api.md](references/render-api.md)

### createRenderClone()

Create an independent off-DOM clone for background rendering without affecting the preview timeline.

```typescript
async createRenderClone(): Promise<RenderCloneResult>
```

**Example:**

```typescript
const tg = document.querySelector('ef-timegroup');

// Create isolated render clone
const { clone, container, cleanup } = await tg.createRenderClone();

try {
  // Clone has independent time state
  await clone.seek(5000);  // Seek clone to 5 seconds

  // Original timeline unaffected
  console.log('Clone time:', clone.currentTimeMs);
  console.log('Original time:', tg.currentTimeMs);
} finally {
  // Always clean up
  cleanup();
}
```

**RenderCloneResult:**
```typescript
interface RenderCloneResult {
  clone: EFTimegroup;      // Cloned timegroup with independent state
  container: HTMLElement;  // Off-screen container holding the clone
  cleanup: () => void;     // Remove clone from DOM and clean up
}
```

Clones automatically re-run the `initializer` function if set, enabling JavaScript-driven animations in renders.

### addFrameTask()

Register a callback that executes on each frame during playback or rendering. Returns cleanup function.

```typescript
addFrameTask(callback: FrameTaskCallback): () => void
```

**Example:**

```typescript
const tg = document.querySelector('ef-timegroup');

const cleanup = tg.addFrameTask((info) => {
  // Update DOM based on current time
  const progress = info.percentComplete;
  console.log(`Frame at ${info.ownCurrentTimeMs}ms (${Math.round(progress * 100)}%)`);

  // Modify child elements
  const textEl = info.element.querySelector('.dynamic-text');
  if (textEl) {
    textEl.textContent = `Time: ${(info.ownCurrentTimeMs / 1000).toFixed(2)}s`;
  }
});

// Remove callback when done
cleanup();
```

**FrameTaskCallback:**
```typescript
type FrameTaskCallback = (info: {
  ownCurrentTimeMs: number;    // This element's local time
  currentTimeMs: number;       // Root timeline's global time
  durationMs: number;          // This element's duration
  percentComplete: number;     // Completion percentage (0.0 to 1.0)
  element: EFTimegroup;        // The timegroup instance
}) => void | Promise<void>;
```

The callback can be sync or async. Multiple callbacks can be registered and execute in parallel.

### seek()

Seek to a specific time position and wait for all visible content to be ready.

```typescript
async seek(timeMs: number): Promise<void>
```

**Example:**

```typescript
const tg = document.querySelector('ef-timegroup');

// Seek to 3 seconds
await tg.seek(3000);

// Timeline is now at 3s, all visible media loaded
console.log('Current time:', tg.currentTimeMs);
```

Time is automatically quantized to frame boundaries based on the `fps` attribute.

## Scripting

Add dynamic behavior with JavaScript using the `initializer` property. The initializer function runs on both the original timeline and all render clones.

```html
<ef-timegroup id="dynamic-scene" mode="fixed" duration="5s">
  <div class="dynamic-text"></div>
</ef-timegroup>

<script>
  const tg = document.querySelector('#dynamic-scene');

  // Initializer runs once per instance (original + clones)
  tg.initializer = (instance) => {
    instance.addFrameTask((info) => {
      const text = instance.querySelector('.dynamic-text');
      text.textContent = `Time: ${(info.ownCurrentTimeMs / 1000).toFixed(2)}s`;
    });
  };
</script>
```
Add dynamic behavior with JavaScript. See [scripting.md](references/scripting.md) for details.

```tsx
import { useRef, useEffect } from "react";
import { Timegroup } from "@editframe/react";

const DynamicScene = () => {
  const timegroupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tg = timegroupRef.current;
    if (!tg) return;

    tg.initializer = (instance) => {
      const cleanup = instance.addFrameTask((info) => {
        // Update content based on time
        console.log(`Time: ${info.ownCurrentTimeMs}ms`);
      });

      return cleanup;
    };
  }, []);

  return (
    <Timegroup ref={timegroupRef} mode="fixed" duration="5s">
      {/* Content */}
    </Timegroup>
  );
};
```

**TimegroupInitializer:**
```typescript
type TimegroupInitializer = (timegroup: EFTimegroup) => void;
```

**Constraints:**
- Must be synchronous (no async/await, no Promise return)
- Must complete quickly (&lt;10ms warning, &lt;100ms error)
- Should only register callbacks and set up behavior
- Runs once per instance (prime timeline + each render clone)
