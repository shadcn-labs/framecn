---
name: vite-plugin
description: "Vite integration for Editframe development with local video transcoding, asset serving, file API endpoints, and visual regression testing."
license: PROPRIETARY
metadata:
  package: "@editframe/vite-plugin"
  version: 0.37.3-beta
  type: vite-plugin
---


# Vite Plugin

The `@editframe/vite-plugin` adds local development capabilities to your Vite project. It handles on-demand video transcoding, local asset serving, and visual regression testing so you can develop Editframe compositions without cloud API dependencies.

## Features

- **JIT Video Transcoding** — Videos are transcoded to streamable format on first request and cached for subsequent loads
- **Local Asset Serving** — Images and captions are served locally with caching
- **Visual Testing** — Image comparison tools for visual regression tests with Vitest
- **Cache Management** — Automatic caching of transcoded assets with cache-clearing support

## Installation

```bash
npm install @editframe/vite-plugin
```

## Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { vitePluginEditframe } from "@editframe/vite-plugin";

export default defineConfig({
  plugins: [
    vitePluginEditframe({
      root: "./src",       // Base directory for resolving file paths
      cacheRoot: "./cache", // Directory for cached transcoded assets
    }),
  ],
});
```
