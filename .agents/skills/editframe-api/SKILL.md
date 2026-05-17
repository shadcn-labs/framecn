---
name: editframe-api
description: "JavaScript/TypeScript SDK for Editframe's video rendering API. Create renders, upload video and image files, manage assets, and sign URLs for playback."
license: MIT
metadata:
  author: editframe
  version: "2.0"
---


# Editframe API

JavaScript/TypeScript client for Editframe's video rendering API. Render videos from HTML compositions, upload and process media files, and manage authenticated access to CDN resources.

## Quick Start

```typescript
import { Client, createRender, getRenderProgress, downloadRender } from "@editframe/api";

// Initialize client with API key
const client = new Client(process.env.EDITFRAME_API_KEY);

// Create a render from HTML composition
const render = await createRender(client, {
  html: `<ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4"></ef-video>
  </ef-timegroup>`,
  width: 1920,
  height: 1080,
  fps: 30,
});

// Poll for completion
for await (const event of await getRenderProgress(client, render.id)) {
  console.log(`Progress: ${event.progress}%`);
}

// Download the result
const response = await downloadRender(client, render.id);
const buffer = await response.arrayBuffer();
```

## Function Index

### Renders
- `createRender(client, payload)` → `CreateRenderResult` — Create a render job from HTML composition
- `uploadRender(client, renderId, fileStream)` → `Promise<void>` — Upload pre-rendered video file
- `getRenderProgress(client, id)` → `CompletionIterator` — Stream render progress via SSE
- `getRenderInfo(client, id)` → `LookupRenderByMd5Result` — Get render metadata
- `lookupRenderByMd5(client, md5)` → `LookupRenderByMd5Result | null` — Find existing render by hash
- `downloadRender(client, id)` → `Response` — Download completed render

### Files (Unified API)
- `createFile(client, payload)` → `CreateFileResult` — Register a file (video, image, or caption)
- `uploadFile(client, uploadDetails, fileStream)` → `IteratorWithPromise<UploadChunkEvent>` — Upload file content with progress
- `getFileDetail(client, id)` → `FileDetail` — Get file metadata and tracks
- `lookupFileByMd5(client, md5)` → `LookupFileByMd5Result | null` — Find existing file by hash
- `deleteFile(client, id)` → `{ success: boolean }` — Delete a file
- `getFileProcessingProgress(client, id)` → `ProgressIterator` — Stream processing progress for video files
- `transcribeFile(client, id, options?)` → `TranscribeFileResult` — Start audio transcription
- `getFileTranscription(client, id)` → `FileTranscriptionResult | null` — Get transcription status

### Node.js Helpers
- `upload(client, filePath)` → `{ file, uploadIterator }` — Upload a file from disk (auto-detects type)

### URL Signing
- `createURLToken(client, url)` → `string` — Generate signed JWT for browser access to media endpoints

## Unified Files API

All file types (video, image, caption) use a single set of endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/v1/files | POST | Create file record |
| /api/v1/files/:id | GET | Get file detail |
| /api/v1/files/:id/upload | GET/POST | Check upload status or upload chunk |
| /api/v1/files/:id/delete | POST | Delete file |
| /api/v1/files/:id/index | GET | Get fragment index (video only) |
| /api/v1/files/:id/tracks/:trackId | GET | Get track data (video only) |
| /api/v1/files/:id/transcribe | POST | Start transcription (video only) |
| /api/v1/files/:id/transcription | GET | Get transcription status |
| /api/v1/files/:id/progress | GET | Stream processing progress (SSE) |
| /api/v1/files/md5/:md5 | GET | Lookup file by MD5 hash |

The file `type` field determines processing behavior:
- `"video"` — uploaded files are automatically processed to ISOBMFF format
- `"image"` — uploaded files are immediately ready
- `"caption"` — uploaded files are immediately ready

## Using Files in Compositions

Reference uploaded files using the `file-id` attribute:

```html
<ef-configuration api-host="https://editframe.com">
  <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-video file-id="uuid-of-processed-video"></ef-video>
    <ef-image file-id="uuid-of-uploaded-image" class="w-24 h-24"></ef-image>
  </ef-timegroup>
</ef-configuration>
```

The `file-id` is a stable UUID assigned at file creation time and remains the same throughout upload, processing, and playback.

## URL Signing

If your application renders Editframe compositions in a browser, you need URL signing. The browser needs authenticated access to transcode endpoints, but cannot hold your API key.

URL signing creates short-lived, scoped tokens that authorize the browser to access specific media URLs. Set up a server route that calls `createURLToken`, then configure `<ef-configuration signingURL="/your-route">` in your frontend.

See [references/url-signing.md](references/url-signing.md) for implementation details and integration with elements-composition and react-composition.
