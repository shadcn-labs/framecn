"use client";

import { Timegroup } from "@editframe/react";
import { useState, useEffect, useRef } from "react";

import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import type { CursorStyle } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import type { CursorWaypoint } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface XFollowCardProps {
  name?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  joined?: string;
  verified?: boolean;
  accentColor?: string;
  orientation?: "horizontal" | "vertical";
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

interface Theme {
  page: string;
  cardBg: string;
  cardBorder: string;
  fg: string;
  fgMuted: string;
  divider: string;
}

export const THEMES: Record<"light" | "dark", Theme> = {
  dark: {
    cardBg: "#16181c",
    cardBorder: "#2f3336",
    divider: "#2f3336",
    fg: "#e7e9ea",
    fgMuted: "#71767b",
    page: "#0a0a0a",
  },
  light: {
    cardBg: "#ffffff",
    cardBorder: "#e6e9eb",
    divider: "#eff3f4",
    fg: "#0f1419",
    fgMuted: "#536471",
    page: "#f5f7f9",
  },
};

export const CLICK_FRAME = 110;

const BUTTON_LAYOUT: Record<
  "horizontal" | "vertical",
  { x: number; y: number; w: number; h: number }
> = {
  horizontal: { h: 40, w: 116, x: 800, y: 240 },
  vertical: { h: 44, w: 124, x: 542, y: 336 },
};

export const cardBounceIn = (
  frame: number,
  fps: number
): { translateY: number; scale: number } => {
  const t = Math.min(frame / 18, 1);
  const c4 = (2 * Math.PI) / 3;
  const s =
    t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  const translateY = s * 60;
  const scale = 0.9 + s * 0.1;
  return { scale, translateY };
};

export const blurInSchedule = (): {
  group: number;
  start: number;
  end: number;
}[] => [
  { end: 26, group: 0, start: 20 },
  { end: 28, group: 1, start: 22 },
  { end: 30, group: 2, start: 24 },
  { end: 32, group: 3, start: 26 },
  { end: 34, group: 4, start: 28 },
  { end: 36, group: 5, start: 30 },
  { end: 38, group: 6, start: 32 },
  { end: 40, group: 7, start: 34 },
  { end: 42, group: 8, start: 36 },
];

export const blurInAt = (
  step: { start: number; end: number },
  frame: number
): { blur: number; opacity: number; translateY: number } => {
  const progress = Math.max(
    0,
    Math.min(1, (frame - step.start) / (step.end - step.start))
  );
  return {
    blur: 8 * (1 - progress),
    opacity: progress,
    translateY: 8 * (1 - progress),
  };
};

export const followStateAt = (frame: number, speed: number): boolean =>
  frame * speed >= CLICK_FRAME;

export const buildFollowWaypoints = (args: {
  buttonCenter: { x: number; y: number };
  orientation: "horizontal" | "vertical";
}): CursorWaypoint[] => {
  const { buttonCenter, orientation } = args;
  const rest =
    orientation === "vertical" ? { x: 640, y: 1120 } : { x: 1120, y: 600 };
  return [
    { at: 0, x: rest.x, y: rest.y },
    { at: 75, x: rest.x, y: rest.y },
    {
      at: CLICK_FRAME,
      click: true,
      duration: 32,
      easing: "inOut",
      x: buttonCenter.x,
      y: buttonCenter.y,
    },
    { at: CLICK_FRAME + 30, x: buttonCenter.x, y: buttonCenter.y },
  ];
};
const tintGradient = (accent: string): string =>
  `linear-gradient(135deg, ${accent} 0%, ${accent}99 55%, ${accent}55 100%)`;

function Cover({
  coverUrl,
  accent,
  height,
}: {
  coverUrl: string;
  accent: string;
  height: number;
}) {
  const [errored, setErrored] = useState(false);
  const fallback = (
    <div style={{ background: tintGradient(accent), height, width: "100%" }} />
  );
  if (errored || !coverUrl) {
    return fallback;
  }
  return (
    <img
      src={coverUrl}
      crossOrigin="anonymous"
      onError={() => setErrored(true)}
      style={{ display: "block", height, objectFit: "cover", width: "100%" }}
    />
  );
}

function Avatar({
  avatarUrl,
  name,
  size,
  accent,
  theme,
}: {
  avatarUrl: string;
  name: string;
  size: number;
  accent: string;
  theme: Theme;
}) {
  const [errored, setErrored] = useState(false);
  const ringStyle = {
    border: `4px solid ${theme.cardBg}`,
    borderRadius: "100%",
    boxSizing: "border-box" as const,
    flexShrink: 0,
    height: size,
    width: size,
  };

  if (errored || !avatarUrl) {
    return (
      <div
        style={{
          ...ringStyle,
          alignItems: "center",
          background: `${accent}33`,
          color: accent,
          display: "flex",
          fontFamily: FONT_FAMILY,
          fontSize: size * 0.4,
          fontWeight: 700,
          justifyContent: "center",
        }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      crossOrigin="anonymous"
      onError={() => setErrored(true)}
      style={{ ...ringStyle, objectFit: "cover" }}
    />
  );
}

function VerifiedBadge({ accent, size }: { accent: string; size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      width={size}
      height={size}
      fill={accent}
    >
      <title>Verified</title>
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function ProfileInfo({
  name,
  handle,
  bio,
  verified,
  accent,
  theme,
  isVertical,
  nameStyle,
  handleStyle,
  bioStyle,
}: {
  name: string;
  handle: string;
  bio: string;
  verified: boolean;
  accent: string;
  theme: Theme;
  isVertical: boolean;
  nameStyle: React.CSSProperties;
  handleStyle: React.CSSProperties;
  bioStyle: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        marginTop: 12,
      }}
    >
      <div
        style={{ ...nameStyle, alignItems: "center", display: "flex", gap: 6 }}
      >
        <span
          style={{
            color: theme.fg,
            fontFamily: FONT_FAMILY,
            fontSize: isVertical ? 28 : 24,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {name}
        </span>
        {verified && (
          <VerifiedBadge accent={accent} size={isVertical ? 24 : 22} />
        )}
      </div>
      <span
        style={{
          ...handleStyle,
          color: theme.fgMuted,
          fontFamily: FONT_FAMILY,
          fontSize: isVertical ? 18 : 16,
          fontWeight: 400,
          lineHeight: 1.3,
        }}
      >
        @{handle}
      </span>
      <p
        style={{
          ...bioStyle,
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          color: theme.fg,
          display: "-webkit-box",
          fontFamily: FONT_FAMILY,
          fontSize: isVertical ? 18 : 16,
          fontWeight: 400,
          lineHeight: 1.4,
          margin: "8px 0 0",
          overflow: "hidden",
        }}
      >
        {bio}
      </p>
    </div>
  );
}

function MetaRow({
  location,
  website,
  joined,
  accent,
  theme,
}: {
  location: string;
  website: string;
  joined: string;
  accent: string;
  theme: Theme;
}) {
  const itemStyle = {
    alignItems: "center",
    color: theme.fgMuted,
    display: "flex",
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    gap: 6,
  } as const;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14 }}>
      <span style={itemStyle}>
        <PinIcon color={theme.fgMuted} />
        {location}
      </span>
      <span style={itemStyle}>
        <LinkIcon color={theme.fgMuted} />
        <span style={{ color: accent }}>{website}</span>
      </span>
      <span style={itemStyle}>
        <CalendarIcon color={theme.fgMuted} />
        {`Joined ${joined}`}
      </span>
    </div>
  );
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill={color}>
      <title>Location</title>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function LinkIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill={color}>
      <title>Website</title>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill={color}>
      <title>Joined</title>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
    </svg>
  );
}

function FollowButton({
  frame,
  speed,
  accent,
  theme,
  layout,
  pressScale,
}: {
  frame: number;
  speed: number;
  accent: string;
  theme: Theme;
  layout: { x: number; y: number; w: number; h: number };
  pressScale: number;
}) {
  const followed = followStateAt(frame, speed);
  const flipProgress = Math.max(
    0,
    Math.min(1, (frame * speed - CLICK_FRAME) / 10)
  );

  const base = {
    alignItems: "center",
    borderRadius: layout.h / 2,
    boxSizing: "border-box" as const,
    display: "flex",
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 700,
    height: layout.h,
    justifyContent: "center",
    left: layout.x,
    position: "absolute" as const,
    top: layout.y,
    transform: `scale(${pressScale})`,
    transformOrigin: "center",
    width: layout.w,
  };

  return (
    <div style={base}>
      <div
        style={{
          alignItems: "center",
          background: accent,
          borderRadius: layout.h / 2,
          color: "#ffffff",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          opacity: 1 - flipProgress,
          position: "absolute",
        }}
      >
        Follow
      </div>
      <div
        style={{
          alignItems: "center",
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: layout.h / 2,
          color: theme.fg,
          display: "flex",
          inset: 0,
          justifyContent: "center",
          opacity: flipProgress,
          position: "absolute",
        }}
      >
        Following
      </div>
    </div>
  );
}

function MessageButton({
  layout,
  theme,
}: {
  layout: { x: number; y: number; size: number };
  theme: Theme;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: layout.size / 2,
        display: "flex",
        height: layout.size,
        justifyContent: "center",
        left: layout.x,
        position: "absolute",
        top: layout.y,
        width: layout.size,
      }}
    >
      <svg width={20} height={20} viewBox="0 0 24 24" fill={theme.fg}>
        <title>Message</title>
        <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.638V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.638-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z" />
      </svg>
    </div>
  );
}

