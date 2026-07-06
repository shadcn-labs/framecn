import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { ContextMenuState } from "@/registry/bases/editframe/ui/context-menu";

const DEFAULT_ITEMS = ["Back", "Reload", "Save As…", "Inspect"];

export const contextMenuConfig: ComponentConfig = {
  componentName: "ContextMenu",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    highlightedIndex: {
      default: 1,
      label: "Highlighted Index",
      max: 5,
      min: -1,
      step: 1,
      type: "number",
    },
    state: {
      default: "opened",
      label: "State",
      options: ["opened", "closed"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/context-menu",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as ContextMenuState) ?? "opened";
    const highlightedIndex = values.highlightedIndex as number | undefined;
    const props: string[] = [`  state="${state}"`];
    if (highlightedIndex !== undefined && highlightedIndex !== -1) {
      props.push(`  highlightedIndex={${highlightedIndex}}`);
    }
    const itemsLiteral = JSON.stringify(DEFAULT_ITEMS);
    return `import { ContextMenu } from "@/components/framecn/context-menu";

<ContextMenu
${props.join("\n")}
  items={${itemsLiteral}}
/>`;
  },
};
