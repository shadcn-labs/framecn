import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { AccordionState } from "@/registry/bases/editframe/ui/accordion";

export const accordionConfig: ComponentConfig = {
  componentName: "Accordion",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    content: {
      default: "Yes. It adheres to the WAI-ARIA design pattern.",
      label: "Content",
      type: "text",
    },
    state: {
      default: "opened",
      label: "State",
      options: ["opened", "closed"],
      type: "select",
    },
    title: { default: "Is it accessible?", label: "Title", type: "text" },
    variant: {
      default: "default",
      label: "Variant",
      options: ["default", "ghost"],
      type: "select",
    },
  },
  durationInFrames: 100,
  fps: FPS,
  importPath: "@/components/framecn/accordion",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as AccordionState) ?? "opened";
    const title = values.title as string | undefined;
    const content = values.content as string | undefined;
    const variant = values.variant as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (title !== undefined && title !== "Is it accessible?") {
      props.push(`  title="${title}"`);
    }
    if (
      content !== undefined &&
      content !== "Yes. It adheres to the WAI-ARIA design pattern."
    ) {
      props.push(`  content="${content}"`);
    }
    if (variant !== undefined && variant !== "default") {
      props.push(`  variant="${variant}"`);
    }
    return `import { Accordion } from "@/components/framecn/accordion";

<Accordion
${props.join("\n")}
/>`;
  },
};
