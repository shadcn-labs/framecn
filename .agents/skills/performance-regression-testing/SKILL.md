---
name: performance-regression-testing
description: Guard serialization and canvas-render pipeline performance against regressions. Use when modifying serializeTimelineDirect.ts or any hot path in the foreignObject/native render pipeline to ensure changes don't increase p95 frame-capture time.
---

# Performance Regression Testing

Any change to the render pipeline must prove it does not increase capture time. The primary guard is `serializeTimelineDirect.perf.browsertest.ts`, which measures `captureTimelineToDataUri` end-to-end in multiple scenarios.

## Quick Workflow

```bash
# Before making changes — record baseline numbers from the terminal output
cd elements
./scripts/browsertest packages/elements/src/preview/rendering/serializeTimelineDirect.perf.browsertest.ts

# Make your changes, then re-run
./scripts/browsertest packages/elements/src/preview/rendering/serializeTimelineDirect.perf.browsertest.ts
```

The test prints `p50`, `p95`, `p99` for each scenario. A fix is acceptable if p95 does not regress. Copy the before/after numbers into the PR description as evidence.

## What Each Scenario Tests

See `serializeTimelineDirect.perf.browsertest.ts` for the current scenario list. Typically: simple HTML, text-heavy content, canvas elements, mixed composition at 1920×1080.

## Interpreting the Output

Each scenario reports:
- `p50` / `p95` / `p99` timing in ms for `serializeMs` (serialization only) and `totalMs` (serialize + image load)
- `dataUriLength` as a proxy for output size

Focus on `p95 serializeMs`. Small additions to `SERIALIZED_STYLE_PROPERTIES` add one `getComputedStyle` lookup per element per serialization — negligible unless the composition has thousands of elements.

## Relating Perf to Parity Fixes

When fixing a CSS property gap in `SERIALIZED_STYLE_PROPERTIES`:
1. Run perf before the fix, note p95
2. Add the property, re-run perf
3. If p95 stays within noise (±5%), the fix is safe
4. If p95 climbs, profile with the `profile-tests` skill to identify the bottleneck

## Broader Perf Tests

For frame-by-frame scrub and full pipeline timing, see:
- `canvas-scrub-performance.browsertest.ts`
- `renderPipeline.perf.browsertest.ts`

These are slower to run (long iteration counts). Use them when the change is structural (e.g., changing how canvases are encoded or how the DOM is walked), not for individual property additions.

## When to Use This Skill

- Before and after any change to `serializeTimelineDirect.ts`
- Before merging a parity fix branch
- When a parity test starts taking noticeably longer than before
