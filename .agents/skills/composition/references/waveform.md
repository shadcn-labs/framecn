---
description: "Audio waveform visualization element with bar, line, and mirror display modes, synced to composition playback time."
---


# ef-waveform

## Attributes

- **target** (string) (required) - ID of ef-audio or ef-video element
- **mode** (string, default: bars) - Display mode
- **bar-spacing** (number, default: 0.5) - Spacing between bars
- **line-width** (number, default: 4) - Line width for line/curve modes

# Waveform

Audio waveform visualization.

## Import

```tsx
import { Waveform } from "@editframe/react";
```

## Basic Usage

```html
<ef-audio id="audio" fft-size="256" src="music.mp3"></ef-audio>
<ef-waveform target="audio" mode="bars" class="text-green-400 w-3/4 h-32"></ef-waveform>
```
```tsx
import { Audio, Waveform } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full bg-black">
  <Audio id="track1" src="/assets/music.mp3" />
  <Waveform
    for="track1"
    className="absolute bottom-0 w-full h-32"
  />
</Timegroup>
```

## Full Scene

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[400px] bg-slate-900 flex flex-col items-center justify-center">
  <ef-audio id="wf-demo" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4" volume="0.6"></ef-audio>
  <ef-waveform mode="bars" target="wf-demo" class="text-green-400 w-3/4 h-32"></ef-waveform>
  <ef-text duration="10s" class="text-white text-lg mt-4">Audio Waveform</ef-text>
</ef-timegroup>
```

## Visualization Modes

Each mode produces a different visual style. Color is inherited from `currentColor` (set via Tailwind `text-*` classes).

### Bars

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-bars" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="bars" target="wf-bars" class="text-green-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Round Bars

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-round" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="roundBars" target="wf-round" class="text-blue-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Line

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-line" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="line" line-width="2" target="wf-line" class="text-yellow-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Curve

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-curve" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="curve" target="wf-curve" class="text-purple-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Wave

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-wave" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="wave" target="wf-wave" class="text-cyan-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Spikes

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-spikes" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="spikes" target="wf-spikes" class="text-red-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Bricks

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-bricks" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="bricks" target="wf-bricks" class="text-orange-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

### Pixel

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center">
  <ef-audio id="wf-pixel" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="pixel" target="wf-pixel" class="text-pink-400 w-3/4 h-32"></ef-waveform>
</ef-timegroup>
```

## Customization

### Bar Spacing and Line Width

```html live
<ef-timegroup mode="contain" workbench class="w-[720px] h-[300px] bg-slate-900 flex items-center justify-center gap-8">
  <ef-audio id="wf-custom" fft-size="256" src="https://assets.editframe.com/bars-n-tone.mp4"></ef-audio>
  <ef-waveform mode="bars" bar-spacing="2" target="wf-custom" class="text-emerald-400 w-1/3 h-32"></ef-waveform>
  <ef-waveform mode="line" line-width="4" target="wf-custom" class="text-sky-400 w-1/3 h-32"></ef-waveform>
</ef-timegroup>
```

## Styled Waveform

```tsx
<Waveform
  for="audio1"
  className="absolute bottom-0 w-full h-40 opacity-60"
  style={{
    fill: '#3b82f6',  // blue-500
    stroke: '#60a5fa', // blue-400
  }}
/>
```

## Positioned Waveform

```tsx
<Timegroup mode="contain" className="absolute w-full h-full">
  <Audio id="podcast" src="/assets/podcast.mp3" />

  {/* Bottom waveform */}
  <Waveform
    for="podcast"
    className="absolute bottom-0 w-full h-24"
    style={{ fill: '#22c55e' }}
  />

  {/* Top waveform (mirrored effect) */}
  <Waveform
    for="podcast"
    className="absolute top-0 w-full h-24 scale-y-[-1]"
    style={{ fill: '#22c55e', opacity: 0.3 }}
  />
</Timegroup>
```

## With Video

```tsx
import { Timegroup, Video, Audio, Waveform } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full">
  <Video src="/assets/video.mp4" muted className="size-full object-cover" />
  <Audio id="audio-track" src="/assets/music.mp3" volume={0.5} />
  <Waveform
    for="audio-track"
    className="absolute bottom-0 w-full h-20 opacity-50"
    style={{ fill: '#ffffff' }}
  />
</Timegroup>
```

## Centered Waveform

```tsx
<Timegroup mode="contain" className="absolute w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
  <Audio id="beat" src="/assets/beat.mp3" />
  <Waveform
    for="beat"
    className="w-3/4 h-64"
    style={{ fill: '#a855f7', stroke: '#c084fc' }}
  />
</Timegroup>
```

## Multiple Audio Tracks

```tsx
<Timegroup mode="fixed" duration="10s" className="absolute w-full h-full">
  <Audio id="music" src="/assets/music.mp3" volume={0.3} />
  <Audio id="voice" src="/assets/voice.mp3" volume={1.0} />

  <Waveform
    for="music"
    className="absolute bottom-0 w-full h-16"
    style={{ fill: '#3b82f6', opacity: 0.6 }}
  />

  <Waveform
    for="voice"
    className="absolute bottom-16 w-full h-32"
    style={{ fill: '#22c55e', opacity: 0.8 }}
  />
</Timegroup>
```

## Podcast/Audio Visualization

```tsx
import { Audio, Waveform, Text, Image } from "@editframe/react";

export const PodcastVisualizer = () => {
  return (
    <Timegroup
      mode="contain"
      className="w-[1920px] h-[1080px] bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <Audio id="episode" src="/assets/podcast.mp3" />

      {/* Podcast artwork */}
      <Image
        src="/assets/podcast-cover.jpg"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-lg shadow-2xl"
      />

      {/* Waveform */}
      <Waveform
        for="episode"
        className="absolute bottom-32 w-full h-40"
        style={{ fill: '#3b82f6', opacity: 0.7 }}
      />

      {/* Title */}
      <Text
        duration="contain"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-2xl"
      >
        Episode 42: The Future of AI
      </Text>
    </Timegroup>
  );
};
```

## Dynamic Colors

```tsx
import { useState } from "react";

const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

const [colorIndex, setColorIndex] = useState(0);

<Waveform
  for="audio"
  className="absolute bottom-0 w-full h-32"
  style={{ fill: colors[colorIndex] }}
/>
```
