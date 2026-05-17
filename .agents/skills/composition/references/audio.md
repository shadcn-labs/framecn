---
description: "Audio element for music, voiceover, and sound effects with trim controls, volume adjustment, and loop support in compositions."
---


# ef-audio

## Attributes

- **src** (string) (required) - URL or path to audio source
- **sourcein** (timestring) - Absolute start time in source media
- **sourceout** (timestring) - Absolute end time in source media
- **trimstart** (timestring) - Duration to trim from start
- **trimend** (timestring) - Duration to trim from end
- **duration** (timestring) - Override element duration
- **volume** (number, default: 1) - Audio volume (0.0 to 1.0)
- **mute** (boolean, default: false) - Silence the audio
- **fft-size** (string) - FFT size for waveform visualization (e.g., "256")

# Audio

Audio element for music, voiceover, sound effects.

## Import

```tsx
import { Audio } from "@editframe/react";
```

## Basic Usage

```html
<ef-audio src="music.mp3" volume="0.5"></ef-audio>
```
```tsx
<Audio src="/assets/music.mp3" />
```

## With Volume

```tsx
<Audio src="/assets/music.mp3" volume={0.3} />
```

## Trimming Approaches

Two ways to trim audio - choose based on your workflow:

### Absolute Trimming (sourcein/sourceout)
### Absolute Trimming (sourceIn/sourceOut)

Use specific timestamps from source. Best for precise timecodes.

```html
<!-- Play seconds 5-10 from source (5s clip) -->
<ef-audio src="voiceover.mp3" sourcein="5s" sourceout="10s" volume="0.8"></ef-audio>
```
```tsx
{/* Play seconds 30-60 from source (30s clip) */}
<Audio
  src="/assets/song.mp3"
  sourceIn="30s"
  sourceOut="60s"
  volume={0.5}
/>
```

### Relative Trimming (trimstart/trimend)
### Relative Trimming (trimStart/trimEnd)

Remove time from start/end. Best for "cut off X seconds" thinking.

```html
<!-- Remove 1s from start, 2s from end -->
<ef-audio src="music.mp3" trimstart="1s" trimend="2s" volume="0.5"></ef-audio>
```
```tsx
{/* Remove 1s from start, 2s from end */}
<Audio
  src="/assets/music.mp3"
  trimStart="1s"
  trimEnd="2s"
  volume={0.5}
/>
```

**When to use each:**
- `sourcein`/`sourceout` - Working with timecode, precise frame references
- `trimstart`/`trimend` - UI builders, "how much to cut off" thinking
- `sourceIn`/`sourceOut` - Working with timecode, precise frame references
- `trimStart`/`trimEnd` - UI builders, "how much to cut off" thinking

## Background Music

```html
<ef-timegroup mode="fixed" duration="10s">
  <ef-video src="video.mp4" mute class="size-full"></ef-video>
  <ef-audio src="background-music.mp3" volume="0.3"></ef-audio>
</ef-timegroup>
```
```tsx
import { Timegroup, Video, Audio } from "@editframe/react";

export const VideoWithMusic = () => {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      {/* Audio spans entire composition */}
      <Audio src="/assets/background-music.mp3" volume={0.2} />

      <Timegroup mode="fixed" duration="10s" className="absolute w-full h-full">
        <Video src="/assets/clip1.mp4" className="size-full" />
      </Timegroup>

      <Timegroup mode="fixed" duration="10s" className="absolute w-full h-full">
        <Video src="/assets/clip2.mp4" className="size-full" />
      </Timegroup>
    </Timegroup>
  );
};
```

## Multiple Audio Tracks

```html
<ef-timegroup mode="fixed" duration="5s">
  <ef-video src="video.mp4" mute class="size-full"></ef-video>
  <ef-audio src="music.mp3" volume="0.25"></ef-audio>
  <ef-audio src="voiceover.mp3" volume="0.9"></ef-audio>
</ef-timegroup>
```
```tsx
<Timegroup mode="fixed" duration="10s">
  <Audio src="/assets/music.mp3" volume={0.3} />
  <Audio src="/assets/voiceover.mp3" volume={1.0} />
  <Audio src="/assets/sfx.mp3" volume={0.5} />
</Timegroup>
```

