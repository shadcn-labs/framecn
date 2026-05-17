---
description: "Export compositions to video in the browser or via CLI with full control over resolution, bitrate, and encoding options."
---


# Render API


## Methods

- **renderToVideo(options?)** - Export timegroup to MP4 video with WebCodecs
  - Returns: Promise<Uint8Array | undefined>
- **createRenderClone()** - Create off-DOM clone for rendering without affecting preview
  - Returns: Promise<RenderCloneResult>
- **getRenderData<T>()** - Access custom data passed from CLI at render time
  - Returns: T | undefined


Export compositions to MP4 video using browser-based WebCodecs or server-side rendering via CLI.

## Browser Export with renderToVideo()

Export videos directly in the browser using the WebCodecs API. Best for client-side applications and interactive exports.

### Basic Usage

```html live
<ef-timegroup mode="fixed" duration="3s" class="w-[720px] h-[480px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
  <ef-text duration="3s" class="text-white text-6xl font-bold">Hello Video!</ef-text>
</ef-timegroup>

<button id="exportBtn" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Export Video
</button>

<div id="progress" class="mt-4 hidden">
  <div class="text-sm text-gray-300 mb-2">
    <span id="progressText">Rendering...</span>
  </div>
  <div class="w-full bg-gray-700 rounded-full h-2">
    <div id="progressBar" class="bg-blue-600 h-2 rounded-full transition-all" style="width: 0%"></div>
  </div>
  <canvas id="preview" class="mt-4 border border-gray-600" style="width: 360px; height: 240px;"></canvas>
</div>

<script type="module">
  const timegroup = document.querySelector('ef-timegroup');
  const exportBtn = document.getElementById('exportBtn');
  const progressDiv = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const previewCanvas = document.getElementById('preview');

  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    progressDiv.classList.remove('hidden');

    try {
      await timegroup.renderToVideo({
        fps: 30,
        codec: 'avc',
        filename: 'my-video.mp4',
        onProgress: (progress) => {
          const percent = Math.round(progress.progress * 100);
          progressBar.style.width = `${percent}%`;
          progressText.textContent = `Rendering frame ${progress.currentFrame}/${progress.totalFrames} (${percent}%)`;

          // Show live preview of current frame
          if (progress.framePreviewCanvas) {
            const ctx = previewCanvas.getContext('2d');
            previewCanvas.width = progress.framePreviewCanvas.width;
            previewCanvas.height = progress.framePreviewCanvas.height;
            ctx.drawImage(progress.framePreviewCanvas, 0, 0);
          }
        }
      });

      progressText.textContent = 'Export complete! Video downloaded.';
      exportBtn.disabled = false;
    } catch (error) {
      progressText.textContent = `Export failed: ${error.message}`;
      exportBtn.disabled = false;
    }
  });
</script>
```

### RenderToVideoOptions

All options for `renderToVideo()`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fps` | `number` | `30` | Frame rate (frames per second) |
| `codec` | `string` | `"avc"` | Video codec: `"avc"`, `"hevc"`, `"vp9"`, `"av1"`, `"vp8"` |
| `bitrate` | `number` | `5_000_000` | Video bitrate in bits per second |
| `filename` | `string` | `"video.mp4"` | Download filename |
| `scale` | `number` | `1` | Rendering scale multiplier (2 = 2x resolution) |
| `keyFrameInterval` | `number` | `150` | Frames between keyframes |
| `fromMs` | `number` | `0` | Start time in milliseconds |
| `toMs` | `number` | `duration` | End time in milliseconds |
| `onProgress` | `function` | - | Progress callback (see below) |
| `streaming` | `boolean` | `false` | Stream output using File System Access API |
| `signal` | `AbortSignal` | - | AbortSignal to cancel render |
| `includeAudio` | `boolean` | `true` | Include audio tracks in output |
| `audioBitrate` | `number` | `128_000` | Audio bitrate in bits per second |
| `contentReadyMode` | `string` | `"immediate"` | `"immediate"` or `"blocking"` for video readiness |
| `blockingTimeoutMs` | `number` | `5000` | Timeout for blocking video loads |
| `returnBuffer` | `boolean` | `false` | Return Uint8Array instead of downloading |
| `preferredAudioCodecs` | `array` | `["opus", "aac"]` | Preferred audio codecs in order |
| `benchmarkMode` | `boolean` | `false` | Skip encoding for performance testing |
| `customWritableStream` | `WritableStream` | - | Custom output stream for programmatic control |
| `progressPreviewInterval` | `number` | `10` | Frames between preview updates |
| `canvasMode` | `string` | `"foreignObject"` | `"native"` or `"foreignObject"` rendering |

### Progress Callback

The `onProgress` callback receives a `RenderProgress` object with detailed information:

```typescript
interface RenderProgress {
  progress: number;              // 0.0 to 1.0
  currentFrame: number;          // Current frame index
  totalFrames: number;           // Total frames to render
  renderedMs: number;            // Milliseconds rendered so far
  totalDurationMs: number;       // Total video duration
  elapsedMs: number;             // Real time elapsed
  estimatedRemainingMs: number;  // Estimated time remaining
  speedMultiplier: number;       // Render speed (2.0 = 2x real-time)
  framePreviewCanvas?: HTMLCanvasElement; // Preview of current frame
}
```

### Codec Support Matrix

Browser support varies by codec. Check availability before rendering:

| Codec | Chrome | Safari | Firefox | Notes |
|-------|--------|--------|---------|-------|
| `avc` (H.264) | ✅ | ✅ | ✅ | Best compatibility, widely supported |
| `hevc` (H.265) | ⚠️ | ✅ | ❌ | macOS/iOS only, better compression |
| `vp9` | ✅ | ❌ | ✅ | Open codec, good compression |
| `av1` | ✅ | ⚠️ | ✅ | Modern, best compression, slower encoding |
| `vp8` | ✅ | ❌ | ✅ | Legacy WebM codec |

**Recommendation:** Use `avc` for maximum compatibility or `av1` for best quality/size.

### Audio Inclusion

Audio from `ef-video` and `ef-audio` elements is automatically mixed and included:

```typescript
await timegroup.renderToVideo({
  includeAudio: true,           // Include audio tracks
  audioBitrate: 192_000,        // Higher quality audio (192 kbps)
  preferredAudioCodecs: ['opus', 'aac'] // Codec preference order
});
```

Audio codecs available: `opus` (best quality), `aac` (most compatible), `mp3` (legacy).

### Streaming Output

Stream large videos to disk without loading entire file into memory:

```typescript
await timegroup.renderToVideo({
  streaming: true,              // Uses File System Access API
  filename: 'large-video.mp4'   // User picks save location
});
```

Requires browser support for File System Access API (Chrome 86+, Edge 86+).

### Aborting Renders

Cancel long-running exports with AbortController:

```typescript
const controller = new AbortController();