function Tabs({
  accent,
  theme,
  isVertical,
}: {
  accent: string;
  theme: Theme;
  isVertical: boolean;
}) {
  const tabs = ["Posts", "Replies", "Media", "Likes"];
  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.divider}`,
        columnGap: 32,
        display: "flex",
        marginTop: 0,
      }}
    >
      {tabs.map((tab, i) => {
        const active = i === 0;
        return (
          <div
            key={tab}
            style={{
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
              paddingBottom: 12,
              position: "relative",
            }}
          >
            <span
              style={{
                color: active ? theme.fg : theme.fgMuted,
                fontFamily: FONT_FAMILY,
                fontSize: isVertical ? 17 : 15,
                fontWeight: active ? 700 : 500,
              }}
            >
              {tab}
            </span>
            {active && (
              <div
                style={{
                  background: accent,
                  borderRadius: 2,
                  bottom: -1,
                  height: 4,
                  position: "absolute",
                  width: 56,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SamplePost({
  name,
  handle,
  avatarUrl,
  accent,
  theme,
}: {
  name: string;
  handle: string;
  avatarUrl: string;
  accent: string;
  theme: Theme;
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
      <Avatar
        avatarUrl={avatarUrl}
        name={name}
        size={44}
        accent={accent}
        theme={theme}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontFamily: FONT_FAMILY,
            gap: 6,
          }}
        >
          <span style={{ color: theme.fg, fontSize: 15, fontWeight: 700 }}>
            {name}
          </span>
          <span
            style={{ color: theme.fgMuted, fontSize: 15 }}
          >{`@${handle} · 2d`}</span>
        </div>
        <p
          style={{
            color: theme.fg,
            fontFamily: FONT_FAMILY,
            fontSize: 15,
            lineHeight: 1.4,
            margin: "4px 0 0",
          }}
        >
          Shipping something new today. Built entirely with Remotion and a lot
          of coffee. More soon.
        </p>
        <div
          style={{
            color: theme.fgMuted,
            display: "flex",
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            gap: 40,
            marginTop: 10,
          }}
        >
          <span>12</span>
          <span>48</span>
          <span>312</span>
        </div>
      </div>
    </div>
  );
}

function CursorLayer({
  theme,
  accent,
  style,
}: {
  theme: "light" | "dark";
  accent: string;
  style: CursorStyle;
}) {
  return (
    <div style={{ inset: 0, pointerEvents: "none", position: "absolute" }}>
      <Cursor style={style} />
    </div>
  );
}

export function XFollowCard({
  name = "framecn",
  handle = "framecn",
  bio = "Building the collaborative video toolkit for small teams.\nShip demos faster with ready-made motion.",
  avatarUrl = "/logo.svg",
  coverUrl = "",
  location = "Tunisia",
  website = "framecn.dev",
  joined = "January 2024",
  verified = true,
  accentColor = "#1d9bf0",
  orientation = "horizontal",
  speed = 1,
  fps = 30,
  durationInFrames = 200,
  className,
}: XFollowCardProps) {
  const durationMs = (durationInFrames / fps) * 1000;
  const t = THEMES.light;
  const isVertical = orientation === "vertical";
  const refW = isVertical ? 720 : 1280;
  const refH = isVertical ? 1280 : 720;
  const frameMs = 1000 / fps;
  const safeSpeed = Math.max(0.01, speed);

  const groupRef = useRef<any>(null);
  const frameRef = useRef(0);

  const cardWidth = isVertical ? 660 : 600;
  const cardLeft = (refW - cardWidth) / 2;
  const cardTop = isVertical ? 140 : 70;
  const coverHeight = isVertical ? 180 : 150;
  const avatarSize = isVertical ? 120 : 110;

  const layout = BUTTON_LAYOUT[orientation];
  const buttonCenter = {
    x: layout.x + layout.w / 2,
    y: layout.y + layout.h / 2,
  };

  const cursorStyle = useCursorPath(
    buildFollowWaypoints({ buttonCenter, orientation }),
    undefined,
    { speed: safeSpeed }
  );
  const pressScale = 0.9 + 0.1 * (cursorStyle.pressScale ?? 1);

  const messageLayout = {
    size: layout.h,
    x: layout.x - layout.h - 8,
    y: layout.y,
  };

  const schedule = blurInSchedule();

  const groupStyle = (group: number, frame: number) => {
    const step = schedule[group];
    const b = blurInAt(step, frame * safeSpeed);
    return {
      filter: b.blur > 0 ? `blur(${b.blur}px)` : "none",
      opacity: b.opacity,
      transform: `translateY(${b.translateY}px)`,
    };
  };

  useEffect(() => {
    const tg = groupRef.current;
    if (!tg) {
      return;
    }
    const cleanup = tg.addFrameTask((info: { ownCurrentTimeMs: number }) => {
      frameRef.current = (info.ownCurrentTimeMs / 1000) * fps;
    });
    return cleanup;
  }, [fps]);

  const bounceDur = (24 * frameMs) / safeSpeed;

  return (
    <Timegroup
      ref={groupRef}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background: "transparent",
          inset: 0,
          position: "absolute",
        } as React.CSSProperties
      }
    >
      <>
        <style>{`
          @keyframes framecnxfc-bounce {
            from { opacity: 0; transform: translateY(60px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div
          style={{
            height: refH,
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: refW,
          }}
        >
          <div
            style={{
              animation: `framecnxfc-bounce ${bounceDur}ms cubic-bezier(0.14, 1.12, 0.34, 1.4) 0ms both`,
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 24,
              boxShadow: "0 12px 40px -16px rgba(15,20,25,0.18)",
              left: cardLeft,
              overflow: "hidden",
              position: "absolute",
              top: cardTop,
              transformOrigin: "center top",
              width: cardWidth,
            }}
          >
            <div style={groupStyle(0, frameRef.current)}>
              <Cover
                coverUrl={coverUrl}
                accent={accentColor}
                height={coverHeight}
              />
            </div>

            <div style={{ padding: "0 24px 24px" }}>
              <div
                style={{
                  alignItems: "flex-end",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: -(avatarSize / 2),
                  position: "relative",
                }}
              >
                <div
                  style={{
                    background: t.cardBg,
                    borderRadius: "100%",
                    flexShrink: 0,
                    height: avatarSize,
                    width: avatarSize,
                  }}
                >
                  <div style={groupStyle(1, frameRef.current)}>
                    <Avatar
                      avatarUrl={avatarUrl}
                      name={name}
                      size={avatarSize}
                      accent={accentColor}
                      theme={t}
                    />
                  </div>
                </div>
              </div>

              <ProfileInfo
                name={name}
                handle={handle}
                bio={bio}
                verified={verified}
                accent={accentColor}
                theme={t}
                isVertical={isVertical}
                nameStyle={groupStyle(2, frameRef.current)}
                handleStyle={groupStyle(3, frameRef.current)}
                bioStyle={groupStyle(4, frameRef.current)}
              />

              <div style={groupStyle(5, frameRef.current)}>
                <MetaRow
                  location={location}
                  website={website}
                  joined={joined}
                  accent={accentColor}
                  theme={t}
                />
              </div>

              <div style={{ height: layout.h - 8 }} aria-hidden="true" />

              <div style={groupStyle(7, frameRef.current)}>
                <Tabs accent={accentColor} theme={t} isVertical={isVertical} />
              </div>

              <div style={groupStyle(8, frameRef.current)}>
                <SamplePost
                  name={name}
                  handle={handle}
                  avatarUrl={avatarUrl}
                  accent={accentColor}
                  theme={t}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              animation: `framecnxfc-bounce ${bounceDur}ms cubic-bezier(0.14, 1.12, 0.34, 1.4) 0ms both`,
              inset: 0,
              position: "absolute",
              transformOrigin: "center top",
            }}
          >
            <div
              style={{
                ...groupStyle(6, frameRef.current),
                inset: 0,
                position: "absolute",
              }}
            >
              <MessageButton layout={messageLayout} theme={t} />
              <FollowButton
                frame={frameRef.current}
                speed={safeSpeed}
                accent={accentColor}
                theme={t}
                layout={layout}
                pressScale={pressScale}
              />
            </div>
          </div>

          <CursorLayer theme="light" accent={accentColor} style={cursorStyle} />
        </div>
      </>
    </Timegroup>
  );
}
