---
description: "Synchronized caption display with word-level highlighting, custom styling via CSS parts, and WebVTT/JSON caption file support."
---


# ef-captions

## Attributes

- **target** (string) - Selector for ef-video or ef-audio element
- **captions-script** (string) - ID of script element with JSON captions
- **captions-src** (string) - URL to JSON captions file
- **captions-data** (object) - Direct captions data object

# Captions

Synchronized captions with word highlighting.

## Import

```tsx
import {
  Captions,
  CaptionsSegment,
  CaptionsActiveWord,
  CaptionsBeforeActiveWord,
  CaptionsAfterActiveWord
} from "@editframe/react";
```

## Basic Usage

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video id="my-video" src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-captions captions-script="captions-data" class="absolute bottom-8 left-4 right-4 text-center">
    <ef-captions-before-active-word class="text-white/60 text-xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-yellow-300 text-xl font-bold"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/40 text-xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="captions-data">
  {
    "segments": [
      { "start": 0, "end": 3, "text": "Welcome to the demo." },
      { "start": 3, "end": 6, "text": "This shows captions." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.5, "text": "Welcome" },
      { "start": 0.5, "end": 0.7, "text": "to" },
      { "start": 0.7, "end": 0.9, "text": "the" },
      { "start": 0.9, "end": 1.4, "text": "demo." },
      { "start": 3.0, "end": 3.4, "text": "This" },
      { "start": 3.4, "end": 3.8, "text": "shows" },
      { "start": 3.8, "end": 4.5, "text": "captions." }
    ]
  }
  </script>
</ef-timegroup>
```
```tsx
<Captions
  src="/assets/captions.json"
  className="absolute bottom-8 text-white text-2xl text-center w-full"
/>
```

## Caption Data Format

```json
{
  "segments": [
    { "start": 0, "end": 3, "text": "Sentence one." }
  ],
  "word_segments": [
    { "start": 0, "end": 0.5, "text": "Sentence" },
    { "start": 0.5, "end": 1.0, "text": "one." }
  ]
}
```

Times are in seconds relative to the parent timegroup.
```json
{
  "segments": [
    {
      "text": "Hello world",
      "start": 0,
      "end": 2000,
      "words": [
        { "word": "Hello", "start": 0, "end": 500 },
        { "word": "world", "start": 500, "end": 2000 }
      ]
    }
  ]
}
```

## With Video

```tsx
import { Timegroup, Video, Captions } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full">
  <Video src="/assets/video.mp4" className="size-full object-cover" />
  <Captions
    src="/assets/captions.json"
    className="absolute bottom-16 text-white text-3xl text-center w-full px-8"
  />
</Timegroup>
```

## Styled Segments

Use caption components for custom styling:

```tsx
<Captions src="/assets/captions.json" className="absolute bottom-8 w-full text-center">
  <CaptionsSegment className="text-2xl">
    <CaptionsBeforeActiveWord className="text-gray-400" />
    <CaptionsActiveWord className="text-white font-bold bg-blue-500 px-1" />
    <CaptionsAfterActiveWord className="text-gray-400" />
  </CaptionsSegment>
</Captions>
```

## Word Highlighting

```tsx
<Captions src="/assets/captions.json" className="absolute bottom-12 w-full text-center">
  <CaptionsSegment className="text-3xl px-4">
    <CaptionsBeforeActiveWord className="opacity-50" />
    <CaptionsActiveWord className="text-yellow-400 font-bold scale-110 inline-block" />
    <CaptionsAfterActiveWord className="opacity-50" />
  </CaptionsSegment>
</Captions>
```

## Background Box

```tsx
<Captions
  src="/assets/captions.json"
  className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg text-white text-2xl max-w-[800px]"
/>
```

## Active Word Styling

### Color Highlighting

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-purple-900 to-indigo-900">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-70"></ef-video>

  <ef-captions captions-script="color-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-white/50 text-2xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-cyan-400 text-3xl font-black drop-shadow-lg"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/30 text-2xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="color-captions">
  {
    "segments": [
      { "start": 0, "end": 4, "text": "Bold cyan highlights active words." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.6, "text": "Bold" },
      { "start": 0.6, "end": 1.1, "text": "cyan" },
      { "start": 1.1, "end": 1.8, "text": "highlights" },
      { "start": 1.8, "end": 2.3, "text": "active" },
      { "start": 2.3, "end": 3.0, "text": "words." }
    ]
  }
  </script>
</ef-timegroup>
```

