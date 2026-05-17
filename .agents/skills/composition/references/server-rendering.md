---
description: "Use SSR-safe imports and integrate Editframe with Next.js, Remix, and other server-rendered frameworks without hydration errors."
---


# Server-Side Rendering


## Functions

- **getRenderInfo(html: string): Promise<RenderInfo>** - Extract render metadata from HTML composition (Node.js safe)
  - Returns: RenderInfo


Editframe packages provide SSR-safe entry points for server-side rendering with Next.js, Remix, and other React frameworks. Import from `@editframe/elements/server` or `@editframe/react/server` to access types and components without triggering browser-specific code.
Editframe provides an SSR-safe entry point for server-side rendering with Next.js, Remix, and other React frameworks.

## Problem: Browser APIs in SSR

The main package entries (`@editframe/elements` and `@editframe/react`) import browser-specific code at the module level:
- Web Components (`customElements.define()`)
- DOM APIs (`HTMLElement`, `document`, `window`)
- Canvas, WebGL, WebCodecs APIs
The main entry point (`@editframe/react`) imports browser-specific code at the module level:
- Web Components (`customElements.define()`)
- DOM APIs (`document`, `window`)
- Browser-only hooks
- Canvas, WebGL, WebCodecs APIs

This code **will crash** if imported during server-side rendering because Node.js doesn't provide these APIs.

## Solution: SSR-Safe Entry Points

Use the `/server` subpath exports that only include types and SSR-safe utilities.

## @editframe/elements/server

Import **types only** and the `getRenderInfo` utility:

```typescript
import type {
  EFTimegroup,
  EFMedia,
  RenderToVideoOptions,
  RenderProgress,
} from "@editframe/elements/server";

import { getRenderInfo } from "@editframe/elements/server";
```

### What's Included

- **Types:** TypeScript type definitions for all elements (zero runtime code)
- **getRenderInfo:** Function to extract render metadata from HTML (Node.js safe)

### What's NOT Included

- Web Component class definitions
- DOM manipulation utilities
- Browser-specific rendering code
- Canvas or WebGL APIs

### getRenderInfo Example

```typescript
// server.ts (Node.js safe)
import { getRenderInfo } from "@editframe/elements/server";

const html = `
  <ef-timegroup mode="sequence" duration="30s">
    <ef-video src="intro.mp4"></ef-video>
    <ef-video src="outro.mp4"></ef-video>
  </ef-timegroup>
`;

const info = await getRenderInfo(html);
console.log(info.durationMs); // 30000
console.log(info.width); // 1920
console.log(info.height); // 1080
```

## @editframe/react/server

Import **React components** that render to HTML without triggering browser APIs:

```typescript
import {
  Timegroup,
  Video,
  Audio,
  Image,
  Text,
  Captions,
  Surface,
  Waveform,
  PanZoom,
} from "@editframe/react/server";
```

### What's Included

- All composition React components (render to `<ef-*>` tags)
- Caption styling sub-components
- All types from `@editframe/elements/server`

### What's NOT Included

- GUI components (Preview, Workbench, Controls, Timeline, etc.)
- Hooks that depend on browser APIs (`useTimingInfo`, `usePlayback`, etc.)
- Browser rendering utilities
Import from `@editframe/react/server` to access composition components without triggering browser code:

```tsx
import {
  Timegroup,
  Video,
  Audio,
  Image,
  Text,
  Captions,
  Surface,
  Waveform,
  PanZoom,
} from "@editframe/react/server";
```

## What's Included

**Composition Components:**
- `Timegroup` - Timeline container
- `Video`, `Audio`, `Image` - Media elements
- `Text`, `TextSegment` - Text rendering
- `Captions` + sub-components - Caption styling
- `Surface` - Element mirroring
- `Waveform` - Audio visualization
- `PanZoom` - Pan/zoom container

**Types:**
- All render option types (`RenderToVideoOptions`, `RenderProgress`, etc.)
- All component prop types

## What's NOT Included

**GUI Components:**
- `Preview`, `Workbench`, `Timeline`, `Controls`
- `Scrubber`, `Filmstrip`, `TimelineRuler`
- `Canvas`, `TransformHandles`, `Hierarchy`
- Any editor/preview UI components

