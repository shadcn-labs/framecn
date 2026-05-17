---
description: On-demand video transcoding during local development for instant browser-compatible playback of any input video format.
---


# JIT Transcoding




The Vite plugin transcodes video files on-demand during development. When a composition references a local video, the plugin splits it into streamable ISOBMFF segments and serves them through a local transcode API that mirrors the production endpoint structure.

## How It Works

When a video is first requested, the plugin:

1. Generates a **fragment index** describing every track (video, audio, scrub) with byte offsets and durations
2. Creates separated track files cached in the `cacheRoot` directory
3. Serves individual segments by streaming the correct byte ranges from cached track files

Subsequent requests for the same video skip transcoding entirely and serve directly from cache.

## Manifest Endpoint

The manifest describes available renditions and their segments:

```
GET /api/v1/transcode/manifest.json?url=http://localhost:5173/src/assets/clip.mp4
```

The response includes video renditions (`high`, `scrub`), audio renditions, per-segment duration arrays, codec strings, and endpoint templates for fetching init and media segments.

## Segment Serving

Init segments and media segments are served by extracting byte ranges from the cached track file:

```
GET /api/v1/transcode/high/init.mp4?url=...    # Initialization segment
GET /api/v1/transcode/high/1.m4s?url=...        # Fragment (moof+mdat only)
GET /api/v1/transcode/high/1.mp4?url=...        # Standalone playable (init+moof+mdat)
```

The `.m4s` extension returns raw fragments for streaming playback. The `.mp4` extension prepends the init segment so the file is independently playable, which is useful for testing.

## Renditions

The plugin creates three rendition types from each video:

- **high** -- Full resolution video track (track ID 1)
- **scrub** -- Low-resolution 320px-wide video for timeline scrubbing (track ID -1)
- **audio** -- Audio track extracted separately (track ID 2, or track ID 1 for audio-only files)

## Cache Management

Transcoded assets are stored under `{cacheRoot}/.cache/`. To clear the cache programmatically:

```
DELETE /@ef-clear-cache/
```

The cache clear uses retry logic with backoff to handle race conditions during concurrent test runs. ENOENT errors are treated as success (cache already cleared), and ENOTEMPTY errors trigger retries.

## Remote URL Support

The `url` parameter can reference either local or remote files. The plugin resolves the URL by checking the hostname:

- **Local URLs** (localhost, 127.0.0.1, *.localhost) are resolved to file paths relative to `root`
- **Remote URLs** are passed directly to ffprobe, which supports HTTP/HTTPS natively

## Debug Logging

Enable debug output for the transcode middleware:

```bash
DEBUG=ef:vite-plugin:jit npm run dev
```
