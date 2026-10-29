# slider

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `@base-ui/react/slider`.

## Changed

- components/ui/slider.tsx: anatomy Root > Control > Track > (Indicator, Thumb); `Range` → `Indicator`; thumbs moved inside Track with `index`; layout classes moved to `Control`; `thumbAlignment="edge"` to match Radix; thumb `disabled:` → `data-[disabled]:`; thumb count handles scalar `value`/`defaultValue`.
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/slider.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- `onValueChange`/`onValueCommit` → `onValueChange(value, details)`/`onValueCommitted`; value is `number | number[]` (consumer error: components/component-customizer.tsx:59 indexes `value[0]`).
- `minStepsBetweenThumbs` → `minStepsBetweenValues`; `inverted` dropped.
- Range thumbs `push` on collision by default.

## Verify by hand

- Drag, track-click, arrow keys; commit fires once on release; vertical orientation renders.
