import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type { SkeletonState } from "@/registry/bases/editframe/ui/skeleton";

export const skeletonConfig: ComponentConfig = {
  componentName: "Skeleton",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    layout: {
      default: "card",
      label: "Layout",
      options: ["lines", "card"],
      type: "select",
    },
    state: {
      default: "loading",
      label: "State",
      options: ["loading", "loaded"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/skeleton",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as SkeletonState) ?? "loading";
    const layout = values.layout as string | undefined;
    const props: string[] = [`  state="${state}"`];
    if (layout !== undefined && layout !== "lines") {
      props.push(`  layout="${layout}"`);
    }
    return `import { Skeleton } from "@/components/framecn/skeleton";

<Skeleton
${props.join("\n")}
>
  {/* your real content */}
</Skeleton>`;
  },
};
