# switch

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `@base-ui/react/switch`.

## Changed

- components/ui/switch.tsx: `data-[state=checked|unchecked]:` → `data-checked:`/`data-unchecked:` on Root and Thumb; props `SwitchPrimitive.Root.Props`; `size` kept.
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/switch.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- Root renders `<span>` + hidden input instead of `<button>`.
- `onCheckedChange` gets a second `eventDetails` arg.

## Verify by hand

- Click/Space toggles; label click toggles; thumb slides.
