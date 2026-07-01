"use client";

import { Timegroup } from "@editframe/react";
import { useEffect, useRef, useState } from "react";

import { revealedText } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { Caret } from "@/registry/bases/editframe/ui/caret";

export interface TelegramMessage {
  from: "me" | "them";
  text: string;
  reaction?: string;
  time?: string;
}

export interface TelegramContact {
  name: string;
  avatar?: string;
}

export interface TelegramChatFlowProps {
  messages?: TelegramMessage[];
  contact?: TelegramContact;
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
const MSG_GAP = 16;
const TYPING_MIN = 34;
const TYPING_MAX = 70;
const TAIL = 28;
const PRESS_WINDOW = 7;

const TELEGRAM_BLUE = "#3390ec";
const INCOMING_BG = "#ffffff";
const INCOMING_FG = "#0f1419";
const INCOMING_META = "#8a99a5";
const OUTGOING_FG = "#ffffff";
const OUTGOING_META = "rgba(255,255,255,0.82)";

const DEFAULT_MESSAGES: TelegramMessage[] = [
  { from: "me", text: "Hey — ready for the demo?", time: "9:40" },
  {
    from: "them",
    reaction: "🔥",
    text: "Yep, pushing it live now",
    time: "9:41",
  },
  {
    from: "me",
    reaction: "👍",
    text: "Perfect, sending the link over",
    time: "9:41",
  },
];
const clamp = (value: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, value));

export interface ScheduledMessage {
  index: number;
  from: "me" | "them";
  text: string;
  reaction?: string;
  time?: string;
  presenceStart: number;
  typeStart?: number;
  sendAt?: number;
  typingStart?: number;
  revealAt: number;
  reactAt?: number;
}

export interface TelegramChatFlowSchedule {
  items: ScheduledMessage[];
  duration: number;
}

