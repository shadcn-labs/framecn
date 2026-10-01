import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { CommandMenuState } from "@/registry/bases/editframe/ui/command-menu";

const DEFAULT_QUERY = "";

export const commandMenuConfig: ComponentConfig = {
  componentName: "CommandMenu",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    highlightedIndex: {
      default: 0,
      label: "Highlighted Index",
      max: 5,
      min: -1,
      step: 1,
      type: "number",
    },
    query: { default: DEFAULT_QUERY, label: "Query", type: "text" },
    revealCount: {
      default: 0,
      label: "Reveal Count",
      max: 20,
      min: 0,
      step: 1,
      type: "number",
    },
    selectedIndex: {
      default: -1,
      label: "Selected Index",
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
  importPath: "@/components/framecn/command-menu",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as CommandMenuState) ?? "opened";
    const query = values.query as string | undefined;
    const revealCount = values.revealCount as number | undefined;
    const selectedIndex = values.selectedIndex as number | undefined;
    const highlightedIndex = values.highlightedIndex as number | undefined;
    const props: string[] = [`  state="${state}"`];
    if (query !== undefined && query !== DEFAULT_QUERY) {
      props.push(`  query="${query}"`);
    }
    if (revealCount !== undefined && revealCount !== 0) {
      props.push(`  revealCount={${revealCount}}`);
    }
    if (selectedIndex !== undefined && selectedIndex !== -1) {
      props.push(`  selectedIndex={${selectedIndex}}`);
    }
    if (highlightedIndex !== undefined && highlightedIndex !== -1) {
      props.push(`  highlightedIndex={${highlightedIndex}}`);
    }
    return `import { CommandMenu } from "@/components/framecn/command-menu";

<CommandMenu
${props.join("\n")}
/>`;
  },
};
