import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

const DEFAULT_STEPS = ["Account", "Plan", "Done"];

export const stepperConfig: ComponentConfig = {
  componentName: "Stepper",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    activeIndex: {
      default: 1,
      label: "Active Index",
      max: 2,
      min: 0,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/stepper",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const activeIndex = values.activeIndex as number | undefined;
    const props: string[] = [`  activeIndex={${activeIndex ?? 0}}`];
    const stepsLiteral = JSON.stringify(DEFAULT_STEPS);
    return `import { Stepper } from "@/components/framecn/stepper";

<Stepper
  steps={${stepsLiteral}}
${props.join("\n")}
/>`;
  },
};
