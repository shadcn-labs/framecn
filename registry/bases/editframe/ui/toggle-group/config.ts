import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { ToggleGroupState } from "@/registry/bases/editframe/ui/toggle-group";

export const toggleGroupConfig: ComponentConfig = {
  componentName: "ToggleGroup",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    size: {
      default: "default",
      label: "Size",
      options: ["default", "sm"],
      type: "select",
    },
    state: {
      default: "Monthly",
      label: "State",
      options: ["Monthly", "Yearly"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/toggle-group",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as ToggleGroupState) ?? "Monthly";
    const size = values.size as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (size !== undefined && size !== "default") {
      props.push(`  size="${size}"`);
    }
    return `import { ToggleGroup } from "@/components/framecn/toggle-group";

<ToggleGroup
${props.join("\n")}
  items={[
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ]}
/>`;
  },
};
