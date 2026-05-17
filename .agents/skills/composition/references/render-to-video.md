---
description: End-to-end guide to exporting Editframe compositions as MP4 video files using the browser renderer or Editframe CLI.
---


# Render to Video Tutorial

Build a composition and export it as MP4 video directly in the browser using WebCodecs.
# Render to Video Tutorial (React)

Build a React composition and export it as MP4 video directly in the browser using WebCodecs.

## Prerequisites

Browser must support WebCodecs API (Chrome 94+, Edge 94+, Safari 16.4+). Check support:

```javascript
const supported = 'VideoEncoder' in window && 'VideoDecoder' in window;
```
- React project with `@editframe/react` installed
- Browser supporting WebCodecs API (Chrome 94+, Edge 94+, Safari 16.4+)
- `TimelineRoot` wrapper (required for rendering)

## Step 1: Create a Composition

Start with a basic composition that you want to render:

```html live
<ef-timegroup id="myComposition" mode="sequence" class="w-[1280px] h-[720px] bg-gradient-to-br from-purple-900 to-blue-900">
  <!-- Scene 1: Title -->
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full flex items-center justify-center">
    <ef-text duration="3s" class="text-white text-6xl font-bold animate-fade-in">
      Welcome
    </ef-text>
  </ef-timegroup>

  <!-- Scene 2: Content -->
  <ef-timegroup mode="fixed" duration="4s" class="absolute w-full h-full flex items-center justify-center">
    <ef-text duration="4s" class="text-white text-4xl">
      This will be exported as video
    </ef-text>
  </ef-timegroup>
</ef-timegroup>
```
Build your video composition as a React component:

```tsx
import { Timegroup, Text } from "@editframe/react";

export const MyVideo = () => {
  return (
    <Timegroup
      mode="sequence"
      className="w-[1280px] h-[720px] bg-gradient-to-br from-purple-900 to-blue-900"
    >
      {/* Scene 1: Title */}
      <Timegroup
        mode="fixed"
        duration="3s"
        className="absolute w-full h-full flex items-center justify-center"
      >
        <Text duration="3s" className="text-white text-6xl font-bold">
          Welcome
        </Text>
      </Timegroup>

      {/* Scene 2: Content */}
      <Timegroup
        mode="fixed"
        duration="4s"
        className="absolute w-full h-full flex items-center justify-center"
      >
        <Text duration="4s" className="text-white text-4xl">
          This will be exported as video
        </Text>
      </Timegroup>
    </Timegroup>
  );
};
```

## Step 2: Add Export ButtonGet Timegroup Reference
Create UI for triggering the export:

```html
<button id="exportBtn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
  Export Video
</button>

<div id="progressContainer" class="mt-4 hidden">
  <div class="flex justify-between text-sm text-gray-300 mb-2">
    <span id="progressText">Preparing...</span>
    <span id="progressPercent">0%</span>
  </div>
  <div class="w-full bg-gray-700 rounded-full h-3">
    <div id="progressBar" class="bg-blue-600 h-3 rounded-full transition-all" style="width: 0%"></div>
  </div>
  <div class="mt-2 text-xs text-gray-400">
    <span id="timeInfo"></span>
  </div>
</div>
```
Use a ref to access the underlying timegroup element:

```tsx
import { useRef } from "react";
import { Timegroup, Text } from "@editframe/react";
import type { EFTimegroup } from "@editframe/elements";

export const MyVideo = () => {
  const timegroupRef = useRef<EFTimegroup>(null);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    await timegroupRef.current.renderToVideo({
      fps: 30,
      codec: "avc",
      filename: "my-video.mp4"
    });
  };

  return (
    <>
      <Timegroup
        ref={timegroupRef}
        mode="sequence"
        className="w-[1280px] h-[720px] bg-black"
      >
        {/* composition content */}
      </Timegroup>

      <button onClick={handleExport}>Export Video</button>
    </>
  );
};
```

## Step 3: Implement Basic RenderAdd Progress State
Call `renderToVideo()` on the timegroup element:

```javascript
const timegroup = document.getElementById('myComposition');
const exportBtn = document.getElementById('exportBtn');

exportBtn.addEventListener('click', async () => {
  exportBtn.disabled = true;

  try {
    await timegroup.renderToVideo({
      fps: 30,
      codec: 'avc',
      filename: 'my-video.mp4'
    });

    alert('Video exported successfully!');
  } catch (error) {
    alert('Export failed: ' + error.message);
  } finally {
    exportBtn.disabled = false;
  }
});
```

