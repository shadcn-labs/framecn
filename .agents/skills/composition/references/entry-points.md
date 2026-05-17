---
description: "Complete guide to Editframe package entry points and exports — when to import from @editframe/elements vs @editframe/react vs core."
---


# Package Entry Points




Editframe packages provide multiple entry points to support different environments: browser, server-side rendering (SSR), and Node.js. This guide explains what each entry point exports and when to use it.
`@editframe/react` provides three entry points to support different environments and use cases.

## @editframe/elements

The core Web Components package with four entry points:

### `.` (Main Entry)

**Path:** `@editframe/elements`

**Environment:** Browser only

**What's Included:**
- All Web Component class definitions (`<ef-timegroup>`, `<ef-video>`, etc.)
- DOM manipulation utilities
- Canvas and WebGL rendering code
- Video encoding (WebCodecs, FFmpeg.wasm)
- All browser-specific APIs

**Usage:**
```typescript
import { EFTimegroup } from "@editframe/elements";
import "@editframe/elements/styles.css";

const timegroup = document.createElement("ef-timegroup");
timegroup.setAttribute("mode", "sequence");
timegroup.setAttribute("duration", "10s");
```

**Do NOT use in:**
- Server-side rendering
- Node.js scripts
- Build tools (without DOM shims)

### `./server` (SSR Safe)

**Path:** `@editframe/elements/server`

**Environment:** Browser, Node.js, SSR

**What's Included:**
- TypeScript type definitions (zero runtime code)
- `getRenderInfo()` utility for extracting metadata from HTML
- Render option types (`RenderToVideoOptions`, `RenderProgress`, etc.)

**What's NOT Included:**
- Web Component definitions
- DOM APIs
- Canvas, WebGL, WebCodecs
- Any browser-specific code

**Usage:**
```typescript
// Safe in Node.js, SSR, and browser
import type { EFTimegroup, RenderToVideoOptions } from "@editframe/elements/server";
import { getRenderInfo } from "@editframe/elements/server";

const html = `<ef-timegroup mode="sequence" duration="10s">...</ef-timegroup>`;
const info = await getRenderInfo(html);
console.log(info.durationMs); // 10000
```

**Use when:**
- Building Node.js tools that need type information
- Server-side rendering with Next.js, Remix, etc.
- Static site generation
- Type-checking server code

### `./node` (Node.js Safe)

**Path:** `@editframe/elements/node`

**Environment:** Browser, Node.js, SSR

**What's Included:**
- Alias for `./server` (backward compatibility)
- Same exports as `./server`

**Usage:**
```typescript
import { getRenderInfo } from "@editframe/elements/node";
import type { EFTimegroup } from "@editframe/elements/node";
```

**Note:** Prefer `./server` for new code. This entry exists for backward compatibility with `@editframe/cli`.

### `./styles.css` (Component Styles)

**Path:** `@editframe/elements/styles.css`

**Environment:** Browser only

**What's Included:**
- Base styles for all Editframe elements
- Layout and positioning utilities
- Default visual appearance

**Usage:**
```typescript
// Vite, Webpack, etc.
import "@editframe/elements/styles.css";
```

```html
<!-- Plain HTML -->
<link rel="stylesheet" href="/node_modules/@editframe/elements/dist/style.css">
```

**Note:** Required for proper element rendering. Import once in your application root.

### `./theme.css` (Theme Variables)

**Path:** `@editframe/elements/theme.css`

**Environment:** Browser only

**What's Included:**
- CSS custom properties for theming
- Color palette variables
- Spacing and typography scales
- Component-specific theme tokens

**Usage:**
```typescript
import "@editframe/elements/theme.css";
```

**Customization:**
```css
/* Override theme variables */
:root {
  --ef-color-primary: #ff6b6b;
  --ef-color-background: #1a1a1a;
  --ef-spacing-unit: 8px;
}
```

**Note:** Optional. Only import if you're using GUI components (Workbench, Timeline, etc.) or want to customize the theme.

## @editframe/react

The React wrapper package with three entry points:

### `.` (Main Entry)

**Path:** `@editframe/react`

**Environment:** Browser only

**What's Included:**
- All React components (composition + GUI)
- All hooks (`useTimingInfo`, `usePlayback`, `usePanZoomTransform`, etc.)
- Browser-specific utilities

