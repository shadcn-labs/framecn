import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { DialogState } from "@/registry/bases/editframe/ui/dialog";

const DEFAULT_DESCRIPTION =
  "Make changes to your profile here. Click save when you're done.";

export const dialogConfig: ComponentConfig = {
  componentName: "Dialog",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    actionLabel: {
      default: "Save changes",
      label: "Action Label",
      type: "text",
    },
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
    title: { default: "Edit profile", label: "Title", type: "text" },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/dialog",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as DialogState) ?? "opened";
    const title = values.title as string | undefined;
    const description = values.description as string | undefined;
    const actionLabel = values.actionLabel as string | undefined;
    const cancelLabel = values.cancelLabel as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (title !== undefined && title !== "Edit profile") {
      props.push(`  title="${title}"`);
    }
    if (description !== undefined && description !== DEFAULT_DESCRIPTION) {
      props.push(`  description="${description}"`);
    }
    if (actionLabel !== undefined && actionLabel !== "Save changes") {
      props.push(`  actionLabel="${actionLabel}"`);
    }
    if (cancelLabel !== undefined && cancelLabel !== "Cancel") {
      props.push(`  cancelLabel="${cancelLabel}"`);
    }
    return `import { Dialog } from "@/components/framecn/dialog";

<Dialog
${props.join("\n")}
/>`;
  },
};
