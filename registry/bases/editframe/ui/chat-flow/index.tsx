"use client";

import { Timegroup } from "@editframe/react";
import { useEffect, useRef, useState } from "react";

import { mixOklch, revealedText, useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Caret } from "@/registry/bases/editframe/ui/caret";
import { MessageBubble } from "@/registry/bases/editframe/ui/message-bubble";
import type {
  MessageBubbleReactionStyle,
  MessageBubbleStyle,
} from "@/registry/bases/editframe/ui/message-bubble";
import { TypingIndicator } from "@/registry/bases/editframe/ui/typing-indicator";

export interface ChatMessage {
  from: "me" | "them";
  text: string;
  reaction?: string;
}

export interface ChatContact {
  name: string;
  avatar?: string;
}

export interface ChatFlowProps {
  messages?: ChatMessage[];
  contact?: ChatContact;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  theme?: Partial<FramecnTheme>;
  className?: string;
}

const MOBILE_WIDTH = 460;
const LEAD_IN = 12;
const FRAMES_PER_CHAR = 2.2;
const MIN_TYPE = 18;
const MAX_TYPE = 86;
const SEND_GAP = 10;
const REVEAL = 14;
const REACT_DELAY = 8;
const REACT_DUR = 14;
const MSG_GAP = 18;
const TYPING_MIN = 34;
const TYPING_MAX = 70;
const TAIL = 28;
const PRESS_WINDOW = 7;

const DEFAULT_MESSAGES: ChatMessage[] = [
  { from: "me", text: "Hey — ready for the demo?" },
  { from: "them", reaction: "🔥", text: "Yep, pushing it live now" },
  { from: "me", reaction: "👍", text: "Perfect, sending the link over" },
];
const clamp = (value: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, value));

export interface ScheduledMessage {
  index: number;
  from: "me" | "them";
  text: string;
  reaction?: string;
  presenceStart: number;
  typeStart?: number;
  sendAt?: number;
  typingStart?: number;
  revealAt: number;
  reactAt?: number;
}

export interface ChatFlowSchedule {
  items: ScheduledMessage[];
  duration: number;
}

export const chatFlowSchedule = (messages: ChatMessage[]): ChatFlowSchedule => {
  const items: ScheduledMessage[] = [];
  let cursor = LEAD_IN;

  messages.forEach((message, index) => {
    const hasReaction =
      message.reaction !== undefined && message.reaction !== "";
    if (message.from === "me") {
      const typeStart = cursor;
      const typeDur = clamp(
        Math.round(message.text.length * FRAMES_PER_CHAR),
        MIN_TYPE,
        MAX_TYPE
      );
      const sendAt = typeStart + typeDur + SEND_GAP;
      const revealAt = sendAt;
      const reactAt = hasReaction ? revealAt + REVEAL + REACT_DELAY : undefined;
      items.push({
        from: "me",
        index,
        presenceStart: sendAt - 2,
        reactAt,
        reaction: hasReaction ? message.reaction : undefined,
        revealAt,
        sendAt,
        text: message.text,
        typeStart,
      });
      cursor =
        revealAt +
        REVEAL +
        (hasReaction ? REACT_DELAY + REACT_DUR : 0) +
        MSG_GAP;
    } else {
      const typingStart = cursor;
      const typingDur = clamp(
        Math.round(message.text.length * FRAMES_PER_CHAR),
        TYPING_MIN,
        TYPING_MAX
      );
      const revealAt = typingStart + typingDur;
      const reactAt = hasReaction ? revealAt + REVEAL + REACT_DELAY : undefined;
      items.push({
        from: "them",
        index,
        presenceStart: typingStart,
        reactAt,
        reaction: hasReaction ? message.reaction : undefined,
        revealAt,
        text: message.text,
        typingStart,
      });
      cursor =
        revealAt +
        REVEAL +
        (hasReaction ? REACT_DELAY + REACT_DUR : 0) +
        MSG_GAP;
    }
  });

  const duration = Math.max(cursor - MSG_GAP + TAIL, LEAD_IN + TAIL);
  return { duration, items };
};

export const chatFlowDuration = (
  messages: ChatMessage[] = DEFAULT_MESSAGES,
  speed = 1
): number => {
  const raw = chatFlowSchedule(messages).duration;
  return Math.ceil(raw / (speed <= 0 ? 1 : speed));
};

export const sendPulse = (items: ScheduledMessage[], eff: number): number => {
  let best = 0;
  for (const item of items) {
    if (item.sendAt === undefined) {
      continue;
    }
    const distance = Math.abs(eff - item.sendAt);
    if (distance <= PRESS_WINDOW) {
      best = Math.max(best, 1 - distance / PRESS_WINDOW);
    }
  }
  return best;
};

