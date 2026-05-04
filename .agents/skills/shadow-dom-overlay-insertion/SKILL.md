---
name: shadow-dom-overlay-insertion
description: How to correctly insert overlay elements when the host is slotted inside a shadow DOM. Covers the parentElement trap, assignedSlot pattern, and the connectedCallback timing hazard. Use when inserting overlays, portals, or absolutely-positioned siblings of slotted elements.
---

# Shadow DOM Overlay Insertion

## The Problem

When component A (e.g. EFCanvas) tries to insert an overlay into the DOM next to itself, it typically uses `this.parentElement.appendChild(overlay)`. This breaks when A is slotted inside a shadow DOM host (e.g. EFWorkbench).

```
EFWorkbench (shadow host)
  shadow root
    <div class="canvas-slot-container">   ← the real DOM parent
      <slot name="canvas">                ← slot element
        [EFCanvas is assigned here]       ← light DOM, assigned via slot
```

- `efCanvas.parentElement` returns **the shadow host** (EFWorkbench), not the internal container
- Calling `shadowHost.appendChild(overlay)` places the overlay in the host's **light DOM**, where CSS and z-index from the shadow DOM won't apply — the overlay is invisible

## The Fix Pattern

```ts
private insertOverlay(overlay: HTMLElement): void {
  const slot = this.assignedSlot;

  if (slot) {
    // Correctly slotted: insert into the shadow-internal container
    slot.parentElement?.appendChild(overlay);
    return;
  }

  if (this.parentElement?.shadowRoot) {
    // Shadow DOM exists but slot assignment hasn't happened yet
    // (connectedCallback fires before Lit renders shadow DOM).
    // Return early; caller should retry via requestAnimationFrame.
    return;
  }

  // Not slotted — plain DOM, safe to use parentElement
  this.parentElement?.appendChild(overlay);
}
```

## The Timing Hazard

During HTML parsing, `connectedCallback` fires **before** Lit has rendered the shadow DOM. At that point:

- `this.assignedSlot` is `null` (slot assignment hasn't happened)
- `this.parentElement` is non-null (the shadow host)
- `this.parentElement.shadowRoot` is also null (shadow DOM not yet attached)

Later in the same microtask tick (after Lit's `performUpdate`):

- `this.assignedSlot` becomes the `<slot>` element
- `slot.parentElement` is the internal container

**Guard pattern:**

```ts
connectedCallback() {
  super.connectedCallback();
  this.tryInsertOverlay();
}

private tryInsertOverlay(): void {
  if (!this.assignedSlot && this.parentElement?.shadowRoot) {
    // Too early — shadow host exists but slot not yet assigned.
    // Lit will assign the slot after performUpdate.
    requestAnimationFrame(() => this.tryInsertOverlay());
    return;
  }
  this.insertOverlay(this.overlay);
}
```

## Summary of Rules

| Situation | `assignedSlot` | `parentElement.shadowRoot` | Action |
|-----------|---------------|---------------------------|--------|
| Not slotted | null | null/undefined | Use `parentElement.appendChild` |
| Correctly slotted | non-null | (any) | Use `assignedSlot.parentElement.appendChild` |
| Too early (Lit not rendered) | null | non-null | Return early, retry via RAF |
| Slotted, parent has no shadow | null | null | Use `parentElement.appendChild` |

**Never use `this.parentElement` directly when the parent is a shadow DOM host.**
