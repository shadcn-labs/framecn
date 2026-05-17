---
description: "Mirror or duplicate another element's canvas output into a new position, useful for picture-in-picture and reflection effects."
---


# ef-surface

## Attributes

- **target** (string) (required) - ID of element to mirror (e.g., ef-video)

# Surface

Mirror/duplicate of another element's canvas output.

## Import

```tsx
import { Surface } from "@editframe/react";
```

## Basic Usage

```html
<ef-video id="main-video" src="video.mp4" class="size-full"></ef-video>
<ef-surface target="main-video" class="absolute top-4 right-4 w-32 h-20 rounded-lg"></ef-surface>
```
```tsx
import { Text, Surface } from "@editframe/react";

<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  <Text id="title" duration="5s" className="text-white text-4xl">
    Original Text
  </Text>

  <Surface
    for="title"
    className="absolute top-32 blur-sm opacity-50"
  />
</Timegroup>
```

## Picture-in-Picture Effect

Mirror video in a small preview corner.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video id="main" src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-cover"></ef-video>

  <!-- PiP using surface -->
  <ef-surface target="main" class="absolute bottom-4 right-4 w-48 h-28 rounded-lg border-2 border-white shadow-lg"></ef-surface>
</ef-timegroup>
```
```tsx
import { Video, Surface } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full">
  {/* Main video */}
  <Video
    id="main"
    src="/assets/main.mp4"
    className="size-full object-cover"
  />

  {/* PiP using surface */}
  <Surface
    for="main"
    className="absolute bottom-4 right-4 w-64 h-36 border-2 border-white rounded shadow-lg"
  />
</Timegroup>
```

## Video Wall Effect

Create grid layouts with multiple mirrors showing different filters.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] grid grid-cols-3 grid-rows-3 gap-2 p-4 bg-black">
  <ef-video id="source" src="https://assets.editframe.com/bars-n-tone.mp4" class="col-span-2 row-span-2 object-cover"></ef-video>

  <!-- Mirror to other grid cells with different effects -->
  <ef-surface target="source" class="object-cover opacity-60"></ef-surface>
  <ef-surface target="source" class="object-cover opacity-40 grayscale"></ef-surface>
  <ef-surface target="source" class="object-cover opacity-60 blur-sm"></ef-surface>
  <ef-surface target="source" class="object-cover opacity-40"></ef-surface>
  <ef-surface target="source" class="object-cover opacity-60 hue-rotate-90"></ef-surface>
  <ef-surface target="source" class="object-cover opacity-40 saturate-0"></ef-surface>
</ef-timegroup>
```
```tsx
import { Video, Surface } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full grid grid-cols-3 grid-rows-3 gap-2 p-4">
  <Video
    id="source"
    src="/assets/video.mp4"
    className="col-span-2 row-span-2 object-cover"
  />

  {/* Mirror to other grid cells */}
  <Surface for="source" className="object-cover opacity-60" />
  <Surface for="source" className="object-cover opacity-40 grayscale" />
  <Surface for="source" className="object-cover opacity-60 blur-sm" />
  <Surface for="source" className="object-cover opacity-40" />
  <Surface for="source" className="object-cover opacity-60 hue-rotate-90" />
  <Surface for="source" className="object-cover opacity-40 saturate-0" />
</Timegroup>
```

## Reflection Effect

Create mirror reflection with vertical flip and fade.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex flex-col items-center justify-center">
  <ef-video id="main-video" src="https://assets.editframe.com/bars-n-tone.mp4" class="w-1/2"></ef-video>

  <!-- Reflection below -->
  <ef-surface target="main-video" class="w-1/2 -scale-y-100 opacity-30 blur-sm" style="margin-top: 1rem;"></ef-surface>
</ef-timegroup>
```
```tsx
import { Video, Surface } from "@editframe/react";

<Timegroup mode="contain" className="absolute w-full h-full bg-black flex items-center justify-center">
  <Video
    id="main-video"
    src="/assets/clip.mp4"
    className="w-1/2"
  />

  {/* Reflection below */}
  <Surface
    for="main-video"
    className="w-1/2 scale-y-[-1] opacity-30 blur-sm"
    style={{ marginTop: '2rem' }}
  />
