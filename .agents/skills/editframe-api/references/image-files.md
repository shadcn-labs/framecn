---
description: Upload and manage static image files through the Editframe unified files API for use in compositions and renders.
---


# Image Files


## Functions

- **createFile(client, { type: 'image', ... })** - Register an image file
  - Returns: CreateFileResult
- **uploadFile(client, uploadDetails, fileStream)** - Upload image data with progress
  - Returns: IteratorWithPromise<UploadChunkEvent>
- **getFileDetail(client, id)** - Get image dimensions and metadata
  - Returns: FileDetail
- **lookupFileByMd5(client, md5)** - Find existing image by hash
  - Returns: LookupFileByMd5Result | null


Upload and manage static images for use in compositions.

Images use the unified files API with `type: "image"`. They are ready immediately after upload (no processing step).

## Upload an Image

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
  if (event.type === "progress") {
    console.log(`Upload: ${event.progress.toFixed(1)}%`);
  }
}
```

Supported formats: JPEG, PNG, WebP, SVG. Maximum size: 16MB.

## Get Image Metadata

```typescript
import { getFileDetail } from "@editframe/api";

const detail = await getFileDetail(client, imageFile.id);

console.log(detail.width);      // 1920
console.log(detail.height);     // 1080
console.log(detail.mime_type);  // "image/jpeg"
console.log(detail.status);    // "ready"
```

## Deduplication

```typescript
import { lookupFileByMd5 } from "@editframe/api";

const existing = await lookupFileByMd5(client, "image-md5-hash");

if (existing && existing.status === "ready") {
  console.log("Image already uploaded");
} else {
  // Upload new image
}
```

## Using in Compositions

Reference images by their `file-id`:

```html
<ef-configuration api-host="https://editframe.com">
  <ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-image
      file-id="${imageFile.id}"
      class="size-full object-cover">
    </ef-image>
  </ef-timegroup>
</ef-configuration>
```

See [files.md](references/files.md) for the complete files API reference.
