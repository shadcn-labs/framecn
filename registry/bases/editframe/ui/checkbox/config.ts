import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { CheckboxState } from "@/registry/bases/editframe/ui/checkbox";

export const checkboxConfig: ComponentConfig = {
  componentName: "Checkbox",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    label: { default: "", label: "Label", type: "text" },
    primary: { default: "#171717", label: "Primary", type: "color" },
    size: {
      default: "default",
      label: "Size",
      options: ["sm", "default", "lg"],
      type: "select",
    },
    state: {
      default: "checked",
      label: "State",
      options: ["unchecked", "checked"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/checkbox",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as CheckboxState) ?? "checked";
    const label = values.label as string | undefined;
    const size = values.size as string | undefined;
    const primary = values.primary as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (label !== undefined && label !== "") {
      props.push(`  label="${label}"`);
    }
    if (size !== undefined && size !== "default") {
      props.push(`  size="${size}"`);
    }
    if (primary !== undefined && primary !== "#171717") {
      props.push(`  primary="${primary}"`);
    }
    return `import { Checkbox } from "@/components/framecn/checkbox";

<Checkbox
${props.join("\n")}
/>`;
  },
};