// Start render
const renderPromise = timegroup.renderToVideo({
  signal: controller.signal,
  onProgress: (progress) => {
    console.log(`${Math.round(progress.progress * 100)}%`);
  }
});

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  await renderPromise;
} catch (error) {
  if (error.name === 'RenderCancelledError') {
    console.log('Render was cancelled');
  }
}
```

### Partial Exports

Export specific time ranges without modifying the composition:

```typescript
// Export only seconds 5-15
await timegroup.renderToVideo({
  fromMs: 5000,
  toMs: 15000,
  filename: 'clip.mp4'
});
```

### High-Resolution Export

Render at higher resolutions using the `scale` option:

```typescript
// Render at 2x resolution (1440x960 from 720x480 composition)
await timegroup.renderToVideo({
  scale: 2,
  bitrate: 10_000_000  // Increase bitrate for higher resolution
});
```

### Programmatic Buffer Access

Get video data as Uint8Array instead of downloading:

```typescript
const videoBuffer = await timegroup.renderToVideo({
  returnBuffer: true,
  filename: 'video.mp4'
});

// Upload to server
const formData = new FormData();
formData.append('video', new Blob([videoBuffer], { type: 'video/mp4' }));
await fetch('/api/upload', { method: 'POST', body: formData });
```

## Off-DOM Rendering with createRenderClone()

Create an independent clone of a timegroup for off-screen rendering. This enables rendering without affecting the user's preview position and allows concurrent renders.

### Why Use Render Clones?

- **Non-disruptive:** Render in background without affecting preview playback
- **Concurrent:** Run multiple renders simultaneously with different clones
- **Isolated state:** Each clone has independent time position and state
- **JavaScript re-execution:** Initializer functions run on each clone

### Basic Usage

```typescript
// Create a render clone
const { clone, container, cleanup } = await timegroup.createRenderClone();

try {
  // Clone is fully functional and independent
  await clone.seekForRender(5000);  // Seek to 5 seconds

  // Render single frame to canvas
  const canvas = await renderToImageNative(clone, 1920, 1080);

  // Use canvas data...
  const dataUrl = canvas.toDataURL('image/png');

} finally {
  // Always clean up when done
  cleanup();
}
```

### Automatic Clone Management

`renderToVideo()` automatically manages clones internally. You typically don't need to use `createRenderClone()` directly unless you're building custom rendering logic.

```typescript
// This internally creates and manages a render clone
await timegroup.renderToVideo({ fps: 30 });
```

### Clone Factory Pattern

For compositions with JavaScript behavior, provide an initializer function that runs on both the prime timeline and all clones:

```typescript
<ef-timegroup id="myComp" mode="sequence"></ef-timegroup>

<script type="module">
  const timegroup = document.getElementById('myComp');

  // This function runs on the original AND on all render clones
  timegroup.initializer = (tg) => {
    // Set up reactive state, register callbacks, etc.
    tg.addEventListener('frame-task', (e) => {
      // Update canvas, modify DOM, etc.
      console.log('Frame:', e.detail.currentTimeMs);
    });
  };
