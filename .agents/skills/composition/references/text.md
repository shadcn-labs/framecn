---
description: "Animated text element with automatic character, word, and line splitting for per-unit CSS animation and stagger effects."
---


# ef-text

## Attributes

- **split** (string, default: word) - Split mode
- **stagger** (timestring) - Delay between segments (e.g., "100ms")
- **easing** (string, default: linear) - Easing function
- **duration** (timestring) - Total duration

# Text

Animated text with character/word/line splitting.

## Import

```tsx
import { Text, TextSegment } from "@editframe/react";
```

## Basic Usage

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text duration="5s" class="text-white text-2xl">Static text</ef-text>
</ef-timegroup>
```
```tsx
<Text duration="5s" className="text-white text-4xl">
  Hello World
</Text>
```

## Styled Text

```tsx
<Text
  duration="3s"
  className="text-white text-6xl font-bold text-center"
>
  Welcome to Editframe
</Text>
```

## Positioned Text

```tsx
<Timegroup mode="fixed" duration="5s" className="absolute w-full h-full">
  <Text
    duration="5s"
    className="absolute top-8 left-8 text-white text-3xl"
  >
    Top Left
  </Text>

  <Text
    duration="5s"
    className="absolute bottom-8 right-8 text-white text-2xl"
  >
    Bottom Right
  </Text>
</Timegroup>
```

## Word Split with Stagger

Use `split="word"` to animate each word independently with stagger delays.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text split="word" stagger="100ms" duration="4s" class="text-white text-3xl">
    <template>
      <ef-text-segment class="fade-in"></ef-text-segment>
    </template>
    Each word appears with timing
  </ef-text>

  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in {
      animation: fadeIn 0.5s ease-out forwards;
      animation-delay: var(--ef-stagger-offset);
    }
  </style>
</ef-timegroup>
```
Control individual words with `TextSegment`:

```tsx
<Text duration="3s" className="text-white text-4xl">
  <TextSegment className="text-red-500">Red</TextSegment>
  {" "}
  <TextSegment className="text-blue-500">Blue</TextSegment>
  {" "}
  <TextSegment className="text-green-500">Green</TextSegment>
</Text>
```

## Character-by-Character Animation

Use `split="char"` for character-level effects.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text split="char" stagger="30ms" duration="3s" class="text-yellow-400 text-5xl font-bold">
    <template>
      <ef-text-segment class="char-slide"></ef-text-segment>
    </template>
    HEADLINES
  </ef-text>

  <style>
    @keyframes charSlide {
      from { opacity: 0; transform: translateX(-20px) rotate(-5deg); }
      to { opacity: 1; transform: translateX(0) rotate(0); }
    }

    .char-slide {
      animation: charSlide 0.3s ease-out forwards;
      animation-delay: var(--ef-stagger-offset);
    }
  </style>
</ef-timegroup>
```

## Line-by-Line Reveal

Use `split="line"` for line-based animations.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text split="line" stagger="800ms" duration="5s" class="text-white text-2xl text-center">
    <template>
      <ef-text-segment class="line-reveal"></ef-text-segment>
    </template>
    First line appears
    Then the second line
    Finally the third line
  </ef-text>

  <style>
    @keyframes lineReveal {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .line-reveal {
      animation: lineReveal 0.6s ease-out forwards;
      animation-delay: var(--ef-stagger-offset);
      display: block;
    }
  </style>
</ef-timegroup>
```

## Custom Animations with registerAnimations()

Use `registerAnimations()` to define reusable animation styles globally.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text split="word" stagger="80ms" duration="4s" class="text-cyan-400 text-4xl font-bold">
    <template>
      <ef-text-segment class="bounce-in"></ef-text-segment>
    </template>
    BOUNCE EFFECT
  </ef-text>

  <script>
    customElements.whenDefined('ef-text-segment').then(() => {
      const EFTextSegment = customElements.get('ef-text-segment');
      EFTextSegment.registerAnimations('bounce-demo', `
        @keyframes bounceIn {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          animation-delay: var(--ef-stagger-offset);
        }
      `);
    });
  </script>
