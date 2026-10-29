# badge

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `useRender` + `mergeProps`.

## Changed

- components/ui/badge.tsx: `Slot`/`asChild` → `useRender` with `render` prop; `data-slot`/`data-variant` emitted via state; `brand` variant kept; added `"use client"` (hook).
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/badge.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- `variant` now defaults to `"default"`, so `data-variant="default"` is emitted when omitted (was absent).

## Verify by hand

- Badge with `render={<a/>}` shows `[a&]:hover` styles and navigates.
