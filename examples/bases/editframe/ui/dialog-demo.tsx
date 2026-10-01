"use client";

import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Dialog } from "@/registry/bases/editframe/ui/dialog";
import { useDialogTransition } from "@/registry/bases/editframe/ui/dialog/use-dialog-transition";

export const dialogDemoControls = [
  "title",
  "description",
  "actionLabel",
  "cancelLabel",
] as const;

export interface DialogDemoProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
}

export const DialogDemoScene = (p: DialogDemoProps = {}) => {
  // The trigger Button: idle → hover → press, the press lands just before the
  // dialog opens (the "click" that triggers it).
  const trigger = useButtonTransition([
    { at: 14, state: "hover" },
    { at: 26, state: "press" },
  ]);
  // The dialog opens right after the press, then closes near the end.
  const dialog = useDialogTransition([
    { at: 32, duration: 16, state: "opened" },
    { at: 92, duration: 12, state: "closed" },
  ]);
  return (
    <>
      <Button label="Edit profile" style={trigger} />
      <Dialog
        title={p.title ?? "Edit profile"}
        description={
          p.description ??
          "Make changes to your profile here. Click save when you're done."
        }
        actionLabel={p.actionLabel ?? "Save changes"}
        cancelLabel={p.cancelLabel ?? "Cancel"}
        style={dialog}
      />
    </>
  );
};

export const dialogDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const title = values.title as string | undefined;
  const description = values.description as string | undefined;
  const actionLabel = values.actionLabel as string | undefined;
  const cancelLabel = values.cancelLabel as string | undefined;

  const dialogProps: string[] = [];
  if (title !== undefined && title !== "Edit profile") {
    dialogProps.push(`title="${title}"`);
  }
  if (
    description !== undefined &&
    description !==
      "Make changes to your profile here. Click save when you're done."
  ) {
    dialogProps.push(`description="${description}"`);
  }
  if (actionLabel !== undefined && actionLabel !== "Save changes") {
    dialogProps.push(`actionLabel="${actionLabel}"`);
  }
  if (cancelLabel !== undefined && cancelLabel !== "Cancel") {
    dialogProps.push(`cancelLabel="${cancelLabel}"`);
  }

  const dialogPropsStr = dialogProps.length ? ` ${dialogProps.join(" ")}` : "";

  return `import { Dialog } from "@/components/framecn/dialog";
import { useDialogTransition } from "@/components/framecn/use-dialog-transition";
import { Button } from "@/components/framecn/button";
import { useButtonTransition } from "@/components/framecn/use-button-transition";

export const Scene = () => {
  const trigger = useButtonTransition([
    { at: 14, state: "hover" },
    { at: 26, state: "press" },
  ]);
  const dialog = useDialogTransition([
    { at: 32, state: "opened", duration: 16 },
    { at: 92, state: "closed", duration: 12 },
  ]);

  return (
    <>
      <Button label="Edit profile" style={trigger} />
      <Dialog${dialogPropsStr} style={dialog} />
    </>
  );
};`;
};