**Hooks:**
- `useTimingInfo`, `usePlayback`, `useCompositionTime`
- `usePanZoomTransform`, `useMediaInfo`
- All browser-dependent hooks

**Browser Utilities:**
- `renderToVideo`, `createRenderClone`
- Browser-specific helpers

## Next.js Integration

### App Router (React Server Components)

```typescript
// app/video/[id]/page.tsx (Server Component)
import { Timegroup, Video, Audio } from "@editframe/react/server";

export default function VideoPage({ params }: { params: { id: string } }) {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      <Video src={`/api/videos/${params.id}/intro.mp4`} className="size-full" />
      <Audio src={`/api/videos/${params.id}/music.mp3`} volume={0.3} />
    </Timegroup>
  );
}
```
Import from `/server` in Server Components:

```tsx
// app/video/[id]/page.tsx (Server Component)
import { Timegroup, Video, Audio } from "@editframe/react/server";

interface Props {
  params: { id: string };
}

export default function VideoPage({ params }: Props) {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px] bg-black">
      <Video src={`/api/videos/${params.id}/intro.mp4`} className="size-full" />
      <Audio src={`/api/videos/${params.id}/music.mp3`} volume={0.3} />
    </Timegroup>
  );
}
```

### Pages Router (SSR)

Use dynamic imports with `ssr: false` for browser-only code:

```typescript
// pages/editor.tsx
import dynamic from "next/dynamic";

// Safe: imports from /server
import { Timegroup, Video } from "@editframe/react/server";

// Unsafe: imports from main entry, requires client-side only
const Preview = dynamic(
  () => import("@editframe/react").then((mod) => mod.Preview),
  { ssr: false }
);

const Workbench = dynamic(
  () => import("@editframe/react").then((mod) => mod.Workbench),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <div>
      {/* This renders on server */}
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/videos/intro.mp4" className="size-full" />
      </Timegroup>

      {/* This only renders on client */}
      <Workbench rendering={false} />
    </div>
  );
}
```
```tsx
// pages/video/[id].tsx
import type { GetServerSideProps } from "next";
import { Timegroup, Video } from "@editframe/react/server";

interface Props {
  videoUrl: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const videoUrl = await fetchVideoUrl(params?.id);
  return { props: { videoUrl } };
};

export default function VideoPage({ videoUrl }: Props) {
  return (
    <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
      <Video src={videoUrl} className="size-full" />
    </Timegroup>
  );
}
```

### Client-Only Components

For editor UI components, use dynamic imports with `ssr: false`:

```tsx
// pages/editor.tsx
import dynamic from "next/dynamic";
import { Timegroup, Video } from "@editframe/react/server";

// Safe: SSR-safe components
const composition = (
  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
    <Video src="/video.mp4" className="size-full" />
  </Timegroup>
);

// Safe: Client-only dynamic import
const Workbench = dynamic(
  () => import("@editframe/react").then((mod) => mod.Workbench),
  { ssr: false }
);

const Preview = dynamic(
  () => import("@editframe/react").then((mod) => mod.Preview),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <div>
      {composition}
      <Workbench rendering={false} />
    </div>
  );
}
```

## Remix Integration

Use the `/server` entry for loaders and actions:

```typescript
// routes/video.$id.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Timegroup, Video, Audio } from "@editframe/react/server";

export async function loader({ params }: LoaderFunctionArgs) {
  const videoData = await fetchVideoData(params.id);
  return json({ videoData });
}

export default function VideoRoute() {
  const { videoData } = useLoaderData<typeof loader>();

  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      <Video src={videoData.introUrl} className="size-full" />
      <Audio src={videoData.musicUrl} volume={0.3} />
    </Timegroup>
  );
}
```

For client-only components, use `ClientOnly`:

```typescript
import { ClientOnly } from "remix-utils/client-only";

export default function EditorRoute() {
  return (
    <ClientOnly>
      {() => {
        // Import happens only on client
        const { Workbench } = require("@editframe/react");
        return <Workbench rendering={false} />;
      }}
    </ClientOnly>
  );
}
```
import { Timegroup, Video } from "@editframe/react/server";

