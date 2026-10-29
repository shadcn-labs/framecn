# aspect-ratio

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to CSS `aspect-ratio` div (no Base UI counterpart).

## Changed

- components/ui/aspect-ratio.tsx: Radix `AspectRatio.Root` → `<div style={{aspectRatio: ratio}}>`; `ratio` prop kept (default 1).
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/aspect-ratio.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- Radix used a padding-bottom wrapper with an absolutely positioned inner div; children now lay out in flow inside the box (use `size-full`/`absolute inset-0` on media if needed).

## Verify by hand

- Images inside AspectRatio fill the box at the right ratio.
