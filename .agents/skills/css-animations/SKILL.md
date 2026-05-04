---
name: css-animations
description: CSS animation fill-mode requirements for Editframe timeline system. Use when creating CSS animations, debugging flashing/flickering issues, or when user mentions animation problems, fade effects, slide effects, or sequential animations.
---

# CSS Animations in Editframe

Editframe's timeline system pauses animations and manually controls them via `animation.currentTime`. Elements exist in the DOM before their animations start, so fill-mode matters.

## ef-text and ef-text-segment — fill-mode is automatic

For text animations on `ef-text` or via `ef-text-segment` classes, **do not set fill-mode**. The system defaults to `backwards` automatically when the computed value is `none`.

```css
/* ✅ Just write the animation — fill-mode is handled */
ef-text {
  animation: fade-in 1s 500ms;
}

.my-segment-class {
  animation: slide-up 800ms var(--ef-stagger-offset);
}
```

Only override if you have a reason:

```css
/* Explicit exit animation that needs forwards */
.my-segment-class {
  animation: fade-out 500ms forwards;
}
```

## Other elements — fill-mode is still required

For plain HTML elements inside a composition (divs, h1s, etc.), you must still set fill-mode explicitly.

### Entry animations → `backwards`

```css
/* ❌ Element shows natural state during delay */
animation: fade-in 1s 500ms;

/* ✅ Holds initial keyframe during delay */
animation: fade-in 1s 500ms backwards;
```

### Exit animations → `forwards`

```css
/* ❌ Element snaps back after fading out */
animation: fade-out 500ms;

/* ✅ Holds final keyframe after animation ends */
animation: fade-out 500ms forwards;
```

### Combined entrance + exit → `both`

```css
animation:
  fade-in 1s backwards,
  fade-out 500ms calc(var(--ef-duration) - 500ms) forwards;

/* or */
animation: fade-in-out 2s both;
```

## Development Mode Validation

The system warns in the browser console about missing fill-mode on any element:

```
🎬 Editframe Animation Fill-Mode Warning
⚠️  Animation "fade-in" has a 500ms delay but no 'backwards' fill-mode.
   Fix: Add 'backwards' or 'both' to the animation shorthand.
```

## Technical Background

- `none` (default): No styles applied before/after animation
- `forwards`: Final keyframe styles persist after animation ends
- `backwards`: Initial keyframe styles applied before animation starts (covers delays)
- `both`: Combination

Editframe controls `animation.currentTime` directly. Without fill-mode, browsers apply natural element styles instead of keyframe styles, causing visible "flashing."

## Resources

- [MDN: animation-fill-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode)
- Implementation: `elements/packages/elements/src/elements/EFText.ts`, `updateAnimations.ts`
