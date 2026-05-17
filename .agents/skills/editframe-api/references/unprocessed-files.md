---
description: Upload raw video files through the Editframe files API with automatic ISOBMFF processing for streaming-optimized playback.
---


# Video Files


## Functions

- **createFile(client, { type: 'video', ... })** - Register a video file
  - Returns: CreateFileResult
- **uploadFile(client, uploadDetails, fileStream)** - Upload video data with chunked transfer and progress
  - Returns: IteratorWithPromise<UploadChunkEvent>
- **getFileProcessingProgress(client, id)** - Stream ISOBMFF processing progress via SSE
  - Returns: ProgressIterator
- **getFileDetail(client, id)** - Get video metadata and track information
  - Returns: FileDetail


Upload video files with automatic processing to streamable ISOBMFF format.

Video files use the unified files API with `type: "video"`. After upload, they are automatically processed to ISOBMFF format.

## Upload and Process

```typescript
import { createFile, uploadFile, getFileProcessingProgress } from "@editframe/api";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const fileStats = await stat("video.mp4");

// 1. Create file record
const file = await createFile(client, {
  filename: "video.mp4",
  type: "video",
  byte_size: fileStats.size,
  md5: "optional-md5-hash",
});

// 2. Upload content
const fileStream = createReadStream("video.mp4");

for await (const event of uploadFile(
  client,
  { id: file.id, byte_size: fileStats.size, type: "video" },
  fileStream
)) {
  if (event.type === "progress") {
    console.log(`Upload: ${event.progress.toFixed(1)}%`);
  }
}

// 3. Wait for processing (automatic after upload)
for await (const event of await getFileProcessingProgress(client, file.id)) {
  if (event.type === "progress") {
    console.log(`Processing: ${event.progress.toFixed(1)}%`);
  } else if (event.type === "complete") {
    console.log("Ready");
    break;
  }
}
```

Processing converts the raw file to ISOBMFF format, enabling:
- Frame-accurate seeking
- Adaptive bitrate streaming
- Efficient composition rendering

Maximum file size: 1GB.

## Get Video Details

After processing, retrieve track information:

```typescript
import { getFileDetail } from "@editframe/api";

const detail = await getFileDetail(client, file.id);

console.log(detail.status);  // "ready"
console.log(detail.width);   // 1920
console.log(detail.height);  // 1080

if (detail.tracks) {
  for (const track of detail.tracks) {
    console.log(`Track ${track.track_id}: ${track.type} ${track.codec_name} (${track.duration_ms}ms)`);
  }
}
```

## Using in Compositions

Reference videos by their `file-id`:

```html
<ef-configuration api-host="https://editframe.com">
  <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-video
      file-id="${file.id}"
      class="size-full object-contain">
    </ef-video>
  </ef-timegroup>
</ef-configuration>
```

The `file-id` is a stable UUID that remains the same from creation through processing and playback.

See [files.md](references/files.md) for the complete files API reference and [media-pipeline.md](references/media-pipeline.md) for the end-to-end workflow.
