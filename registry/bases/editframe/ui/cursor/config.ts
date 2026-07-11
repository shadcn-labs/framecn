import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const cursorConfig: ComponentConfig = {
  componentName: "Cursor",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    rippleColor: { default: "#171717", label: "Ripple", type: "color" },
    size: {
      default: 28,
      label: "Size",
      max: 64,
      min: 16,
      step: 2,
      type: "number",
    },
    variant: {
      default: "arrow",
      label: "Variant",
      options: ["arrow", "pointer"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/cursor",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const variant = values.variant as string | undefined;
    const size = values.size as number | undefined;
    const props: string[] = ["  style={style}"];
    if (variant !== undefined && variant !== "arrow") {
      props.push(`  variant="${variant}"`);
    }
    if (size !== undefined && size !== 28) {
      props.push(`  size={${size}}`);
    }
    return `import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";

// The cursor is value-channel driven: \`useCursorPath\` reads the frame and
// returns the animated \`CursorStyle\`; \`<Cursor>\` itself stays pure.
const style = useCursorPath([
  { at: 0, x: 120, y: 120 },
  { at: 24, x: 360, y: 200, click: true },
]);

<Cursor
${props.join("\n")}
/>`;
  },
};
