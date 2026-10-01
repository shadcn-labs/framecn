import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { SelectState } from "@/registry/bases/editframe/ui/select";

export const selectConfig: ComponentConfig = {
  componentName: "Select",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    highlightedIndex: {
      default: -1,
      label: "Highlighted Index",
      max: 3,
      min: -1,
      step: 1,
      type: "number",
    },
    label: { default: "Select a fruit", label: "Label", type: "text" },
    selectedIndex: {
      default: 1,
      label: "Selected Index",
      max: 3,
      min: -1,
      step: 1,
      type: "number",
    },
    state: {
      default: "opened",
      label: "State",
      options: ["opened", "closed"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/select",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as SelectState) ?? "opened";
    const label = values.label as string | undefined;
    const selectedIndex = values.selectedIndex as number | undefined;
    const highlightedIndex = values.highlightedIndex as number | undefined;
    const props: string[] = [`  state="${state}"`];
    if (label !== undefined && label !== "Select a fruit") {
      props.push(`  label="${label}"`);
    }
    if (selectedIndex !== undefined && selectedIndex !== -1) {
      props.push(`  selectedIndex={${selectedIndex}}`);
    }
    if (highlightedIndex !== undefined && highlightedIndex !== -1) {
      props.push(`  highlightedIndex={${highlightedIndex}}`);
    }
    return `import { Select } from "@/components/framecn/select";

<Select
${props.join("\n")}
/>`;
  },
};