## Audio with Waveform Visualization

Combine `ef-audio` with `ef-waveform` for visual feedback:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-slate-900 to-slate-800">
  <ef-audio id="audio-viz" fft-size="256" src="https://assets.editframe.com/music-bed-1.mp3" volume="0.6"></ef-audio>

  <div class="flex flex-col items-center justify-center h-full gap-8">
    <h2 class="text-white text-3xl font-bold">Audio Visualization</h2>
    <ef-waveform target="audio-viz" mode="bars" class="text-green-400 w-4/5 h-48"></ef-waveform>
  </div>
</ef-timegroup>
```
```tsx
import { Audio, Waveform } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full">
  <Audio id="my-audio" src="/assets/podcast.mp3" />
  <Waveform
    for="my-audio"
    className="absolute bottom-0 w-full h-24 opacity-50"
  />
</Timegroup>
```

## Volume Control with Slider

Use an HTML range input to control audio volume interactively:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-purple-900 to-indigo-900">
  <ef-audio id="audio-vol" fft-size="256" src="https://assets.editframe.com/music-bed-1.mp3" volume="0.5"></ef-audio>

  <div class="flex flex-col items-center justify-center h-full gap-8 p-8">
    <h2 class="text-white text-3xl font-bold">Volume Control</h2>
    <ef-waveform target="audio-vol" mode="roundBars" class="text-cyan-400 w-4/5 h-40"></ef-waveform>

    <div class="w-96 bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
      <div class="flex items-center justify-between">
        <label for="volume-slider" class="text-white font-medium">Volume:</label>
        <span id="volume-display" class="text-cyan-400 font-bold text-lg">50%</span>
      </div>
      <input
        type="range"
        id="volume-slider"
        min="0"
        max="100"
        value="50"
        class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  </div>
</ef-timegroup>

<script>
  const slider = document.getElementById('volume-slider');
  const display = document.getElementById('volume-display');
  const audio = document.getElementById('audio-vol');

  slider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    display.textContent = `${e.target.value}%`;
  });
</script>
```

## Multiple Audio Tracks Layering

Layer background music, sound effects, and voiceover:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-blue-900 to-purple-900">
  <ef-audio id="track1" fft-size="256" src="https://assets.editframe.com/music-bed-1.mp3" volume="0.3"></ef-audio>
  <ef-audio id="track2" src="https://assets.editframe.com/music-bed-2.mp3" volume="0.2"></ef-audio>
  <ef-audio id="track3" src="https://assets.editframe.com/music-bed-3.mp3" volume="0.25"></ef-audio>

  <div class="flex flex-col items-center justify-center h-full gap-6 p-8">
    <h2 class="text-white text-3xl font-bold">Three Audio Tracks</h2>
    <ef-waveform target="track1" mode="curve" class="text-pink-400 w-4/5 h-32"></ef-waveform>

    <div class="w-96 bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
      <div class="text-white space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm">Track 1:</span>
          <span class="text-pink-400 font-bold">30%</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm">Track 2:</span>
          <span class="text-blue-400 font-bold">20%</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm">Track 3:</span>
          <span class="text-purple-400 font-bold">25%</span>
        </div>
      </div>
    </div>
  </div>
