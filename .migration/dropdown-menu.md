# dropdown-menu

2026-10-29, transformation engine (legacy `new-york`; CUSTOMIZED: arrow functions, `sounds` prop on root with controlled-sync, `sound`/`haptic` on items). Verdict: migrated to `@base-ui/react/menu`; typecheck clean for this file; one consumer will crash at runtime until swept (see Behavior changes).

## Changed

- `components/ui/dropdown-menu.tsx`
  - Import → `import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu"`; types → `DropdownMenuPrimitive.X.Props`.
  - Root: `sounds` logic kept; `handleOpenChange` forwards `(open, eventDetails)`.
  - Part renames: `Label` → `GroupLabel`, `Sub` → `SubmenuRoot`, `SubTrigger` → `SubmenuTrigger`, `ItemIndicator` → `CheckboxItemIndicator` / `RadioItemIndicator`.
  - `DropdownMenuContent` → `Portal > Positioner(className="isolate z-50 outline-none") > Popup`. `align`/`alignOffset`/`side`/`sideOffset`/`collisionBoundary`/`collisionPadding` declared via Pick, destructured, forwarded (existing defaults kept: `sideOffset=4`, `align="center"`).
  - `DropdownMenuSubContent` composes `DropdownMenuContent` with `align="start" alignOffset={-3} side="right" sideOffset={0}` and its previous `overflow-hidden shadow-lg`.
  - `DropdownMenuItem`: `sound`/`haptic` kept; handler typed `DropdownMenuPrimitive.Item.Props["onClick"]`.
  - Classes: `data-[state=*]:` → `data-open:`/`data-closed:`; SubTrigger → `data-popup-open:`; `--radix-dropdown-menu-content-available-height` → `--available-height`, `...-transform-origin` → `--transform-origin`.
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/dropdown-menu.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- Consumer sweep (lead), not edited here:
  - `account-button.tsx:55` `DropdownMenuLabel` is NOT inside a `DropdownMenuGroup` → wrap it (Base UI GroupLabel throws without a group).
  - `account-button.tsx:68`, `component-detail.tsx:221` `onSelect` on `DropdownMenuItem` → `onClick` (onSelect still type-checks as the HTML event but never fires).
  - `docs-share-menu.tsx:64` `onCloseAutoFocus={(e) => e.preventDefault()}` → `finalFocus={false}` on `DropdownMenuContent`.
  - `asChild` → `render={...}` on Trigger/Item: `account-button.tsx:42,62`, `component-detail.tsx:199,210`, `docs-copy-page.tsx:194,202`, `docs-share-menu.tsx:48,77,88`, `docs-toc.tsx:89,105`. For `<a>` items, `render={<Link/>}` works (Base UI also has `LinkItem`).

## Behavior changes

- FLAG (runtime crash): `DropdownMenuLabel` outside a group throws (see account-button).
- FLAG: menu items no longer honor `onSelect`; CheckboxItem/RadioItem `closeOnClick` defaults to false (Radix closed on select).
- `loop` → Root `loopFocus` (Base UI loops by default); `collisionPadding` default 5 (Radix 0).
- `onOpenChange(open, eventDetails)`.

## Verify by hand

- Account menu, docs share menu, docs copy-page menu, docs TOC menu, component-detail menu: open via click and via Enter/Space; arrow keys + typeahead; Enter activates and closes; Esc closes and focus returns to the trigger (except share menu once `finalFocus={false}` is applied).
- Fade/zoom/slide in and out animate; menu height capped by viewport (`--available-height`).
- Item sounds/haptics fire; with `sounds`, open/close sounds play once.
