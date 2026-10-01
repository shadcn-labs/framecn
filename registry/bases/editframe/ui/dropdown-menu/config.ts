import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { DropdownMenuState } from "@/registry/bases/editframe/ui/dropdown-menu";

export const dropdownMenuConfig: ComponentConfig = {
  componentName: "DropdownMenu",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    highlightedIndex: {
      default: 0,
      label: "Highlighted Index",
      max: 10,
      min: -1,
      step: 1,
      type: "number",
    },
    label: { default: "Options", label: "Label", type: "text" },
    state: {
      default: "opened",
      label: "State",
      options: ["opened", "closed"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/dropdown-menu",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as DropdownMenuState) ?? "opened";
    const label = values.label as string | undefined;
    const highlightedIndex = values.highlightedIndex as number | undefined;
    const props: string[] = [`  state="${state}"`];
    if (label !== undefined && label !== "Options") {
      props.push(`  label="${label}"`);
    }
    if (highlightedIndex !== undefined && highlightedIndex !== -1) {
      props.push(`  highlightedIndex={${highlightedIndex}}`);
    }
    return `import { DropdownMenu } from "@/components/framecn/dropdown-menu";

<DropdownMenu
${props.join("\n")}
/>`;
  },
};
