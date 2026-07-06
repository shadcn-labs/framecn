import { FPS, H, W } from "@/lib/customizer-config";
import type { ComponentConfig } from "@/lib/customizer-config";
import type {
  MessageBubbleState,
  MessageBubbleVariant,
} from "@/registry/bases/editframe/ui/message-bubble";

const DEFAULT_TEXT = "Yep, pushing it live now";
const DEFAULT_REACTION = "🔥";

export const messageBubbleConfig: ComponentConfig = {
  componentName: "MessageBubble",
  compositionHeight: H,
  compositionWidth: W,
  controls: {
    reaction: { default: DEFAULT_REACTION, label: "Reaction", type: "text" },
    state: {
      default: "visible",
      label: "State",
      options: ["hidden", "visible"],
      type: "select",
    },
    text: { default: DEFAULT_TEXT, label: "Text", type: "text" },
    variant: {
      default: "incoming",
      label: "Variant",
      options: ["incoming", "outgoing"],
      type: "select",
    },
  },
  durationInFrames: 120,
  fps: FPS,
  importPath: "@/components/framecn/message-bubble",
  previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  snippet: (values) => {
    const state = (values.state as MessageBubbleState) ?? "visible";
    const variant = (values.variant as MessageBubbleVariant) ?? "incoming";
    const text = (values.text as string | undefined) ?? DEFAULT_TEXT;
    const reaction = values.reaction as string | undefined;
    const props: string[] = [`  state="${state}"`, `  variant="${variant}"`];
    if (reaction !== undefined && reaction !== "") {
      props.push(`  reaction="${reaction}"`);
    }
    return `import { MessageBubble } from "@/components/framecn/message-bubble";

<MessageBubble
${props.join("\n")}
>
  ${text}
</MessageBubble>`;
  },
};
