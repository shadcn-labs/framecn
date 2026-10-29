# sheet

2026-10-29, transformation engine (legacy `new-york`; CUSTOMIZED wrapper: arrow functions, `sounds` prop with drawer open/close sounds). Verdict: migrated to `@base-ui/react/dialog`, own classes kept, slide animation restated as Base UI transitions; typecheck clean for this file.

## Changed

- `components/ui/sheet.tsx`
  - Import → `import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"`; types → `SheetPrimitive.X.Props` (Overlay → `Backdrop.Props`, Content → `Popup.Props`).
  - `Sheet`: `sounds` logic kept; `handleOpenChange` forwards `(open, eventDetails)`.
  - `SheetOverlay` → `Backdrop` (classes renamed `data-[state=*]:` → `data-open:`/`data-closed:`).
  - `SheetContent` → `Popup`. Per the skill's sheet rule, the tw-animate `slide-in-from-*`/`slide-out-to-*` keyed on `data-[state]` were restated as transitions: `data-starting-style:` / `data-ending-style:` `translate-x-full` (right), `-translate-x-full` (left), `-translate-y-full` (top), `translate-y-full` (bottom). The user's `transition ease-in-out` and timing kept as `data-open:duration-500` / `data-closed:duration-300` (full-panel slide, same look as before).
  - Close button: `data-[state=open]:bg-secondary` → `data-open:bg-secondary`.
  - Leftover scan `grep -n "radix-ui\|@radix-ui" components/ui/sheet.tsx`: clean.

## Left alone

- `components/ui/command.tsx` (cmdk), `drawer.tsx` (vaul), `sonner.tsx`: not radix; untouched.
- `components/ui/sidebar.tsx` imports Sheet (owned by another migration slice); no Sheet API change affects it besides `onOpenChange` gaining `eventDetails`.

## Behavior changes

- `onOpenChange(open, eventDetails)` signature; Radix `onOpenAutoFocus`/`onCloseAutoFocus`/dismiss callbacks on `SheetContent` are gone (use `initialFocus`/`finalFocus`, Root `onOpenChange` reasons).
- `SheetPortal` renders a real `<div>`.

## Verify by hand

- Mobile sidebar (narrow viewport): sheet slides in from the side over ~500ms, slides out over ~300ms; overlay fades.
- Esc / overlay click closes; focus returns to the toggle button.
- With `sounds`, drawer open/close sounds play once.
