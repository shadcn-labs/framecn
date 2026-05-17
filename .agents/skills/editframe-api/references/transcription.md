---
description: "Generate spoken-word transcriptions from uploaded video files, returning word-level timestamps for caption generation."
---


# Transcription


## Functions

- **transcribeFile(client, id, options?)** - Start audio transcription for a video file
  - Returns: TranscribeFileResult
- **getFileTranscription(client, id)** - Get transcription status for a file
  - Returns: FileTranscriptionResult | null


Generate audio transcriptions from uploaded video files.

## transcribeFile

Start audio transcription for a video file.

```typescript
import { transcribeFile } from "@editframe/api";

const transcription = await transcribeFile(client, file.id, {
  trackId: 1, // Optional: specify audio track ID
});

console.log(transcription.id);       // Transcription job ID
console.log(transcription.file_id);  // File ID
console.log(transcription.track_id); // Audio track ID
```

If you don't specify `trackId`, Editframe uses the first audio track in the file.

## getFileTranscription

Get transcription status for a file.

```typescript
import { getFileTranscription } from "@editframe/api";

const transcription = await getFileTranscription(client, file.id);

if (transcription) {
  console.log(transcription.id);
  console.log(transcription.status);       // "completed"
  console.log(transcription.work_slice_ms);
  console.log(transcription.completed_at);
}
```

Returns `null` if the file has no transcription.

## Complete Workflow

```typescript
import {
  Client,
  createFile,
  uploadFile,
  getFileProcessingProgress,
  transcribeFile,
  getFileTranscription,
} from "@editframe/api";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const client = new Client(process.env.EDITFRAME_API_KEY);

// 1. Upload video file
const filePath = "video.mp4";
const fileStats = await stat(filePath);

const file = await createFile(client, {
  filename: "video.mp4",
  type: "video",
  byte_size: fileStats.size,
});

const fileStream = createReadStream(filePath);
for await (const event of uploadFile(
  client,
  { id: file.id, byte_size: fileStats.size, type: "video" },
  fileStream
)) {
  if (event.type === "progress") {
    console.log(`Upload: ${event.progress.toFixed(1)}%`);
  }
}

// 2. Wait for processing
for await (const event of await getFileProcessingProgress(client, file.id)) {
  if (event.type === "progress") {
    console.log(`Processing: ${event.progress.toFixed(1)}%`);
  } else if (event.type === "complete") {
    break;
  }
}

// 3. Start transcription
const transcription = await transcribeFile(client, file.id);
console.log("Transcription started:", transcription.id);

// 4. Check transcription status
const result = await getFileTranscription(client, file.id);
if (result) {
  console.log("Status:", result.status);
}
```

## Using Transcriptions in Compositions

Once transcribed, use `<ef-captions>` with `target` to display captions:

```html
<ef-configuration api-host="https://editframe.com">
  <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-video file-id="${file.id}"></ef-video>
    <ef-captions
      target="ef-video"
      class="absolute bottom-10 left-10 right-10 text-white text-4xl text-center">
    </ef-captions>
  </ef-timegroup>
</ef-configuration>
```

The `<ef-captions>` element with `target="ef-video"` automatically fetches transcription data from the video file. See the elements-composition skill for complete `<ef-captions>` documentation.
