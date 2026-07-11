import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { TooltipState } from "@/registry/bases/editframe/ui/tooltip";

const DEFAULT_LABEL = "Add to library";

export const tooltipConfig: ComponentConfig = {
  componentName: "Tooltip",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    label: { default: DEFAULT_LABEL, label: "Label", type: "text" },
    side: {
      default: "top",
      label: "Side",
      options: ["top", "bottom", "left", "right"],
      type: "select",
    },
    state: {
      default: "visible",
      label: "State",
      options: ["hidden", "visible"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/tooltip",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as TooltipState) ?? "visible";
    const label = values.label as string | undefined;
    const side = values.side as string | undefined;
    const props: string[] = [
      `  state="${state}"`,
      `  label="${label ?? DEFAULT_LABEL}"`,
    ];
    if (side !== undefined && side !== "top") {
      props.push(`  side="${side}"`);
    }
    return `import { Tooltip } from "@/components/framecn/tooltip";

<Tooltip
${props.join("\n")}
/>`;
  },
};
