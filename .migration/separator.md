# separator

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `@base-ui/react/separator`.

## Changed

- components/ui/separator.tsx: `SeparatorPrimitive.Root` → `SeparatorPrimitive`; props `SeparatorPrimitive.Props`; `decorative` dropped (no Base UI equivalent); `data-[orientation=*]` classes unchanged (Base UI emits `data-orientation`).
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/separator.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- Base UI always renders `role="separator"` (Radix default `decorative` rendered `role="none"`); screen readers now announce separators. Pass `aria-hidden` to opt out.

## Verify by hand

- Horizontal and vertical separators render at 1px.