export default function EditorRoute() {
  return (
    <>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/video.mp4" className="size-full" />
      </Timegroup>

      <ClientOnly>
        {() => {
          const { Workbench } = require("@editframe/react");
          return <Workbench rendering={false} />;
        }}
      </ClientOnly>
    </>
  );
}
```

## Pre-rendering Static HTML

Generate static HTML for compositions:

```typescript
// build.ts (Node.js)
import { renderToString } from "react-dom/server";
import { Timegroup, Video, Text } from "@editframe/react/server";
import { writeFileSync } from "fs";

const composition = (
  <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px]">
    <Video src="/assets/background.mp4" className="size-full" />
    <Text className="absolute inset-0 flex items-center justify-center text-6xl">
      Hello World
    </Text>
  </Timegroup>
);

const html = renderToString(composition);
writeFileSync("./dist/composition.html", html);
```

This HTML can then be hydrated on the client with the full browser-side code.

```tsx
// client.tsx
import { hydrateRoot } from "react-dom/client";
import { Timegroup, Video, Text } from "@editframe/react"; // Full browser version

hydrateRoot(
  document.getElementById("root")!,
  <Timegroup mode="fixed" duration="10s" className="w-[1920px] h-[1080px] bg-black">
    <Video src="/assets/background.mp4" className="size-full object-cover" />
    <Text className="absolute inset-0 flex items-center justify-center text-6xl text-white">
      Hello World
    </Text>
  </Timegroup>
);
```

## Type Imports

When you only need types (not runtime code), use type-only imports for maximum safety:

```typescript
// Safe in any environment (no runtime code)
import type { EFTimegroup, RenderToVideoOptions } from "@editframe/elements/server";
import type { TimegroupProps } from "@editframe/react/server";

function createRenderConfig(): RenderToVideoOptions {
  return {
    fps: 30,
    codec: "h264",
    scale: 1,
  };
}
```

## Type-Only Imports

```typescript
// Safe in any environment (no runtime code)
import type { TimegroupProps, VideoProps, RenderToVideoOptions } from "@editframe/react/server";

function createVideoConfig(): VideoProps {
  return {
    src: "/video.mp4",
    className: "size-full",
  };
}

function createRenderOptions(): RenderToVideoOptions {
  return {
    fps: 30,
    codec: "h264",
    scale: 1,
  };
}
```

## Environment-Based Imports

Dynamically import based on environment:

```tsx
// VideoEditor.tsx
import type { FC } from "react";

let Timegroup: any;
let Video: any;
let Workbench: any;

if (typeof window === "undefined") {
  // Server: import from /server
  const server = await import("@editframe/react/server");
  Timegroup = server.Timegroup;
  Video = server.Video;
} else {
  // Browser: import from main entry
  const browser = await import("@editframe/react");
  Timegroup = browser.Timegroup;
  Video = browser.Video;
  Workbench = browser.Workbench;
}

export const VideoEditor: FC = () => {
  return (
    <>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        <Video src="/video.mp4" className="size-full" />
      </Timegroup>
      {typeof window !== "undefined" && <Workbench rendering={false} />}
    </>
  );
};
```

## Typical Setup

### Development (main.tsx)

```tsx
// src/main.tsx (browser only)
import ReactDOM from "react-dom/client";
import { Configuration, TimelineRoot } from "@editframe/react";
import { Video } from "./Video";
import "@editframe/elements/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Configuration mediaEngine="local">
    <TimelineRoot id="root" component={Video} />
  </Configuration>
);
```

### Video Composition (Video.tsx)

```tsx
// src/Video.tsx (SSR-safe)
import { Timegroup, Video, Audio, Text } from "@editframe/react/server";

