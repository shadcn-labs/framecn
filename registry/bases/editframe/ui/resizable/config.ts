import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type {
  ResizableDirection,
  ResizableHandleState,
} from "@/registry/bases/editframe/ui/resizable";

export const resizableConfig: ComponentConfig = {
  componentName: "Resizable",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    direction: {
      default: "horizontal",
      label: "Direction",
      options: ["horizontal", "vertical"],
      type: "select",
    },
    handleState: {
      default: "idle",
      label: "Handle State",
      options: ["idle", "hover", "press"],
      type: "select",
    },
    ratio: {
      default: 0.5,
      label: "Ratio",
      max: 1,
      min: 0,
      step: 0.05,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/resizable",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const ratio = values.ratio as number | undefined;
    const handleState = values.handleState as ResizableHandleState | undefined;
    const direction = values.direction as ResizableDirection | undefined;
    const props: string[] = [`  ratio={${ratio ?? 0.5}}`];
    if (handleState !== undefined && handleState !== "idle") {
      props.push(`  handleState="${handleState}"`);
    }
    if (direction !== undefined && direction !== "horizontal") {
      props.push(`  direction="${direction}"`);
    }
    return `import { Resizable } from "@/components/framecn/resizable";

<Resizable
${props.join("\n")}
/>`;
  },
};
