# navigation-menu

2026-10-29, transformation engine (legacy `new-york`; CUSTOMIZED: arrow functions, extra `viewportClassName` prop). Verdict: migrated to `@base-ui/react/navigation-menu`; `NavigationMenuIndicator` FLAGGED (no equivalent, inert passthrough); `viewport` boolean dropped. No consumers in the app import this wrapper.

## Changed

- `components/ui/navigation-menu.tsx`
  - Import → `import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"`; types → `NavigationMenuPrimitive.X.Props`.
  - `NavigationMenuViewport` (same export name) is now `Portal > Positioner > Popup > Viewport`, rendered by `NavigationMenu`. Positioner: `isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)`, position transition between triggers (`transition-[top,left,right,bottom] duration-200 data-instant:transition-none`) and a 6px `before:` hover bridge over the gap. `sideOffset=6` replaces the old `mt-1.5`; `align` (default `"start"`) forwarded from `NavigationMenu`.
  - Popup keeps the old viewport look (`rounded-md border bg-popover text-popover-foreground shadow`, fade/slide-from-top tw-animate on `data-open:`/`data-closed:`), sized by `h-(--popup-height) w-(--popup-width)` (was `--radix-navigation-menu-viewport-height/width`). `viewportClassName` still targets it; `data-slot="navigation-menu-viewport"` kept.
  - `NavigationMenu`: `viewport` prop and `data-viewport` attribute removed (Base UI always uses the popup); `align` added (golden).
  - Trigger: `data-[state=open]:` → `data-popup-open:`; chevron `group-data-[state=open]:rotate-180` → `group-data-popup-open:rotate-180`.
  - Content: `data-[motion=*]` keyframes restated as transitions on `data-starting-style`/`data-ending-style` × `data-[activation-direction=left|right]` (`translate-x-52` slide + fade, same distance as before); `md:absolute top-0 left-0 w-full md:w-auto` → `h-full w-auto` (Base UI handles content swapping inside Viewport); dead `group-data-[viewport=false]/navigation-menu:*` classes removed with the prop.
  - Link: `data-[active=true]:` → `data-active:` (Base UI sets a presence attribute).
  - `NavigationMenuIndicator`: inert `<div>` passthrough with the old arrow markup; dead `data-[state=visible|hidden]` animation classes removed.
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/navigation-menu.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- No app code imports `@/components/ui/navigation-menu`; nothing to sweep.

## Behavior changes

- FLAG: `NavigationMenuIndicator` no longer tracks the active trigger (Base UI has no such part; `NavigationMenuPrimitive.Icon` requires an Item context and is a trigger chevron, `Arrow` lives inside the Popup).
- FLAG: popup is anchored to the active trigger (start-aligned) instead of centered under the whole menu; `viewport={false}` mode no longer exists.
- Root `delayDuration`(200)/`skipDelayDuration` → `delay`(50)/`closeDelay`(50): hover-open feels faster.
- Links: Base UI does not close the menu on link click unless `closeOnClick`.
- `onValueChange(value, eventDetails)`; value may be `null` when closed.

## Verify by hand

- Hover/click a trigger: popup fades/slides in 6px below it; moving between triggers slides content left/right and moves the popup.
- Pointer crossing the gap into the popup does not close it.
- Arrow keys move between triggers; Esc closes and returns focus; active link shows `data-active` styling.
