---
description: "Create render jobs from HTML compositions, poll for completion, and download finished videos or image outputs."
---


# Renders


## Functions

- **createRender(client, payload)** - Create a render job from HTML composition
  - Returns: CreateRenderResult
- **uploadRender(client, renderId, fileStream)** - Upload pre-rendered video file
  - Returns: Promise<void>
- **getRenderProgress(client, id)** - Stream render progress via SSE
  - Returns: CompletionIterator
- **getRenderInfo(client, id)** - Get render metadata
  - Returns: LookupRenderByMd5Result
- **lookupRenderByMd5(client, md5)** - Find existing render by hash
  - Returns: LookupRenderByMd5Result | null
- **downloadRender(client, id)** - Download completed render
  - Returns: Response


Create and manage video renders from HTML compositions.

## createRender

Create a render job from an HTML composition.

```typescript
import { Client, createRender } from "@editframe/api";

const client = new Client(process.env.EDITFRAME_API_KEY);

const render = await createRender(client, {
  html: `
    <ef-timegroup mode="contain" class="w-[1920px] h-[1080px] bg-black">
      <ef-video src="https://assets.editframe.com/bars-n-tone.mp4"></ef-video>
    </ef-timegroup>
  `,
  width: 1920,      // Output width in pixels
  height: 1080,     // Output height in pixels
  fps: 30,          // Frames per second (default: 30)
  output: {         // Output format (default: MP4)
    container: "mp4",
    video: { codec: "h264" },
    audio: { codec: "aac" },
  },
});

console.log(render.id);     // Render ID for progress tracking
console.log(render.status); // "created" | "pending" | "rendering" | "complete" | "failed"
```

The `html` field contains an Editframe composition using custom elements. See the elements-composition skill for complete syntax documentation.

**Output formats:**

MP4 video (default):
```typescript
output: {
  container: "mp4",
  video: { codec: "h264" },
  audio: { codec: "aac" },
}
```

JPEG image:
```typescript
output: {
  container: "jpeg",
  quality: 90,  // 1-100, default: 80
}
```

PNG image:
```typescript
output: {
  container: "png",
  compression: 80,      // 1-100, default: 80
  transparency: true,   // default: false
}
```

WebP image:
```typescript
output: {
  container: "webp",
  quality: 90,          // 1-100, default: 80
  compression: 4,       // 0-6, default: 4
  transparency: true,   // default: false
}
```

**Deduplication:**

If you provide an `md5` hash, Editframe checks for an existing render with the same hash. If found, it returns the existing render instead of creating a new one:

```typescript
import { md5 } from "@editframe/assets";

const hash = md5(compositionHtml);

const render = await createRender(client, {
  md5: hash,
  html: compositionHtml,
  width: 1920,
  height: 1080,
});
```

This saves rendering time and costs when the same composition is rendered multiple times.

## getRenderProgress

Stream render progress via server-sent events (SSE).

```typescript
import { getRenderProgress } from "@editframe/api";

for await (const event of await getRenderProgress(client, render.id)) {
  if (event.type === "progress") {
    console.log(`Progress: ${event.progress.toFixed(1)}%`);
  } else if (event.type === "complete") {
    console.log("Render complete!");
    break;
  }
}
```

The iterator yields two event types:
- `progress`: `{type: "progress", progress: number}` — progress percentage (0-100)
- `complete`: `{type: "complete"}` — render finished successfully

If the render fails, the iterator throws an error.

## downloadRender

Download the completed render file.

```typescript
import { downloadRender } from "@editframe/api";
import { writeFileSync } from "node:fs";

const response = await downloadRender(client, render.id);
const buffer = await response.arrayBuffer();
writeFileSync("output.mp4", Buffer.from(buffer));
```

The response is a standard `fetch` Response object. Use `.arrayBuffer()`, `.blob()`, or `.body` to access the file data.

For images, the file extension matches the output format:
```typescript
// For JPEG output
const response = await downloadRender(client, render.id);
// Equivalent to: fetch(`https://editframe.com/api/v1/renders/${render.id}.jpeg`)
```

## getRenderInfo

Get render metadata without downloading the file.

```typescript
import { getRenderInfo } from "@editframe/api";

const info = await getRenderInfo(client, render.id);

console.log(info.status);    // "complete" | "rendering" | "failed"
console.log(info.md5);       // MD5 hash of the output file
console.log(info.metadata);  // Custom metadata object
```

Use this to check render status before downloading.

## lookupRenderByMd5

Find an existing render by MD5 hash.

```typescript
import { lookupRenderByMd5 } from "@editframe/api";
import { md5 } from "@editframe/assets";

const hash = md5(compositionHtml);
const existing = await lookupRenderByMd5(client, hash);

if (existing) {
  console.log(`Found existing render: ${existing.id}`);
} else {
  console.log("No existing render found");
}
```

Returns `null` if no render with that hash exists. Otherwise returns the same shape as `getRenderInfo`.

## uploadRender

Upload a pre-rendered video file instead of rendering from HTML.

```typescript
import { createRender, uploadRender } from "@editframe/api";
import { createReadStream } from "node:fs";

// Create render record
const render = await createRender(client, {
  width: 1920,
  height: 1080,
  output: { container: "mp4", video: { codec: "h264" }, audio: { codec: "aac" } },
});

// Upload file
const fileStream = createReadStream("video.mp4");
await uploadRender(client, render.id, fileStream);
```

This is useful when you render videos with external tools and want to store them in Editframe's CDN.

The file must match the output format specified in `createRender`. For example, if you specified `container: "mp4"`, you must upload an MP4 file.
