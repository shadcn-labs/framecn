---
description: Upload and manage WebVTT or SRT subtitle files through the Editframe files API for synchronized caption playback.
---


# Caption Files


## Functions

- **createFile(client, { type: 'caption', ... })** - Register a caption file
  - Returns: CreateFileResult
- **uploadFile(client, uploadDetails, fileStream)** - Upload caption data
  - Returns: IteratorWithPromise<UploadChunkEvent>
- **lookupFileByMd5(client, md5)** - Find existing captions by hash
  - Returns: LookupFileByMd5Result | null


Upload and manage subtitle files in WebVTT or SRT format.

Captions use the unified files API with `type: "caption"`. They are ready immediately after upload (no processing step).

## Upload Captions

```typescript
import { createFile, uploadFile } from "@editframe/api";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const captionStats = await stat("subtitles.vtt");

const captionFile = await createFile(client, {
  filename: "subtitles.vtt",
  type: "caption",
  byte_size: captionStats.size,
});

const captionStream = createReadStream("subtitles.vtt");

for await (const event of uploadFile(
  client,
  { id: captionFile.id, byte_size: captionStats.size, type: "caption" },
  captionStream
)) {
  if (event.type === "progress") {
    console.log(`Upload: ${event.progress.toFixed(1)}%`);
  }
}
```

Supported formats: WebVTT (`.vtt`), SRT (`.srt`). Maximum size: 2MB.

## Deduplication

```typescript
import { lookupFileByMd5 } from "@editframe/api";

const existing = await lookupFileByMd5(client, "caption-md5-hash");

if (existing && existing.status === "ready") {
  console.log("Captions already uploaded");
} else {
  // Upload new captions
}
```

## Using in Compositions

Use `<ef-captions>` with `target` to display captions from a video's transcription, or provide a standalone caption file:

```html
<ef-configuration api-host="https://editframe.com">
  <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-video file-id="${videoFile.id}"></ef-video>
    <ef-captions
      target="ef-video"
      class="absolute bottom-10 left-10 right-10 text-white text-4xl text-center">
    </ef-captions>
  </ef-timegroup>
</ef-configuration>
```

See [files.md](references/files.md) for the complete files API reference.
