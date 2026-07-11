import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { ButtonState } from "@/registry/bases/editframe/ui/button";

export const buttonConfig: ComponentConfig = {
  componentName: "Button",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    label: { default: "Continue", label: "Label", type: "text" },
    primary: { default: "#171717", label: "Primary", type: "color" },
    size: {
      default: "default",
      label: "Size",
      options: ["sm", "default", "lg"],
      type: "select",
    },
    state: {
      default: "loading",
      label: "State",
      options: ["idle", "hover", "press", "loading", "success"],
      type: "select",
    },
    variant: {
      default: "default",
      label: "Variant",
      options: ["default", "secondary", "destructive", "outline", "ghost"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/button",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as ButtonState) ?? "loading";
    const label = values.label as string | undefined;
    const variant = values.variant as string | undefined;
    const size = values.size as string | undefined;
    const primary = values.primary as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (label !== undefined && label !== "Continue") {
      props.push(`  label="${label}"`);
    }
    if (variant !== undefined && variant !== "default") {
      props.push(`  variant="${variant}"`);
    }
    if (size !== undefined && size !== "default") {
      props.push(`  size="${size}"`);
    }
    if (primary !== undefined && primary !== "#171717") {
      props.push(`  primary="${primary}"`);
    }
    return `import { Button } from "@/components/framecn/button";

<Button
${props.join("\n")}
/>`;
  },
};
