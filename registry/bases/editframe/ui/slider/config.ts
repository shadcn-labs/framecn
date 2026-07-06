import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { SliderThumbState } from "@/registry/bases/editframe/ui/slider";

export const sliderConfig: ComponentConfig = {
  componentName: "Slider",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    showValue: { default: true, label: "Show Value", type: "boolean" },
    thumbState: {
      default: "idle",
      label: "Thumb State",
      options: ["idle", "hover", "press"],
      type: "select",
    },
    value: {
      default: 40,
      label: "Value",
      max: 100,
      min: 0,
      step: 1,
      type: "number",
    },
    width: {
      default: 320,
      label: "Width",
      max: 640,
      min: 120,
      step: 20,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/slider",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const value = values.value as number | undefined;
    const thumbState = values.thumbState as SliderThumbState | undefined;
    const width = values.width as number | undefined;
    const showValue = values.showValue as boolean | undefined;
    const props: string[] = [`  value={${value ?? 0}}`];
    if (thumbState !== undefined && thumbState !== "idle") {
      props.push(`  thumbState="${thumbState}"`);
    }
    if (width !== undefined && width !== 320) {
      props.push(`  width={${width}}`);
    }
    if (showValue) {
      props.push(`  showValue`);
    }
    return `import { Slider } from "@/components/framecn/slider";

<Slider
${props.join("\n")}
/>`;
  },
};