</ef-timegroup>
```

## Easing Options

Different easing functions create different animation feels.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex flex-col items-center justify-center gap-8">
  <!-- Linear easing -->
  <ef-text split="word" stagger="60ms" easing="linear" duration="3s" class="text-white text-xl">
    <template>
      <ef-text-segment class="scale-in"></ef-text-segment>
    </template>
    Linear easing (constant speed)
  </ef-text>

  <!-- Ease-out easing -->
  <ef-text split="word" stagger="60ms" easing="ease-out" duration="3s" class="text-green-400 text-xl">
    <template>
      <ef-text-segment class="scale-in"></ef-text-segment>
    </template>
    Ease-out (starts fast ends slow)
  </ef-text>

  <!-- Cubic-bezier easing -->
  <ef-text split="word" stagger="60ms" duration="3s" class="text-blue-400 text-xl">
    <template>
      <ef-text-segment class="scale-bounce"></ef-text-segment>
    </template>
    Custom cubic-bezier (bouncy)
  </ef-text>

  <style>
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0); }
      to { opacity: 1; transform: scale(1); }
    }

    .scale-in {
      animation: scaleIn 0.4s forwards;
      animation-delay: var(--ef-stagger-offset);
    }

    .scale-bounce {
      animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      animation-delay: var(--ef-stagger-offset);
    }
  </style>
</ef-timegroup>
```

## StaggerMs Timing Variations

Control the delay between segments to create different rhythms.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex flex-col items-center justify-center gap-10">
  <!-- Fast stagger -->
  <ef-text split="word" stagger="40ms" duration="3s" class="text-white text-2xl">
    <template>
      <ef-text-segment class="pop-in"></ef-text-segment>
    </template>
    Fast stagger feels energetic
  </ef-text>

  <!-- Medium stagger -->
  <ef-text split="word" stagger="120ms" duration="4s" class="text-yellow-400 text-2xl">
    <template>
      <ef-text-segment class="pop-in"></ef-text-segment>
    </template>
    Medium stagger is balanced
  </ef-text>

  <!-- Slow stagger -->
  <ef-text split="word" stagger="250ms" duration="5s" class="text-pink-400 text-2xl">
    <template>
      <ef-text-segment class="pop-in"></ef-text-segment>
    </template>
    Slow stagger adds drama
  </ef-text>

  <style>
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.5) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .pop-in {
      animation: popIn 0.4s ease-out forwards;
      animation-delay: var(--ef-stagger-offset);
    }
  </style>
</ef-timegroup>
```

## Using --ef-seed for Random Variation

The `--ef-seed` CSS variable provides deterministic randomness per segment.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text split="word" stagger="100ms" duration="4s" class="text-white text-3xl">
    <template>
      <ef-text-segment class="random-slide"></ef-text-segment>
    </template>
    Words slide from random angles
  </ef-text>

  <style>
    @keyframes randomSlide {
      from {
        opacity: 0;
        transform:
          translateX(calc(var(--ef-seed) * 80px - 40px))
          translateY(calc(var(--ef-seed) * 60px - 30px))
          rotate(calc(var(--ef-seed) * 60deg - 30deg));
      }
      to {
        opacity: 1;
        transform: translateX(0) translateY(0) rotate(0);
      }
    }

    .random-slide {
      animation: randomSlide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: var(--ef-stagger-offset);
    }
  </style>
</ef-timegroup>
```

## Lower Third

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black relative">
  <ef-text duration="4s" class="absolute bottom-16 left-4 bg-blue-600/90 text-white px-4 py-2 rounded-md text-sm font-semibold">
    Scene Label
  </ef-text>
</ef-timegroup>
```

## Multiple Segments Per Word

Create multiple segments for each text unit by using multiple `ef-text-segment` elements in the template.

```html live
<ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black flex items-center justify-center">
  <ef-text split="word" stagger="120ms" duration="4s" class="text-white text-3xl">
    <template>
      <!-- Shadow segment behind -->
      <ef-text-segment class="segment-shadow"></ef-text-segment>
      <!-- Main segment on top -->
      <ef-text-segment class="segment-main"></ef-text-segment>
    </template>
    Layered shadow effect
  </ef-text>

  <style>
    .segment-shadow {
      position: absolute;
      color: #3b82f6;
      filter: blur(4px);
      animation: shadowSlide 0.6s ease-out forwards;
      animation-delay: var(--ef-stagger-offset);
    }

    .segment-main {
      position: relative;
      animation: mainSlide 0.6s ease-out forwards;
      animation-delay: var(--ef-stagger-offset);
    }

    @keyframes shadowSlide {
      from { opacity: 0; transform: translate(-20px, 10px); }
      to { opacity: 0.6; transform: translate(4px, 4px); }
    }

    @keyframes mainSlide {
      from { opacity: 0; transform: translate(-20px, 0); }
      to { opacity: 1; transform: translate(0, 0); }
    }
  </style>
