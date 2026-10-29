# label

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to native `<label>` (no Base UI counterpart).

## Changed

- components/ui/label.tsx: Radix `Label.Root` → native `<label>`; classes unchanged; `"use client"` dropped.
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/label.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- Radix Label prevented text selection on double-click via mousedown handler; `select-none` class still covers it.

## Verify by hand

- Click a label: associated input focuses/toggles.
