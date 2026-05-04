---
name: hero-demo
description: Landing page hero demo video composition. Use when editing scenes, regenerating voiceover, updating captions, or adjusting timing for the hero demo at telecine/services/web/app/components/landing-v5/HeroDemo.tsx.
---

# Hero Demo Composition

An ~51s animated composition built with Editframe's React/timeline components that plays on the landing page. 8 scenes in a `sequence` Timegroup with crossfade overlaps, a single continuous voiceover, and word-level synced captions.

## File Map

| File | Purpose |
|------|---------|
| `telecine/services/web/app/components/landing-v5/HeroDemo.tsx` | Composition: DUR constants, CAPTIONS array, 8 scene functions, HeroDemoContent layout |
| `telecine/services/web/app/styles/landing.css` | All `hero-*` keyframe animations |
| `telecine/services/web/scripts/generate-hero-voiceover-local.py` | TTS generation + whisper splitting script |
| `telecine/services/web/public/audio/hero/` | Generated WAV/MP3 files, timing.json |

## Architecture

```
FitScale
  Timegroup mode="contain" (960x540, relative)
    Audio src={VOICEOVER_SRC}           ← single continuous track
    Timegroup mode="sequence" overlapMs=495
      SceneTitle      (3333ms)
      SceneAuthor     (6333ms)
      SceneLayers     (7067ms)
      SceneTimeline   (9767ms)
      SceneEditor     (8200ms)
      SceneTemplate   (5500ms)
      SceneStream     (5700ms)
      SceneRender     (8833ms)
    SceneCaptions groups={CAPTIONS}     ← absolute overlay, global timestamps
```

- Overlap is 495ms (15 frames at 30fps). Each scene fades in/out over this window.
- Total duration with overlaps: ~51.3s.
- DUR values = voice duration + buffer. Buffer gives the scene visual breathing room beyond the VO.
- All animations are CSS-only, driven by `animationDelay` relative to each scene's local timeline. Set fill-mode on non-ef-text elements as needed (see css-animations skill); ef-text handles it automatically.

## Voiceover Script

| # | Scene | Text |
|---|-------|------|
| 1 | title | Video is a web page that moves. |
| 2 | author | It starts with HTML and CSS. When you need more, it's just React. |
| 3 | layers | Stack layers the way you stack divs. Video, text, shapes, 3D, mix everything. |
| 4 | timeline | Need an editor? Snap together GUI primitives. Timeline, waveforms, captions, into any editing experience you want. |
| 5 | editor | A full NLE. A simple trim tool in a form. It's your UI. These are just the building blocks. |
| 6 | template | Feed in data, and one template becomes ten thousand unique videos. |
| 7 | stream | Preview is instant. Change the code, see the frame. |
| 8 | render | When it's ready, render to the cloud, the browser, or the command line. Same composition, every target. |

**Messaging**: Editframe is a declarative layer. HTML/CSS is the foundation; React and JS are power tools on top. Not "just React" and not "just HTML."

**Text rules**: No em-dashes (they cause TTS pauses). Keep sentences short and punchy.

## Voiceover Regeneration Workflow

Follow these steps exactly when the script text changes.

### Step 1: Update the generation script

Edit `SEGMENTS` in `telecine/services/web/scripts/generate-hero-voiceover-local.py`. Each segment has:
- `key`: filename prefix (e.g. `01-title`)
- `text`: the voiceover line
- `last_word`: final word stem for whisper-based splitting
- `discard`: true for the preamble segment only

The first segment MUST be a preamble (`"discard": True`) with throwaway text like `"Here is the introduction."` — this absorbs TTS model warmup noise. DO NOT remove it.

Segments are joined with `" ... "` pause separators into one TTS pass.

### Step 2: Generate audio locally

```bash
cd telecine/services/web
python scripts/generate-hero-voiceover-local.py
```

This requires:
- `qwen_tts` package with the VoiceDesign model (`Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign`)
- `whisper`, `soundfile`, `numpy`, `torch`

**DO NOT use the CustomVoice model** (`generate_custom_voice`). It produces garbled output. Only use `generate_voice_design` with `language="English"`.

Output lands in `telecine/services/web/public/audio/hero/`:
- `voiceover.wav` / `.mp3` — full audio including preamble
- `01-title.wav` through `08-render.wav` / `.mp3` — per-scene splits (reference only)
- `timing.json` — per-scene durations in seconds

### Step 3: Trim the preamble

The preamble must be removed. Find the trim point from the script's console output (it prints the preamble end time), then:

```bash
ffmpeg -y -i public/audio/hero/voiceover.wav -ss <PREAMBLE_END_SEC> public/audio/hero/voiceover-trimmed.wav
ffmpeg -y -i public/audio/hero/voiceover-trimmed.wav -codec:a libmp3lame -b:a 128k public/audio/hero/voiceover-trimmed.mp3
```

### Step 4: Get global word timestamps

Run whisper on the trimmed file to get global timestamps (all relative to t=0 of the trimmed audio):

```python
import whisper, json
model = whisper.load_model("small")
result = model.transcribe("public/audio/hero/voiceover-trimmed.wav", language="en", word_timestamps=True)
words = []
for seg in result["segments"]:
    for w in seg.get("words", []):
        words.append({"word": w["word"].strip(), "start": round(w["start"] * 1000), "end": round(w["end"] * 1000)})
with open("/tmp/hero-whisper/global.json", "w") as f:
    json.dump(words, f, indent=2)
```

