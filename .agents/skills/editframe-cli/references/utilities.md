---
description: "CLI utilities for authentication, dependency checks, webhook testing, and video file inspection during development."
---


# Utility Commands

## auth

Display current API token information.

```bash
npx editframe auth
```

Shows the API key name and organization. Requires a token via `--token` or `EF_TOKEN`.

## check

Verify that required dependencies are installed.

```bash
npx editframe check
```

Checks for:

- **ffmpeg** — Required for processing video, audio, captions, and waveform elements
- **whisper_timestamped** — Required for caption generation

Provides platform-specific installation instructions if a dependency is missing.

## webhook

Test a webhook URL with a simulated event.

```bash
npx editframe webhook [options]
```

### Options

- `-u, --webhookURL <url>` — Webhook URL to test
- `-t, --topic <topic>` — Event topic

### Topics

`render.created`, `render.pending`, `render.rendering`, `render.completed`, `render.failed`

If options are omitted, the command prompts interactively.

## mux

Inspect audio and video tracks in a media file.

```bash
npx editframe mux <path>
```

Probes the file and displays track information.
