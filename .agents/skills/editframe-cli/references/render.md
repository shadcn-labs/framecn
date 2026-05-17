---
description: Render Editframe HTML compositions to MP4 files locally using headless Chrome and ffmpeg via the Editframe CLI.
---


# Render

Render a video composition to MP4 locally.

## Usage

```bash
npx editframe render [directory] [options]
npx editframe render --url <url> [options]
```

## Arguments

- `directory` — Project directory containing `index.html` (default: `.`)

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `-o, --output <path>` | `output.mp4` | Output file path |
| `--url <url>` | — | Render from URL (bypasses directory/server startup) |
| `-d, --data <json>` | — | Custom render data as JSON string |
| `--data-file <path>` | — | Custom render data from JSON file |
| `--fps <number>` | `30` | Frame rate |
| `--scale <number>` | `1` | Resolution scale (0–1) |
| `--include-audio` | `true` | Include audio track |
| `--no-include-audio` | — | Exclude audio track |
| `--from-ms <number>` | — | Start time in milliseconds |
| `--to-ms <number>` | — | End time in milliseconds |
| `--experimental-native-render` | — | Use canvas capture API (faster) |
| `--profile` | — | Enable CPU profiling |
| `--profile-output <path>` | `./render-profile.cpuprofile` | Profile output path |

## Examples

```bash
# Render current directory
npx editframe render -o output.mp4

# Render from dev server URL
npx editframe render --url http://localhost:4321 -o output.mp4

# Render with custom data
npx editframe render --data '{"userName":"John","theme":"dark"}' -o video.mp4

# Render specific time range at half resolution
npx editframe render --from-ms 1000 --to-ms 5000 --scale 0.5

# Render without audio
npx editframe render --no-include-audio -o video-only.mp4
```

## Custom Render Data

Pass dynamic data to compositions with `--data` or `--data-file`:

```bash
npx editframe render --data '{"userName":"John"}' -o personalized.mp4
npx editframe render --data-file data.json -o personalized.mp4
```

Read the data in your composition with `getRenderData()`:

```typescript
import { getRenderData } from "@editframe/elements";

const data = getRenderData<{ userName: string }>();
if (data) {
  document.querySelector("#name").textContent = data.userName;
}
```

## URL vs Directory Mode

**Directory mode** (default): The CLI starts a Vite dev server, renders the page, and shuts down.

**URL mode** (`--url`): The CLI renders from an already-running server. Useful when your dev server is already running or when rendering from a remote URL.
