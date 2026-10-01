import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { AlertDialogState } from "@/registry/bases/editframe/ui/alert-dialog";

const DEFAULT_DESCRIPTION =
  "This action cannot be undone. This will permanently remove your data from our servers.";

export const alertDialogConfig: ComponentConfig = {
  componentName: "AlertDialog",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    actionLabel: { default: "Delete", label: "Action Label", type: "text" },
    cancelLabel: { default: "Cancel", label: "Cancel Label", type: "text" },
    description: {
      default: DEFAULT_DESCRIPTION,
      label: "Description",
      type: "text",
    },
    state: {
      default: "opened",
      label: "State",
      options: ["opened", "closed"],
      type: "select",
    },
    title: { default: "Delete account?", label: "Title", type: "text" },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/alert-dialog",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as AlertDialogState) ?? "opened";
    const title = values.title as string | undefined;
    const description = values.description as string | undefined;
    const actionLabel = values.actionLabel as string | undefined;
    const cancelLabel = values.cancelLabel as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (title !== undefined && title !== "Delete account?") {
      props.push(`  title="${title}"`);
    }
    if (description !== undefined && description !== DEFAULT_DESCRIPTION) {
      props.push(`  description="${description}"`);
    }
    if (actionLabel !== undefined && actionLabel !== "Delete") {
      props.push(`  actionLabel="${actionLabel}"`);
    }
    if (cancelLabel !== undefined && cancelLabel !== "Cancel") {
      props.push(`  cancelLabel="${cancelLabel}"`);
    }
    return `import { AlertDialog } from "@/components/framecn/alert-dialog";

<AlertDialog
${props.join("\n")}
/>`;
  },
};
