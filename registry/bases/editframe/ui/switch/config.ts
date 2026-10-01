import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { SwitchState } from "@/registry/bases/editframe/ui/switch";

export const switchConfig: ComponentConfig = {
  componentName: "Switch",
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
  importPath: "@/components/framecn/switch",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as SwitchState) ?? "checked";
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
    return `import { Switch } from "@/components/framecn/switch";

<Switch
${props.join("\n")}
/>`;
  },
};
