import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { ToastState } from "@/registry/bases/editframe/ui/toast";

const DEFAULT_TITLE = "Changes saved";
const DEFAULT_DESCRIPTION = "Your profile has been updated.";

export const toastConfig: ComponentConfig = {
  componentName: "Toast",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    description: {
      default: DEFAULT_DESCRIPTION,
      label: "Description",
      type: "text",
    },
    state: {
      default: "visible",
      label: "State",
      options: ["hidden", "visible"],
      type: "select",
    },
    title: { default: DEFAULT_TITLE, label: "Title", type: "text" },
    variant: {
      default: "success",
      label: "Variant",
      options: ["default", "success", "error"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/toast",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as ToastState) ?? "visible";
    const title = values.title as string | undefined;
    const description = values.description as string | undefined;
    const variant = values.variant as string | undefined;
    const props: string[] = [
      `  state="${state}"`,
      `  title="${title ?? DEFAULT_TITLE}"`,
    ];
    if (description !== undefined && description !== DEFAULT_DESCRIPTION) {
      props.push(`  description="${description}"`);
    }
    if (variant !== undefined && variant !== "default") {
      props.push(`  variant="${variant}"`);
    }
    return `import { Toast } from "@/components/framecn/toast";

<Toast
${props.join("\n")}
/>`;
  },
};
