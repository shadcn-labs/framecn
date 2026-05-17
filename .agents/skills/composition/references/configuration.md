---
description: Configuration wrapper for selecting media engine (ffmpeg or native) and setting API credentials for Editframe compositions.
---


# ef-configuration

## Attributes

- **api-host** (string) - Override API host for asset resolution
- **signing-url** (string, default: /@ef-sign-url) - URL endpoint for signed URL generation
- **media-engine** (string, default: cloud) - Media engine selection

# Configuration

Configuration wrapper for media engine selection and API settings.

## Import

```tsx
import { Configuration } from "@editframe/react";
```

## Basic Usage

Wrap your composition to configure media handling:

```html
<ef-configuration media-engine="cloud">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```
```tsx
// Video.tsx
import { Timegroup } from "@editframe/react";

export const Video = () => {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      {/* Your composition */}
    </Timegroup>
  );
};

// main.tsx
import ReactDOM from "react-dom/client";
import { Configuration, TimelineRoot } from "@editframe/react";
import { Video } from "./Video";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Configuration apiHost="https://api.example.com" mediaEngine="local">
    <TimelineRoot id="root" component={Video} />
  </Configuration>
);
```

## Media Engine Options

The `media-engine` attribute controls how media files are loaded and processed.
Controls how media files are loaded and processed. Three options are available:

### Cloud Mode (Default)

Automatically selects the appropriate engine based on URL:
- Remote URLs (`http://`, `https://`) use JIT transcoding
- Local paths use asset engine

```html live
<ef-configuration media-engine="cloud">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px] bg-black">
    <ef-video src="https://assets.editframe.com/bars-n-tone.mp4" class="size-full object-contain"></ef-video>
  </ef-timegroup>
</ef-configuration>
```

**Use when:** Building production applications with mixed local and remote assets.
```tsx
<Configuration mediaEngine="cloud">
  <Timegroup mode="sequence">
    <Video src="https://cdn.example.com/video.mp4" /> {/* JIT transcoding */}
    <Video src="/assets/local.mp4" /> {/* Local assets */}
  </Timegroup>
</Configuration>
```

### Local Mode

Forces all sources through the local asset engine using `@ef-*` URLs:

```html
<ef-configuration media-engine="local">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px]">
    <ef-video src="video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```

**Use when:**
- Development with local files only
- Testing without network access
- Working with bundled assets
- All sources use local asset endpoints
- No transcoding applied
- Best for local development with Vite plugin

```tsx
<Configuration mediaEngine="local">
  <Timegroup mode="sequence">
    <Video src="/assets/video.mp4" /> {/* → /@ef-assets/... */}
  </Timegroup>
</Configuration>
```

### JIT Mode

Forces all sources through JIT transcoding using `/api/v1/transcode/*` URLs:

```html
<ef-configuration media-engine="jit">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px]">
    <ef-video src="https://example.com/video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```

**Use when:**
- On-demand transcoding needed
- Working with incompatible video formats
- Development with Editframe Vite plugin
- All sources are transcoded on-demand
- Useful for testing transcoding behavior
- May have slower initial load

```tsx
<Configuration mediaEngine="jit">
  <Timegroup mode="sequence">
    <Video src="/assets/video.mp4" /> {/* → /api/v1/transcode/... */}
  </Timegroup>
</Configuration>
```

## API Host Override

Override the API host for asset resolution in production:

```html
<ef-configuration api-host="https://api.editframe.com">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px]">
    <ef-video src="video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```

**Use when:**
- Deploying to custom domains
- Using proxy servers
- Testing against staging environments
Set the API endpoint for transcription and rendering:

```tsx
<Configuration apiHost="https://api.editframe.com">
  <Timegroup mode="sequence">
    {/* Composition */}
  </Timegroup>
</Configuration>
```

## Signing URL

Configure the endpoint for generating signed URLs:

```html
<ef-configuration signing-url="/api/sign-url">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px]">
    <ef-video src="video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```

