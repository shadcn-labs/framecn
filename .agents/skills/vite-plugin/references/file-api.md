---
description: "Local development endpoints for file upload and ISOBMFF video processing, mirroring the Editframe cloud files API."
---


# Local File API




The plugin provides local equivalents of the production file and ISOBMFF file APIs. These endpoints handle fragment index generation, MD5 hashing, and track extraction for local media files so that the elements runtime can process local assets without a cloud backend.

## Endpoints

The `/api/v1/files/local/*` and `/api/v1/isobmff_files/local/*` routes are interchangeable -- both accept the same parameters and produce the same results.

### Fragment Index

Returns track metadata (codec, duration, timescale, segment byte offsets) for all tracks in a media file:

```
GET /api/v1/files/local/index?src=assets/clip.mp4
GET /api/v1/isobmff_files/local/index?src=assets/clip.mp4
```

The response is the cached fragment index JSON produced by `generateTrackFragmentIndex`. Each track entry includes:

- `type` -- `"video"` or `"audio"`
- `codec` -- e.g. `"avc1.640029"` or `"mp4a.40.2"`
- `duration` and `timescale` -- total duration in track timescale units
- `initSegment` -- byte offset and size of the initialization segment
- `segments` -- array of `{ offset, size, duration }` for each media segment

### MD5 Hash

Returns the MD5 hash of a local file, used for cache invalidation and asset identity:

```
GET /api/v1/files/local/md5?src=assets/clip.mp4
```

Response:

```json
{ "md5": "a1b2c3d4e5f6..." }
```

### Track Extraction

Extracts and serves a specific track from a media file:

```
GET /api/v1/files/local/track?src=assets/clip.mp4&trackId=1
GET /api/v1/files/local/track?src=assets/clip.mp4&trackId=1&segmentId=0
GET /api/v1/files/local/track?src=assets/clip.mp4&trackId=-1
```

Parameters:

- `src` (required) -- path to the source file, resolved relative to `root`
- `trackId` (required) -- track to extract. `1` for video, `2` for audio, `-1` for the low-resolution scrub track
- `segmentId` (optional) -- specific segment within the track

Track ID `-1` is a special case that calls `generateScrubTrack` instead of `generateTrack`, producing a 320px-wide low-bitrate version for timeline scrubbing.

## Legacy Endpoints

These routes predate the REST API and are still supported:

| Legacy Route | Equivalent |
|---|---|
| `HEAD /@ef-asset/{path}` | `/api/v1/files/local/md5?src={path}` |
| `/@ef-track-fragment-index/{path}` | `/api/v1/files/local/index?src={path}` |
| `/@ef-track/{path}?trackId=N` | `/api/v1/files/local/track?src={path}&trackId=N` |
| `/@ef-scrub-track/{path}` | `/api/v1/files/local/track?src={path}&trackId=-1` |

The `@ef-asset` HEAD request returns the MD5 in the `ETag` header and stores an in-memory MD5-to-filepath mapping for subsequent requests.

## Error Handling

- Missing `src` returns `400` with `{ error: "src parameter is required" }`
- Missing `trackId` on the track endpoint returns `400`
- File not found (`ENOENT`) returns `404`
- Other errors return `500` with the error message

## Debug Logging

```bash
DEBUG=ef:vite-plugin:isobmff npm run dev
```