### Background Box Style

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-captions captions-script="box-captions" class="absolute bottom-20 left-0 right-0 text-center leading-relaxed">
    <ef-captions-before-active-word class="text-white text-2xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-white text-2xl bg-red-600 px-3 py-1 rounded-lg shadow-xl"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/40 text-2xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="box-captions">
  {
    "segments": [
      { "start": 0, "end": 3.5, "text": "Box highlights each word." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.5, "text": "Box" },
      { "start": 0.5, "end": 1.2, "text": "highlights" },
      { "start": 1.2, "end": 1.6, "text": "each" },
      { "start": 1.6, "end": 2.2, "text": "word." }
    ]
  }
  </script>
</ef-timegroup>
```

### Underline and Shadow

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-t from-gray-900 to-gray-700">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-60"></ef-video>

  <ef-captions captions-script="underline-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-gray-400 text-xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-white text-2xl font-bold underline decoration-yellow-400 decoration-4 underline-offset-4" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.8);"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-gray-500 text-xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="underline-captions">
  {
    "segments": [
      { "start": 0, "end": 3.5, "text": "Underline with shadow effect." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.6, "text": "Underline" },
      { "start": 0.6, "end": 1.0, "text": "with" },
      { "start": 1.0, "end": 1.5, "text": "shadow" },
      { "start": 1.5, "end": 2.2, "text": "effect." }
    ]
  }
  </script>
</ef-timegroup>
```

