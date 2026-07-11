"use client";

import { Timegroup } from "@editframe/react";
import { useState, useEffect } from "react";

import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

export interface Follower {
  name: string;
  handle: string;
  avatarUrl: string;
  verified?: boolean;
}

export interface XFollowersOverviewProps {
  name?: string;
  handle?: string;
  followers?: Follower[];
  theme?: "light" | "dark";
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

const THEMES: Record<"light" | "dark", Theme> = {
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
    cardBorder: "#eff3f4",
    divider: "#eff3f4",
    fg: "#0f1419",
    fgMuted: "#536471",
    page: "#f7f9f9",
  },
};

const DEFAULT_FOLLOWERS: Follower[] = [
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    handle: "mojombo",
    name: "Tom Preston-Werner",
    verified: true,
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    handle: "defunkt",
    name: "Chris Wanstrath",
    verified: true,
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    handle: "pjhyett",
    name: "PJ Hyett",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    handle: "wycats",
    name: "Yehuda Katz",
    verified: true,
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/5?v=4",
    handle: "rtomayko",
    name: "Ryan Tomayko",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    handle: "bmizerany",
    name: "Bryan Taylor",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/7?v=4",
    handle: "schacon",
    name: "Scott Chacon",
    verified: true,
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/9?v=4",
    handle: "anotherjesse",
    name: "Jesse Vincent",
  },
];

const VerifiedBadge = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="#1d9bf0">
    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
  </svg>
);

const Avatar = ({ src, size = 48 }: { src: string; size?: number }) => {
  const [errored, setErrored] = useState(false);
  return (
    <div
      style={{
        borderRadius: size / 2,
        flexShrink: 0,
        height: size,
        overflow: "hidden",
        width: size,
      }}
    >
      {src && !errored ? (
        <img
          alt=""
          onError={() => setErrored(true)}
          src={src}
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
        />
      ) : (
        <div
          style={{
            alignItems: "center",
            background: "#1d9bf0",
            color: "white",
            display: "flex",
            fontSize: size * 0.4,
            fontWeight: 700,
            height: "100%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          ?
        </div>
      )}
    </div>
  );
};

const FollowerRow = ({
  follower,
  theme,
  opacity,
}: {
  follower: Follower;
  theme: Theme;
  opacity: number;
}) => (
  <div
    style={{
      alignItems: "center",
      borderBottom: `1px solid ${theme.divider}`,
      display: "flex",
      gap: 12,
      opacity,
      padding: "12px 16px",
    }}
  >
    <Avatar src={follower.avatarUrl} size={40} />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 4 }}>
        <span
          style={{
            color: theme.fg,
            fontSize: 15,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {follower.name}
        </span>
        {follower.verified && <VerifiedBadge />}
      </div>
      <span
        style={{
          color: theme.fgMuted,
          fontSize: 14,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        @{follower.handle}
      </span>
    </div>
  </div>
);

export const XFollowersOverview = ({
  name = "framecn",
  handle = "framecn",
  followers = DEFAULT_FOLLOWERS,
  theme: themeName = "dark",
  speed = 1,
  fps = 30,
  durationInFrames = 300,
  className,
}: XFollowersOverviewProps) => {
  const theme = THEMES[themeName];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setFrame((prev) => {
        const next = prev + delta * fps * speed;
        return next >= durationInFrames ? 0 : next;
      });
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [fps, speed, durationInFrames]);

  const cursorStyle = useCursorPath([
    { at: 0, x: 100, y: 100 },
    { at: 60, duration: 20, x: 300, y: 200 },
    { at: 90, click: true, duration: 10, x: 300, y: 250 },
  ]);

  const revealProgress = Math.min(1, frame / 60);
  const visibleCount = Math.floor(revealProgress * followers.length);

  return (
    <Timegroup
      className={className}
      style={{
        fontFamily: FONT_FAMILY,
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: theme.page,
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 16,
            left: "50%",
            maxWidth: 440,
            overflow: "hidden",
            position: "absolute",
            top: 40,
            transform: "translateX(-50%)",
            width: "90%",
          }}
        >
          <div
            style={{
              borderBottom: `1px solid ${theme.divider}`,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "16px 16px 12px",
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <span style={{ color: theme.fg, fontSize: 20, fontWeight: 800 }}>
                {name}
              </span>
              <VerifiedBadge />
            </div>
            <span style={{ color: theme.fgMuted, fontSize: 15 }}>
              @{handle}
            </span>
            <span style={{ color: theme.fgMuted, fontSize: 14, marginTop: 4 }}>
              {followers.length} followers
            </span>
          </div>

          {followers.map((follower, i) => (
            <FollowerRow
              key={follower.handle}
              follower={follower}
              opacity={i < visibleCount ? 1 : 0}
              theme={theme}
            />
          ))}
        </div>

        <Cursor style={cursorStyle} variant="pointer" theme={themeName} />
      </div>
    </Timegroup>
  );
};