export const Video = () => {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px] bg-black">
      <Timegroup mode="fixed" duration="5s" className="absolute inset-0">
        <Video src="/assets/intro.mp4" className="size-full object-cover" />
      </Timegroup>
      <Timegroup mode="fixed" duration="10s" className="absolute inset-0">
        <Video src="/assets/main.mp4" className="size-full object-cover" />
        <Audio src="/assets/music.mp3" volume={0.3} />
        <Text className="absolute bottom-0 left-0 p-8 text-4xl text-white">
          Hello World
        </Text>
      </Timegroup>
    </Timegroup>
  );
};
```

This pattern works in:
- Browser (with `@editframe/react`)
- SSR (with `@editframe/react/server`)
- Static generation (with `@editframe/react/server`)

## Common Patterns

### Hydration After SSR

**Server:**
```typescript
// server.tsx
import { renderToString } from "react-dom/server";
import { Timegroup, Video } from "@editframe/react/server";

const html = renderToString(
  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
    <Video src="/video.mp4" className="size-full" />
  </Timegroup>
);

// Send html to client
```

**Client:**
```typescript
// client.tsx
import { hydrateRoot } from "react-dom/client";
import { Timegroup, Video } from "@editframe/react"; // Full browser version

hydrateRoot(
  document.getElementById("root"),
  <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
    <Video src="/video.mp4" className="size-full" />
  </Timegroup>
);
```

### Conditional Imports

```typescript
// utils.ts
export async function loadEditorComponents() {
  if (typeof window === "undefined") {
    throw new Error("Editor components require browser environment");
  }

  const { Workbench, Preview, Timeline } = await import("@editframe/react");
  return { Workbench, Preview, Timeline };
}
```

## Troubleshooting

### Error: `customElements is not defined`

**Problem:** Importing from main entry point during SSR.

**Solution:** Use `/server` entry point:
```typescript
// ❌ Wrong
import { Timegroup } from "@editframe/react";

// ✅ Correct
import { Timegroup } from "@editframe/react/server";
```

### Error: `HTMLElement is not defined`

**Problem:** Web Component class definition loaded during SSR.

**Solution:** Use dynamic import with `ssr: false` or conditional import.

### Error: `document is not defined`

**Problem:** Browser-specific code running on server.

**Solution:** Check imports and ensure all browser code is client-only.

### Error: `Cannot find module '@editframe/react/server'`

**Problem:** Outdated package version.

**Solution:**
```bash
npm install @editframe/react@latest
```

Ensure version is 0.37.0 or higher.

### Error: `window is not defined`

**Problem:** Browser code running on server.

**Solution:** Use dynamic import with `ssr: false` or check environment:
```tsx
if (typeof window !== "undefined") {
  // Browser-only code
}
```

### Component renders but doesn't work

**Problem:** Hydration mismatch between server and client.

**Solution:** Ensure identical imports on both sides or use client-only rendering:
```tsx
import dynamic from "next/dynamic";

const ClientComponent = dynamic(() => import("./Component"), {
  ssr: false,
});
```

## What About GUI Components?

GUI components like `Workbench`, `Preview`, and `Timeline` are **never** SSR-safe because they:
- Depend on browser APIs (`ResizeObserver`, `IntersectionObserver`, etc.)
- Use Web Components internally
- Require canvas and WebGL contexts
- Need interactive event handling

Always use dynamic imports for GUI components:

```tsx
const Workbench = dynamic(
  () => import("@editframe/react").then((m) => m.Workbench),
  { ssr: false }
);
```

## Package Structure

Both packages expose three entry points:

### @editframe/elements
```json
{
  "exports": {
    ".": "./dist/index.js",          // Browser: Full package (Web Components, DOM APIs)
    "./server": "./dist/server.js",  // SSR: Types + getRenderInfo only
    "./node": "./dist/node.js"       // Node: Same as /server (backward compat)
  }
}
```

### @editframe/react
```json
{
  "exports": {
    ".": "./dist/index.js",          // Browser: Full package (all components + hooks)
    "./server": "./dist/server.js",  // SSR: Composition components only
    "./r3f": "./dist/r3f/index.js"   // Browser: React Three Fiber integration
  }
}
```

## Related

- [entry-points.md](references/entry-points.md) - Complete guide to package entry points
- [r3f.md](references/r3f.md) - React Three Fiber integration
- [getting-started.md](references/getting-started.md) - Installation and setup
- [configuration.md](references/configuration.md) - Configuration component