**Usage:**
```tsx
import {
  Timegroup,
  Video,
  Audio,
  Image,
  Text,
  Preview,
  Workbench,
  Timeline,
  useTimingInfo,
  usePlayback,
} from "@editframe/react";

export const VideoEditor = () => {
  const { currentTimeMs, durationMs } = useTimingInfo();

  return (
    <Workbench rendering={false}>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/intro.mp4" className="size-full" />
      </Timegroup>
    </Workbench>
  );
};
```
**Composition Components:**
- `Timegroup`, `Video`, `Audio`, `Image`
- `Text`, `TextSegment`
- `Captions` + sub-components
- `Surface`, `Waveform`, `PanZoom`

**GUI Components:**
- `Preview`, `Workbench`, `Controls`
- `Timeline`, `Filmstrip`, `TimelineRuler`
- `Scrubber`, `TimeDisplay`, `TrimHandles`
- `Canvas`, `TransformHandles`, `Hierarchy`
- `Play`, `Pause`, `TogglePlay`, `ToggleLoop`
- `OverlayLayer`, `OverlayItem`
- `FocusOverlay`, `FitScale`, `ActiveRootTemporal`
- `Dial`, `ResizableBox`

**Hooks:**
- `useTimingInfo`, `usePlayback`
- `usePanZoomTransform`, `useMediaInfo`
- All composition-related hooks

**Utilities:**
- `Configuration`, `TimelineRoot`
- Browser rendering utilities

### Basic Usage

```tsx
import {
  Timegroup,
  Video,
  Audio,
  Text,
  Preview,
  Workbench,
  useTimingInfo,
} from "@editframe/react";

export const VideoEditor = () => {
  const { currentTimeMs, durationMs } = useTimingInfo();

  return (
    <Workbench rendering={false}>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/intro.mp4" className="size-full" />
        <Audio src="/music.mp3" volume={0.3} />
        <Text className="absolute inset-0 flex items-center justify-center text-6xl">
          Hello World
        </Text>
      </Timegroup>
    </Workbench>
  );
};
```

### Do NOT Use In

- Server-side rendering (will crash)
- Node.js scripts
- React Server Components

**Do NOT use in:**
- Server-side rendering (will crash)
- Node.js scripts
- React Server Components

### `./server` (SSR Safe)

**Path:** `@editframe/react/server`

**Environment:** Browser, Node.js, SSR

**What's Included:**
- Composition React components only:
  - `Timegroup`, `Video`, `Audio`, `Image`, `Text`, `Captions`, `Surface`, `Waveform`, `PanZoom`
  - Caption sub-components: `CaptionsActiveWord`, `CaptionsBeforeActiveWord`, etc.
- All types from `@editframe/elements/server`

**What's NOT Included:**
- GUI components (`Preview`, `Workbench`, `Timeline`, `Controls`, etc.)
- Hooks (`useTimingInfo`, `usePlayback`, etc.)
- Browser-specific utilities

**Usage:**
```tsx
// Safe in SSR
import { Timegroup, Video, Audio } from "@editframe/react/server";

export const VideoComposition = () => {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      <Video src="/intro.mp4" className="size-full" />
      <Audio src="/music.mp3" volume={0.3} />
    </Timegroup>
  );
};
```

**Use when:**
- Server-side rendering (Next.js App Router, Remix loaders)
- Pre-rendering static HTML
- React Server Components
- Node.js rendering utilities

### `./r3f` (React Three Fiber)

**Path:** `@editframe/react/r3f`

**Environment:** Browser only

**What's Included:**
- `CompositionCanvas` - Main-thread R3F canvas with timeline sync
- `OffscreenCompositionCanvas` - Web worker R3F canvas
- `useCompositionTime()` - Hook to read timeline position in 3D scenes
- `renderOffscreen()` - Worker-side entry point for offscreen rendering
- Worker protocol types

**Usage:**
```tsx
import { Timegroup } from "@editframe/react";
import { CompositionCanvas, useCompositionTime } from "@editframe/react/r3f";

function RotatingBox() {
  const { timeMs } = useCompositionTime();
  return <box rotation={[0, timeMs / 1000, 0]} />;
}

export const Video = () => {
  return (
    <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
      <CompositionCanvas shadows>
        <RotatingBox />
      </CompositionCanvas>
    </Timegroup>
  );
};
```

