import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { InputState } from "@/registry/bases/editframe/ui/input";

export const inputConfig: ComponentConfig = {
  componentName: "Input",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    placeholder: {
      default: "you@example.com",
      label: "Placeholder",
      type: "text",
    },
    primary: { default: "#171717", label: "Primary", type: "color" },
    size: {
      default: "default",
      label: "Size",
      options: ["sm", "default", "lg"],
      type: "select",
    },
    state: {
      default: "typing",
      label: "State",
      options: ["idle", "hover", "active", "typing", "blur", "invalid"],
      type: "select",
    },
    value: { default: "remotion@remocn.dev", label: "Value", type: "text" },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/input",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as InputState) ?? "typing";
    const placeholder = values.placeholder as string | undefined;
    const value = values.value as string | undefined;
    const size = values.size as string | undefined;
    const primary = values.primary as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (placeholder !== undefined && placeholder !== "you@example.com") {
      props.push(`  placeholder="${placeholder}"`);
    }
    if (value !== undefined && value !== "remotion@remocn.dev") {
      props.push(`  value="${value}"`);
    }
    if (size !== undefined && size !== "default") {
      props.push(`  size="${size}"`);
    }
    if (primary !== undefined && primary !== "#171717") {
      props.push(`  primary="${primary}"`);
    }
    return `import { Input } from "@/components/framecn/input";

<Input
${props.join("\n")}
/>`;
  },
};
