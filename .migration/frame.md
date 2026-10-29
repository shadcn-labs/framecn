# frame

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `useRender` + `mergeProps`.

## Changed

- components/ui/frame.tsx: `Frame`/`FrameContent` `Slot`/`asChild` → `useRender` + `render` prop, `data-slot` via state; header/footer unchanged; added `"use client"`.
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/frame.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes



## Verify by hand

- Frame with `render={<Link/>}` keeps shell classes and navigates.
