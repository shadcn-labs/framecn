"use client";

import { Timegroup } from "@editframe/react";
import { ArrowUp, ChevronLeft, Plus, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { revealedText } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Caret } from "@/registry/bases/editframe/ui/caret";
import { TypingIndicator } from "@/registry/bases/editframe/ui/typing-indicator";

export interface ImessageMessage {
  from: "me" | "them";
  text: string;
  reaction?: string;
}

export interface ImessageContact {
  name: string;
  avatar?: string;
}

export interface ImessageChatFlowProps {
  messages?: ImessageMessage[];
  contact?: ImessageContact;
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

const IMESSAGE_BLUE = "#0a7cff";
const SYSTEM_BLUE = "#007aff";
const INCOMING_BG = "#e9e9eb";
const INCOMING_FG = "#000000";
const OUTGOING_FG = "#ffffff";
const META_GRAY = "#8e8e93";

const DEFAULT_MESSAGES: ImessageMessage[] = [
  { from: "me", text: "Hey — ready for the demo?" },
  { from: "them", reaction: "❤️", text: "Yep, pushing it live now" },
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

export interface ImessageChatFlowSchedule {
  items: ScheduledMessage[];
  duration: number;
}

export const imessageChatFlowSchedule = (
  messages: ImessageMessage[]
): ImessageChatFlowSchedule => {
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

export const imessageChatFlowDuration = (
  messages: ImessageMessage[] = DEFAULT_MESSAGES,
  speed = 1
): number => {
  const raw = imessageChatFlowSchedule(messages).duration;
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

function Avatar({ contact, size }: { contact: ImessageContact; size: number }) {
  const initial = contact.name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(180deg, #b8c0c9 0%, #8e99a4 100%)",
        borderRadius: "50%",
        color: "#ffffff",
        display: "flex",
        flexShrink: 0,
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: size * 0.42,
        fontWeight: 600,
        height: size,
        justifyContent: "center",
        minWidth: size,
        overflow: "hidden",
        width: size,
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

function BubbleTail({
  side,
  color,
}: {
  side: "left" | "right";
  color: string;
}) {
  const path =
    side === "right"
      ? "M0 0 C2 8 6 12 12 13 C7 14 1 13 0 8 Z"
      : "M13 0 C11 8 7 12 1 13 C6 14 12 13 13 8 Z";
  return (
    <svg
      width={13}
      height={14}
      viewBox="0 0 13 14"
      style={{
        bottom: 0,
        left: side === "left" ? -5 : undefined,
        position: "absolute",
        right: side === "right" ? -5 : undefined,
      }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}

export function ImessageChatFlow({
  messages = DEFAULT_MESSAGES,
  contact,
  accentColor,
  speed = 1,
  fps = 30,
  durationInFrames,
  className,
}: ImessageChatFlowProps) {
  const [eff, setEff] = useState(0);
  const startRef = useRef<number | null>(null);
  const accent = accentColor ?? IMESSAGE_BLUE;

  const { items, duration: rawDuration } = imessageChatFlowSchedule(messages);
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

  let lastMeIndex = -1;
  items.forEach((item) => {
    if (item.from === "me") {
      lastMeIndex = item.index;
    }
  });
  const deliveredIndex = lastMeIndex === messages.length - 1 ? lastMeIndex : -1;

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
          @keyframes framecn-imsg-msg-enter {
            from { opacity: 0; transform: translateY(10px) scale(0.92); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-imsg-send-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.84); }
          }
          @keyframes framecn-imsg-reaction-pop {
            0% { opacity: 0; transform: scale(0); }
            60% { transform: scale(1.15); }
            100% { opacity: 1; transform: scale(1); }
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
              width: "100%",
            }}
          >
            <div
              style={{
                alignItems: "center",
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.82)",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                gap: 6,
                padding: "10px 12px",
              }}
            >
              <ChevronLeft size={28} color={SYSTEM_BLUE} strokeWidth={2.25} />
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {contact !== undefined && (
                  <Avatar contact={contact} size={30} />
                )}
                <span
                  style={{
                    color: "#000000",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {contact?.name ?? "Chat"}
                </span>
              </div>
              <Video size={24} color={SYSTEM_BLUE} strokeWidth={2} />
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  justifyContent: "flex-end",
                  minHeight: "100%",
                  padding: "16px 14px 12px",
                }}
              >
                {present.map((item) => (
                  <ImessageRow
                    key={item.index}
                    item={item}
                    eff={eff}
                    fps={fps}
                    contact={contact}
                    accent={accent}
                    showDelivered={item.index === deliveredIndex}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                alignItems: "flex-end",
                display: "flex",
                gap: 8,
                padding: "8px 12px 12px",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#e9e9eb",
                  borderRadius: "50%",
                  display: "flex",
                  height: 34,
                  justifyContent: "center",
                  width: 34,
                }}
              >
                <Plus size={22} color="#3c3c43" strokeWidth={2} />
              </div>
              <div
                style={{
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid #d1d1d6",
                  borderRadius: 18,
                  display: "flex",
                  flex: 1,
                  gap: 6,
                  minHeight: 36,
                  padding: "0 6px 0 14px",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    color: sendActive ? "#000000" : "#9b9ba1",
                    display: "flex",
                    flex: 1,
                    fontSize: 16,
                  }}
                >
                  <span
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {sendActive ? composerText : "iMessage"}
                  </span>
                  {typing && (
                    <Caret
                      color={accent}
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
                    background: sendActive ? accent : "#c6c6cc",
                    borderRadius: "50%",
                    display: "flex",
                    flexShrink: 0,
                    height: 28,
                    justifyContent: "center",
                    transform: `scale(${sendScale})`,
                    width: 28,
                  }}
                >
                  <ArrowUp size={20} color="#ffffff" strokeWidth={2.75} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
}

function ImessageRow({
  item,
  eff,
  fps,
  contact,
  accent,
  showDelivered,
}: {
  item: ScheduledMessage;
  eff: number;
  fps: number;
  contact?: ImessageContact;
  accent: string;
  showDelivered: boolean;
}) {
  const outgoing = item.from === "me";
  const showTyping =
    item.from === "them" &&
    item.typingStart !== undefined &&
    eff < item.revealAt;

  const enterTarget = showTyping ? (item.typingStart ?? 0) : item.revealAt;
  const enterProgress = clamp(
    (eff - enterTarget) / (16 * (1 / Math.max(0.01, 1))),
    0,
    1
  );
  const ease = 1 - (1 - enterProgress) ** 3;
  const opacity = ease;
  const translateY = 10 * (1 - ease);
  const scale = 0.92 + 0.08 * ease;

  let reactionScale = 0;
  let reactionOpacity = 0;
  if (item.reactAt !== undefined && eff >= item.reactAt) {
    const reactProgress = clamp((eff - item.reactAt) / 12, 0, 1);
    reactionScale =
      reactProgress < 0.6
        ? (reactProgress / 0.6) * 1.15
        : 1.15 - ((reactProgress - 0.6) / 0.4) * 0.15;
    reactionOpacity = clamp((eff - item.reactAt) / 5, 0, 1);
  }

  const bg = outgoing ? accent : INCOMING_BG;
  const fg = outgoing ? OUTGOING_FG : INCOMING_FG;
  const delivered =
    showDelivered && !showTyping && eff > item.revealAt + REVEAL;

  const bubble = (
    <div
      style={{
        background: bg,
        borderBottomLeftRadius: outgoing ? 19 : 7,
        borderBottomRightRadius: outgoing ? 7 : 19,
        borderRadius: 19,
        color: fg,
        fontSize: 16,
        lineHeight: 1.32,
        maxWidth: "72%",
        padding: showTyping ? "11px 14px" : "7px 13px 8px",
        position: "relative",
      }}
    >
      {showTyping ? (
        <TypingIndicator color={META_GRAY} />
      ) : (
        <span style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
          {item.text}
        </span>
      )}
      {!showTyping && (
        <BubbleTail side={outgoing ? "right" : "left"} color={bg} />
      )}
      {item.reaction !== undefined && (
        <div
          style={{
            alignItems: "center",
            background: INCOMING_BG,
            borderRadius: "50%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
            display: "flex",
            fontSize: 15,
            height: 30,
            justifyContent: "center",
            left: outgoing ? -14 : undefined,
            opacity: reactionOpacity,
            position: "absolute",
            right: outgoing ? undefined : -14,
            top: -16,
            transform: `scale(${reactionScale})`,
            transformOrigin: outgoing ? "bottom left" : "bottom right",
            width: 30,
          }}
        >
          {item.reaction}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        alignItems: outgoing ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: outgoing ? "bottom right" : "bottom left",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "flex-end",
          display: "flex",
          gap: 7,
          justifyContent: outgoing ? "flex-end" : "flex-start",
          width: "100%",
        }}
      >
        {!outgoing && contact !== undefined && (
          <Avatar contact={contact} size={28} />
        )}
        {bubble}
      </div>
      {delivered && (
        <span
          style={{
            color: META_GRAY,
            fontSize: 11,
            paddingRight: 4,
          }}
        >
          Delivered
        </span>
      )}
    </div>
  );
}