</ef-timegroup>
```

## Mute/Unmute Behavior

Toggle audio muting with a button:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-gray-900 to-slate-800">
  <ef-audio id="audio-mute" fft-size="256" src="https://assets.editframe.com/music-bed-1.mp3" volume="0.6" mute="false"></ef-audio>

  <div class="flex flex-col items-center justify-center h-full gap-8 p-8">
    <h2 class="text-white text-3xl font-bold">Mute Control</h2>
    <ef-waveform target="audio-mute" mode="wave" class="text-yellow-400 w-4/5 h-40"></ef-waveform>

    <div class="flex gap-4">
      <button
        id="mute-btn"
        class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-colors"
      >
        Mute
      </button>
      <button
        id="unmute-btn"
        class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-colors"
      >
        Unmute
      </button>
    </div>

    <div id="status" class="text-white text-xl font-medium">
      Status: <span id="mute-status" class="text-green-400">Playing</span>
    </div>
  </div>
</ef-timegroup>

<script>
  const audio = document.getElementById('audio-mute');
  const muteBtn = document.getElementById('mute-btn');
  const unmuteBtn = document.getElementById('unmute-btn');
  const status = document.getElementById('mute-status');

  muteBtn.addEventListener('click', () => {
    audio.mute = true;
    status.textContent = 'Muted';
    status.className = 'text-red-400';
  });

  unmuteBtn.addEventListener('click', () => {
    audio.mute = false;
    status.textContent = 'Playing';
    status.className = 'text-green-400';
  });
</script>
```

## FFT Size Effect on Waveform

The `fft-size` attribute controls the frequency resolution of the waveform. Higher values provide more detail but use more processing power:

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-gradient-to-br from-emerald-900 to-teal-900">
  <ef-audio id="audio-fft" fft-size="128" src="https://assets.editframe.com/music-bed-1.mp3" volume="0.6"></ef-audio>

  <div class="flex flex-col items-center justify-center h-full gap-6 p-8">
    <h2 class="text-white text-3xl font-bold">FFT Size Control</h2>
    <ef-waveform target="audio-fft" mode="bars" class="text-emerald-400 w-4/5 h-40"></ef-waveform>

    <div class="w-96 bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-white font-medium">FFT Size:</label>
        <span id="fft-display" class="text-emerald-400 font-bold text-lg">128</span>
      </div>

      <div class="flex gap-2">
        <button class="fft-btn flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors" data-size="64">64</button>
        <button class="fft-btn flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm" data-size="128">128</button>
        <button class="fft-btn flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors" data-size="256">256</button>
        <button class="fft-btn flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors" data-size="512">512</button>
        <button class="fft-btn flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors" data-size="1024">1024</button>
      </div>

      <p class="text-gray-300 text-xs">
        Higher FFT sizes provide more frequency detail but use more CPU.
      </p>
    </div>
  </div>
</ef-timegroup>

<script>
  const audioFft = document.getElementById('audio-fft');
  const fftDisplay = document.getElementById('fft-display');
  const fftButtons = document.querySelectorAll('.fft-btn');

  fftButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.size;
      audioFft.setAttribute('fft-size', size);
      fftDisplay.textContent = size;

      // Update button styles
      fftButtons.forEach(b => {
        if (b === btn) {
          b.className = 'fft-btn flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm';
        } else {
          b.className = 'fft-btn flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors';
        }
      });
    });
  });
</script>
```

**FFT Size Guidelines:**
- `64` - Low detail, minimal CPU usage
- `128` - Basic visualization, good performance
- `256` - Balanced detail and performance (recommended)
- `512` - High detail, moderate CPU usage
- `1024` - Maximum detail, higher CPU usage

## Dynamic Audio List

```tsx
interface AudioTrack {
  id: string;
  src: string;
  volume: number;
}

const tracks: AudioTrack[] = [
  { id: "music", src: "/assets/music.mp3", volume: 0.3 },
  { id: "voice", src: "/assets/voice.mp3", volume: 1.0 },
];

<Timegroup mode="sequence" className="w-[800px] h-[500px]">
  {tracks.map((track) => (
    <Audio
      key={track.id}
      id={track.id}
      src={track.src}
      volume={track.volume}
    />
  ))}
</Timegroup>
```

## Synchronized Audio

Audio automatically syncs with the timeline. Use `sourceIn`/`sourceOut` to trim:

```tsx
{/* Play seconds 10-20 from the audio file */}
<Audio
  src="/assets/long-audio.mp3"
  sourceIn="10s"
  sourceOut="20s"
/>
```
