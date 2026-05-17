---
description: Generate word-level transcription data from audio and video files for use with ef-captions synchronized caption playback.
---


# Generating Captions

Generate word-level captions for `ef-captions` using the Editframe CLI.

## Quick Start

```bash
npx editframe transcribe video.mp4 -o captions.json
```

See the `editframe-cli` skill for full transcription options, language support, and requirements.

## Automatic Transcription

During development, captions are generated automatically when you reference a video/audio file:

```html
<ef-captions for="my-video">
  <ef-captions-active-word class="text-yellow-300"></ef-captions-active-word>
</ef-captions>

<ef-video id="my-video" src="video.mp4"></ef-video>
```

The dev server detects the video and generates captions on first use.

## Use in Composition

Load from file:

```html
<ef-captions captions-src="/assets/captions.json">
  <ef-captions-before-active-word class="text-white/60"></ef-captions-before-active-word>
  <ef-captions-active-word class="text-yellow-300 font-bold"></ef-captions-active-word>
  <ef-captions-after-active-word class="text-white/40"></ef-captions-after-active-word>
</ef-captions>
```
