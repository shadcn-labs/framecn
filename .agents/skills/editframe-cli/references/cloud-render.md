---
description: Submit Editframe compositions to the cloud render pipeline and download completed videos without local ffmpeg.
---


# Cloud Rendering

Render compositions in Editframe's cloud infrastructure. Requires an API token.

## cloud-render

```bash
npx editframe cloud-render [directory] [options]
```

Builds the project, syncs assets, and submits a render job to the cloud.

### Options

- `-s, --strategy <strategy>` — Render strategy (default: `v1`)

### Workflow

1. Builds the project with Vite
2. Syncs assets to Editframe servers
3. Extracts render info from the composition
4. Creates a cloud render job
5. Uploads built assets

## sync

```bash
npx editframe sync [directory]
```

Syncs assets from `src/assets/.cache` to Editframe servers. Required before cloud rendering.

## process

```bash
npx editframe process [directory]
```

Builds the project and processes assets for cloud rendering. Analyzes media files and prepares them for the render pipeline.

## process-file

```bash
npx editframe process-file <file>
```

Uploads a single audio/video file to Editframe for processing. Shows upload progress and waits for processing to complete.

## Authentication

All cloud commands require an API token. Set it via:

```bash
npx editframe --token <your-token> cloud-render
```

Or set the `EF_TOKEN` environment variable:

```bash
export EF_TOKEN=your-token
npx editframe cloud-render
```

Verify your token:

```bash
npx editframe auth
```