The video automatically downloads when rendering completes.

## Step 4: Add Progress Tracking

Show real-time progress with the `onProgress` callback:

```javascript
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const timeInfo = document.getElementById('timeInfo');

exportBtn.addEventListener('click', async () => {
  exportBtn.disabled = true;
  progressContainer.classList.remove('hidden');

  try {
    await timegroup.renderToVideo({
      fps: 30,
      codec: 'avc',
      filename: 'my-video.mp4',
      onProgress: (progress) => {
        // Update progress bar
        const percent = Math.round(progress.progress * 100);
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;

        // Update status text
        progressText.textContent = `Rendering frame ${progress.currentFrame} of ${progress.totalFrames}`;

        // Show timing information
        const elapsed = Math.round(progress.elapsedMs / 1000);
        const remaining = Math.round(progress.estimatedRemainingMs / 1000);
        const speed = progress.speedMultiplier.toFixed(1);
        timeInfo.textContent = `Elapsed: ${elapsed}s | Remaining: ${remaining}s | Speed: ${speed}x`;
      }
    });

    progressText.textContent = 'Export complete!';
    progressPercent.textContent = '100%';
  } catch (error) {
    progressText.textContent = 'Export failed: ' + error.message;
  } finally {
    exportBtn.disabled = false;
  }
});
```
Track render progress with React state:

```tsx
import { useState, useRef } from "react";
import { Timegroup, Text } from "@editframe/react";
import type { EFTimegroup } from "@editframe/elements";
import type { RenderProgress } from "@editframe/elements";

export const MyVideo = () => {
  const timegroupRef = useRef<EFTimegroup>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    setIsRendering(true);
    setError(null);
    setProgress(null);

    try {
      await timegroupRef.current.renderToVideo({
        fps: 30,
        codec: "avc",
        filename: "my-video.mp4",
        onProgress: (p) => {
          setProgress(p);
        }
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <>
      <Timegroup
        ref={timegroupRef}
        mode="sequence"
        className="w-[1280px] h-[720px] bg-gradient-to-br from-blue-600 to-purple-600"
      >
        <Timegroup
          mode="fixed"
          duration="3s"
          className="absolute w-full h-full flex items-center justify-center"
        >
          <Text duration="3s" className="text-white text-6xl font-bold">
            Editframe
          </Text>
        </Timegroup>
      </Timegroup>

      <div className="mt-4 space-y-4">
        <button
          onClick={handleExport}
          disabled={isRendering}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRendering ? "Rendering..." : "Export Video"}
        </button>

        {progress && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>
                Frame {progress.currentFrame} of {progress.totalFrames}
              </span>
              <span>{Math.round(progress.progress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress.progress * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Speed: {progress.speedMultiplier.toFixed(1)}x |
              Remaining: {Math.round(progress.estimatedRemainingMs / 1000)}s
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">Error: {error}</div>
        )}
      </div>
    </>
  );
};
```

## Step 4: Use useTimingInfo for Dynamic Content

Combine `useTimingInfo` with rendering for time-based animations:

```tsx
import { Timegroup, Text, useTimingInfo } from "@editframe/react";

const FadeInScene = ({ children }: { children: React.ReactNode }) => {
  const { ref, percentComplete } = useTimingInfo();

  return (
    <Timegroup
      ref={ref}
      mode="fixed"
      duration="3s"
      className="absolute w-full h-full flex items-center justify-center"
    >
      <div style={{ opacity: percentComplete }}>
        {children}
      </div>
    </Timegroup>
  );
};

export const AnimatedVideo = () => {
  const timegroupRef = useRef<EFTimegroup>(null);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    await timegroupRef.current.renderToVideo({
      fps: 30,
      codec: "avc",
      filename: "animated-video.mp4"
    });
  };

  return (
    <>
      <Timegroup
        ref={timegroupRef}
        mode="sequence"
        className="w-[1280px] h-[720px] bg-black"
      >
        <FadeInScene>
          <Text className="text-white text-6xl">Fades In</Text>
        </FadeInScene>

        <FadeInScene>
          <Text className="text-white text-6xl">Also Fades In</Text>
        </FadeInScene>
      </Timegroup>

      <button onClick={handleExport}>Export</button>
    </>
  );
};
```

