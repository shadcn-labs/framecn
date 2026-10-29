# popover

2026-10-29, transformation engine (legacy `new-york`; CUSTOMIZED: arrow functions, `sounds` prop with dropdown open/close sounds). Verdict: migrated to `@base-ui/react/popover`; `PopoverAnchor` FLAGGED (no Base UI part, now an inert passthrough).

## Changed

- `components/ui/popover.tsx`
  - Import → `import { Popover as PopoverPrimitive } from "@base-ui/react/popover"`; types → `PopoverPrimitive.X.Props`.
  - `Popover`: `sounds` logic kept; `handleOpenChange` forwards `(open, eventDetails)`.
  - `PopoverContent` → `Portal > Positioner > Popup`. Positioner props declared via `Pick<Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "anchor" | "collisionBoundary" | "collisionPadding">`, destructured and forwarded to `<Positioner className="isolate z-50">` (defaults kept: `align="center"`, `sideOffset=4`, plus `side="bottom"`, `alignOffset=0`). `anchor` is exposed so callers can replace the old Anchor part.
  - Classes: `data-[state=*]:` → `data-open:`/`data-closed:`; `origin-(--radix-popover-content-transform-origin)` → `origin-(--transform-origin)`.
  - `PopoverAnchor`: inert `<div data-slot="popover-anchor">` passthrough (same DOM as Radix's Anchor, no positioning effect).
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/popover.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- Consumer sweep (lead), not edited here:
  - `components/docs-copy-page.tsx:183` `<PopoverAnchor />` no longer anchors: the popup now positions against `PopoverTrigger` (the mobile chevron) instead of the whole button group. To restore: put a ref on the group `<div>` and pass `anchor={groupRef}` to `PopoverContent`.
  - `components/site-settings.tsx:101` `onOpenAutoFocus={(e) => e.preventDefault()}` → `initialFocus={false}`; `:100` className `data-[state=closed]:`/`data-[state=open]:` → `data-closed:`/`data-open:`.
  - `PopoverTrigger asChild` → `render={...}` (`docs-copy-page.tsx:212`, `site-settings.tsx:97`).

## Behavior changes

- FLAG: `PopoverAnchor` is inert (see above).
- `onOpenChange(open, eventDetails)`; Radix dismiss/focus callbacks on Content are gone (`initialFocus`/`finalFocus`, Root `onOpenChange` reasons).
- Positioner `collisionPadding` default is 5 (Radix 0).

## Verify by hand

- Site settings popover (desktop): opens aligned to the end of the trigger, focus does NOT jump into it once `initialFocus={false}` is applied; fade/zoom/slide in and out.
- Docs "Copy Page" on a narrow viewport: check where the menu appears (anchor flag).
- Esc / outside click closes; with `sounds`, open/close sounds play once.
