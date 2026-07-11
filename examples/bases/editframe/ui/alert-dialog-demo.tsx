"use client";

import { AlertDialog } from "@/registry/bases/editframe/ui/alert-dialog";
import { useAlertDialogTransition } from "@/registry/bases/editframe/ui/alert-dialog/use-alert-dialog-transition";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";

export const alertDialogDemoControls = [
  "title",
  "description",
  "actionLabel",
  "cancelLabel",
] as const;

export interface AlertDialogDemoProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
}

export const AlertDialogDemoScene = (p: AlertDialogDemoProps = {}) => {
  // The trigger Button: idle → hover → press, the press lands just before the
  // dialog opens (the "click" that triggers it).
  const trigger = useButtonTransition(
    [
      { at: 14, state: "hover" },
      { at: 26, state: "press" },
    ],
    { variant: "destructive" }
  );
  // The dialog opens right after the press, then closes near the end.
  const dialog = useAlertDialogTransition([
    { at: 32, duration: 16, state: "opened" },
    { at: 92, duration: 12, state: "closed" },
  ]);
  return (
    <>
      <Button label="Delete account" variant="destructive" style={trigger} />
      <AlertDialog
        title={p.title ?? "Delete account?"}
        description={
          p.description ??
          "This action cannot be undone. This will permanently remove your data from our servers."
        }
        actionLabel={p.actionLabel ?? "Delete"}
        cancelLabel={p.cancelLabel ?? "Cancel"}
        style={dialog}
      />
    </>
  );
};

export const alertDialogDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const title = values.title as string | undefined;
  const description = values.description as string | undefined;
  const actionLabel = values.actionLabel as string | undefined;
  const cancelLabel = values.cancelLabel as string | undefined;

  const alertDialogProps: string[] = [];
  if (title !== undefined && title !== "Delete account?") {
    alertDialogProps.push(`title="${title}"`);
  }
  if (
    description !== undefined &&
    description !==
      "This action cannot be undone. This will permanently remove your data from our servers."
  ) {
    alertDialogProps.push(`description="${description}"`);
  }
  if (actionLabel !== undefined && actionLabel !== "Delete") {
    alertDialogProps.push(`actionLabel="${actionLabel}"`);
  }
  if (cancelLabel !== undefined && cancelLabel !== "Cancel") {
    alertDialogProps.push(`cancelLabel="${cancelLabel}"`);
  }

  const alertDialogPropsStr = alertDialogProps.length
    ? ` ${alertDialogProps.join(" ")}`
    : "";

  return `import { AlertDialog } from "@/components/framecn/alert-dialog";
import { useAlertDialogTransition } from "@/components/framecn/use-alert-dialog-transition";
import { Button } from "@/components/framecn/button";
import { useButtonTransition } from "@/components/framecn/use-button-transition";

export const Scene = () => {
  const trigger = useButtonTransition(
    [
      { at: 14, state: "hover" },
      { at: 26, state: "press" },
    ],
    { variant: "destructive" },
  );
  const dialog = useAlertDialogTransition([
    { at: 32, state: "opened", duration: 16 },
    { at: 92, state: "closed", duration: 12 },
  ]);

  return (
    <>
      <Button label="Delete account" variant="destructive" style={trigger} />
      <AlertDialog${alertDialogPropsStr} style={dialog} />
    </>
  );
};`;
};
