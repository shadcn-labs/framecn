# collapsible

2026-10-29, transformation engine on the user's own file (legacy `new-york` style: radix golden used for classification only). Migrated; wrapper typechecks clean.

## Changed

- `components/ui/collapsible.tsx`: `radix-ui` Collapsible → `@base-ui/react/collapsible`. `CollapsibleTrigger` → `Trigger`, `CollapsibleContent` → `Panel` (export names unchanged). Types → `CollapsiblePrimitive.<Part>.Props`.
- `sounds` expand/collapse audio kept; `handleOpenChange` now forwards Base UI's `(open, eventDetails)` to the consumer's `onOpenChange`.
- No class strings in the wrapper. Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/collapsible.tsx`: clean.

## Left alone

- cmdk/vaul/sonner wrappers (not radix). No other files edited; consumers belong to the lead's sweep.
- Consumers to sweep:
  - `components/code-collapsible-wrapper.tsx`: `CollapsibleTrigger asChild` (35, 60) → `render={...}`; `forceMount` (53) → `keepMounted`; classes `data-[state=open|closed]` on Root (30), `group-data-[state=closed|open]/collapsible` (38, 59) → Base UI Root renders a plain div with NO state attributes: move these hooks onto Panel/Trigger (`data-open`/`data-closed` on Panel, `data-panel-open` on Trigger) or style via controlled `open`. Panel `data-[state=closed]:` (54) → `data-closed:`.
  - `components/app-sidebar.tsx:220`: `Collapsible asChild` → `render`.

## Behavior changes

- Root no longer emits `data-state`; only Panel (`data-open`/`data-closed`) and Trigger (`data-panel-open`) carry state.
- `onOpenChange` receives a second `eventDetails` arg.
- Collapsible parts no longer emit `data-disabled`.

## Verify by hand

- Code block expand/collapse on a docs page: toggles, sound plays once per change with `sounds`.
- Sidebar nav collapsibles open/close and keep their open styling.
- Closed `keepMounted` panel content still searchable/visible per previous styling.
