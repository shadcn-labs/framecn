---
description: "Install and configure the Editframe Vite plugin to enable local asset serving, JIT transcoding, and visual testing."
---


# Getting Started


## Functions

- **vitePluginEditframe(options)** - Creates the Editframe Vite plugin instance
  - Returns: Plugin


The Editframe Vite plugin integrates video transcoding, asset management, and visual testing into your Vite development workflow.

## Installation

```bash
npm install @editframe/vite-plugin
```

## Configuration

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import { vitePluginEditframe } from "@editframe/vite-plugin";

export default defineConfig({
  plugins: [
    vitePluginEditframe({
      root: "./src",
      cacheRoot: "./cache",
    }),
  ],
});
```

## Configuration Options

### root

The base directory for resolving relative file paths. When the plugin receives a request for a local file, it resolves the path relative to this directory.

```typescript
vitePluginEditframe({
  root: "./src",
  cacheRoot: "./cache",
})
```

### cacheRoot

Directory where transcoded video assets are cached. On first request for a video, the plugin transcodes it and stores the result here for fast subsequent loads.

```typescript
vitePluginEditframe({
  root: "./src",
  cacheRoot: "./cache",
})
```

## Vitest Configuration

For visual testing with Vitest browser mode, use the vitest-specific entry point:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const { vitePluginEditframe } = await import(
    "@editframe/vite-plugin/src/index.vitest.js"
  );

  return {
    plugins: [
      vitePluginEditframe({
        root: "./test-assets",
        cacheRoot: "./test-assets",
      }),
    ],
    test: {
      browser: {
        enabled: true,
        provider: "playwright",
      },
    },
  };
});
```