## Step 5: Add Codec Selection

Let users choose the codec based on browser support:

```html
<select id="codecSelect" class="px-4 py-2 bg-gray-700 text-white rounded">
  <option value="avc">H.264 (Best Compatibility)</option>
  <option value="hevc">H.265 (Better Compression)</option>
  <option value="vp9">VP9 (Open Codec)</option>
  <option value="av1">AV1 (Best Quality)</option>
</select>
```

```javascript
const codecSelect = document.getElementById('codecSelect');

// Check codec support on load
const codecs = ['avc', 'hevc', 'vp9', 'av1'];
codecs.forEach(async (codec) => {
  const config = {
    codec: codec === 'avc' ? 'avc1.42E01E' :
           codec === 'hevc' ? 'hvc1.1.6.L93.B0' :
           codec === 'vp9' ? 'vp09.00.10.08' : 'av01.0.05M.08',
    width: 1280,
    height: 720,
    bitrate: 5_000_000,
    framerate: 30
  };

  const supported = await VideoEncoder.isConfigSupported(config);
  if (!supported.supported) {
    const option = codecSelect.querySelector(`option[value="${codec}"]`);
    option.disabled = true;
    option.textContent += ' (Not Supported)';
  }
});

// Use selected codec when rendering
exportBtn.addEventListener('click', async () => {
  const codec = codecSelect.value;
  // ... rest of render code
  await timegroup.renderToVideo({
    fps: 30,
    codec: codec,
    filename: 'my-video.mp4',
    onProgress: (progress) => { /* ... */ }
  });
});
```
```tsx
import { useState, useRef } from "react";
import { Timegroup, Text } from "@editframe/react";
import type { EFTimegroup } from "@editframe/elements";

type Codec = "avc" | "hevc" | "vp9" | "av1";

export const MyVideo = () => {
  const timegroupRef = useRef<EFTimegroup>(null);
  const [codec, setCodec] = useState<Codec>("avc");
  const [isRendering, setIsRendering] = useState(false);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    setIsRendering(true);
    try {
      await timegroupRef.current.renderToVideo({
        fps: 30,
        codec,
        filename: `video-${codec}.mp4`
      });
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <>
      <Timegroup
        ref={timegroupRef}
        mode="sequence"
        className="w-[1280px] h-[720px] bg-black"
      >
        {/* composition */}
      </Timegroup>

      <div className="flex gap-4 mt-4">
        <select
          value={codec}
          onChange={(e) => setCodec(e.target.value as Codec)}
          className="px-4 py-2 border rounded"
        >
          <option value="avc">H.264 (Best Compatibility)</option>
          <option value="hevc">H.265 (Better Compression)</option>
          <option value="vp9">VP9 (Open Codec)</option>
          <option value="av1">AV1 (Best Quality)</option>
        </select>

        <button onClick={handleExport} disabled={isRendering}>
          {isRendering ? "Rendering..." : "Export Video"}
        </button>
      </div>
    </>
  );
};
```

## Step 6: Include Audio

Audio from `ef-video` and `ef-audio`Video and Audio elements is automatically mixed:

```html
<ef-timegroup id="compositionWithAudio" mode="sequence" class="w-[1280px] h-[720px]">
  <ef-timegroup mode="fixed" duration="5s" class="absolute w-full h-full">
    <ef-video src="/assets/clip.mp4" class="size-full object-cover"></ef-video>
    <ef-audio src="/assets/music.mp3" volume="0.3"></ef-audio>
  </ef-timegroup>
</ef-timegroup>
```

