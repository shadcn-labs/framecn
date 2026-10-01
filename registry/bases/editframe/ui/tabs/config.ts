import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { TabsState } from "@/registry/bases/editframe/ui/tabs";

export const tabsConfig: ComponentConfig = {
  componentName: "Tabs",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    state: {
      default: "Account",
      label: "State",
      options: ["Account", "Password", "Settings"],
      type: "select",
    },
    variant: {
      default: "pill",
      label: "Variant",
      options: ["pill", "underline"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/tabs",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as TabsState) ?? "Account";
    const variant = values.variant as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (variant !== undefined && variant !== "pill") {
      props.push(`  variant="${variant}"`);
    }
    return `import { Tabs } from "@/components/framecn/tabs";

<Tabs
${props.join("\n")}
/>`;
  },
};