export const telegramChatFlowSchedule = (
  messages: TelegramMessage[]
): TelegramChatFlowSchedule => {
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
        time: message.time,
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
        presenceStart: revealAt,
        reactAt,
        reaction: hasReaction ? message.reaction : undefined,
        revealAt,
        text: message.text,
        time: message.time,
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

export const telegramChatFlowDuration = (
  messages: TelegramMessage[] = DEFAULT_MESSAGES,
  speed = 1
): number => {
  const raw = telegramChatFlowSchedule(messages).duration;
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

function Avatar({ contact, size }: { contact: TelegramContact; size: number }) {
  const initial = contact.name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        alignItems: "center",
        background: `linear-gradient(180deg, #72d5fd 0%, ${TELEGRAM_BLUE} 100%)`,
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

function DoubleCheck({ color }: { color: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </svg>
  );
}

function PaperPlane({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

function MicIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19v3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <rect x={9} y={2} width={6} height={13} rx={3} />
    </svg>
  );
}

function SmileIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1={9} x2={9.01} y1={9} y2={9} />
      <line x1={15} x2={15.01} y1={9} y2={9} />
    </svg>
  );
}

function AttachIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
    </svg>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function MoreIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
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
      ? "M0 0 H4 C4 7 7 12 13 13 C6 13 0 9 0 0 Z"
      : "M13 0 H9 C9 7 6 12 0 13 C7 13 13 9 13 0 Z";
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      style={{
        bottom: 0,
        left: side === "left" ? -6 : undefined,
        position: "absolute",
        right: side === "right" ? -6 : undefined,
      }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}

export function TelegramChatFlow({
  messages = DEFAULT_MESSAGES,
  contact,
  accentColor,
  speed = 1,
  fps = 30,
  durationInFrames,
  className,
}: TelegramChatFlowProps) {
  const [eff, setEff] = useState(0);
  const startRef = useRef<number | null>(null);
  const accent = accentColor ?? TELEGRAM_BLUE;

  const { items, duration: rawDuration } = telegramChatFlowSchedule(messages);
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

  const themTyping = items.some(
    (item) =>
      item.from === "them" &&
      item.typingStart !== undefined &&
      eff >= item.typingStart &&
      eff < item.revealAt
  );

  const sendActive = composerText.length > 0;
  const sendScale = 1 - 0.16 * sendPulse(items, eff);
  const present = items.filter((item) => eff >= item.presenceStart);

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
          @keyframes framecn-tg-msg-enter {
            from { opacity: 0; transform: translateY(10px) scale(0.92); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes framecn-tg-send-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.84); }
          }
          @keyframes framecn-tg-reaction-pop {
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
                background: "#ffffff",
                boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
                display: "flex",
                gap: 12,
                padding: "12px 14px",
              }}
            >
              {contact !== undefined && <Avatar contact={contact} size={38} />}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                <span
                  style={{
                    color: "#0f1419",
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {contact?.name ?? "Chat"}
                </span>
                <span
                  style={{
                    color: accent,
                    fontSize: 13,
                    fontStyle: themTyping ? "italic" : "normal",
                    lineHeight: 1.15,
                  }}
                >
                  {themTyping ? "typing…" : "online"}
                </span>
              </div>
              <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
                <PhoneIcon color="#8a99a5" />
                <MoreIcon color="#8a99a5" />
              </div>
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
                  gap: 4,
                  justifyContent: "flex-end",
                  minHeight: "100%",
                  padding: "16px 12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(0,0,0,0.18)",
                      borderRadius: 14,
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 500,
                      padding: "3px 11px",
                    }}
                  >
                    Today
                  </span>
                </div>
                {present.map((item) => (
                  <TelegramRow
                    key={item.index}
                    item={item}
                    eff={eff}
                    fps={fps}
                    contact={contact}
                    accent={accent}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                alignItems: "flex-end",
                background: "#ffffff",
                boxShadow: "0 -1px 0 rgba(0,0,0,0.06)",
                display: "flex",
                gap: 8,
                padding: "8px 10px 12px",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#f1f3f5",
                  borderRadius: 22,
                  display: "flex",
                  flex: 1,
                  gap: 8,
                  minHeight: 44,
                  padding: "0 12px",
                }}
              >
                <SmileIcon color="#8a99a5" />
                <div
                  style={{
                    alignItems: "center",
                    color: sendActive ? "#0f1419" : "#8a99a5",
                    display: "flex",
                    flex: 1,
                    fontSize: 15,
                  }}
                >
                  <span
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {sendActive ? composerText : "Message"}
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
                <AttachIcon color="#8a99a5" />
              </div>
              <div
                style={{
                  alignItems: "center",
                  background: accent,
                  borderRadius: "50%",
                  display: "flex",
                  flexShrink: 0,
                  height: 46,
                  justifyContent: "center",
                  transform: `scale(${sendScale})`,
                  width: 46,
                }}
              >
                {sendActive ? (
                  <PaperPlane color="#ffffff" />
                ) : (
                  <MicIcon color="#ffffff" />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
}

function TelegramRow({
  item,
  eff,
  fps,
  contact,
  accent,
}: {
  item: ScheduledMessage;
  eff: number;
  fps: number;
  contact?: TelegramContact;
  accent: string;
}) {
  const outgoing = item.from === "me";

  const enterProgress = clamp(
    (eff - item.revealAt) / (16 * (1 / Math.max(0.01, 1))),
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
  const metaColor = outgoing ? OUTGOING_META : INCOMING_META;
  const tailColor = outgoing ? accent : INCOMING_BG;

  const bubble = (
    <div
      style={{
        background: bg,
        borderBottomLeftRadius: outgoing ? 16 : 6,
        borderBottomRightRadius: outgoing ? 6 : 16,
        borderRadius: 16,
        boxShadow: outgoing ? "none" : "0 1px 1px rgba(0,0,0,0.1)",
        color: fg,
        fontSize: 15,
        lineHeight: 1.35,
        maxWidth: "76%",
        padding: "6px 11px 7px",
        position: "relative",
      }}
    >
      <span style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
        {item.text}
      </span>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 8,
          justifyContent:
            item.reaction !== undefined ? "space-between" : "flex-end",
          marginTop: 2,
        }}
      >
        {item.reaction !== undefined && (
          <span
            style={{
              alignItems: "center",
              background: outgoing
                ? "rgba(255,255,255,0.22)"
                : "rgba(51,144,236,0.12)",
              borderRadius: 11,
              color: outgoing ? "#ffffff" : accent,
              display: "inline-flex",
              fontSize: 13,
              fontWeight: 600,
              gap: 4,
              opacity: reactionOpacity,
              padding: "1px 7px",
              transform: `scale(${reactionScale})`,
              transformOrigin: "left center",
            }}
          >
            {item.reaction} 1
          </span>
        )}
        <span
          style={{
            alignItems: "center",
            color: metaColor,
            display: "inline-flex",
            fontSize: 12,
            gap: 3,
            whiteSpace: "nowrap",
          }}
        >
          {item.time ?? "9:41"}
          {outgoing && <DoubleCheck color={metaColor} />}
        </span>
      </div>
      <BubbleTail side={outgoing ? "right" : "left"} color={tailColor} />
    </div>
  );

  return (
    <div
      style={{
        alignItems: "flex-end",
        display: "flex",
        gap: 7,
        justifyContent: outgoing ? "flex-end" : "flex-start",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: outgoing ? "bottom right" : "bottom left",
        width: "100%",
      }}
    >
      {!outgoing && contact !== undefined && (
        <Avatar contact={contact} size={30} />
      )}
      {bubble}
    </div>
  );
}
