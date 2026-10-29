# context-menu

2026-10-29, transformation engine (legacy `new-york`; CUSTOMIZED: arrow functions, `sounds` prop on root, `sound`/`haptic` on items). Verdict: migrated to `@base-ui/react/context-menu`; typecheck clean for this file.

## Changed

- `components/ui/context-menu.tsx`
  - Import → `import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"`; types → `ContextMenuPrimitive.X.Props`.
  - Root: `sounds` kept; `handleOpenChange` forwards `(open, eventDetails)`.
  - Part renames: `Label` → `GroupLabel`, `Sub` → `SubmenuRoot`, `SubTrigger` → `SubmenuTrigger`, `ItemIndicator` → `CheckboxItemIndicator` / `RadioItemIndicator`.
  - `ContextMenuContent` → `Portal > Positioner(className="isolate z-50 outline-none") > Popup` (popup keeps `z-50`, adds `outline-none`). Positioner props via Pick, destructured and forwarded with NO defaults (main menu stays pointer-anchored; Base UI applies its own start/offset defaults).
  - `ContextMenuSubContent` composes `ContextMenuContent` with `align="start" alignOffset={4} side="right" sideOffset={0}` and `overflow-hidden shadow-lg` (its previous distinct classes).
  - `ContextMenuItem`: `sound`/`haptic` kept; click handler typed as `ContextMenuPrimitive.Item.Props["onClick"]`.
  - Classes: `data-[state=*]:` → `data-open:`/`data-closed:`; SubTrigger open styling → `data-popup-open:bg-accent data-popup-open:text-accent-foreground`; `--radix-context-menu-content-available-height` → `--available-height`, `--radix-context-menu-content-transform-origin` → `--transform-origin`.
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/context-menu.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- Consumer sweep (lead): `brand-context-menu.tsx:42` `ContextMenuTrigger asChild` and `:57,:68` `ContextMenuItem asChild` → `render={...}`.

## Behavior changes

- `ContextMenuLabel` is Base UI `GroupLabel`: it THROWS at runtime ("MenuGroupContext is missing") unless rendered inside `ContextMenuGroup`/`ContextMenuRadioGroup` (no current consumer uses it).
- Items: Radix `onSelect` no longer fires on selection (HTML `onSelect` type still compiles); use `onClick` + `closeOnClick`. CheckboxItem/RadioItem `closeOnClick` defaults to false (Radix closed the menu).
- Root `modal` and Trigger `disabled` do not exist in Base UI.
- `onOpenChange(open, eventDetails)`.

## Verify by hand

- Right-click the brand logo: menu opens at the pointer, fade/zoom in/out; arrow keys + typeahead navigate; Enter activates; Esc closes.
- Item sound/haptic still play on click; with `sounds`, open/close sounds play.
- Long-press on touch opens the menu.