</script>
```

The initializer:
- **Must be synchronous** (no async/await, no Promise return)
- **Must complete quickly** (&lt;10ms warning, &lt;100ms error)
- Runs once per instance (original + each clone)
- Enables JavaScript-driven animations in renders

## CLI Rendering

For server-side rendering, use the Editframe CLI. See the `editframe-cli` skill for full documentation.

### Quick Render

```bash
npx editframe render -o output.mp4
```

### Custom Render Data

Pass dynamic data into compositions at render time:

```bash
npx editframe render --data '{"userName":"John","theme":"dark"}' -o video.mp4
```

Read the data in your composition with `getRenderData()`:

```typescript
import { getRenderData } from "@editframe/elements";

interface MyRenderData {
  userName: string;
  theme: "light" | "dark";
}

const data = getRenderData<MyRenderData>();
if (data) {
  console.log(data.userName);  // "John"
  console.log(data.theme);     // "dark"
}
```

### When to Use CLI vs Browser

**Use CLI rendering when:**
- Running on a server or CI/CD pipeline
- Need consistent encoding across platforms
- Processing videos in batch
- Require specific encoder settings not available in browsers

**Use browser rendering when:**
- Building interactive client-side applications
- Want instant preview and export without server
- Need real-time progress feedback
- Exporting user-generated content

## Advanced: Custom Writable Streams

For fine-grained control over output, provide a custom WritableStream:

```typescript
class VideoUploadStream extends WritableStream<Uint8Array> {
  constructor() {
    super({
      async write(chunk) {
        // Stream chunks directly to server
        await fetch('/api/upload/chunk', {
          method: 'POST',
          body: chunk
        });
      },
      async close() {
        // Finalize upload
        await fetch('/api/upload/complete', { method: 'POST' });
      }
    });
  }
}

await timegroup.renderToVideo({
  customWritableStream: new VideoUploadStream(),
  returnBuffer: false
});
```

## Performance Tips

1. **Use appropriate codecs:** `avc` encodes fastest, `av1` encodes slowest but smallest
2. **Reduce resolution:** Lower resolution renders much faster
3. **Limit audio bitrate:** High audio bitrates don't improve quality much
4. **Use contentReadyMode: "immediate":** Skip waiting for videos to fully load
5. **Disable progress previews:** Set high `progressPreviewInterval` or omit callback
6. **Test codec support:** Not all codecs are hardware-accelerated on all devices

## Browser Requirements

- **WebCodecs API** (Chrome 94+, Edge 94+, Safari 16.4+)
- **File System Access API** for streaming (Chrome 86+, Edge 86+)
- Requires HTTPS or localhost (secure context)

Check support:

```typescript
const hasWebCodecs = 'VideoEncoder' in window && 'VideoDecoder' in window;
const hasFileSystemAccess = 'showSaveFilePicker' in window;
```

## Error Handling

```typescript
try {
  await timegroup.renderToVideo({ fps: 60, codec: 'av1' });
} catch (error) {
  if (error.name === 'RenderCancelledError') {
    console.log('User cancelled export');
  } else if (error.name === 'NoSupportedAudioCodecError') {
    console.log('No compatible audio codec available');
    // Retry without audio
    await timegroup.renderToVideo({ includeAudio: false });
  } else {
    console.error('Render failed:', error);
  }
}
```

## Examples

### Export with Custom Settings

```typescript
await timegroup.renderToVideo({
  fps: 60,                       // Smooth 60fps
  codec: 'avc',                  // H.264 for compatibility
  bitrate: 8_000_000,            // 8 Mbps
  scale: 1.5,                    // 1.5x resolution
  includeAudio: true,
  audioBitrate: 256_000,         // High quality audio
  filename: 'high-quality.mp4'
});
```

### Progress Bar with Time Estimates

```typescript
await timegroup.renderToVideo({
  onProgress: ({ progress, elapsedMs, estimatedRemainingMs, speedMultiplier }) => {
    const percent = Math.round(progress * 100);
    const elapsed = Math.round(elapsedMs / 1000);
    const remaining = Math.round(estimatedRemainingMs / 1000);

    console.log(
      `${percent}% complete | ` +
      `Elapsed: ${elapsed}s | ` +
      `Remaining: ${remaining}s | ` +
      `Speed: ${speedMultiplier.toFixed(1)}x`
    );
  }
});
```

### Export Multiple Clips

```typescript
const clips = [
  { fromMs: 0, toMs: 5000, filename: 'intro.mp4' },
  { fromMs: 5000, toMs: 15000, filename: 'main.mp4' },
  { fromMs: 15000, toMs: 20000, filename: 'outro.mp4' },
];

for (const clip of clips) {
  await timegroup.renderToVideo(clip);
}
```
