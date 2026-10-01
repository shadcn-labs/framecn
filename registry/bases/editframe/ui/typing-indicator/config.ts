import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";

export const typingIndicatorConfig: ComponentConfig = {
  componentName: "TypingIndicator",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    amplitude: {
      default: 5,
      label: "Bounce",
      max: 14,
      min: 0,
      step: 1,
      type: "number",
    },
    dotCount: {
      default: 3,
      label: "Dots",
      max: 5,
      min: 2,
      step: 1,
      type: "number",
    },
    size: {
      default: 8,
      label: "Dot size",
      max: 16,
      min: 4,
      step: 1,
      type: "number",
    },
  },
  durationInFrames: 90,
  fps: FPS,
  importPath: "@/components/framecn/typing-indicator",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const dotCount = (values.dotCount as number | undefined) ?? 3;
    const size = (values.size as number | undefined) ?? 8;
    const amplitude = (values.amplitude as number | undefined) ?? 5;
    const speed = (values.speed as number | undefined) ?? 1;
    const props: string[] = [];
    if (dotCount !== 3) {
      props.push(`  dotCount={${dotCount}}`);
    }
    if (size !== 8) {
      props.push(`  size={${size}}`);
    }
    if (amplitude !== 5) {
      props.push(`  amplitude={${amplitude}}`);
    }
    if (speed !== 1) {
      props.push(`  speed={${speed}}`);
    }
    const body = props.length > 0 ? `\n${props.join("\n")}\n` : " ";
    return `import { TypingIndicator } from "@/components/framecn/typing-indicator";

<TypingIndicator${body}/>`;
  },
};
