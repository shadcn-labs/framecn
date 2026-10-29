# sidebar

2026-10-29, transformation engine on the user's own file (legacy `new-york` style: radix golden used for classification only). Migrated (radix-dependent parts only); two remaining errors depend on tooltip.tsx still being on Radix (owned by BaseOverlays) and resolve once it lands.

## Changed

- `components/ui/sidebar.tsx`: removed `Slot` from `radix-ui`; added `useRender` (`@base-ui/react/use-render`) + `mergeProps` (`@base-ui/react/merge-props`).
- `SidebarGroupLabel` (div), `SidebarGroupAction` (button), `SidebarMenuButton` (button), `SidebarMenuAction` (button), `SidebarMenuSubButton` (a): `asChild` → `render`; props type `useRender.ComponentProps<tag>`. `data-slot`/`data-sidebar`/`data-size`/`data-active` emitted via `state` (`active: String(isActive)` keeps `data-active="true|false"`, so `data-[active=true]` selectors still match). Classes unchanged.
- `SidebarMenuButton`: `sound`/`haptic` kept (click handler passed through `mergeProps`); tooltip `<TooltipTrigger asChild>{button}` → `<TooltipTrigger render={button} />`; `TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}` kept (BaseOverlays confirmed side/align forwarded to Positioner, `hidden` passed to Popup).
- `TooltipProvider delayDuration={0}` → `delay={0}` (BaseOverlays' Base UI tooltip API).
- Menu button/action `data-[state=open]:hover:*` / `data-[state=open]:opacity-100` (open dropdown trigger marker) → `data-popup-open:*` per class-mapping.
- `SidebarTrigger` click handler retyped from Button props (Button is now Base UI, `BaseUIEvent`).
- `peer-data-[state=collapsed]` (SidebarInset) left as is: it is the sidebar's own `data-state`, not Radix.
- Leftover scan `grep -n "radix-ui\|@radix-ui\|Slot\|asChild" components/ui/sidebar.tsx`: clean.

## Left alone

- Sheet/Tooltip/Button/Separator/Input/Skeleton imports unchanged (sibling wrappers, same export names).
- Typecheck errors at `sidebar.tsx:144` (`delay`) and `:570` (`render` on TooltipTrigger) are because `components/ui/tooltip.tsx` is still radix at time of writing.
- Consumers to sweep: `components/app-sidebar.tsx` `asChild` on `SidebarMenuButton`/`SidebarMenuSubButton` (78, 186, 271, 300) → `render={<Link …/>}`; when rendering a non-button (e.g. `<a>`/Link) via `SidebarMenuButton`, no `nativeButton` needed (useRender, not a Base UI button).

## Behavior changes

- `useRender` merges handlers: consumer `onClick` and the sound handler both run (consumer's first). Previously Slot did the same merge.
- Collapsed-state tooltip hidden via `hidden` on the Popup; the Positioner element still mounts while open.
- `data-popup-open` only appears when the button is a Base UI Menu/Popover trigger; if used as a Collapsible trigger the open marker is `data-panel-open` (no styling rule for that, same as before for non-menu use).

## Verify by hand

- Collapse sidebar to icon mode: hover menu buttons → tooltip on the right; expanded mode → no tooltip.
- Menu buttons rendered as links navigate, show active styling, play sound.
- Menu action button with an open dropdown stays visible/highlighted.
- Mobile: sidebar opens as Sheet, closes on overlay click.
