---
description: "Available Editframe project templates — plain HTML, React, and more — and the file structure each template provides."
---


# Templates

Available templates when running `npm create @editframe`.

## html

Minimal HTML/CSS/JavaScript starter. Best for web component compositions.

```
my-project/
├── index.html          # Composition markup
├── src/
│   ├── index.js        # Imports Editframe elements
│   ├── styles.css      # Tailwind CSS
│   └── assets/         # Media files
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

**Dependencies:** `@editframe/elements`, `@editframe/cli`, `@editframe/vite-plugin`, `tailwindcss`, `vite`

## react

Minimal React/TypeScript starter. Best for React-based compositions.

```
my-project/
├── index.html
├── src/
│   ├── main.tsx        # Entry point with TimelineRoot
│   ├── Video.tsx       # Composition component
│   ├── styles.css      # Tailwind CSS
│   └── assets/         # Media files
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

**Dependencies:** `@editframe/react`, `@editframe/cli`, `@editframe/vite-plugin`, `react`, `tailwindcss`, `vite`

## simple-demo

HTML demo with sample assets and CSS animations. Good starting point to see elements in action.

## card-poetry

HTML demo with card assets (images, audio, captions), waveform visualization, and keyframe animations.

## react-demo

React version of the card-poetry demo using `@editframe/react` components and the `useTimingInfo` hook.

## animejs

AnimeJS integration demo showing text stagger, timeline animation, WAAPI, and SVG motion paths integrated with Editframe's timeline via `addFrameTask`.

## Common Structure

All templates include:

- **Vite** build system with `@editframe/vite-plugin`
- **Tailwind CSS** for styling
- **`npm start`** runs `editframe preview` for live development
- **`src/assets/`** directory for media files (video, audio, images)
- **`.gitignore`** configured for Node.js projects
