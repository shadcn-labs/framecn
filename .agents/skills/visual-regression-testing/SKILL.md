---
name: visual-regression-testing
description: Canvas/DOM parity testing for the foreignObject serializer. Use when comparing the SVG foreignObject render path against the native Blink canvas path, writing pixel-diff tests, or hunting canvas vs DOM rendering inconsistencies.
---

# Visual Regression Testing

Two render paths must produce identical pixels. The **native canvas path** (`renderToImageNative` via `drawElementImage`) renders the live DOM directly through Blink and is the ground truth. The **foreignObject path** (`captureTimelineToDataUri`) serializes the DOM to XHTML inside an SVG `<foreignObject>`. Any difference between them is a serializer bug.

## Utility

`elements/packages/elements/test/visualRegressionUtils.ts` provides the testing API. Key functions:

```typescript
// Compare two canvases directly — returns diffPercentage, no baseline file needed
compareTwoCanvases(canvas1, canvas2, testName, comparisonName, options)
expectCanvasesToMatch(canvas1, canvas2, testName, comparisonName, options)

// Compare a canvas against a stored baseline PNG
assertCanvasSnapshot(canvas, testName, snapshotName, options)
expectCanvasToMatchSnapshot(source, testName, snapshotName, options)
```

`options.acceptableDiffPercentage` (default `1.0`) controls pass/fail. Use `0` to `0.5` for tight parity checks.

## Standard Comparison Pattern

```typescript
import { captureTimelineToDataUri } from "./rendering/serializeTimelineDirect.js";
import { loadImageFromDataUri } from "./rendering/loadImage.js";
import { renderToImageNative } from "./rendering/renderToImageNative.js";
import { isNativeCanvasApiAvailable } from "./previewSettings.js";
import { expectCanvasesToMatch } from "../../test/visualRegressionUtils.js";

async function captureForComparison(tg: EFTimegroup, W: number, H: number) {
  // foreignObject path
  const dataUri = await captureTimelineToDataUri(tg, W, H, { canvasScale: 1, timeMs: 0 });
  const img = await loadImageFromDataUri(dataUri);
  const fc = document.createElement("canvas");
  fc.width = W; fc.height = H;
  fc.getContext("2d")!.drawImage(img, 0, 0);

  // native path (ground truth — Blink renders the live DOM)
  const nc = await renderToImageNative(tg, W, H, { skipDprScaling: true });

  return { foreignCanvas: fc, nativeCanvas: nc };
}
```

Always guard native-path tests with `isNativeCanvasApiAvailable()` — the WICG `drawElementImage` API is Chromium-only.

## Writing a Minimal Reproduction Test

A minimal reproduction isolates a single CSS property. The test should **fail before the fix and pass after**.

```typescript
it("text-shadow from inline style", async () => {
  if (!isNativeCanvasApiAvailable()) return;
  const tg = document.createElement("ef-timegroup") as EFTimegroup;
  tg.style.cssText = "width:400px;height:200px;background:#000;position:relative;";
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"
    + "font-size:60px;font-weight:900;color:white;text-shadow:0 0 40px red;";
  el.textContent = "GLOW";
  tg.appendChild(el);
  document.body.appendChild(tg);
  await tg.updateComplete;

  const { foreignCanvas, nativeCanvas } = await captureForComparison(tg, 400, 200);
  await expectCanvasesToMatch(foreignCanvas, nativeCanvas, "canvasDomParity", "text-shadow-inline", {
    acceptableDiffPercentage: 0.5,
  });
  tg.remove();
});
```

## Snapshot Files

Diff PNGs are written to `elements/test-assets/test/__snapshots__/<testName>/`. Open them to visually inspect which pixels differ.

## Serializer Properties

The foreignObject serializer captures computed styles from `SERIALIZED_STYLE_PROPERTIES` in `elements/packages/elements/src/preview/rendering/serializeTimelineDirect.ts`. Missing a property there means it is lost when animations are frozen with `animation:none`. Check this list first when a CSS feature produces a parity gap.

## When to Use This Skill

- Writing new parity tests for a CSS feature gap
- Investigating a report that the preview thumbnail differs from what the DOM shows
- After any change to `serializeTimelineDirect.ts` to verify no new regression