### Step 5: Upload to GCS

Files go to `gs://editframe-assets-7ac794b/hero/` (NOT `editframe-assets`). CDN serves at `https://assets.editframe.com/hero/`.

Use a content hash in the filename — the CDN cache won't let you overwrite the same URL:

```bash
HASH=$(md5 -q public/audio/hero/voiceover-trimmed.mp3 | head -c 8)
gsutil -h "Content-Type:audio/mpeg" -h "Cache-Control:public, max-age=31536000" \
  cp public/audio/hero/voiceover-trimmed.mp3 "gs://editframe-assets-7ac794b/hero/voiceover-${HASH}.mp3"
```

### Step 6: Update HeroDemo.tsx

Three things to update:

1. **`VOICEOVER_SRC`** — set to the new CDN URL with the content hash.

2. **`CAPTIONS` array** — rebuild from the global whisper timestamps. Group words into caption groups that match natural sentence/phrase boundaries. Each group needs:
   - `showMs`: timestamp of first word in the group (or slightly before)
   - `hideMs`: timestamp of last word's end + ~400ms buffer
   - `words`: array of `{ w, s, e }` from whisper output

   Caption groups should break at sentence boundaries and match the scene they belong to. Multiple groups per scene is normal. The timestamps are GLOBAL (from the single voiceover track), not scene-relative.

3. **`DUR` constants** — if voice durations changed significantly, adjust scene durations. Formula: `DUR.scene = voiceDurationMs + buffer` where buffer is typically 800-1200ms. Round to 30fps alignment (multiples of 33.33ms). Check `timing.json` for per-scene voice durations.

### Step 7: Verify

Play the composition in the browser. Check:
- Caption words highlight in sync with audio
- Scene transitions don't cut off voiceover mid-sentence
- No dead air gaps between scenes (overlaps should feel smooth)

## Scene Editing

Each scene is a function (`SceneTitle`, `SceneAuthor`, etc.) returning a `Timegroup mode="fixed"` with explicit `duration={DUR.xxx}ms`.

Common patterns:
- `sceneStyle(d)` applies crossfade in/out via CSS animation
- Visual animations use `animationDelay` for stagger/sequencing; ef-text auto-defaults fill-mode, plain elements need explicit fill-mode
- `CompositionCanvas` wraps R3F Three.js content (particles in SceneStream)
- `<Text split="char">` for per-character stagger animations

When adding/editing animations, define new keyframes in `landing.css` with the `hero-` prefix.

## Changelog MDX Authoring

Changelog entries live in `telecine/services/web/app/content/changelogs/{version}.mdx`. Each entry uses the same component set as HeroDemo but through MDX props.

### Component API

**`ChangelogIntroCard`** — required props: `version`, `codename`, `title`. The `title` prop is NOT optional even though TypeScript won't enforce it at MDX authoring time. Missing `title` causes `title.trim()` to throw at runtime, breaking hydration and leaving the page as a blank placeholder. The `illustration` prop is a no-op stub kept for MDX compat.

```mdx
<ChangelogIntroCard
  version="0.47.0"
  codename="Mocha Relay"
  title="Short title for the card display"
  durationMs={4000}
/>
```

**`ReleaseVideo`** — wraps children in its own `<Timegroup mode="contain">`. Pass scene elements as direct children via an inner `<Timegroup mode="sequence">`:

```mdx
<ReleaseVideo aspect="16/9">
  <Timegroup mode="sequence" overlapMs={600} style={{ width: 1920, height: 1080, position: "relative" }}>
    <ChangelogIntroCard ... />
    <TextMoment ... />
    <ChangelogOutroCard ... />
  </Timegroup>
</ReleaseVideo>
```

**`ChangelogOutroCard`** — `version` and `tagline` required. `durationMs` defaults exist.

**`TextMoment`** — `headline` and `body` required. `motif`, `accentColor`, `durationMs` optional.

### Pitfall: blank placeholder on page load

If `ReleaseVideo` renders as a blank gray box and never hydrates into a player, the cause is almost always a runtime error in one of the scene components. `ReleaseVideo` uses `isClient` gating, so SSR always shows the placeholder — errors in scene components silently kill client hydration. Check browser console for `TypeError` on the component throwing.

## Pitfalls

- **TTS CustomVoice model is broken**: Only use VoiceDesign (`generate_voice_design`). CustomVoice produces unintelligible audio.
- **Preamble is required**: First 1-2s of TTS generation can be noisy. The throwaway preamble absorbs this. Always trim it off before uploading.
- **GCS filename reuse**: CDN caches aggressively. Always use content-hashed filenames when uploading new audio.
- **Caption timestamps are global**: They come from whisper on the single trimmed voiceover, not per-scene. Do not make them scene-relative.
- **CompositionCanvas rendering**: Uses `flushSync` + `useLayoutEffect` to work in the synchronous export pipeline. Do not add manual `gl.render()`/`gl.finish()` calls — that doubles GPU work.
- **Em-dashes in VO text**: Cause unwanted pauses in TTS output. Use commas or periods instead.
