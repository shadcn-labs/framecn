---
name: ef-agent-panel
description: Workbench agent panel system — ef-edit CustomEvent pipeline, registry roll-up, selector grouping, and element property schema. Use when adding new GUI edit capture points, expanding the inspector schema, or continuing development of the EFAgentPanel feature.
---

# Agent Panel

The `EFAgentPanel` captures `ef-edit` CustomEvents dispatched whenever a user makes a meaningful composition edit in the GUI, deduplicates them by element+property via a keyed registry, groups them by selector, and renders a copy-able coding-agent prompt.

## Event Pipeline

```
GUI interaction (canvas drag, inspector change, trim drag, loop toggle)
  └─ component.dispatchEvent(createEditCustomEvent(editEvent))
       └─ [bubbles: true, composed: true]
            └─ EFWorkbench listener → agentPanel.addEdit(event)
                 └─ Map<editChangeKey, EditEvent> registry (deduplicates)
                      └─ groupEditsBySelector() → buildAgentPrompt() → copy button
```

`EFWorkbench` registers `addEventListener('ef-edit', ...)` on itself — because `ef-edit` bubbles and is composed, any component in any slot (timeline, hierarchy, canvas) can dispatch it without special routing.

## Key Types (`editEvents.ts`)

```ts
// EditEvent — what the panel accumulates
interface EditEvent {
  operation: EditOperation;
  description: string;   // human sentence
  selector: string;      // CSS path from composition root
  elementHtml: string;   // cleaned outerHTML snippet
  timestamp: number;
}

// Operation union — extend here when adding new interaction types
type EditOperation =
  | { type: "element-property-changed"; elementId; tagName; label; property; oldValue; newValue }
  | { type: "element-moved";   elementId; tagName; label; fromX; fromY; toX; toY }
  | { type: "element-resized"; elementId; tagName; label; x; y; width; height }
  | { type: "element-rotated"; elementId; tagName; label; rotation }
```

Registry key format — determines deduplication:
- Property change: `selector::prop:propName`
- Move/resize/rotate: `selector::move`, `selector::resize`, `selector::rotate`

## Pattern: Adding a New ef-edit Dispatch Point

```ts
import {
  createEditCustomEvent, buildSelectorPath, getElementHtml,
  buildEditDescription, type ElementPropertyChangedOperation,
} from "../../editEvents.js";

const oldValue = element.someProperty;
element.someProperty = newValue;

const op: ElementPropertyChangedOperation = {
  type: "element-property-changed",
  elementId: el.id,
  tagName: el.tagName.toLowerCase(),
  label: el.textContent?.trim().slice(0, 30) || el.id || el.tagName.toLowerCase(),
  property: "attr-name",   // attribute name as used in HTML source
  oldValue,
  newValue,
};
this.dispatchEvent(createEditCustomEvent({
  operation: op,
  description: buildEditDescription(op),
  selector: buildSelectorPath(el),
  elementHtml: getElementHtml(el),
  timestamp: Date.now(),
}));
```

`buildPropertyEditEvent(element, property, oldValue, newValue)` in `EFInspector.ts` is a shorter form for simple property edits.

## Finding Current Dispatch Points

```bash
# Every call site that produces an ef-edit event
rg 'createEditCustomEvent' elements/packages/elements/src/

# Track subclasses that override render() — each must bind @trim-change-end
rg 'override render' elements/packages/elements/src/gui/timeline/tracks/

# Registered element schemas
rg 'SCHEMA_REGISTRY' elements/packages/elements/src/gui/elementPropertySchema.ts
```

## What is NOT Wired (intentional)

Playback controls (play/pause/seek), pan-zoom/zoom level, and toolbar settings are display-only state — they should not produce `ef-edit` events. Hierarchy reorder (`hierarchy-reorder` from `EFHierarchy`) would require a new `ElementReorderedOperation` type; not yet implemented.

## Shadow DOM Event Routing Gotcha

`trim-change-end` bubbles with `composed: true` from `EFTrimHandles`. `TrackItem.render()` binds `@trim-change-end` on the `ef-trim-handles` element. **`EFVideoTrack` overrides `render()` entirely and provides its own `ef-trim-handles` binding.** Any future track subclass that overrides `render()` and includes `ef-trim-handles` must bind **both** `@trim-change` and `@trim-change-end` — the base `TrackItem.render()` handlers are not inherited when `render()` is overridden.

## Element Property Schema (`elementPropertySchema.ts`)

Static descriptors drive the inspector UI. Register new element types at the bottom via `SCHEMA_REGISTRY`. Use the factory functions:

- `timeDescriptor(attr, label, opts)` — time values (stored as `${ms}ms` attributes)
- `enumDescriptor(attr, label, options, condition?)`
- `boolDescriptor(attr, label, condition?)`
- `numberDescriptor(attr, label, opts)`
- `stringDescriptor(attr, label)`

Elements with no registry entry are invisible to the inspector. Check `elementPropertySchema.test.ts` for the test pattern.

## Testing ef-edit Events

**Unit tests** (Node/vitest): use for `editEvents.ts` helpers — `editChangeKey`, `rollUpEdits`, `groupEditsBySelector`, `buildAgentPrompt`.

**Browser tests** (Chromium/vitest): required for any test involving DOM events or shadow DOM.

For trim ef-edit, dispatch `trim-change-end` directly on the `ef-trim-handles` host element — do not try to simulate full pointer events through shadow DOM layers, as pointer capture mechanics are unreliable in test environments:

```ts
const trimHandles = track.shadowRoot?.querySelector("ef-trim-handles");
trimHandles?.dispatchEvent(new CustomEvent("trim-change-end", {
  detail: { elementId: video.id, type: "start" },
  bubbles: true, composed: true,
}));
```

For loop ef-edit, click the loop button via `shadowRoot.querySelector("button[title='Loop']").click()`.

Listen at `document` level — `ef-edit` is `bubbles: true, composed: true`, so it propagates from any component to `document`.