**Use when:**
- Rendering 3D scenes with React Three Fiber
- Creating 3D motion graphics
- Integrating Three.js with Editframe timelines

**Do NOT use in:**
- Server-side rendering
- Browsers without WebGL support

## Entry Point Decision Tree

### For Browser Applications

```
Do you need 3D rendering?
├─ Yes → @editframe/react/r3f
└─ No
   ├─ Using React?
   │  └─ Yes → @editframe/react
   └─ No (vanilla JS/TS)
      └─ @editframe/elements
```
```
Do you need 3D rendering?
├─ Yes → @editframe/react/r3f
└─ No → @editframe/react
```

### For Server-Side Rendering

```
Do you need to render React components?
├─ Yes → @editframe/react/server
└─ No
   ├─ Need types only?
   │  └─ Yes → @editframe/elements/server (type imports)
   └─ Need getRenderInfo()?
      └─ Yes → @editframe/elements/server
```
```
Is this a Server Component / SSR function?
├─ Yes → @editframe/react/server
└─ No (Client Component)
   ├─ Need editor UI?
   │  └─ Yes → @editframe/react (with dynamic import)
   └─ Need composition only?
      └─ Yes → @editframe/react/server
```

### For Node.js Scripts

```
What do you need?
├─ Extract metadata from HTML → @editframe/elements/server (getRenderInfo)
├─ Type definitions → @editframe/elements/server (type imports)
└─ Render React to HTML → @editframe/react/server (with react-dom/server)
```

## Import Examples

### Browser App (React)

```tsx
// main.tsx
import "@editframe/elements/styles.css";
import "@editframe/elements/theme.css";

import {
  Timegroup,
  Video,
  Audio,
  Workbench,
  useTimingInfo,
} from "@editframe/react";
```

### Browser App (Vanilla)

```typescript
// main.ts
import "@editframe/elements/styles.css";
import { EFTimegroup, EFVideo } from "@editframe/elements";

const timegroup = document.createElement("ef-timegroup");
// ...
```

### Next.js App Router (Server Component)

```tsx
// app/video/page.tsx
import { Timegroup, Video } from "@editframe/react/server";

export default function VideoPage() {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      <Video src="/video.mp4" className="size-full" />
    </Timegroup>
  );
}
```

### Next.js Pages Router (SSR + Client)

```tsx
// pages/editor.tsx
import dynamic from "next/dynamic";
import { Timegroup, Video } from "@editframe/react/server";

const Workbench = dynamic(
  () => import("@editframe/react").then((m) => m.Workbench),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/video.mp4" className="size-full" />
      </Timegroup>
      <Workbench rendering={false} />
    </>
  );
}
```

### Node.js Tool

```typescript
// build.ts
import { getRenderInfo } from "@editframe/elements/server";
import type { RenderInfo } from "@editframe/elements/server";
import { readFileSync } from "fs";

const html = readFileSync("./composition.html", "utf-8");
const info: RenderInfo = await getRenderInfo(html);
console.log(`Duration: ${info.durationMs}ms`);
console.log(`Size: ${info.width}x${info.height}`);
```

### React + 3D Scene

```tsx
// Video.tsx
import { Timegroup } from "@editframe/react";
import { CompositionCanvas, useCompositionTime } from "@editframe/react/r3f";

function Scene() {
  const { timeMs } = useCompositionTime();
  return <box rotation={[0, timeMs / 1000, 0]} />;
}

export const Video = () => {
  return (
    <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
      <CompositionCanvas>
        <Scene />
      </CompositionCanvas>
    </Timegroup>
  );
};
```

### Browser App

```tsx
// main.tsx
import ReactDOM from "react-dom/client";
import {
  Configuration,
  TimelineRoot,
  Timegroup,
  Video,
  Workbench,
} from "@editframe/react";
import "@editframe/elements/styles.css";

const Video = () => (
  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
    <Video src="/video.mp4" className="size-full" />
  </Timegroup>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Configuration mediaEngine="local">
    <TimelineRoot id="root" component={Video} />
  </Configuration>
);
```

### SSR App (Next.js)

```tsx
// app/video/page.tsx (Server Component)
import { Timegroup, Video } from "@editframe/react/server";

export default function VideoPage() {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      <Video src="/video.mp4" className="size-full" />
    </Timegroup>
  );
}
```

