# project

2026-10-29, whole-project mode, transformation engine (legacy `new-york` style: no base-<style> golden pair, so each wrapper was transformed in place keeping its own classes). Verdict: every `components/ui` wrapper and all app code run on `@base-ui/react` 1.9.0; `radix-ui` is removed.

## Changed

- Dependencies: added `@base-ui/react@^1.9.0`; removed `radix-ui` (`pnpm remove radix-ui`).
- Wrappers: see the per-component reports in this directory (button, badge, frame, separator, label, aspect-ratio, toggle, switch, slider, dialog, sheet, popover, tooltip, context-menu, dropdown-menu, navigation-menu, accordion, collapsible, tabs, sidebar).
- App-code sweep: every `asChild` became `render={<El />}` (plus `nativeButton={false}` for buttons rendered as links); `delayDuration` → `delay`; `onOpenAutoFocus`/`onCloseAutoFocus` → `initialFocus`/`finalFocus`; menu `onSelect` → `onClick`; `DropdownMenuLabel` wrapped in `DropdownMenuGroup`; Accordion `type`/`collapsible` removed; Collapsible `forceMount` → `keepMounted`; `data-[state=…]` consumer classes → Base UI data attributes; Slider value typing.
- Component panel header: Previous / Next / View as Markdown share ONE tooltip popup via `createTooltipHandle` (detached triggers), so moving between buttons moves the popup instead of re-animating.
- Leftover scan: `grep -rn "radix-ui\|@radix-ui\|--radix-" app components hooks lib mdx-components.tsx styles` is empty.

## Left alone

- `components/ui/command.tsx` (cmdk), `components/ui/drawer.tsx` (vaul), `components/ui/sonner.tsx` (sonner): not Radix. vaul still depends on `@radix-ui/react-dialog` transitively; that is vaul's dependency, not ours. `command.tsx` only had its `CommandDialog` children type narrowed.
- `components.json` style switched `new-york` → `base-vega` (the classic shadcn look on Base UI); `shadcn info` now reports `base: base`, so future `shadcn add` delivers Base UI variants. New components arrive with vega's stock classes and need the site's card/frame styling applied by hand.

## Behavior changes

- Tabs activate manually (arrow keys move focus, Enter/Space selects).
- Accordion `value` is always an array; arrow-key navigation between triggers is gone.
- Menu checkbox/radio items no longer close the menu on click; `DropdownMenuLabel` requires a `DropdownMenuGroup`.
- Tooltip default `sideOffset` is 4 (Base UI does not add the arrow height).
- `PopoverAnchor` / `NavigationMenuIndicator` are inert placeholders.

## Verify by hand

Typecheck clean except the pre-existing `lib/auth.ts`, `lib/billing.ts` and `app/api/auth` errors. Smoke-checked in the dev server: `/`, `/components`, `/pricing`, `/docs/installation`, `/docs/changelog`, `/brand`, `/contact` load with no console errors; panel tooltip moves Previous → Next as one popup; Copy prompt menu opens with 5 items; Command/Manual tabs switch; pricing FAQ accordion opens.
