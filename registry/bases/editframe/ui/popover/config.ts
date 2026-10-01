import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { PopoverState } from "@/registry/bases/editframe/ui/popover";

const DEFAULT_TITLE = "Dimensions";
const DEFAULT_DESCRIPTION = "Set the dimensions for the layer.";

export const popoverConfig: ComponentConfig = {
  componentName: "Popover",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    description: {
      default: DEFAULT_DESCRIPTION,
      label: "Description",
      type: "text",
    },
    side: {
      default: "bottom",
      label: "Side",
      options: ["top", "bottom", "left", "right"],
      type: "select",
    },
    state: {
      default: "opened",
      label: "State",
      options: ["opened", "closed"],
      type: "select",
    },
    title: { default: DEFAULT_TITLE, label: "Title", type: "text" },
    width: {
      default: 288,
      label: "Width",
      max: 480,
      min: 160,
      step: 8,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/popover",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as PopoverState) ?? "opened";
    const title = values.title as string | undefined;
    const description = values.description as string | undefined;
    const side = values.side as string | undefined;
    const width = values.width as number | undefined;
    const props: string[] = [`  state="${state}"`];
    if (title !== undefined && title !== "") {
      props.push(`  title="${title}"`);
    }
    if (description !== undefined && description !== "") {
      props.push(`  description="${description}"`);
    }
    if (side !== undefined && side !== "bottom") {
      props.push(`  side="${side}"`);
    }
    if (width !== undefined && width !== 288) {
      props.push(`  width={${width}}`);
    }
    return `import { Popover } from "@/components/framecn/popover";

<Popover
${props.join("\n")}
/>`;
  },
};
