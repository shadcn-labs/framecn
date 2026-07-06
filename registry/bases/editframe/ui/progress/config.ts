import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const progressConfig: ComponentConfig = {
  componentName: "Progress",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    showLabel: { default: true, label: "Show Label", type: "boolean" },
    value: {
      default: 62,
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
  importPath: "@/components/framecn/progress",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const value = values.value as number | undefined;
    const width = values.width as number | undefined;
    const showLabel = values.showLabel as boolean | undefined;
    const props: string[] = [`  value={${value ?? 0}}`];
    if (width !== undefined && width !== 320) {
      props.push(`  width={${width}}`);
    }
    if (showLabel) {
      props.push(`  showLabel`);
    }
    return `import { Progress } from "@/components/framecn/progress";

<Progress
${props.join("\n")}
/>`;
  },
};
