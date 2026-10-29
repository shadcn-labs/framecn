# button

2026-10-29, legacy new-york style: transformation engine on the user's own file (classes kept); migrated to `@base-ui/react/button`.

## Changed

- components/ui/button.tsx: `Slot`/`asChild` → `ButtonPrimitive` (`render` prop, `nativeButton`, `focusableWhenDisabled` now available). `ButtonProps` extends `ButtonPrimitive.Props`; variants (incl. `gradient`/`primary-gradient`), `sound`/`haptic` + `useFeedback` kept; `onClick` typed as `ButtonPrimitive.Props["onClick"]`.
- Leftover scan `grep -n "radix-ui\|@radix-ui"` on components/ui/button.tsx: clean.

## Left alone

- Consumers (asChild → render sweep owned by lead).

## Behavior changes

- `onClick` now receives a `BaseUIEvent` (has `preventBaseUIHandler`); callers forwarding a plain React MouseEvent type-error (components/registry-add-button.tsx:89, components/ui/sidebar.tsx:277).
- `render={<a/>}` / `<Link/>` targets need `nativeButton={false}` or Base UI warns and adds button semantics.
- Disabled native button: Base UI keeps focusability only with `focusableWhenDisabled`.

## Verify by hand

- Click a `sound` button: sound/haptic fire once.
- Link-rendered buttons (`render={<Link/>}` + `nativeButton={false}`) navigate, keep styles, no role=button.
- Tab focus ring; disabled buttons ignore clicks.