```javascript
await timegroup.renderToVideo({
  fps: 30,
  codec: 'avc',
  includeAudio: true,              // Default: true
  audioBitrate: 192_000,           // 192 kbps for high quality
  preferredAudioCodecs: ['opus', 'aac'],  // Preference order
  filename: 'video-with-audio.mp4'
});
```
```tsx
import { Timegroup, Video, Audio, Text } from "@editframe/react";

export const VideoWithAudio = () => {
  const timegroupRef = useRef<EFTimegroup>(null);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    await timegroupRef.current.renderToVideo({
      fps: 30,
      codec: "avc",
      includeAudio: true,              // Default: true
      audioBitrate: 192_000,           // High quality (192 kbps)
      preferredAudioCodecs: ["opus", "aac"],
      filename: "video-with-audio.mp4"
    });
  };

  return (
    <>
      <Timegroup
        ref={timegroupRef}
        mode="fixed"
        duration="10s"
        className="w-[1280px] h-[720px] bg-black"
      >
        <Video src="/assets/clip.mp4" className="size-full object-cover" />
        <Audio src="/assets/music.mp3" volume={0.3} />
        <Text className="absolute bottom-8 text-white text-2xl">
          With Background Music
        </Text>
      </Timegroup>

      <button onClick={handleExport}>Export with Audio</button>
    </>
  );
};
```

## Step 7: Add Cancel Support

Allow users to abort long renders:

```html
<button id="cancelBtn" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hidden">
  Cancel Render
</button>
```

```javascript
let abortController = null;
const cancelBtn = document.getElementById('cancelBtn');

exportBtn.addEventListener('click', async () => {
  exportBtn.disabled = true;
  cancelBtn.classList.remove('hidden');
  progressContainer.classList.remove('hidden');

  abortController = new AbortController();

  try {
    await timegroup.renderToVideo({
      fps: 30,
      codec: 'avc',
      filename: 'my-video.mp4',
      signal: abortController.signal,
      onProgress: (progress) => {
        // Update progress UI
        const percent = Math.round(progress.progress * 100);
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
      }
    });

    progressText.textContent = 'Export complete!';
  } catch (error) {
    if (error.name === 'RenderCancelledError') {
      progressText.textContent = 'Render cancelled by user';
    } else {
      progressText.textContent = 'Export failed: ' + error.message;
    }
  } finally {
    exportBtn.disabled = false;
    cancelBtn.classList.add('hidden');
    abortController = null;
  }
});

cancelBtn.addEventListener('click', () => {
  if (abortController) {
    abortController.abort();
  }
});
```
Allow users to abort renders with AbortController:

```tsx
import { useState, useRef } from "react";
import { Timegroup, Text } from "@editframe/react";
import type { EFTimegroup } from "@editframe/elements";

export const CancellableExport = () => {
  const timegroupRef = useRef<EFTimegroup>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    setIsRendering(true);
    setProgress(0);

    abortControllerRef.current = new AbortController();

    try {
      await timegroupRef.current.renderToVideo({
        fps: 30,
        codec: "avc",
        filename: "my-video.mp4",
        signal: abortControllerRef.current.signal,
        onProgress: (p) => {
          setProgress(p.progress * 100);
        }
      });

      alert("Export complete!");
    } catch (error) {
      if (error instanceof Error && error.name === "RenderCancelledError") {
        alert("Render cancelled");
      } else {
        alert("Export failed");
      }
    } finally {
      setIsRendering(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <>
      <Timegroup
        ref={timegroupRef}
        mode="sequence"
        className="w-[1280px] h-[720px] bg-black"
      >
        {/* composition */}
      </Timegroup>

      <div className="flex gap-4 mt-4">
        <button onClick={handleExport} disabled={isRendering}>
          Export Video
        </button>

        {isRendering && (
          <>
            <button onClick={handleCancel} className="bg-red-600">
              Cancel
            </button>
            <div className="flex-1">
              <div className="text-sm mb-1">{Math.round(progress)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
```

## Complete Example