function Avatar({
  contact,
  theme,
}: {
  contact: ChatContact;
  theme: FramecnTheme;
}) {
  const initial = contact.name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        alignItems: "center",
        background: theme.muted,
        borderRadius: "50%",
        color: theme.mutedForeground,
        display: "flex",
        flexShrink: 0,
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 14,
        fontWeight: 600,
        height: 32,
        justifyContent: "center",
        minWidth: 32,
        overflow: "hidden",
        width: 32,
      }}
    >
      {contact.avatar !== undefined ? (
        <img
          src={contact.avatar}
          alt={contact.name}
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

function SendIcon({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 19V5M12 5l-6 6M12 5l6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatFlow({
  messages = DEFAULT_MESSAGES,
  contact,
  accentColor,
  speed = 1,
  fps = 30,
  durationInFrames,
  theme: themeOverride,
  className,
}: ChatFlowProps) {
  const [eff, setEff] = useState(0);
  const startRef = useRef<number | null>(null);

  const themeProp = {
    ...themeOverride,
    ...(accentColor ? { primary: accentColor } : {}),
  };
  const resolved = useFramecnTheme(themeProp, "light");

  const { items, duration: rawDuration } = chatFlowSchedule(messages);
  const totalDuration =
    durationInFrames ?? Math.ceil(rawDuration / (speed <= 0 ? 1 : speed));
  const durationMs = (totalDuration / fps) * 1000;

  useEffect(() => {
    let raf: number;
    const tick = (now: number) => {
      if (startRef.current === null) {
        startRef.current = now;
      }
      const elapsed = now - startRef.current;
      const frame = (elapsed / 1000) * fps;
      setEff(Math.min(frame * speed, totalDuration));
      if (frame * speed < totalDuration) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, speed, totalDuration]);

  const activeMe = items.find(
    (item) =>
      item.from === "me" &&
      item.typeStart !== undefined &&
      item.sendAt !== undefined &&
      eff >= item.typeStart &&
      eff < item.sendAt
  );
  let composerText = "";
  let typing = false;
  if (
    activeMe &&
    activeMe.typeStart !== undefined &&
    activeMe.sendAt !== undefined
  ) {
    const typeDur = Math.max(
      activeMe.sendAt - SEND_GAP - activeMe.typeStart,
      1
    );
    const progress = clamp((eff - activeMe.typeStart) / typeDur, 0, 1);
    composerText = revealedText(
      activeMe.text,
      Math.floor(progress * activeMe.text.length)
    );
    typing = true;
  }

  const sendActive = composerText.length > 0;
  const sendScale = 1 - 0.16 * sendPulse(items, eff);
  const present = items.filter((item) => eff >= item.presenceStart);

  const composerBackground = mixOklch(
    resolved.background,
    resolved.muted,
    0.55
  );

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={{
        inset: 0,
        position: "absolute",
      }}
    >
      <>
        <style>{`
          @keyframes framecn-chat-typing-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes framecn-chat-typing-out {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes framecn-chat-send-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.84); }
          }
          @keyframes framecn-chat-reaction-pop {
            0% { opacity: 0; transform: scale(0); }
            60% { transform: scale(1.15); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes framecn-chat-msg-enter {
            from { opacity: 0; transform: translateY(10px) scale(0.92); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div
          style={{
            background: "transparent",
            display: "flex",
            fontFamily:
              "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxWidth: MOBILE_WIDTH,
              padding: "24px 16px 18px",
              width: "100%",
            }}
          >
            {contact !== undefined && (
              <div
                style={{
                  alignItems: "center",
                  borderBottom: `1px solid ${resolved.border}`,
                  display: "flex",
                  gap: 10,
                  marginBottom: 8,
                  paddingBottom: 16,
                }}
              >
                <Avatar contact={contact} theme={resolved} />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span
                    style={{
                      color: resolved.foreground,
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.25,
                    }}
                  >
                    {contact.name}
                  </span>
                  <span
                    style={{
                      alignItems: "center",
                      color: "oklch(0.62 0.17 150)",
                      display: "flex",
                      fontSize: 12,
                      gap: 5,
                      lineHeight: 1.2,
                    }}
                  >
                    <span
                      style={{
                        background: "oklch(0.62 0.17 150)",
                        borderRadius: "50%",
                        height: 6,
                        width: 6,
                      }}
                    />
                    online
                  </span>
                </div>
              </div>
            )}

            <div
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0, #000 48px, #000 100%)",
                flex: 1,
                maskImage:
                  "linear-gradient(to bottom, transparent 0, #000 48px, #000 100%)",
                minHeight: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  justifyContent: "flex-end",
                  minHeight: "100%",
                  paddingBottom: 22,
                  paddingTop: 24,
                }}
              >
                {present.map((item) => (
                  <ChatRow
                    key={item.index}
                    item={item}
                    eff={eff}
                    speed={speed}
                    fps={fps}
                    contact={contact}
                    themeProp={themeProp}
                    theme={resolved}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                background: composerBackground,
                border: `1px solid ${resolved.border}`,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 14,
                padding: 14,
              }}
            >
              <div
                style={{
                  alignItems: "flex-start",
                  color: sendActive
                    ? resolved.foreground
                    : resolved.mutedForeground,
                  display: "flex",
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.45,
                  minHeight: 24,
                }}
              >
                <span
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {sendActive ? composerText : "Message"}
                </span>
                {typing && (
                  <Caret
                    color={resolved.foreground}
                    height={18}
                    radius={1}
                    blink
                    marginLeft={composerText.length > 0 ? 2 : 0}
                  />
                )}
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: "transparent",
                    border: `1px solid ${resolved.border}`,
                    borderRadius: "50%",
                    display: "flex",
                    height: 38,
                    justifyContent: "center",
                    width: 38,
                  }}
                >
                  <PlusIcon color={resolved.mutedForeground} />
                </div>
                <div
                  style={{
                    alignItems: "center",
                    background: sendActive
                      ? resolved.primary
                      : mixOklch(resolved.background, resolved.muted, 0.6),
                    borderRadius: "50%",
                    display: "flex",
                    height: 38,
                    justifyContent: "center",
                    transform: `scale(${sendScale})`,
                    width: 38,
                  }}
                >
                  <SendIcon
                    color={
                      sendActive
                        ? resolved.primaryForeground
                        : resolved.mutedForeground
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
}

function ChatRow({
  item,
  eff,
  speed,
  fps,
  contact,
  themeProp,
  theme,
}: {
  item: ScheduledMessage;
  eff: number;
  speed: number;
  fps: number;
  contact?: ChatContact;
  themeProp: Partial<FramecnTheme>;
  theme: FramecnTheme;
}) {
  const variant = item.from === "me" ? "outgoing" : "incoming";
  const showTyping =
    item.from === "them" &&
    item.typingStart !== undefined &&
    eff < item.revealAt;

  const bubbleStyle: MessageBubbleStyle = (() => {
    if (showTyping && item.typingStart !== undefined) {
      const fadeInProgress = clamp((eff - item.typingStart) / 8, 0, 1);
      const fadeOutProgress = clamp((eff - (item.revealAt - 6)) / 6, 0, 1);
      return {
        opacity: fadeInProgress * (1 - fadeOutProgress),
        scale: 1,
        translateY: 10 * (1 - fadeInProgress),
      };
    }
    const revealProgress = clamp((eff - item.revealAt) / REVEAL, 0, 1);
    return {
      opacity: revealProgress,
      scale: 0.92 + 0.08 * revealProgress,
      translateY: 10 * (1 - revealProgress),
    };
  })();

  let reactionStyle: MessageBubbleReactionStyle | undefined;
  if (item.reactAt !== undefined && eff >= item.reactAt) {
    const reactProgress = clamp((eff - item.reactAt) / 12, 0, 1);
    const pop =
      reactProgress < 0.6
        ? (reactProgress / 0.6) * 1.15
        : 1.15 - ((reactProgress - 0.6) / 0.4) * 0.15;
    const opacity = clamp((eff - item.reactAt) / 5, 0, 1);
    reactionStyle = { opacity, scale: pop };
  }

  const bubbleNode = showTyping ? (
    <MessageBubble variant="incoming" style={bubbleStyle} theme={themeProp}>
      <TypingIndicator color={theme.mutedForeground} />
    </MessageBubble>
  ) : (
    <MessageBubble
      variant={variant}
      style={bubbleStyle}
      reaction={item.reaction}
      reactionStyle={reactionStyle}
      theme={themeProp}
    >
      {item.text}
    </MessageBubble>
  );

  if (item.from === "them" && contact !== undefined) {
    return (
      <div style={{ alignItems: "flex-end", display: "flex", gap: 8 }}>
        <Avatar contact={contact} theme={theme} />
        <div style={{ flex: 1, minWidth: 0 }}>{bubbleNode}</div>
      </div>
    );
  }

  return bubbleNode;
}
