---
description: "Local development endpoints for asset management, image thumbnail caching, and automatic caption file generation."
---


# Local Assets API




The plugin serves local images and captions through endpoints that mirror the production asset API. This allows compositions to use the same asset-fetching logic in both development and production without conditional paths.

## Image Caching

The image endpoint caches a local image file and serves the cached copy with proper MIME types and ETags:

```
GET /api/v1/assets/local/image?src=assets/background.png
```

The `src` parameter is resolved relative to the plugin `root` directory. The plugin calls `cacheImage(cacheRoot, absolutePath)` which copies the file into the `.cache` directory and returns it with an MD5-based ETag for browser caching.

Remote URLs are also supported -- if `src` starts with `http`, it is passed through directly without path resolution.

## Caption Generation

The captions endpoint generates or retrieves cached transcription data for audio and video files:

```
GET /api/v1/assets/local/captions?src=assets/interview.mp4
```

This calls `findOrCreateCaptions(cacheRoot, absolutePath)` which either returns existing cached captions or generates new ones using the assets package transcription pipeline. The result is served as JSON with cache headers.

## Legacy Endpoints

The plugin also supports older `@ef-` prefixed routes that predate the REST API format:

| Legacy Route | Equivalent API Route |
|---|---|
| `/@ef-image/{path}` | `/api/v1/assets/local/image?src={path}` |
| `/@ef-captions/{path}` | `/api/v1/assets/local/captions?src={path}` |

Both formats resolve paths the same way and share the underlying `cacheImage` and `findOrCreateCaptions` functions.

## Path Resolution

All `src` parameters follow the same resolution logic:

1. If `src` starts with `http`, it is treated as a remote URL
2. Otherwise, `src` is joined with the plugin `root` option
3. Any `dist/` prefix in the resolved path is replaced with `src/` to support source-mapped development

```typescript
// Example: root = "./dev-projects/src"
// src = "assets/photo.jpg"
// Resolved: ./dev-projects/src/assets/photo.jpg
```

## Response Format

All asset responses are streamed from the cache with:

- **Content-Type** determined by file extension via the `mime` package
- **ETag** set to the MD5 hash of the cached file
- **Cache-Control** set to `max-age=3600`
- **Range request** support for partial content (HTTP 206)

## Error Handling

- Missing `src` parameter returns `400` with `{ error: "src parameter is required" }`
- File not found returns `404` with plain text body
- Other errors return `500` with `{ error: "..." }` JSON

## Debug Logging

```bash
DEBUG=ef:vite-plugin:assets npm run dev
```
