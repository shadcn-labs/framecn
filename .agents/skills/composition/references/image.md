---
description: "Static image element with configurable display duration, CSS positioning, and fit/fill/cover layout modes for compositions."
---


# ef-image

## Attributes

- **src** (string) (required) - URL, path, or data URI
- **duration** (timestring) - Display duration

# Image

Static image element.

## Import

```tsx
import { Image } from "@editframe/react";
```

## Asset Paths

`ef-image` and `<Image>` require `/assets/` path strings. The vite plugin intercepts these at `/@ef-image/` and resolves them relative to the plugin `root` directory.

**Correct:**
```html
<ef-image src="/assets/photo.jpg"></ef-image>
```
```tsx
<Image src="/assets/photo.jpg" />
```

**Wrong — do not use Vite module imports with `<Image>`:**
```tsx
// This will not display in preview or render
import photoUrl from "./assets/photo.jpg?url";
<Image src={photoUrl} />

// Use a plain <img> only for decorative/non-timeline images
// ef-image / <Image> must use /assets/ paths
```

Place files in `src/assets/` and reference them as `/assets/filename`. The vite plugin serves them; Vite bundling is not involved.

## Basic Usage

```html
<ef-image src="photo.jpg" duration="5s" class="size-full object-cover"></ef-image>
```
```tsx
<Image src="/assets/logo.png" alt="Company Logo" />
```

## Full Background

```tsx
<Image
  src="/assets/background.jpg"
  className="size-full object-cover"
  alt="Background"
/>
```

## Logo/Watermark Overlay

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
  <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full"></ef-video>
  <ef-image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%233b82f6' width='80' height='80' rx='8'/%3E%3C/svg%3E" duration="5s" class="absolute top-4 right-4 w-16 h-16 opacity-80"></ef-image>
</ef-timegroup>
```
```tsx
<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  <Image
    src="/assets/background.jpg"
    className="size-full object-cover"
  />
  <Image
    src="/assets/logo.png"
    className="absolute top-8 right-8 w-32 h-32"
  />
</Timegroup>
```

## Image Slideshow

```html live
<ef-timegroup mode="sequence" class="w-[720px] h-[480px] bg-black">
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full">
    <ef-image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='480'%3E%3Crect fill='%23ef4444' width='720' height='480'/%3E%3Ctext x='360' y='250' fill='white' font-size='48' text-anchor='middle'%3ESlide 1%3C/text%3E%3C/svg%3E" duration="3s" class="size-full object-contain"></ef-image>
  </ef-timegroup>
  <ef-timegroup mode="fixed" duration="3s" class="absolute w-full h-full">
    <ef-image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='480'%3E%3Crect fill='%233b82f6' width='720' height='480'/%3E%3Ctext x='360' y='250' fill='white' font-size='48' text-anchor='middle'%3ESlide 2%3C/text%3E%3C/svg%3E" duration="3s" class="size-full object-contain"></ef-image>
  </ef-timegroup>
</ef-timegroup>
```
```tsx
interface ImageSlide {
  id: string;
  src: string;
  duration: string;
  caption: string;
}

const slides: ImageSlide[] = [
  { id: "1", src: "/assets/slide1.jpg", duration: "3s", caption: "Slide 1" },
  { id: "2", src: "/assets/slide2.jpg", duration: "3s", caption: "Slide 2" },
  { id: "3", src: "/assets/slide3.jpg", duration: "3s", caption: "Slide 3" },
];

<Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
  {slides.map((slide) => (
    <Timegroup
      key={slide.id}
      mode="fixed"
      duration={slide.duration}
      className="absolute w-full h-full"
    >
      <Image src={slide.src} className="size-full object-cover" />
      <Text duration={slide.duration} className="absolute bottom-8 left-8 text-white text-3xl">
        {slide.caption}
      </Text>
    </Timegroup>
  ))}
</Timegroup>
```

## Data URI (Inline SVG)

```html
<ef-image
  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%233b82f6' width='80' height='80' rx='8'/%3E%3C/svg%3E"
  duration="5s"
  class="absolute top-4 right-4 w-16 h-16">
</ef-image>
```

## Object Fit

```tsx
{/* Cover - fills container, may crop */}
<Image src="/assets/photo.jpg" className="size-full object-cover" />

{/* Contain - fits within container, maintains aspect ratio */}
<Image src="/assets/photo.jpg" className="size-full object-contain" />

{/* Fill - stretches to fill */}
<Image src="/assets/photo.jpg" className="size-full object-fill" />
```

## Sized Images

```tsx
<Image src="/assets/icon.png" className="w-24 h-24" />
<Image src="/assets/banner.png" className="w-full h-32" />
<Image src="/assets/square.png" className="size-64" />
```

## With Effects

```tsx
{/* Blur */}
<Image src="/assets/bg.jpg" className="size-full object-cover blur-lg" />

{/* Opacity */}
<Image src="/assets/overlay.png" className="absolute inset-0 opacity-50" />

{/* Grayscale */}
<Image src="/assets/photo.jpg" className="size-full grayscale" />

{/* Rounded */}
<Image src="/assets/avatar.jpg" className="w-32 h-32 rounded-full" />
```

## Layered Images

```tsx
<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  {/* Background */}
  <Image
    src="/assets/bg.jpg"
    className="absolute inset-0 object-cover blur-lg opacity-20"
  />

  {/* Foreground */}
  <Image
    src="/assets/main.png"
    className="absolute inset-0 w-1/2 h-1/2 m-auto object-contain"
  />
</Timegroup>
```

## Animated Image Transitions

```tsx
import { Image } from "@editframe/react";
import { useTimingInfo } from "@editframe/react";

const FadingImage = ({ src }: { src: string }) => {
  const { ref, percentComplete } = useTimingInfo();

  return (
    <Timegroup ref={ref} mode="fixed" duration="3s" className="absolute w-full h-full">
      <Image
        src={src}
        className="size-full object-cover"
        style={{ opacity: percentComplete }}
      />
    </Timegroup>
  );
};
```