```html live
<ef-timegroup id="finalComposition" mode="sequence" class="w-[1280px] h-[720px] bg-black">
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
    <ef-text duration="3s" class="text-white text-6xl font-bold">Editframe</ef-text>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
    <ef-text duration="3s" class="text-white text-4xl">Export to Video</ef-text>
  </ef-timegroup>
</ef-timegroup>

<div class="mt-4 space-y-4">
  <div class="flex gap-4">
    <button id="finalExportBtn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
      Export Video
    </button>
    <button id="finalCancelBtn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hidden">
      Cancel
    </button>
    <select id="finalCodecSelect" class="px-4 py-2 bg-gray-700 text-white rounded">
      <option value="avc">H.264</option>
      <option value="vp9">VP9</option>
      <option value="av1">AV1</option>
    </select>
  </div>

  <div id="finalProgressContainer" class="hidden">
    <div class="flex justify-between text-sm mb-2">
      <span id="finalProgressText">Preparing...</span>
      <span id="finalProgressPercent">0%</span>
    </div>
    <div class="w-full bg-gray-700 rounded-full h-3">
      <div id="finalProgressBar" class="bg-blue-600 h-3 rounded-full transition-all" style="width: 0%"></div>
    </div>
    <div class="mt-2 text-xs text-gray-400" id="finalTimeInfo"></div>
  </div>
</div>

<script type="module">
  const timegroup = document.getElementById('finalComposition');
  const exportBtn = document.getElementById('finalExportBtn');
  const cancelBtn = document.getElementById('finalCancelBtn');
  const codecSelect = document.getElementById('finalCodecSelect');
  const progressContainer = document.getElementById('finalProgressContainer');
  const progressBar = document.getElementById('finalProgressBar');
  const progressText = document.getElementById('finalProgressText');
  const progressPercent = document.getElementById('finalProgressPercent');
  const timeInfo = document.getElementById('finalTimeInfo');

  let abortController = null;

  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    cancelBtn.classList.remove('hidden');
    progressContainer.classList.remove('hidden');

    abortController = new AbortController();

    try {
      await timegroup.renderToVideo({
        fps: 30,
        codec: codecSelect.value,
        bitrate: 5_000_000,
        filename: 'editframe-export.mp4',
        signal: abortController.signal,
        onProgress: (progress) => {
          const percent = Math.round(progress.progress * 100);
          progressBar.style.width = `${percent}%`;
          progressPercent.textContent = `${percent}%`;
          progressText.textContent = `Rendering frame ${progress.currentFrame}/${progress.totalFrames}`;

          const elapsed = Math.round(progress.elapsedMs / 1000);
          const remaining = Math.round(progress.estimatedRemainingMs / 1000);
          timeInfo.textContent = `${elapsed}s elapsed | ${remaining}s remaining | ${progress.speedMultiplier.toFixed(1)}x speed`;
        }
      });

      progressText.textContent = 'Export complete! Video downloaded.';
      progressPercent.textContent = '100%';
    } catch (error) {
      if (error.name === 'RenderCancelledError') {
        progressText.textContent = 'Render cancelled';
      } else {
        progressText.textContent = `Error: ${error.message}`;
      }
    } finally {
      exportBtn.disabled = false;
      cancelBtn.classList.add('hidden');
      abortController = null;
    }
  });

  cancelBtn.addEventListener('click', () => {
    if (abortController) abortController.abort();
  });
</script>
```
```tsx
import { useState, useRef } from "react";
import { Timegroup, Text, useTimingInfo } from "@editframe/react";
import type { EFTimegroup, RenderProgress } from "@editframe/elements";

type Codec = "avc" | "hevc" | "vp9" | "av1";

const AnimatedScene = ({ children }: { children: React.ReactNode }) => {
  const { ref, percentComplete } = useTimingInfo();

  return (
    <Timegroup
      ref={ref}
      mode="fixed"
      duration="3s"
      className="absolute w-full h-full flex items-center justify-center"
    >
      <div style={{ opacity: percentComplete, transform: `scale(${0.5 + percentComplete * 0.5})` }}>
        {children}
      </div>
    </Timegroup>
  );
};

export const CompleteExportExample = () => {
  const timegroupRef = useRef<EFTimegroup>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [codec, setCodec] = useState<Codec>("avc");
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!timegroupRef.current) return;

    setIsRendering(true);
    setError(null);
    setProgress(null);

    abortControllerRef.current = new AbortController();

    try {
      await timegroupRef.current.renderToVideo({
        fps: 30,
        codec,
        bitrate: 5_000_000,
        filename: `my-video-${codec}.mp4`,
        signal: abortControllerRef.current.signal,
        onProgress: (p) => setProgress(p)
      });

      alert("Video exported successfully!");
    } catch (err) {
      if (err instanceof Error && err.name === "RenderCancelledError") {
        setError("Render cancelled by user");
      } else {
        setError(err instanceof Error ? err.message : "Export failed");
      }
    } finally {
      setIsRendering(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
  };

  const percent = progress ? Math.round(progress.progress * 100) : 0;

  return (
    <div className="space-y-4">
      <Timegroup
        ref={timegroupRef}
        mode="sequence"
        className="w-[1280px] h-[720px] bg-gradient-to-br from-blue-600 to-purple-600"
      >
        <AnimatedScene>
          <Text className="text-white text-6xl font-bold">Editframe</Text>
        </AnimatedScene>

        <AnimatedScene>
          <Text className="text-white text-4xl">Export to Video</Text>
        </AnimatedScene>

        <AnimatedScene>
          <Text className="text-white text-4xl">React + WebCodecs</Text>
        </AnimatedScene>
      </Timegroup>

      <div className="flex gap-4 items-center">
        <select
          value={codec}
          onChange={(e) => setCodec(e.target.value as Codec)}
          disabled={isRendering}
          className="px-4 py-2 border rounded"
        >
          <option value="avc">H.264</option>
          <option value="hevc">H.265</option>
          <option value="vp9">VP9</option>
          <option value="av1">AV1</option>
        </select>

        <button
          onClick={handleExport}
          disabled={isRendering}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRendering ? "Rendering..." : "Export Video"}
        </button>

        {isRendering && (
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
        )}
      </div>

      {progress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Frame {progress.currentFrame} of {progress.totalFrames}</span>
            <span>{percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            Elapsed: {Math.round(progress.elapsedMs / 1000)}s |
            Remaining: {Math.round(progress.estimatedRemainingMs / 1000)}s |
            Speed: {progress.speedMultiplier.toFixed(1)}x
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
```

