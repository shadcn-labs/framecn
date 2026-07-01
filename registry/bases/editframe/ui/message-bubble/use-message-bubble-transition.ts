"use client";

import type { MessageBubbleState } from "@/registry/bases/editframe/ui/message-bubble";

export const DEFAULT_DURATION = 14;

const messageBubbleStyle = (
  state: MessageBubbleState
): { opacity: number; translateY: number; scale: number } => {
  switch (state) {
    case "visible": {
      return { opacity: 1, scale: 1, translateY: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.92, translateY: 10 };
    }
  }
};

export interface MessageBubbleTransitionOptions {
  duration?: number;
}

export const messageBubbleKeyframes = (
  from: MessageBubbleState,
  to: MessageBubbleState
): string => {
  const a = messageBubbleStyle(from);
  const b = messageBubbleStyle(to);
  const name = `ef-mb-${from}-${to}`;
  const existing = document.querySelector(`style[data-ef-mb="${name}"]`);
  if (existing) {
    return name;
  }
  const style = document.createElement("style");
  style.dataset.efMb = name;
  style.textContent = `
    @keyframes ${name} {
      0% { opacity: ${a.opacity}; transform: translateY(${a.translateY}px) scale(${a.scale}); }
      100% { opacity: ${b.opacity}; transform: translateY(${b.translateY}px) scale(${b.scale}); }
    }
  `;
  document.head.append(style);
  return name;
};

export const messageBubbleReactionKeyframes = (
  from: MessageBubbleState,
  to: MessageBubbleState
): string => {
  const fromReaction = from === "visible";
  const toReaction = to === "visible";
  const a = fromReaction ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 };
  const b = toReaction ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 };
  const name = `ef-mbr-${from}-${to}`;
  const existing = document.querySelector(`style[data-ef-mbr="${name}"]`);
  if (existing) {
    return name;
  }
  const style = document.createElement("style");
  style.dataset.efMbr = name;
  style.textContent = `
    @keyframes ${name} {
      0% { opacity: ${a.opacity}; transform: translateY(75%) scale(${a.scale}); }
      100% { opacity: ${b.opacity}; transform: translateY(75%) scale(${b.scale}); }
    }
  `;
  document.head.append(style);
  return name;
};

export const messageBubbleAnimation = (
  from: MessageBubbleState,
  to: MessageBubbleState,
  duration: number = DEFAULT_DURATION
): string => {
  if (from === to) {
    return "none";
  }
  const name = messageBubbleKeyframes(from, to);
  return `${name} ${duration}ms cubic-bezier(0, 0, 0.2, 1) forwards`;
};

export const messageBubbleReactionAnimation = (
  from: MessageBubbleState,
  to: MessageBubbleState,
  duration: number = DEFAULT_DURATION
): string => {
  if (from === to) {
    return "none";
  }
  const name = messageBubbleReactionKeyframes(from, to);
  return `${name} ${duration}ms cubic-bezier(0, 0, 0.2, 1) forwards`;
};
