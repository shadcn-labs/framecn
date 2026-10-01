"use client";

import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "@/lib/framecn-ui";
import { MessageBubble } from "@/registry/bases/editframe/ui/message-bubble";
import type {
  MessageBubbleReactionStyle,
  MessageBubbleVariant,
} from "@/registry/bases/editframe/ui/message-bubble";
import { useMessageBubbleTransition } from "@/registry/bases/editframe/ui/message-bubble/use-message-bubble-transition";

const REVEAL_AT = 16;
const REACT_AT = 44;

export const messageBubbleDemoControls = [
  "text",
  "variant",
  "reaction",
] as const;

export interface MessageBubbleDemoProps {
  text?: string;
  variant?: MessageBubbleVariant;
  reaction?: string;
}

export const MessageBubbleDemoScene = (p: MessageBubbleDemoProps = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const variant = p.variant ?? "incoming";
  const text = p.text ?? "Yep, pushing it live now";
  const reaction = p.reaction === "" ? undefined : (p.reaction ?? "🔥");

  const bubbleStyle = useMessageBubbleTransition([
    { at: REVEAL_AT, duration: 14, state: "visible" },
  ]);

  const reactionStyle: MessageBubbleReactionStyle | undefined =
    reaction === undefined
      ? undefined
      : {
          opacity: interpolate(frame, [REACT_AT, REACT_AT + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: spring({
            config: { damping: 11, mass: 0.6, stiffness: 220 },
            fps,
            frame: frame - REACT_AT,
          }),
        };

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: 96,
        position: "relative",
        width: "100%",
      }}
    >
      <div style={{ width: 560 }}>
        <MessageBubble
          variant={variant}
          style={bubbleStyle}
          reaction={reaction}
          reactionStyle={reactionStyle}
        >
          {text}
        </MessageBubble>
      </div>
    </div>
  );
};

export const messageBubbleDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const text =
    (values.text as string | undefined) ?? "Yep, pushing it live now";
  const variant = (values.variant as string | undefined) ?? "incoming";
  const reaction = values.reaction as string | undefined;

  const props: string[] = [
    `    variant="${variant}"`,
    "    style={bubbleStyle}",
  ];
  if (reaction !== undefined && reaction !== "") {
    props.push(`    reaction="${reaction}"`);
  }

  return `import { MessageBubble } from "@/components/framecn/message-bubble";
import { useMessageBubbleTransition } from "@/components/framecn/use-message-bubble-transition";

export const Scene = () => {
  const bubbleStyle = useMessageBubbleTransition([
    { at: 16, state: "visible", duration: 14 },
  ]);

  return (
    <MessageBubble
${props.join("\n")}
    >
      ${text}
    </MessageBubble>
  );
};`;
};