</Timegroup>
```

## Blurred Background Effect

Use enlarged, blurred surface behind main video for cinematic look.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <!-- Blurred background fill -->
  <ef-surface target="main-video" class="absolute inset-0 blur-3xl opacity-30 scale-110"></ef-surface>

  <!-- Main video centered -->
  <ef-video id="main-video" src="https://assets.editframe.com/bars-n-tone.mp4" class="absolute inset-0 w-2/3 h-2/3 m-auto object-contain z-10"></ef-video>
</ef-timegroup>
```
```tsx
import { Image, Surface } from "@editframe/react";

<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  {/* Blurred background */}
  <Surface
    for="main-image"
    className="absolute inset-0 blur-2xl opacity-30 scale-110"
  />

  {/* Main image */}
  <Image
    id="main-image"
    src="/assets/photo.jpg"
    className="absolute inset-0 w-2/3 h-2/3 m-auto object-contain z-10"
  />
</Timegroup>
```

## CSS Filter Effects

Apply different CSS filters to surfaces while keeping original unchanged.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] grid grid-cols-2 grid-rows-2 gap-4 p-4 bg-black">
  <!-- Original -->
  <ef-video id="filter-demo" src="https://assets.editframe.com/bars-n-tone.mp4" class="object-cover"></ef-video>

  <!-- Grayscale -->
  <ef-surface target="filter-demo" class="object-cover grayscale"></ef-surface>

  <!-- Hue rotate -->
  <ef-surface target="filter-demo" class="object-cover hue-rotate-180"></ef-surface>

  <!-- Blur + Brightness -->
  <ef-surface target="filter-demo" class="object-cover blur-md brightness-150"></ef-surface>
</ef-timegroup>
```

## Multiple Shadow Layers

Stack surfaces with offsets to create depth and shadow effects.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <!-- Shadow layers -->
  <ef-surface target="logo" class="absolute w-32 h-32 blur-md" style="transform: translate(-4px, -4px); filter: hue-rotate(180deg) blur(4px);"></ef-surface>
  <ef-surface target="logo" class="absolute w-32 h-32 blur-md" style="transform: translate(4px, 4px); filter: hue-rotate(90deg) blur(4px);"></ef-surface>

  <!-- Main image -->
  <ef-image id="logo" src="https://assets.editframe.com/editframe-logo.png" class="w-32 h-32 z-10"></ef-image>
</ef-timegroup>
```
```tsx
import { Image, Surface } from "@editframe/react";

<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  <Image
    id="logo"
    src="/assets/logo.png"
    className="absolute top-8 left-8 w-32 h-32"
  />

  {/* Blurred background */}
  <Surface
    for="logo"
    className="absolute inset-0 blur-3xl opacity-20 scale-150"
  />

  {/* Shadow effect */}
  <Surface
    for="logo"
    className="absolute top-10 left-10 w-32 h-32 blur-md opacity-50"
  />
</Timegroup>
```

## Animated Text Copies

```tsx
import { Text, Surface } from "@editframe/react";

<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full bg-black flex items-center justify-center">
  {/* Original */}
  <Text
    id="title"
    duration="5s"
    className="text-white text-6xl font-bold z-10"
  >
    IMPACT
  </Text>

  {/* Shadow layers */}
  <Surface
    for="title"
    className="absolute text-red-500 blur-sm"
    style={{ transform: 'translate(-4px, -4px)' }}
  />
  <Surface
    for="title"
    className="absolute text-blue-500 blur-sm"
    style={{ transform: 'translate(4px, 4px)' }}
  />
</Timegroup>
```

## Use Cases

- **Picture-in-picture** -- Show same source in preview corner
- **Video walls** -- Grid layouts with multiple mirrors
- **Reflections** -- Flip and fade for water/glass effects
- **Backgrounds** -- Blurred enlarged version behind content
- **Filter effects** -- Apply CSS filters to surfaces independently
- **Shadow layers** -- Stack offset surfaces for depth

## Important Notes

- The `for` prop must match the `id` of another element
- Surface elements mirror content in real-time
- Surfaces don't affect performance significantly
- Use transforms and filters for creative effects
