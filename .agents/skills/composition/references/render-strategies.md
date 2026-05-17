---
description: "Three approaches to rendering Editframe compositions — CLI, browser-side, and cloud — with tradeoffs and when to use each."
---


# Render Strategies

Editframe compositions can be rendered through three paths. Each targets a different environment and set of constraints. The composition itself is identical across all three — only the rendering infrastructure differs.

## CLI Render (Playwright)

The CLI spawns a local Vite dev server and a Playwright browser instance. The browser loads the composition, and frames are captured server-side using Playwright's screenshot API.

```bash
npx editframe render -o output.mp4
```

The CLI handles encoding, audio muxing, and output assembly. Dynamic data can be injected at render time:

```bash
npx editframe render --data '{"title":"Q4 Report","theme":"dark"}' -o output.mp4
```

Access the data inside the composition with `getRenderData()`:

```html
<script type="module">
  import { getRenderData } from "@editframe/elements";

  const data = getRenderData();
  if (data) {
    document.querySelector('ef-text').textContent = data.title;
  }
</script>
```

The CLI path is suited for local development, automation scripts, and CI/CD pipelines where no browser UI is needed.

## Browser Render (WebCodecs)

The browser path uses the WebCodecs API for video encoding and FFmpeg.wasm for muxing. The entire render runs client-side — no server is required.

```html
<script type="module">
  const timegroup = document.querySelector('ef-timegroup');

  await timegroup.renderToVideo({
    fps: 30,
    codec: 'avc',
    filename: 'export.mp4',
    onProgress: (progress) => {
      console.log(`${Math.round(progress.progress * 100)}%`);
    }
  });
</script>
```

Browser support: Chrome 94+, Edge 94+, Safari 16.4+. Check availability at runtime:

```html
<script type="module">
  const supported = 'VideoEncoder' in window && 'VideoDecoder' in window;
</script>
```

The browser path is suited for user-facing export features, interactive applications, and cases where you want to avoid running a backend.

## Cloud Render (API)

The cloud path uploads the composition bundle to a server, which processes it with Playwright in a controlled environment. The server handles encoding, asset resolution, and output delivery.

```bash
# POST composition bundle to render API
curl -X POST https://api.editframe.com/v1/renders \
  -H "Authorization: Bearer $API_KEY" \
  -F "bundle=@composition.tgz"
```

Results are delivered via webhook or polling. The cloud path is suited for production workflows, scalable rendering, and environments where no browser is available.

## Comparison

| Aspect | CLI (Playwright) | Browser (WebCodecs) | Cloud (API) |
|--------|-------------------|---------------------|-------------|
| Runs in | Local machine | User's browser | Remote server |
| Encoding | Server-side FFmpeg | WebCodecs + FFmpeg.wasm | Server-side FFmpeg |
| Audio muxing | Automatic | Automatic | Automatic |
| Dynamic data | `--data` flag | JavaScript state | Request payload |
| Progress feedback | Terminal output | `onProgress` callback | Webhook / polling |
| Browser required | Playwright (headless) | User's browser | None (server-side) |
| Codec control | Full FFmpeg options | Browser-supported codecs | Full FFmpeg options |
| Concurrent renders | Limited by local CPU | One per tab | Scales with infrastructure |

## Architecture Differences

All three paths share the same composition format. The divergence is in how frames are captured and encoded.

**CLI and cloud** both use Playwright to load the composition in a headless browser. Playwright captures each frame as a screenshot, and an FFmpeg process encodes the image sequence into the output container. Audio is decoded and muxed separately.

**Browser render** creates an off-DOM clone of the composition, seeks it frame-by-frame, and rasterizes each frame to a canvas. The canvas frames are fed to a `VideoEncoder` instance (WebCodecs API), and the encoded chunks are muxed with FFmpeg.wasm into the final MP4.

## Performance Characteristics

**CLI render** speed depends on the local machine. Frame capture through Playwright adds per-frame overhead, but encoding benefits from native FFmpeg and hardware acceleration where available.

**Browser render** speed depends on the user's device and browser. WebCodecs can leverage hardware encoding (GPU-accelerated H.264/H.265 on supported hardware), but the JavaScript overhead of canvas rasterization is the typical bottleneck.

**Cloud render** offloads all computation to the server. Latency comes from uploading the bundle and waiting for the job to complete, but the render itself benefits from dedicated infrastructure.

## See Also

- [render-api.md](references/render-api.md) — full `renderToVideo()` options reference
- [render-to-video.md](references/render-to-video.md) — step-by-step browser export tutorial
- [server-rendering.md](references/server-rendering.md) — SSR-safe imports for server environments