</ef-timegroup>
```

## Unregistering Animations

Remove previously registered animations when no longer needed.

```javascript
const EFTextSegment = customElements.get('ef-text-segment');
EFTextSegment.unregisterAnimations('bounce');
```

## ef-text-segment Reference

`ef-text-segment` elements are automatically created by `ef-text` when using split modes. Each segment represents a word, character, or line and can be styled and animated independently.

### CSS Variables

| Variable | Type | Description |
|----------|------|-------------|
| `--ef-index` | number | Segment index (0, 1, 2, ...) |
| `--ef-stagger-offset` | time | Calculated stagger delay (e.g., "0ms", "100ms") |
| `--ef-seed` | number | Deterministic random (0-1) based on index |

### Technical Notes

- Segments are automatically created by `ef-text` when using split modes
- Segments inherit animation properties from parent `ef-text` element
- `registerAnimations()` uses adopted stylesheets for efficient global sharing
- Non-whitespace segments automatically become `inline-block` when animated to enable transforms
- Whitespace segments remain `inline` to preserve text flow

## Dynamic Text

```tsx
interface TitleData {
  text: string;
  duration: string;
  className: string;
}

const titles: TitleData[] = [
  { text: "Scene 1", duration: "3s", className: "text-red-500" },
  { text: "Scene 2", duration: "3s", className: "text-blue-500" },
  { text: "Scene 3", duration: "3s", className: "text-green-500" },
];

<Timegroup mode="sequence" className="w-[800px] h-[500px]">
  {titles.map((title, i) => (
    <Timegroup key={i} mode="fixed" duration={title.duration} className="absolute w-full h-full flex items-center justify-center">
      <Text duration={title.duration} className={`text-4xl ${title.className}`}>
        {title.text}
      </Text>
    </Timegroup>
  ))}
</Timegroup>
```

## Text with Background

```tsx
<Text
  duration="5s"
  className="bg-black/50 text-white text-3xl px-4 py-2 rounded"
>
  Overlay Text
</Text>
```

## Multi-line Text

```tsx
<Text
  duration="5s"
  className="text-white text-2xl text-center max-w-[600px]"
>
  This is a longer text that will wrap across multiple lines
  when it reaches the maximum width.
</Text>
```

## Animated Text with useTimingInfo

```tsx
import { Text } from "@editframe/react";
import { useTimingInfo } from "@editframe/react";

const FadingText = ({ children }: { children: React.ReactNode }) => {
  const { ref, percentComplete } = useTimingInfo();

  return (
    <Text
      ref={ref}
      duration="5s"
      className="text-white text-4xl"
      style={{ opacity: percentComplete }}
    >
      {children}
    </Text>
  );
};
```

## Register Custom Animations

Use `TextSegment.registerAnimations()` to define animations shared across all segments:

```tsx
import { TextSegment } from "@editframe/react";

TextSegment.registerAnimations("customAnimations", `
  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .slide-in { animation: slideIn 0.5s ease-out; }
`);

const AnimatedText = () => (
  <Text duration="5s" className="text-white text-4xl">
    <TextSegment className="slide-in inline-block">Slides</TextSegment>
    {" "}
    <TextSegment className="bounce-in inline-block">Bounces</TextSegment>
  </Text>
);
```

Unregister animations when no longer needed:

```tsx
import { useEffect } from "react";
import { TextSegment } from "@editframe/react";

const MyComponent = () => {
  useEffect(() => {
    TextSegment.registerAnimations("myAnimations", `/* styles */`);
    return () => {
      TextSegment.unregisterAnimations("myAnimations");
    };
  }, []);

  return (/* ... */);
};
```

## TextSegment Reference

Each TextSegment has access to CSS variables for advanced animations:

| Variable | Type | Description |
|----------|------|-------------|
| `--ef-index` | number | Segment index (0, 1, 2, ...) |
| `--ef-stagger-offset` | time | Calculated stagger delay |
| `--ef-seed` | number | Deterministic random (0-1) based on index |

- TextSegment requires a parent `Text` component
- Use `inline-block` display for transform animations to work correctly
- Animation styles are shared globally across all TextSegment instances
- Each segment's `--ef-seed` value is deterministic based on its index
