# tooltip

2026-10-29, transformation engine (legacy `new-york`; CUSTOMIZED: arrow functions, auto-provider via `InsideProvider` context, provider delay default 0, `sideOffset=0`, primary-colored rotated-square arrow). Verdict: migrated to `@base-ui/react/tooltip`, plus Base UI handle API exposed; typecheck clean for this file.

## Changed

- `components/ui/tooltip.tsx`
  - Import → `import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"`.
  - `TooltipProvider`: `delayDuration` → Base UI `delay` (default 0 kept); also passes `closeDelay`/`timeout` through.
  - `Tooltip`: generic `<Payload>` over `TooltipPrimitive.Root.Props<Payload>` so `handle` and function children (`{({ payload }) => ...}`) type-check. Still auto-wraps in `TooltipProvider` when not inside one.
  - `TooltipTrigger`: generic over `TooltipPrimitive.Trigger.Props<Payload>` (accepts `handle`, `payload`, `delay`, `closeDelay`, `closeOnClick`, `render`). Detached triggers outside any provider are auto-wrapped in `TooltipProvider` too, so they keep the 0ms default delay (Base UI triggers read delay from the nearest Provider, default 600).
  - New export `createTooltipHandle = TooltipPrimitive.createHandle` (several triggers share one popup via `handle`).
  - `TooltipContent` → `Portal > Positioner(className="isolate z-50") > Popup`. `side`/`sideOffset`/`align`/`alignOffset`/`collisionBoundary`/`collisionPadding` declared via Pick and forwarded to Positioner. `sideOffset` default 0 → 4 (golden; Radix added the 5px arrow height to the offset, Base UI does not).
  - Popup keeps `data-slot="tooltip-content"` (Kbd `in-data-[slot=tooltip-content]` styling still matches) and the user's classes; `data-[state=closed]:` → `data-closed:`, `origin-(--radix-tooltip-content-transform-origin)` → `origin-(--transform-origin)`.
  - Arrow keeps the user's look (`bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]`) plus the per-side placement from the current base registry tooltip (`data-[side=bottom]:top-1 data-[side=top]:-bottom-2.5`, left/right `top-1/2! -translate-y-1/2 -right-1/-left-1`), since Base UI's Arrow is a plain div positioned only on the cross axis.
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/tooltip.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- Consumer sweep (lead): `component-detail.tsx:620` `<TooltipProvider delayDuration={300}>` → `delay={300}`; `TooltipTrigger asChild` → `render={...}` (`component-detail.tsx:639`, `copy-button.tsx:118`, `docs-nav-link.tsx:65`, `github-stars.tsx:25`, `sidebar.tsx`).

## Behavior changes

- `delayDuration`/`skipDelayDuration`/`disableHoverableContent` are gone (→ Provider `delay`, Provider `timeout`, Root `disableHoverablePopup`); no consumer uses the last two.
- `onOpenChange(open, eventDetails)`; Content dismiss callbacks moved to Root `onOpenChange` reasons.
- Trigger `closeOnClick` defaults to true (Radix also closed on pointerdown).
- Default gap between trigger and popup changes slightly (sideOffset 4 instead of Radix's implicit 0+5px arrow).

## Verify by hand

- Hover copy button, docs nav icons, github stars: tooltip opens instantly, fades/zooms in, fades out on leave.
- Arrow sits centered against the trigger on all sides (try a `side="right"` sidebar tooltip in collapsed sidebar).
- Kbd inside a tooltip still gets the inverted tooltip styling.
- Moving between adjacent tooltips in one provider opens the next one instantly.
- Handle API: two `TooltipTrigger handle={h} payload={...}` + one `Tooltip handle={h}` with function children shows one popup that follows the hovered trigger.
