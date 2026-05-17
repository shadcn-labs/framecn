---
description: "Automated visual regression testing for Editframe compositions, comparing rendered frames against stored baseline images."
---


# Visual Testing




The Vitest entry point (`@editframe/vite-plugin/src/index.vitest.js`) adds server-side image comparison endpoints powered by [odiff-bin](https://github.com/nicolo-ribaudo/odiff-bin). Tests running in the browser capture screenshots and POST them to the Vite server, which performs pixel-level comparison on the server where native binaries are available.

## Setup

Use the Vitest-specific import in your `vitest.config.ts`:

```typescript
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

## Snapshot Comparison

The `/@ef-compare-snapshot` endpoint compares a screenshot against a stored baseline:

```typescript
const response = await fetch("/@ef-compare-snapshot", {
  method: "POST",
  body: JSON.stringify({
    testName: "my-component",
    snapshotName: "default-state",
    dataUrl: canvas.toDataURL("image/png"),
    threshold: 0.1,
    antialiasing: true,
    acceptableDiffPercentage: 1.0,
  }),
});
const result = await response.json();
// { match: true, diffCount: 0, diffPercentage: 0 }
```

### First Run Behavior

When no baseline exists, the actual image is automatically saved as the baseline and the comparison returns `{ match: true, baselineCreated: true }`. Subsequent runs compare against this stored baseline.

### Comparison Parameters

- **threshold** (default `0.1`) -- Color distance threshold passed to odiff. Lower values are stricter.
- **antialiasing** (default `true`) -- When true, odiff ignores antialiasing differences between images.
- **acceptableDiffPercentage** (default `1.0`) -- Maximum percentage of differing pixels before the comparison is considered a failure.

## Two-Image Comparison

The `/@ef-compare-two-images` endpoint compares any two images without baseline management:

```typescript
const response = await fetch("/@ef-compare-two-images", {
  method: "POST",
  body: JSON.stringify({
    testName: "animation-test",
    comparisonName: "frame-1-vs-frame-2",
    dataUrl1: frame1Canvas.toDataURL("image/png"),
    dataUrl2: frame2Canvas.toDataURL("image/png"),
    threshold: 0.1,
    acceptableDiffPercentage: 5.0,
  }),
});
```

Both images are written to the snapshot directory and compared with odiff. This is useful for verifying that two frames of an animation are visually distinct or within tolerance.

## Snapshot Storage

Snapshots are stored under `{root}/test/__snapshots__/{testName}/`:

```
test/__snapshots__/my-component/
  default-state.baseline.png   # Reference image
  default-state.actual.png     # Latest capture
  default-state.diff.png       # Pixel diff (generated on mismatch)
```

The `/@ef-write-snapshot` endpoint can write a baseline or actual image directly:

```typescript
await fetch("/@ef-write-snapshot", {
  method: "POST",
  body: JSON.stringify({
    testName: "my-component",
    snapshotName: "default-state",
    dataUrl: canvas.toDataURL("image/png"),
    isBaseline: true,
  }),
});
```

## Diff Output

When images differ beyond the acceptable threshold, odiff generates a diff image highlighting changed pixels. The response includes:

- **match** -- `false` when the diff exceeds the threshold
- **diffCount** -- Total number of differing pixels
- **diffPercentage** -- Percentage of the image area that differs
- **error** -- Set to `"Images have different dimensions"` when a layout diff is detected
