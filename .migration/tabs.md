# tabs

2026-10-29, transformation engine on the user's own file (legacy `new-york` style: radix golden used for classification only). Migrated; wrapper typechecks clean.

## Changed

- `components/ui/tabs.tsx`: `radix-ui` Tabs → `@base-ui/react/tabs`. `Trigger` → `Tab`, `Content` → `Panel` (export names `TabsTrigger`/`TabsContent` unchanged). Types → `TabsPrimitive.<Part>.Props`.
- Kept the card UI verbatim: list `bg-muted/60 … rounded-lg border p-0.5`; trigger `data-[state=active]:{bg-card,border-border,text-foreground,shadow-xs}` → `data-active:*` (`data-active` confirmed in `tabs/tab/TabsTabDataAttributes.d.ts`; Base UI has no `data-selected` on Tab). Added `aria-disabled:pointer-events-none aria-disabled:opacity-50`.
- `sound`/`haptic` + `useFeedback` kept; click handler typed via `TabsPrimitive.Tab.Props["onClick"]`.
- Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/tabs.tsx`: clean.

## Left alone

- cmdk/vaul/sonner wrappers (not radix). No other files edited; consumers belong to the lead's sweep.
- Consumer to sweep: `components/code-block-command.tsx:65` uses `data-[state=active]:` on `TabsTrigger` → `data-active:`.

## Behavior changes

- FLAG (not patched): activation mode. Radix defaulted to automatic (arrow keys select tab); Base UI `List.activateOnFocus` defaults to `false` (manual: arrows move focus, Enter/Space selects). To restore Radix behavior pass `activateOnFocus` to `TabsList`.
- Tab sound fires on click only (as before); with manual activation, keyboard Enter/Space click still triggers it.
- Base UI Root defaults to value `0` when uncontrolled without `defaultValue` (Radix had no active tab).
- Inactive panels: Radix `data-state=inactive` → Base UI `data-hidden`.
- `onValueChange` gains a second `eventDetails` arg.

## Verify by hand

- Install-command tabs: click switches, active tab shows white card + border + shadow.
- Arrow keys move focus; confirm whether selection should follow focus (see flag).
- Sound plays on tab switch.
