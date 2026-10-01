"use client";

import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Sheet } from "@/registry/bases/editframe/ui/sheet";
import { useSheetTransition } from "@/registry/bases/editframe/ui/sheet/use-sheet-transition";

export const sheetDemoControls = [
  "title",
  "description",
  "actionLabel",
  "cancelLabel",
] as const;

export interface SheetDemoProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
}

export const SheetDemoScene = (p: SheetDemoProps = {}) => {
  // The trigger Button: idle → hover → press, the press lands just before the
  // sheet opens (the "click" that triggers it).
  const trigger = useButtonTransition([
    { at: 14, state: "hover" },
    { at: 26, state: "press" },
  ]);
  // The sheet slides in right after the press, then closes near the end.
  const sheet = useSheetTransition([
    { at: 32, duration: 16, state: "opened" },
    { at: 92, duration: 12, state: "closed" },
  ]);
  return (
    <>
      <Button label="Edit profile" style={trigger} />
      <Sheet
        title={p.title ?? "Edit profile"}
        description={
          p.description ??
          "Make changes to your profile here. Click save when you're done."
        }
        actionLabel={p.actionLabel ?? "Save changes"}
        cancelLabel={p.cancelLabel ?? "Cancel"}
        style={sheet}
      />
    </>
  );
};

export const sheetDemoCode = (values: Record<string, unknown> = {}): string => {
  const title = values.title as string | undefined;
  const description = values.description as string | undefined;
  const actionLabel = values.actionLabel as string | undefined;
  const cancelLabel = values.cancelLabel as string | undefined;

  const sheetProps: string[] = [];
  if (title !== undefined && title !== "Edit profile") {
    sheetProps.push(`title="${title}"`);
  }
  if (
    description !== undefined &&
    description !==
      "Make changes to your profile here. Click save when you're done."
  ) {
    sheetProps.push(`description="${description}"`);
  }
  if (actionLabel !== undefined && actionLabel !== "Save changes") {
    sheetProps.push(`actionLabel="${actionLabel}"`);
  }
  if (cancelLabel !== undefined && cancelLabel !== "Cancel") {
    sheetProps.push(`cancelLabel="${cancelLabel}"`);
  }

  const sheetPropsStr = sheetProps.length ? ` ${sheetProps.join(" ")}` : "";

  return `import { Sheet } from "@/components/framecn/sheet";
import { useSheetTransition } from "@/components/framecn/use-sheet-transition";
import { Button } from "@/components/framecn/button";
import { useButtonTransition } from "@/components/framecn/use-button-transition";

export const Scene = () => {
  const trigger = useButtonTransition([
    { at: 14, state: "hover" },
    { at: 26, state: "press" },
  ]);
  const sheet = useSheetTransition([
    { at: 32, state: "opened", duration: 16 },
    { at: 92, state: "closed", duration: 12 },
  ]);

  return (
    <>
      <Button label="Edit profile" style={trigger} />
      <Sheet${sheetPropsStr} style={sheet} />
    </>
  );
};`;
};
