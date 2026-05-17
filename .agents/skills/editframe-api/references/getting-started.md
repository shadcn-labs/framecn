---
description: "Install the Editframe API package, obtain an API key, and submit your first HTML composition as a cloud render job."
---


# Getting Started

Render a video from an HTML composition in under 5 minutes.

## Install the Package

```bash
npm install @editframe/api
```

## Get Your API Key

1. Sign in to [editframe.com](https://editframe.com)
2. Navigate to Settings → API Keys
3. Create a new API key
4. Copy the key and store it securely

Keep your API key secure. Never commit it to version control or expose it in client-side code.

## Create Your First Render

```typescript
import { Client, createRender, getRenderProgress, downloadRender } from "@editframe/api";
import { writeFileSync } from "node:fs";

const client = new Client(process.env.EDITFRAME_API_KEY);

// Create a render job
const render = await createRender(client, {
  html: `
    <ef-timegroup mode="contain" class="w-[1920px] h-[1080px] bg-black">
      <ef-video 
        src="https://assets.editframe.com/bars-n-tone.mp4"
        class="size-full object-contain">
      </ef-video>
      <ef-text 
        class="absolute bottom-10 left-10 text-white text-6xl font-bold">
        Hello, Editframe!
      </ef-text>
    </ef-timegroup>
  `,
  width: 1920,
  height: 1080,
  fps: 30,
});

console.log(`Render created: ${render.id}`);

// Poll for completion
for await (const event of await getRenderProgress(client, render.id)) {
  if (event.type === "progress") {
    console.log(`Progress: ${event.progress.toFixed(1)}%`);
  } else if (event.type === "complete") {
    console.log("Render complete!");
  }
}

// Download the result
const response = await downloadRender(client, render.id);
const buffer = await response.arrayBuffer();
writeFileSync("output.mp4", Buffer.from(buffer));

console.log("Video saved to output.mp4");
```

Run this script with Node.js:

```bash
node render.js
```

You'll see progress updates as the render processes, then the final MP4 will be saved to `output.mp4`.

## What Just Happened?

1. **Client instantiation**: `new Client(apiKey)` creates an authenticated client
2. **Render creation**: `createRender()` sends your HTML composition to Editframe's rendering service
3. **Progress monitoring**: `getRenderProgress()` returns an async iterator that streams server-sent events (SSE)
4. **Download**: `downloadRender()` fetches the completed video file

The HTML composition uses Editframe's custom elements (`<ef-timegroup>`, `<ef-video>`, `<ef-text>`) to define the video timeline. See the elements-composition skill for complete documentation on composition syntax.

## Output Formats

By default, renders output MP4 with H.264 video and AAC audio. You can also render still images:

```typescript
const render = await createRender(client, {
  html: compositionHtml,
  width: 1920,
  height: 1080,
  output: {
    container: "jpeg",
    quality: 90,
  },
});
```

Supported formats: `mp4`, `jpeg`, `png`, `webp`. See [references/renders.md](references/renders.md) for complete output configuration options.

## Next Steps

- [Authentication](references/authentication.md) — understand API key format and Client behavior
- [Renders](references/renders.md) — explore render configuration options
- [URL Signing](references/url-signing.md) — set up browser-based playback
- [Media Pipeline](references/media-pipeline.md) — upload and process your own media files
- [Files](references/files.md) — unified files API reference
