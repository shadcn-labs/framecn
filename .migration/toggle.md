# toggle

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `@base-ui/react/toggle`.

## Changed

- components/ui/toggle.tsx: `TogglePrimitive.Root` → `TogglePrimitive`; `data-[state=on]:` → `data-pressed:`; `onPressedChange(pressed, eventDetails)` forwarded; toggleOn/toggleOff sounds kept.
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/toggle.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes



## Verify by hand

- Toggle on/off: pressed styles + correct sound each time.