### Animated Pop Effect

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-captions captions-script="pop-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-white/60 text-xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="pop-word text-yellow-300 text-2xl font-bold"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/40 text-xl"></ef-captions-after-active-word>
  </ef-captions>

  <style>
    @keyframes popIn {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }
    .pop-word {
      display: inline-block;
      animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  </style>

  <script type="application/json" id="pop-captions">
  {
    "segments": [
      { "start": 0, "end": 3, "text": "Words pop in dynamically." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.5, "text": "Words" },
      { "start": 0.5, "end": 1.0, "text": "pop" },
      { "start": 1.0, "end": 1.3, "text": "in" },
      { "start": 1.3, "end": 2.2, "text": "dynamically." }
    ]
  }
  </script>
</ef-timegroup>
```

### Slide-In Animation

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-blue-900 to-purple-900">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-50"></ef-video>

  <ef-captions captions-script="slide-captions" class="absolute bottom-20 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-white/50 text-xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="slide-word text-white text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 px-2 rounded"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/30 text-xl"></ef-captions-after-active-word>
  </ef-captions>

  <style>
    @keyframes slideIn {
      from { transform: translateX(-30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .slide-word {
      display: inline-block;
      animation: slideIn 0.3s ease-out;
    }
  </style>

  <script type="application/json" id="slide-captions">
  {
    "segments": [
      { "start": 0, "end": 3, "text": "Words slide in smoothly." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.5, "text": "Words" },
      { "start": 0.5, "end": 1.0, "text": "slide" },
      { "start": 1.0, "end": 1.3, "text": "in" },
      { "start": 1.3, "end": 2.0, "text": "smoothly." }
    ]
  }
  </script>
</ef-timegroup>
```

## Segment-Level Styling

### Full Segment Display

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-captions captions-script="segment-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-segment class="text-white text-2xl bg-black/70 px-6 py-3 rounded-xl inline-block shadow-2xl border-2 border-white/20"></ef-captions-segment>
  </ef-captions>

  <script type="application/json" id="segment-captions">
  {
    "segments": [
      { "start": 0, "end": 3, "text": "This is the first segment." },
      { "start": 3, "end": 6, "text": "Now showing the second segment." }
    ],
    "word_segments": []
  }
  </script>
</ef-timegroup>
```

### Multi-Line Segments

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-teal-900 to-blue-900">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-60"></ef-video>

  <ef-captions captions-script="multiline-captions" class="absolute bottom-12 left-8 right-8">
    <ef-captions-segment class="block text-white text-xl bg-gradient-to-r from-teal-600/80 to-blue-600/80 px-4 py-3 rounded-lg shadow-xl text-center leading-relaxed"></ef-captions-segment>
  </ef-captions>

  <script type="application/json" id="multiline-captions">
  {
    "segments": [
      { "start": 0, "end": 3, "text": "Segment-level styling creates clean caption blocks." },
      { "start": 3, "end": 6, "text": "Perfect for traditional subtitle appearance." }
    ],
    "word_segments": []
  }
  </script>
</ef-timegroup>
```

## Karaoke-Style Captions

### Classic Karaoke

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-40"></ef-video>

  <ef-captions captions-script="karaoke1" class="absolute bottom-24 left-0 right-0 text-center leading-relaxed">
    <ef-captions-before-active-word class="text-green-400 text-3xl font-bold"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-white text-3xl font-bold bg-pink-600 px-2 py-1 rounded-md shadow-lg"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/50 text-3xl font-bold"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="karaoke1">
  {
    "segments": [
      { "start": 0, "end": 4, "text": "Sing along with karaoke style captions!" }
    ],
    "word_segments": [
      { "start": 0, "end": 0.5, "text": "Sing" },
      { "start": 0.5, "end": 1.0, "text": "along" },
      { "start": 1.0, "end": 1.3, "text": "with" },
      { "start": 1.3, "end": 2.0, "text": "karaoke" },
      { "start": 2.0, "end": 2.5, "text": "style" },
      { "start": 2.5, "end": 3.5, "text": "captions!" }
    ]
  }
  </script>
</ef-timegroup>
```

### Progress Bar Karaoke

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-captions captions-script="karaoke2" class="absolute bottom-20 left-0 right-0">
    <div class="bg-gradient-to-r from-purple-600/90 to-pink-600/90 py-4 px-8 text-center text-3xl font-bold leading-relaxed">
      <ef-captions-before-active-word class="text-yellow-300"></ef-captions-before-active-word>
      <ef-captions-active-word class="text-white bg-yellow-500 px-2 rounded shadow-xl"></ef-captions-active-word>
      <ef-captions-after-active-word class="text-white/60"></ef-captions-after-active-word>
    </div>
  </ef-captions>

  <script type="application/json" id="karaoke2">
  {
    "segments": [
      { "start": 0, "end": 4, "text": "Words turn gold as they're sung." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.6, "text": "Words" },
      { "start": 0.6, "end": 1.1, "text": "turn" },
      { "start": 1.1, "end": 1.6, "text": "gold" },
      { "start": 1.6, "end": 1.9, "text": "as" },
      { "start": 1.9, "end": 2.4, "text": "they're" },
      { "start": 2.4, "end": 3.0, "text": "sung." }
    ]
  }
  </script>
</ef-timegroup>
```

### Gradient Progression

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-gray-900 to-gray-800">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-50"></ef-video>

  <ef-captions captions-script="karaoke3" class="absolute bottom-20 left-0 right-0 text-center text-2xl font-semibold leading-relaxed">
    <ef-captions-before-active-word class="text-blue-400"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-cyan-300 text-3xl" style="text-shadow: 0 0 20px rgba(34, 211, 238, 0.8);"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-gray-500"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="karaoke3">
  {
    "segments": [
      { "start": 0, "end": 4, "text": "Progressive color transitions flow smoothly." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.6, "text": "Progressive" },
      { "start": 0.6, "end": 1.1, "text": "color" },
      { "start": 1.1, "end": 1.8, "text": "transitions" },
      { "start": 1.8, "end": 2.2, "text": "flow" },
      { "start": 2.2, "end": 3.0, "text": "smoothly." }
    ]
  }
  </script>
</ef-timegroup>
```

## Custom Timing Examples

### Fast-Paced Captions

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <ef-captions captions-script="fast-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-white/50 text-xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-orange-400 text-2xl font-bold"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/30 text-xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="fast-captions">
  {
    "segments": [
      { "start": 0, "end": 2, "text": "Quick rapid fire speech!" }
    ],
    "word_segments": [
      { "start": 0, "end": 0.3, "text": "Quick" },
      { "start": 0.3, "end": 0.6, "text": "rapid" },
      { "start": 0.6, "end": 0.9, "text": "fire" },
      { "start": 0.9, "end": 1.4, "text": "speech!" }
    ]
  }
  </script>
</ef-timegroup>
```

### Slow Dramatic Timing

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-b from-gray-900 to-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-40"></ef-video>

  <ef-captions captions-script="slow-captions" class="absolute bottom-20 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-gray-500 text-2xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-white text-4xl font-bold" style="text-shadow: 3px 3px 10px rgba(0,0,0,0.9);"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-gray-600 text-2xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="slow-captions">
  {
    "segments": [
      { "start": 0, "end": 6, "text": "Slow. Deliberate. Speech." }
    ],
    "word_segments": [
      { "start": 0, "end": 1.5, "text": "Slow." },
      { "start": 2.0, "end": 3.5, "text": "Deliberate." },
      { "start": 4.0, "end": 5.5, "text": "Speech." }
    ]
  }
  </script>
</ef-timegroup>
```

### Multiple Speakers

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-indigo-900 to-purple-900">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain opacity-60"></ef-video>

  <ef-captions captions-script="speakers-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-segment class="block text-white text-xl bg-blue-600/80 px-4 py-2 rounded-lg mb-2 inline-block"></ef-captions-segment>
  </ef-captions>

  <script type="application/json" id="speakers-captions">
  {
    "segments": [
      { "start": 0, "end": 2, "text": "[Speaker 1] Hello there!" },
      { "start": 2.5, "end": 4.5, "text": "[Speaker 2] Hi, how are you?" },
      { "start": 5, "end": 7, "text": "[Speaker 1] I'm doing great!" }
    ],
    "word_segments": []
  }
  </script>
</ef-timegroup>
```

## Loading Captions

### From External File

```html
<ef-captions captions-src="/captions/video-transcript.json" class="absolute bottom-12 left-0 right-0 text-center">
  <ef-captions-before-active-word class="text-white/60 text-xl"></ef-captions-before-active-word>
  <ef-captions-active-word class="text-yellow-300 text-2xl font-bold"></ef-captions-active-word>
  <ef-captions-after-active-word class="text-white/40 text-xl"></ef-captions-after-active-word>
</ef-captions>
```

### From Inline Script

```html
<ef-captions captions-script="my-captions">
  <ef-captions-active-word class="text-yellow-300"></ef-captions-active-word>
</ef-captions>

<script type="application/json" id="my-captions">
{
  "segments": [
    { "start": 0, "end": 3, "text": "Your caption text here." }
  ],
  "word_segments": [
    { "start": 0, "end": 1, "text": "Your" },
    { "start": 1, "end": 2, "text": "caption" },
    { "start": 2, "end": 3, "text": "text" },
    { "start": 3, "end": 4, "text": "here." }
  ]
}
</script>
```

### Via JavaScript

```html
<ef-captions id="dynamic-captions">
  <ef-captions-active-word class="text-cyan-400"></ef-captions-active-word>
</ef-captions>

<script>
  const captions = document.getElementById('dynamic-captions');
  captions.captionsData = {
    segments: [
      { start: 0, end: 3, text: "Dynamically loaded captions." }
    ],
    word_segments: [
      { start: 0, end: 1, text: "Dynamically" },
      { start: 1, end: 2, text: "loaded" },
      { start: 2, end: 3, text: "captions." }
    ]
  };
</script>
```

## Sub-Elements

`ef-captions` uses child elements to separate caption text into styleable parts. These elements act as **slots** — they're containers that `ef-captions` fills with text. You style them with CSS classes, and `ef-captions` handles updating their content.

All caption sub-elements use `display: inline` by default for natural text flow. They act as transparent containers — the text flows as if the element boundaries don't exist.

### ef-captions-active-word

The word currently being spoken. Automatically hidden when empty or contains only punctuation.

**CSS Variables:**
- `--ef-word-seed` - Deterministic random (0-1) per word for animations

**Behavior:**
- Adds trailing space automatically for proper word spacing
- Hidden via `hidden` attribute when no active word

### ef-captions-before-active-word

All words in the current segment that have already been spoken.

**Behavior:**
- Adds trailing space when followed by active word
- Hidden via `hidden` attribute when no prior words

### ef-captions-after-active-word

All words in the current segment not yet spoken.

**Behavior:**
- No leading space (active word adds trailing space)
- Hidden via `hidden` attribute when no upcoming words

### ef-captions-segment

The full text of the current caption segment.

**Behavior:**
- Hidden via `hidden` attribute when no active segment
- Can be used alone or alongside word-level elements

### Layout Patterns

```html
<!-- Inline flow (default) -->
<ef-captions class="text-white text-xl">
  <ef-captions-before-active-word></ef-captions-before-active-word>
  <ef-captions-active-word class="font-bold"></ef-captions-active-word>
  <ef-captions-after-active-word></ef-captions-after-active-word>
</ef-captions>

<!-- Multi-line layout -->
<ef-captions>
  <div class="text-center">
    <ef-captions-segment class="block text-white/50 mb-1"></ef-captions-segment>
  </div>
  <div class="text-center">
    <ef-captions-active-word class="text-yellow-400 text-2xl"></ef-captions-active-word>
  </div>
</ef-captions>
```

### Technical Notes

- All sub-elements use light DOM (not shadow DOM) for styling simplicity
- Parent `ef-captions` element updates child `textContent` directly
- Empty or punctuation-only content automatically hides elements via `hidden` attribute
- Elements maintain text flow by using `display: inline` with no margins/padding
- `--ef-word-seed` provides deterministic randomness based on word index (not random each frame)

## Generate Captions

Use the Editframe CLI to generate captions from video/audio files:

```bash
npx editframe transcribe video.mp4 -o captions.json
```

```bash
# Transcribe with specific language
npx editframe transcribe video.mp4 --language en -o captions.json

# Transcribe audio file
npx editframe transcribe audio.mp3 -o captions.json
```

Then load the generated captions:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>

  <!-- In production, use captions-src="/path/to/captions.json" -->
  <ef-captions captions-script="transcribed-captions" class="absolute bottom-16 left-0 right-0 text-center">
    <ef-captions-before-active-word class="text-white/60 text-xl"></ef-captions-before-active-word>
    <ef-captions-active-word class="text-green-400 text-2xl font-bold bg-black/60 px-2 rounded"></ef-captions-active-word>
    <ef-captions-after-active-word class="text-white/40 text-xl"></ef-captions-after-active-word>
  </ef-captions>

  <script type="application/json" id="transcribed-captions">
  {
    "segments": [
      { "start": 0, "end": 3, "text": "Transcription generates this format automatically." }
    ],
    "word_segments": [
      { "start": 0, "end": 0.7, "text": "Transcription" },
      { "start": 0.7, "end": 1.3, "text": "generates" },
      { "start": 1.3, "end": 1.6, "text": "this" },
      { "start": 1.6, "end": 2.0, "text": "format" },
      { "start": 2.0, "end": 3.0, "text": "automatically." }
    ]
  }
  </script>
</ef-timegroup>
```

See [transcription.md](references/transcription.md) for complete transcription workflow documentation.
This uses `whisper_timestamped` to create word-level timestamps. Install it first:

```bash
pip3 install whisper-timestamped
```

See [references/transcription.md](references/transcription.md) for more details.

## Multiple Caption Tracks

```tsx
<Timegroup mode="contain" className="absolute w-full h-full">
  <Video src="/assets/video.mp4" className="size-full" />

  {/* English subtitles */}
  <Captions
    id="en"
    src="/assets/captions-en.json"
    className="absolute bottom-24 text-white text-2xl text-center w-full"
  />

  {/* Spanish subtitles */}
  <Captions
    id="es"
    src="/assets/captions-es.json"
    className="absolute bottom-8 text-yellow-300 text-xl text-center w-full"
  />
</Timegroup>
```

## Dynamic Captions

```tsx
interface CaptionTrack {
  id: string;
  src: string;
  language: string;
}

const tracks: CaptionTrack[] = [
  { id: "en", src: "/assets/captions-en.json", language: "English" },
  { id: "es", src: "/assets/captions-es.json", language: "Spanish" },
];

const [selectedTrack, setSelectedTrack] = useState(tracks[0]);

<Timegroup mode="contain" className="absolute w-full h-full">
  <Video src="/assets/video.mp4" className="size-full" />
  <Captions
    src={selectedTrack.src}
    className="absolute bottom-8 text-white text-2xl text-center w-full"
  />
</Timegroup>
```