### SSR App with Editor UI

```tsx
// pages/editor.tsx
import dynamic from "next/dynamic";
import { Timegroup, Video } from "@editframe/react/server";

const Workbench = dynamic(
  () => import("@editframe/react").then((m) => m.Workbench),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/video.mp4" className="size-full" />
      </Timegroup>
      <Workbench rendering={false} />
    </>
  );
}
```

### Node.js Pre-rendering

```typescript
// build.ts
import { renderToString } from "react-dom/server";
import { Timegroup, Video } from "@editframe/react/server";
import { writeFileSync } from "fs";

const composition = (
  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
    <Video src="/video.mp4" className="size-full" />
  </Timegroup>
);

const html = renderToString(composition);
writeFileSync("./dist/composition.html", html);
```

## Package.json Exports (Technical Reference)

### @editframe/elements

```json
{
  "name": "@editframe/elements",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./server": {
      "import": {
        "types": "./dist/server.d.ts",
        "default": "./dist/server.js"
      }
    },
    "./node": {
      "import": {
        "types": "./dist/node.d.ts",
        "default": "./dist/node.js"
      }
    },
    "./styles.css": "./dist/style.css",
    "./theme.css": "./dist/gui/ef-theme.css"
  }
}
```

### @editframe/react

```json
{
  "name": "@editframe/react",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./server": {
      "import": {
        "types": "./dist/server.d.ts",
        "default": "./dist/server.js"
      }
    },
    "./r3f": {
      "import": {
        "types": "./dist/r3f/index.d.ts",
        "default": "./dist/r3f/index.js"
      }
    }
  }
}
```

## Common Errors and Solutions

### Error: `customElements is not defined`

**Problem:** Imported main entry during SSR.

**Solution:**
```typescript
// ❌ Wrong
import { Timegroup } from "@editframe/react";

// ✅ Correct
import { Timegroup } from "@editframe/react/server";
```

### Error: `Cannot find module '@editframe/react/server'`

**Problem:** Outdated package version (pre-0.37.0).

**Solution:**
```bash
npm install @editframe/react@latest
```

### Error: Module not found in Vite/Webpack

**Problem:** Bundler doesn't recognize subpath exports.

**Solution:** Update bundler configuration or use newer versions (Vite 3+, Webpack 5+).

### Import CSS files in TypeScript

**Problem:** TypeScript complains about CSS imports.

**Solution:**
```typescript
// Add declaration file
// src/global.d.ts
declare module "*.css" {
  const content: string;
  export default content;
}
```

### Error: GUI component not found in `/server`

**Problem:** Trying to import GUI component from SSR entry.

**Solution:** Use dynamic import:
```tsx
const Workbench = dynamic(
  () => import("@editframe/react").then((m) => m.Workbench),
  { ssr: false }
);
```

### Error: `window is not defined`

**Problem:** Browser code running on server.

**Solution:** Check environment:
```tsx
if (typeof window !== "undefined") {
  // Browser-only code
}
```

## Comparison with @editframe/elements

`@editframe/react` wraps `@editframe/elements` Web Components:

| @editframe/elements | @editframe/react | Environment |
|---------------------|------------------|-------------|
| `.` | `.` | Browser |
| `./server` | `./server` | Browser, Node, SSR |
| `./node` | N/A | Browser, Node, SSR |
| N/A | `./r3f` | Browser |
| `./styles.css` | N/A | Browser |
| `./theme.css` | N/A | Browser |

Import CSS from `@editframe/elements`:
```tsx
import "@editframe/elements/styles.css";
import "@editframe/elements/theme.css"; // Optional
```

## Type-Only Imports

Always safe in any environment:

```typescript
import type {
  TimegroupProps,
  VideoProps,
  RenderToVideoOptions,
} from "@editframe/react/server";

function createVideoProps(): VideoProps {
  return {
    src: "/video.mp4",
    className: "size-full",
  };
}
```

## Related

- [server-rendering.md](references/server-rendering.md) - SSR integration guide
- [r3f.md](references/r3f.md) - React Three Fiber integration
- [configuration.md](references/configuration.md) - Configuration component
- [getting-started.md](references/getting-started.md) - Installation and setup
