# accordion

2026-10-29, transformation engine on the user's own file (legacy `new-york` style: radix golden used for classification only). Migrated; wrapper typechecks clean.

## Changed

- `components/ui/accordion.tsx`: `radix-ui` Accordion → `@base-ui/react/accordion`. Types `React.ComponentProps<typeof X>` → `AccordionPrimitive.<Part>.Props`. `Content` → `Panel` (export name `AccordionContent` unchanged).
- Trigger: `[&[data-state=open]>svg]:rotate-180` → `[&[data-panel-open]>svg]:rotate-180`; added `aria-disabled:pointer-events-none aria-disabled:opacity-50` beside the `disabled:` classes. `sound`/`haptic` + `useFeedback` kept; `handleClick` typed as `AccordionPrimitive.Trigger.Props["onClick"]` (BaseUIEvent).
- Panel: `data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down` → `h-(--accordion-panel-height) transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0` (tw-animate-css `accordion-down/up` keyframes only read `--radix-accordion-content-height`, so they cannot be reused).
- Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/accordion.tsx`: clean.

## Left alone

- cmdk/vaul/sonner wrappers (not radix). No other files edited; consumers belong to the lead's sweep.
- Consumer to sweep: `app/(app)/pricing/page.tsx:233` uses `type="single" collapsible` → drop both (single is default; Base UI single mode is always collapsible). Any `value`/`defaultValue` must become arrays.

## Behavior changes

- Root `value`/`defaultValue`/`onValueChange` are always arrays now (`["a"]`), even single mode.
- `collapsible` prop is gone: single mode is always collapsible (Radix default was NOT collapsible unless set).
- No roving arrow-key focus between triggers (Base UI dropped it per APG); Tab moves between triggers.
- Panel animation now CSS-transition based; same 200ms ease-out height feel.

## Verify by hand

- Open/close an item on /pricing: height animates both ways, chevron rotates.
- Click an open item: it collapses (single mode).
- Trigger with `sound` plays once per click.
- Tab through triggers; Enter/Space toggles.
