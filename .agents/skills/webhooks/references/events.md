---
description: "Complete reference for all Editframe webhook event types, payload schemas, and the conditions that trigger each event."
---


# Webhook Events

Complete reference of all webhook event types and their payload structures.

## Event Structure

All webhook events follow this structure:

```typescript
interface WebhookEvent<T> {
  topic: string;        // Event type (e.g., "render.completed")
  data: T;              // Event-specific payload
}
```

The webhook is delivered as an HTTP POST request with:
- **Headers**: `Content-Type: application/json`, `X-Webhook-Signature: <hmac>`
- **Body**: JSON-encoded webhook event

## Render Events

### render.created

Triggered when a render job is created.

```typescript
interface RenderCreatedPayload {
  id: string;              // Render UUID
  status: "created";       // Always "created" for this event
  created_at: string;      // ISO 8601 timestamp
  completed_at: null;      // Not completed yet
  failed_at: null;         // Not failed yet
  width: number;           // Video width in pixels
  height: number;          // Video height in pixels
  fps: number;             // Frames per second
  byte_size: null;         // Not available until completed
  duration_ms: null;       // Not available until completed
  md5: null;               // Not available until completed
  metadata: object | null; // Custom metadata from request
  download_url: null;      // Not available until completed
}
```

**Example:**
```json
{
  "topic": "render.created",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "created",
    "created_at": "2024-10-30T10:00:00Z",
    "completed_at": null,
    "failed_at": null,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "byte_size": null,
    "duration_ms": null,
    "md5": null,
    "metadata": { "project_id": "abc123" },
    "download_url": null
  }
}
```

### render.pending

Triggered when a render is queued for processing.

Payload structure is identical to `render.created`, with `status: "pending"`.

### render.rendering

Triggered when a render begins active processing.

Payload structure is identical to `render.created`, with `status: "rendering"`.

### render.completed

Triggered when a render successfully finishes.

```typescript
interface RenderCompletedPayload {
  id: string;              // Render UUID
  status: "complete";      // Always "complete" for this event
  created_at: string;      // ISO 8601 timestamp
  completed_at: string;    // ISO 8601 timestamp of completion
  failed_at: null;         // Not failed
  width: number;           // Video width in pixels
  height: number;          // Video height in pixels
  fps: number;             // Frames per second
  byte_size: number;       // File size in bytes
  duration_ms: number;     // Video duration in milliseconds
  md5: string;             // MD5 hash of video file
  metadata: object | null; // Custom metadata from request
  download_url: string;    // Signed URL to download video
}
```

**Example:**
```json
{
  "topic": "render.completed",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "complete",
    "created_at": "2024-10-30T10:00:00Z",
    "completed_at": "2024-10-30T10:01:23Z",
    "failed_at": null,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "byte_size": 15728640,
    "duration_ms": 5000,
    "md5": "098f6bcd4621d373cade4e832627b4f6",
    "metadata": { "project_id": "abc123" },
    "download_url": "https://editframe.com/api/v1/renders/550e8400-e29b-41d4-a716-446655440000/mp4"
  }
}
```

**Usage:**
```typescript
if (event.topic === "render.completed") {
  const { id, download_url, duration_ms, byte_size } = event.data;

  console.log(`Render ${id} completed:`);
  console.log(`- Duration: ${duration_ms / 1000}s`);
  console.log(`- Size: ${(byte_size / 1024 / 1024).toFixed(2)} MB`);

  // Download the video
  const response = await fetch(download_url);
  const videoBuffer = await response.arrayBuffer();

  // Save or upload to your storage
  await saveVideo(id, videoBuffer);
}
```

### render.failed

Triggered when a render encounters an error.

```typescript
interface RenderFailedPayload {
  id: string;              // Render UUID
  status: "failed";        // Always "failed" for this event
  created_at: string;      // ISO 8601 timestamp
  completed_at: null;      // Not completed
  failed_at: string;       // ISO 8601 timestamp of failure
  width: number;           // Video width in pixels
  height: number;          // Video height in pixels
  fps: number;             // Frames per second
  byte_size: null;         // Not available
  duration_ms: null;       // Not available
  md5: null;               // Not available
  metadata: object | null; // Custom metadata from request
  download_url: null;      // Not available
}
```

**Example:**
```json
{
  "topic": "render.failed",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "failed",
    "created_at": "2024-10-30T10:00:00Z",
    "completed_at": null,
    "failed_at": "2024-10-30T10:00:45Z",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "byte_size": null,
    "duration_ms": null,
    "md5": null,
    "metadata": { "project_id": "abc123" },
    "download_url": null
  }
}
```

