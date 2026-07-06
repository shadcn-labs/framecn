import { FPS, H, SHARED_CONTROLS, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type {
  BlurInDirection,
  BlurInState,
} from "@/registry/bases/editframe/ui/blur-in";

export const blurInConfig: ComponentConfig = {
  componentName: "BlurIn",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    blur: {
      default: 8,
      label: "Blur",
      max: 40,
      min: 0,
      step: 1,
      type: "number",
    },
    direction: {
      default: "up",
      label: "Direction",
      options: ["up", "down", "left", "right"],
      type: "select",
    },
    distance: {
      default: 12,
      label: "Distance",
      max: 80,
      min: 0,
      step: 1,
      type: "number",
    },
    state: {
      default: "revealed",
      label: "State",
      options: ["hidden", "revealed"],
      type: "select",
    },
    ...SHARED_CONTROLS,
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/blur-in",
  snippet: (values) => {
    const state = (values.state as BlurInState) ?? "revealed";
    const blur = values.blur as number | undefined;
    const distance = values.distance as number | undefined;
    const direction = values.direction as BlurInDirection | undefined;
    const props: string[] = [`  state="${state}"`];
    if (direction !== undefined && direction !== "up") {
      props.push(`  direction="${direction}"`);
    }
    if (blur !== undefined && blur !== 8) {
      props.push(`  blur={${blur}}`);
    }
    if (distance !== undefined && distance !== 12) {
      props.push(`  distance={${distance}}`);
    }
    return `import { BlurIn } from "@/components/framecn/blur-in";

<BlurIn
${props.join("\n")}
>
  {/* your element */}
</BlurIn>`;
  },
};
