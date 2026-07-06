"use client";

import { easings, useStateTransition } from "@/lib/framecn-ui";
import type { Step } from "@/lib/framecn-ui";
import { messageBubbleStyle } from "@/registry/bases/editframe/ui/message-bubble";
import type {
  MessageBubbleState,
  MessageBubbleStyle,
} from "@/registry/bases/editframe/ui/message-bubble";

export const DEFAULT_DURATION = 14;

export const tweenMessageBubbleStyle = (
  a: MessageBubbleStyle,
  b: MessageBubbleStyle,
  t: number
): MessageBubbleStyle => ({
  opacity: a.opacity + (b.opacity - a.opacity) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  translateY: a.translateY + (b.translateY - a.translateY) * t,
});

export interface MessageBubbleTransitionOptions {
  speed?: number;
  defaultDuration?: number;
}

export const useMessageBubbleTransition = (
  steps: Step<MessageBubbleState>[],
  opts: MessageBubbleTransitionOptions = {}
): MessageBubbleStyle => {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "hidden",
    speed,
    defaultDuration
  );
  const t = easings.out(progress);
  return tweenMessageBubbleStyle(
    messageBubbleStyle(from),
    messageBubbleStyle(to),
    t
  );
};