## File Events

### file.created

Triggered when a file record is created (before upload).

```typescript
interface FileCreatedPayload {
  id: string;              // File UUID
  type: "video" | "image" | "caption"; // File type
  status: "created";       // Always "created" for this event
  filename: string;        // Original filename
  byte_size: null;         // Not uploaded yet
  md5: null;               // Not uploaded yet
  mime_type: null;         // Not available yet
  width: null;             // Not available yet (images only)
  height: null;            // Not available yet (images only)
}
```

**Example:**
```json
{
  "topic": "file.created",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "type": "video",
    "status": "created",
    "filename": "my-video.mp4",
    "byte_size": null,
    "md5": null,
    "mime_type": null,
    "width": null,
    "height": null
  }
}
```

### file.uploading

Triggered when file upload is in progress.

Payload structure similar to `file.created`, with `status: "uploading"`.

### file.processing

Triggered when a video file is being processed to ISOBMFF format.

Only sent for `type: "video"` files.

```typescript
interface FileProcessingPayload {
  id: string;              // File UUID
  type: "video";           // Always "video" for processing
  status: "processing";    // Always "processing" for this event
  filename: string;        // Original filename
  byte_size: number;       // Uploaded file size
  md5: string;             // MD5 hash of uploaded file
  mime_type: string;       // MIME type (e.g., "video/mp4")
  width: number | null;    // Video width in pixels
  height: number | null;   // Video height in pixels
}
```

### file.ready

Triggered when a file is ready for use in compositions.

```typescript
interface FileReadyPayload {
  id: string;              // File UUID
  type: "video" | "image" | "caption"; // File type
  status: "ready";         // Always "ready" for this event
  filename: string;        // Original filename
  byte_size: number;       // File size in bytes
  md5: string;             // MD5 hash of file
  mime_type: string;       // MIME type
  width: number | null;    // Width in pixels (images/video only)
  height: number | null;   // Height in pixels (images/video only)
}
```

**Example:**
```json
{
  "topic": "file.ready",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "type": "video",
    "status": "ready",
    "filename": "my-video.mp4",
    "byte_size": 52428800,
    "md5": "5d41402abc4b2a76b9719d911017c592",
    "mime_type": "video/mp4",
    "width": 1920,
    "height": 1080
  }
}
```

**Usage:**
```typescript
if (event.topic === "file.ready") {
  const { id, type, filename } = event.data;

  console.log(`File ${filename} (${type}) is ready`);
  console.log(`Use in composition: <ef-${type} file-id="${id}"></${type}>`);

  // Update database record
  await db.updateFile(id, { status: "ready", processedAt: new Date() });
}
```

### file.failed

Triggered when file upload or processing fails.

Payload structure similar to other file events, with `status: "failed"`.

## Legacy Events

### unprocessed_file.created

**Deprecated**: Use `file.created` instead.

Triggered when an unprocessed file is created.

```typescript
interface UnprocessedFileCreatedPayload {
  id: string;              // File UUID
  byte_size: number;       // File size in bytes
  next_byte: number;       // Upload progress
  md5: string | null;      // MD5 hash if completed
  filename: string;        // Original filename
  completed_at: string | null; // Completion timestamp
}
```

## Webhook Test Event

### webhook.test

Sent when you trigger a test webhook from the dashboard.

```json
{
  "topic": "webhook.test",
  "data": {
    "id": "your-api-key-id",
    "org_id": "your-org-id"
  }
}
```

Use this to verify your webhook endpoint is correctly configured.

## Event Ordering

Events are sent in chronological order, but network issues or retries may cause events to arrive out of order. Use timestamps (`created_at`, `completed_at`, etc.) to determine actual event sequence.

Example render lifecycle:
1. `render.created` (status: "created")
2. `render.pending` (status: "pending")
3. `render.rendering` (status: "rendering")
4. `render.completed` (status: "complete") OR `render.failed` (status: "failed")

## Subscribing to Events

Configure which events you receive when creating or updating an API key:

```typescript
const apiKey = await createApiKey({
  name: "Production",
  webhookUrl: "https://api.yourapp.com/webhooks",
  webhookEvents: [
    "render.completed",
    "render.failed",
    "file.ready",
    "file.failed"
  ]
});
```

**Recommendation**: Subscribe only to events you need to reduce unnecessary webhook traffic.

## Next Steps

- [security.md](references/security.md) — Verify webhook signatures
- [testing.md](references/testing.md) — Test webhook payloads locally
- [troubleshooting.md](references/troubleshooting.md) — Debug webhook issues