## Advanced Options

### High-Resolution Export

Render at higher resolution than the composition:

```javascript
await timegroup.renderToVideo({
  scale: 2,              // 2x resolution (2560x1440 from 1280x720)
  bitrate: 10_000_000,   // Increase bitrate for quality
  filename: 'high-res.mp4'
});
```
```tsx
await timegroupRef.current.renderToVideo({
  scale: 2,              // 2x resolution
  bitrate: 10_000_000,   // Higher bitrate for quality
  filename: "high-res.mp4"
});
```

### Partial Export

Export only a portion of the composition:

```javascript
await timegroup.renderToVideo({
  fromMs: 2000,    // Start at 2 seconds
  toMs: 8000,      // End at 8 seconds
  filename: 'clip.mp4'
});
```
```tsx
await timegroupRef.current.renderToVideo({
  fromMs: 2000,    // Start at 2 seconds
  toMs: 8000,      // End at 8 seconds
  filename: "clip.mp4"
});
```

### Programmatic AccessBuffer Access
Get the video as a buffer instead of downloading:

```javascript
const videoBuffer = await timegroup.renderToVideo({
  returnBuffer: true,
  filename: 'video.mp4'
});

// Upload to server
const formData = new FormData();
formData.append('video', new Blob([videoBuffer], { type: 'video/mp4' }));
await fetch('/api/upload', { method: 'POST', body: formData });
```
```tsx
const videoBuffer = await timegroupRef.current.renderToVideo({
  returnBuffer: true,
  filename: "video.mp4"
});

// Upload to server
const formData = new FormData();
formData.append("video", new Blob([videoBuffer], { type: "video/mp4" }));
await fetch("/api/upload", { method: "POST", body: formData });
```

## TypeScript Types

Import types for proper typing:

```tsx
import type {
  EFTimegroup,
  RenderProgress,
  RenderToVideoOptions
} from "@editframe/elements";

const options: RenderToVideoOptions = {
  fps: 60,
  codec: "avc",
  bitrate: 8_000_000,
  onProgress: (progress: RenderProgress) => {
    console.log(progress.progress);
  }
};
```

## Important Notes

1. **TimelineRoot Required**: Always wrap your composition with `TimelineRoot` for rendering to work correctly with React state and hooks
2. **Refs for Access**: Use refs to access the underlying `EFTimegroup` element
3. **State Management**: React state updates work normally during rendering thanks to `TimelineRoot`
4. **Hook Support**: `useTimingInfo` and other hooks work in render clones

## Next Steps

- See [render-api.md](references/render-api.md) for all options
- See [render-strategies.md](references/render-strategies.md) for choosing between browser, CLI, and cloud rendering
- See the `editframe-cli` skill for server-side rendering
- See [hooks.md](references/hooks.md) for `useTimingInfo` and other hooks
- See [timegroup.md](references/timegroup.md) for composition structure
- See [timeline-root.md](references/timeline-root.md) for why it's required
- See the `editframe-cli` skill for server-side rendering
