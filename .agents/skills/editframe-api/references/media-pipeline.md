---
description: "End-to-end workflow for uploading a media file, waiting for processing, and using the processed file in a composition."
---


# Media Pipeline

Upload a media file and use it in a composition.

## Overview

The unified files API handles all media types with a single set of endpoints:

1. **Create** a file record (specifying type: video, image, or caption)
2. **Upload** the file content via chunked transfer
3. **Wait for processing** (video files are auto-processed to ISOBMFF)
4. **Use in composition** via `file-id` attribute

## Step 1: Upload a Video File

```typescript
import { Client, createFile, uploadFile, getFileProcessingProgress } from "@editframe/api";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const client = new Client(process.env.EDITFRAME_API_KEY);

const filePath = "video.mp4";
const fileStats = await stat(filePath);

// Create file record
const file = await createFile(client, {
  filename: "video.mp4",
  type: "video",
  byte_size: fileStats.size,
  mime_type: "video/mp4",
});

// Upload file content
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

console.log("Upload complete");
```

## Step 2: Wait for Processing

Video files are automatically processed to ISOBMFF format after upload. Monitor progress:

```typescript
for await (const event of await getFileProcessingProgress(client, file.id)) {
  if (event.type === "progress") {
    console.log(`Processing: ${event.progress.toFixed(1)}%`);
  } else if (event.type === "complete") {
    console.log("Processing complete");
    break;
  }
}
```

Processing enables frame-accurate seeking, adaptive bitrate streaming, and efficient composition rendering.

Image and caption files skip processing and are immediately ready after upload.

## Step 3: Use in Composition

Reference the file by its `file-id`:

```typescript
import { createRender, getRenderProgress, downloadRender } from "@editframe/api";
import { writeFileSync } from "node:fs";

const html = `
  <ef-configuration api-host="https://editframe.com">
    <ef-timegroup mode="contain" class="w-[1920px] h-[1080px] bg-black">
      <ef-video
        file-id="${file.id}"
        class="size-full object-contain">
      </ef-video>
      <ef-text
        class="absolute bottom-10 left-10 text-white text-6xl font-bold">
        My Video
      </ef-text>
    </ef-timegroup>
  </ef-configuration>
`;

const render = await createRender(client, {
  html,
  width: 1920,
  height: 1080,
  fps: 30,
});

for await (const event of await getRenderProgress(client, render.id)) {
  if (event.type === "progress") {
    console.log(`Render: ${event.progress.toFixed(1)}%`);
  } else if (event.type === "complete") {
    break;
  }
}

const response = await downloadRender(client, render.id);
const buffer = await response.arrayBuffer();
writeFileSync("output.mp4", Buffer.from(buffer));
```

The `file-id` is a stable UUID assigned when the file record is created. It remains the same throughout upload, processing, and playback.

## Deduplication

Check if a file already exists before uploading:

```typescript
import { lookupFileByMd5 } from "@editframe/api";

const existing = await lookupFileByMd5(client, "your-file-md5-hash");

if (existing && existing.status === "ready") {
  console.log("File already uploaded and processed");
  // Use existing.id directly
} else {
  // Create and upload new file
}
```

## Image Pipeline

Images use the same API with `type: "image"`:

```typescript
import { createFile, uploadFile } from "@editframe/api";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const imageStats = await stat("thumbnail.jpg");

const imageFile = await createFile(client, {
  filename: "thumbnail.jpg",
  type: "image",
  byte_size: imageStats.size,
  mime_type: "image/jpeg",
});

const imageStream = createReadStream("thumbnail.jpg");
for await (const event of uploadFile(
  client,
  { id: imageFile.id, byte_size: imageStats.size, type: "image" },
  imageStream
)) {
  // Images are ready immediately after upload
}

// Use in composition
const html = `
  <ef-configuration api-host="https://editframe.com">
    <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
      <ef-image
        file-id="${imageFile.id}"
        class="size-full object-cover">
      </ef-image>
    </ef-timegroup>
  </ef-configuration>
`;
```

## Node.js Helper

For Node.js environments, use the `@editframe/api/node` subpackage for a simplified upload:

```typescript
import { upload } from "@editframe/api/node";

const { file, uploadIterator } = await upload(client, "video.mp4");

for await (const event of uploadIterator) {
  if (event.type === "progress") {
    console.log(`Upload: ${event.progress.toFixed(1)}%`);
  }
}

console.log(`File ${file.id} uploaded (type: ${file.type})`);
```

This handles file type detection, MD5 calculation, and chunked upload automatically.

## Error Handling

```typescript
try {
  const file = await createFile(client, payload);
} catch (error) {
  if (error.message.includes("413")) {
    console.error("File too large");
  } else if (error.message.includes("401")) {
    console.error("Invalid API key");
  } else {
    console.error("Upload failed:", error);
  }
}
```

Size limits by type: video 1GB, image 16MB, caption 2MB.

## Next Steps

- [Files](references/files.md) — unified file API reference
- [Transcription](references/transcription.md) — add captions to uploaded videos
- Elements Composition skill — composition syntax and element reference