**Use when:**
- Custom authentication flows
- Non-standard URL signing
- Backend integration requirements
Defaults to `/@ef-sign-url`:

```tsx
<Configuration
  apiHost="https://api.example.com"
  signingURL="/custom-signing-endpoint"
>
  <Timegroup mode="sequence">
    {/* Composition */}
  </Timegroup>
</Configuration>
```

The signing URL is used to:
- Generate signed URLs for secure media access
- Authenticate transcoding requests
- Control access to media files

In development, the Vite plugin provides this endpoint automatically.

## Development vs Production

### Local Development Setup

Use `local` mode with Vite plugin for fast iteration:

```html
<ef-configuration media-engine="local" signing-url="/@ef-sign-url">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px]">
    <ef-video src="./assets/video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```

### Production Setup

Use `cloud` mode with custom API host:

```html
<ef-configuration media-engine="cloud" api-host="https://api.yourdomain.com">
  <ef-timegroup mode="contain" class="w-[720px] h-[480px]">
    <ef-video src="https://cdn.yourdomain.com/video.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```
```tsx
const apiHost = import.meta.env.VITE_API_HOST || "http://localhost:3000";
const mediaEngine = import.meta.env.PROD ? "cloud" : "local";

export const Video = () => {
  return (
    <Configuration apiHost={apiHost} mediaEngine={mediaEngine}>
      <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
        {/* Your composition */}
      </Timegroup>
    </Configuration>
  );
};
```

## Context Provision

`ef-configuration` provides settings via Lit context to all descendant elements. This means you only need one configuration wrapper at the root level:

```html
<ef-configuration media-engine="cloud">
  <ef-timegroup mode="sequence" class="w-[720px] h-[480px]">
    <!-- All children inherit configuration -->
    <ef-video src="clip1.mp4" class="size-full"></ef-video>
    <ef-video src="clip2.mp4" class="size-full"></ef-video>
    <ef-video src="clip3.mp4" class="size-full"></ef-video>
  </ef-timegroup>
</ef-configuration>
```
If you don't need API features (transcription) or want default settings, you can omit Configuration:

```tsx
export const Video = () => {
  return (
    <Timegroup mode="sequence" className="w-[1920px] h-[1080px]">
      {/* Your composition */}
    </Timegroup>
  );
};
```

## Multiple Configurations

Nest configurations to override settings for specific subtrees:

```html
<ef-configuration media-engine="cloud">
  <ef-timegroup mode="sequence" class="w-[720px] h-[480px]">
    <!-- Remote video uses cloud mode -->
    <ef-video src="https://cdn.example.com/intro.mp4" class="size-full"></ef-video>

    <!-- Local videos use local mode -->
    <ef-configuration media-engine="local">
      <ef-video src="./local-clip.mp4" class="size-full"></ef-video>
    </ef-configuration>
  </ef-timegroup>
</ef-configuration>
```

> **Note:** Inner configurations override outer settings only for their descendants. Settings merge — unspecified attributes inherit from parent configuration.
## Typical Setup

```tsx
// VideoComposition.tsx
import { Timegroup, Video, Audio } from "@editframe/react";

export const VideoComposition = () => {
  return (
    <Timegroup

      mode="sequence"
      className="w-[1920px] h-[1080px] bg-black"
    >
      <Timegroup mode="fixed" duration="10s" className="absolute w-full h-full">
        <Video src="/assets/intro.mp4" className="size-full object-cover" />
        <Audio src="/assets/music.mp3" volume={0.3} />
      </Timegroup>
    </Timegroup>
  );
};

// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Configuration, TimelineRoot } from "@editframe/react";
import { VideoComposition } from "./VideoComposition";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Configuration
    apiHost={import.meta.env.VITE_EDITFRAME_API}
    mediaEngine="local"
  >
    <TimelineRoot id="root" component={VideoComposition} />
  </Configuration>
);
```
