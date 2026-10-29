# dialog

2026-10-29, transformation engine (legacy `new-york` style: radix golden used for classification only; wrapper is CUSTOMIZED: arrow-function style, `sounds` prop with open/close sounds, `overlayClassName`, `showCloseButton`). Verdict: migrated to `@base-ui/react/dialog`, own classes kept, typecheck clean for this file.

## Changed

- `components/ui/dialog.tsx`
  - Import `radix-ui` → `import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"`.
  - Types: `React.ComponentProps<typeof DialogPrimitive.X>` → `DialogPrimitive.X.Props`; Overlay → `Backdrop.Props`, Content → `Popup.Props`.
  - `Dialog`: keeps `sounds` + open/close sound logic (controlled-sync effect unchanged). `handleOpenChange` now forwards Base UI's `(open, eventDetails)` to the consumer `onOpenChange`.
  - `DialogOverlay` renders `DialogPrimitive.Backdrop`; `DialogContent` renders `DialogPrimitive.Popup` (centered modal, no Positioner); `overlayClassName` / `showCloseButton` kept.
  - Class renames: `data-[state=open]:` → `data-open:`, `data-[state=closed]:` → `data-closed:` (overlay, popup, close button). tw-animate keyframes kept (same as the shadcn base registry dialog; Base UI keeps the popup mounted until CSS animations finish).
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/dialog.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- `components/ui/command.tsx` imports this wrapper (`CommandDialog`). It now fails typecheck: `command.tsx(52,9)` — `React.ComponentProps<typeof Dialog>["children"]` is now `ReactNode | PayloadChildRenderFunction` (Base UI Root accepts a payload render function) and is passed into `<Command>`. Fix for the lead: type `children` in CommandDialog as `React.ReactNode` (`Omit<React.ComponentProps<typeof Dialog>, "children"> & { children?: React.ReactNode }`). Not edited here (cmdk wrapper, not owned).
- Consumer sweep (lead): `DialogTrigger asChild` / `DialogClose asChild` → `render={...}` in `command-menu.tsx:280`, `registry-add-button.tsx:139,155`; `registry-add-button.tsx:89` passes a React `MouseEvent` handler where Base UI expects `BaseUIEvent<...>`.

## Behavior changes

- `onOpenChange` receives a second `eventDetails` argument; Radix per-interaction props (`onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside`) no longer exist on `DialogContent` → use Popup `initialFocus` / `finalFocus` and Root `onOpenChange` reasons + `eventDetails.cancel()`.
- `DialogPortal` now renders a real `<div>` (Base UI Portal), so `data-slot="dialog-portal"` lands on the DOM.
- Base UI focuses the first tabbable element in the popup on open (Radix did too); nested dialogs: Backdrop is not rendered for nested dialogs unless `forceRender`.

## Verify by hand

- Open the command menu (⌘K) and the pro-unlock / registry-add dialogs: fade+zoom in, fade+zoom out (exit animation must play, not snap).
- Esc and outside click close; focus returns to the trigger.
- Tab cycles inside the dialog only; X button closes.
- With `sounds`, open/close sounds play once each (both trigger-driven and controlled `open`).
