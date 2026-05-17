---
description: "Generate word-level captions from audio or video files using Whisper, outputting JSON or WebVTT for use with ef-captions."
---


# Transcribe

Generate word-level captions from audio or video files using whisper_timestamped.

## Usage

```bash
npx editframe transcribe <input> [options]
```

## Arguments

- `input` — Input audio or video file path

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `-o, --output <file>` | `captions.json` | Output JSON file |
| `-l, --language <lang>` | `en` | Language code (en, es, fr, de, it, pt, nl, etc.) |

## Examples

```bash
# Basic transcription
npx editframe transcribe video.mp4

# Custom output and language
npx editframe transcribe interview.mp4 -o spanish.json -l es
```

## Requirements

Requires `whisper_timestamped`:

```bash
pip3 install whisper-timestamped
```

Check installation:

```bash
npx editframe check
```

## Output Format

Generates JSON compatible with `ef-captions`:

```json
{
  "segments": [
    { "start": 0, "end": 2500, "text": "Hello world" }
  ],
  "word_segments": [
    { "text": "Hello", "start": 0, "end": 800 },
    { "text": "world", "start": 900, "end": 2500 }
  ]
}
```

Times are in milliseconds.

## Use in Compositions

```html
<ef-captions captions-src="/assets/captions.json">
  <ef-captions-active-word class="text-yellow-300 font-bold"></ef-captions-active-word>
</ef-captions>
```

See the `elements-composition` skill's captions reference for full styling options.
