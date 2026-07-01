"use client";

import type { ReactNode } from "react";

import { mixOklch, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import {
  messageBubbleKeyframes,
  messageBubbleReactionAnimation,
} from "@/registry/bases/editframe/ui/message-bubble/use-message-bubble-transition";

export type MessageBubbleVariant = "incoming" | "outgoing";

export type MessageBubbleState = "hidden" | "visible";

export interface MessageBubbleStyle {
  opacity: number;
  translateY: number;
  scale: number;
}

export interface MessageBubbleReactionStyle {
  opacity: number;
  scale: number;
}

export interface MessageBubbleStyleContext {
  incomingBg: string;
  incomingFg: string;
  outgoingBg: string;
  outgoingFg: string;
}

export interface MessageBubbleProps {
  variant?: MessageBubbleVariant;
  state?: MessageBubbleState;
  from?: MessageBubbleState;
  style?: MessageBubbleStyle;
  reaction?: string;
  reactionStyle?: MessageBubbleReactionStyle;
  theme?: Partial<FramecnTheme>;
  className?: string;
  duration?: string;
  children?: ReactNode;
}

const BUBBLE_MAX_WIDTH = 320;

export const messageBubbleStyleContext = (
  theme: FramecnTheme
): MessageBubbleStyleContext => ({
  incomingBg: mixOklch(theme.background, theme.muted, 0.55),
  incomingFg: theme.foreground,
  outgoingBg: theme.primary,
  outgoingFg: theme.primaryForeground,
});

export const messageBubbleStyle = (
  state: MessageBubbleState
): MessageBubbleStyle => {
  switch (state) {
    case "visible": {
      return { opacity: 1, scale: 1, translateY: 0 };
    }
    default: {
      return { opacity: 0, scale: 0.92, translateY: 10 };
    }
  }
};

// eslint-disable-next-line complexity
export const MessageBubble = ({
  variant = "incoming",
  state = "visible",
  from,
  style,
  reaction,
  reactionStyle,
  theme: themeOverride,
  className,
  duration = "14frames",
  children,
}: MessageBubbleProps) => {
  const theme = useFramecnTheme(themeOverride, "light");
  const ctx = messageBubbleStyleContext(theme);
  const v = style ?? messageBubbleStyle(state);

  const isOutgoing = variant === "outgoing";
  const bg = isOutgoing ? ctx.outgoingBg : ctx.incomingBg;
  const fg = isOutgoing ? ctx.outgoingFg : ctx.incomingFg;

  const hasAnimation = from && from !== state;
  const anim = hasAnimation ? messageBubbleKeyframes(from, state) : "none";

  const hasReaction = reaction !== undefined && reaction !== "";
  const reactionAnim = hasAnimation
    ? messageBubbleReactionAnimation(
        from,
        state,
        Number.parseInt(duration, 10) || 14
      )
    : "none";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {hasAnimation && <style>{messageBubbleKeyframes(from, state)}</style>}
      <div
        style={{
          animation: hasAnimation ? anim : undefined,
          background: bg,
          borderRadius: isOutgoing
            ? "16px 16px 4px 16px"
            : "16px 16px 16px 4px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          color: fg,
          fontSize: 14,
          lineHeight: 1.45,
          maxWidth: BUBBLE_MAX_WIDTH,
          opacity: v.opacity,
          padding: "10px 14px",
          transform: `translateY(${v.translateY}px) scale(${v.scale})`,
          transformOrigin: isOutgoing ? "bottom right" : "bottom left",
          width: "fit-content",
        }}
      >
        {children}
      </div>
      {hasReaction && (
        <div
          style={{
            animation: hasAnimation ? reactionAnim : undefined,
            background: theme.popover,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            bottom: -6,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            fontSize: 16,
            height: 28,
            left: isOutgoing ? undefined : 8,
            lineHeight: "28px",
            opacity: reactionStyle?.opacity ?? 1,
            position: "absolute",
            right: isOutgoing ? 8 : undefined,
            textAlign: "center",
            transform: `scale(${reactionStyle?.scale ?? 1})`,
            width: 28,
          }}
        >
          {reaction}
        </div>
      )}
    </div>
  );
};
