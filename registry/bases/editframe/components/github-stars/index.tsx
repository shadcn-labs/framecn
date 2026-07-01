"use client";

import { Timegroup } from "@editframe/react";
import { format, parseISO } from "date-fns";
import { memo, useMemo, useState, useEffect, useRef } from "react";

import { Odometer } from "@/registry/bases/editframe/components/number-wheel";

export interface Stargazer {
  login: string;
  avatarUrl: string;
  starredAt: string;
}

export interface GitHubStarsProps {
  repo?: string;
  totalStars?: number;
  stargazers?: Stargazer[];
  orientation?: "horizontal" | "vertical";
  accentColor?: string;
  speed?: number;
  theme?: "light" | "dark";
  repoAvatarUrl?: string;
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const SAMPLE_STARGAZERS: Stargazer[] = [
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
    starredAt: "2021-03-04",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
    starredAt: "2021-06-12",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
    starredAt: "2021-09-21",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
    starredAt: "2021-12-08",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
    starredAt: "2022-03-17",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
    starredAt: "2022-06-29",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
    starredAt: "2022-09-14",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
    starredAt: "2022-12-23",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
    starredAt: "2023-03-09",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
    starredAt: "2023-07-19",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
    starredAt: "2023-11-02",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
    starredAt: "2024-02-15",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
    starredAt: "2021-03-04",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
    starredAt: "2021-06-12",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
    starredAt: "2021-09-21",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
    starredAt: "2021-12-08",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
    starredAt: "2022-03-17",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
    starredAt: "2022-06-29",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
    starredAt: "2022-09-14",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
    starredAt: "2022-12-23",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
    starredAt: "2023-03-09",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
    starredAt: "2023-07-19",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
    starredAt: "2023-11-02",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
    starredAt: "2024-02-15",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
    starredAt: "2021-03-04",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
    starredAt: "2021-06-12",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
    starredAt: "2021-09-21",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
    starredAt: "2021-12-08",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
    starredAt: "2022-03-17",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
    starredAt: "2022-06-29",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
    starredAt: "2022-09-14",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
    starredAt: "2022-12-23",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
    starredAt: "2023-03-09",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
    starredAt: "2023-07-19",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
    starredAt: "2023-11-02",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
    starredAt: "2024-02-15",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
    starredAt: "2021-03-04",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
    starredAt: "2021-06-12",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
    starredAt: "2021-09-21",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
    starredAt: "2021-12-08",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
    starredAt: "2022-03-17",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
    starredAt: "2022-06-29",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
    starredAt: "2022-09-14",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
    starredAt: "2022-12-23",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
    starredAt: "2023-03-09",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
    starredAt: "2023-07-19",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
    starredAt: "2023-11-02",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
    starredAt: "2024-02-15",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
    starredAt: "2021-03-04",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
    starredAt: "2021-06-12",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
    starredAt: "2021-09-21",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
    starredAt: "2021-12-08",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
    starredAt: "2022-03-17",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
    starredAt: "2022-06-29",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
    starredAt: "2022-09-14",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
    starredAt: "2022-12-23",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
    starredAt: "2023-03-09",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
    starredAt: "2023-07-19",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
    starredAt: "2023-11-02",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
    starredAt: "2024-02-15",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
    starredAt: "2021-03-04",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
    starredAt: "2021-06-12",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
    starredAt: "2021-09-21",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
    starredAt: "2021-12-08",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
    starredAt: "2022-03-17",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
    starredAt: "2022-06-29",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
    starredAt: "2022-09-14",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
    starredAt: "2022-12-23",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
    starredAt: "2023-03-09",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
    starredAt: "2023-07-19",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
    starredAt: "2023-11-02",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
    starredAt: "2024-02-15",
  },
];

const SANS_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

const FONT_FAMILY = SANS_FAMILY;

interface Theme {
  bg: string;
  bgSubtle: string;
  fg: string;
  fgMuted: string;
  border: string;
}

const THEMES: Record<"light" | "dark", Theme> = {
  dark: {
    bg: "#0a0a0a",
    bgSubtle: "#111113",
    border: "#262626",
    fg: "#fafafa",
    fgMuted: "#a1a1aa",
  },
  light: {
    bg: "#ffffff",
    bgSubtle: "#fafafa",
    border: "#ededed",
    fg: "#171717",
    fgMuted: "#737373",
  },
};

export const downsampleStargazers = (
  stargazers: Stargazer[],
  max = 60
): Stargazer[] => {
  const len = stargazers.length;
  if (len <= max) {
    return stargazers;
  }
  if (max <= 1) {
    return len ? [stargazers[0]] : [];
  }
  const out: Stargazer[] = [];
  for (let i = 0; i < max; i++) {
    out.push(stargazers[Math.round((i * (len - 1)) / (max - 1))]);
  }
  return out;
};

const MAX_ELASTIC_OVERSHOOT = 0.0658;
const SCROLL_OVERSHOOT = 1 + MAX_ELASTIC_OVERSHOOT;
const MASK_SOLID_FRACTION = 0.88;
const COUNT_PORTION = 0.8;
const elasticEase = (t: number): number => {
  if (t <= 0) {
    return 0;
  }
  if (t >= 1) {
    return 1;
  }
  const p = 0.3;
  const s = p / 4;
  return 2 ** (-10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
};

export const computeCounterProgress = ({
  frame,
  speed = 1,
  durationInFrames,
}: {
  frame: number;
  speed?: number;
  durationInFrames: number;
}): number => {
  const fc = frame * speed;
  const target = durationInFrames * COUNT_PORTION;
  return Math.max(0, Math.min(1, fc / target));
};

export const computeScrollProgress = ({
  frame,
  speed = 1,
  durationInFrames,
}: {
  frame: number;
  speed?: number;
  durationInFrames: number;
}): number => {
  const fc = frame * speed;
  return Math.max(0, Math.min(1, elasticEase(fc / durationInFrames)));
};

export const computeSpacerRows = ({
  N,
  rowH,
  viewportH,
  visibleRows,
}: {
  N: number;
  rowH: number;
  viewportH: number;
  visibleRows: number;
}): number => {
  const D = Math.max(0, (N - visibleRows + 1) * rowH);
  const needPx =
    MASK_SOLID_FRACTION * viewportH - N * rowH + SCROLL_OVERSHOOT * D;
  return Math.max(0, Math.ceil(needPx / rowH));
};

export const getStarCount = (
  scrollProgress: number,
  totalStars: number
): number => Math.round(scrollProgress * totalStars);

function StarGlyph({ size, fill }: { size: number; fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      color={fill}
      fill={fill}
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Stars</title>
      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" />
    </svg>
  );
}

function Avatar({
  login,
  avatarUrl,
  size,
  theme,
}: {
  login: string;
  avatarUrl: string;
  size: number;
  theme: Theme;
}) {
  const [errored, setErrored] = useState(false);
  const ringStyle = {
    border: `1px solid ${theme.border}`,
    borderRadius: 9999,
    flexShrink: 0,
    height: size,
    width: size,
  } as const;

  if (errored || !avatarUrl) {
    return (
      <div
        style={{
          ...ringStyle,
          alignItems: "center",
          background: theme.bgSubtle,
          color: theme.fgMuted,
          display: "flex",
          fontSize: size * 0.42,
          fontWeight: 600,
          justifyContent: "center",
        }}
      >
        {login.charAt(0).toUpperCase()}
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

interface RowProps {
  stargazer: Stargazer;
  index: number;
  rowH: number;
  avatarSize: number;
  loginSize: number;
  dateLabel: string;
  accent: string;
  theme: Theme;
  isActive: boolean;
  settle: number;
  showSeparator: boolean;
  opacity: number;
}

const Row = memo(function Row({
  stargazer,
  index,
  rowH,
  avatarSize,
  loginSize,
  dateLabel,
  accent,
  theme,
  isActive,
  settle,
  showSeparator,
  opacity,
}: RowProps) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "transparent",
        borderBottom:
          showSeparator && !isActive ? `1px solid ${theme.border}` : "none",
        boxSizing: "border-box",
        display: "flex",
        height: rowH,
        opacity,
        paddingLeft: 24,
        paddingRight: 24,
        position: "relative",
      }}
    >
      {isActive && (
        <>
          <div
            style={{
              background: theme.bgSubtle,
              inset: 0,
              opacity: settle,
              position: "absolute",
            }}
          />
          <div
            style={{
              background: accent,
              bottom: 0,
              left: 0,
              opacity: settle,
              position: "absolute",
              top: 0,
              width: 2,
            }}
          />
        </>
      )}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          position: "relative",
          width: "100%",
        }}
      >
        <Avatar
          login={stargazer.login}
          avatarUrl={stargazer.avatarUrl}
          size={avatarSize}
          theme={theme}
        />
        <div style={{ flex: 1, marginLeft: 20, minWidth: 0 }}>
          <div
            style={{
              color: theme.fg,
              fontFamily: FONT_FAMILY,
              fontSize: loginSize,
              fontWeight: 600,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {stargazer.login}
          </div>
          <div
            style={{
              color: theme.fgMuted,
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.3,
            }}
          >
            {dateLabel}
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            color: theme.fgMuted,
            display: "flex",
            flexShrink: 0,
            fontFamily: MONO_FAMILY,
            fontSize: 18,
            fontVariantNumeric: "tabular-nums",
            gap: 8,
          }}
        >
          <StarGlyph size={20} fill={accent} />
          <span>#{index + 1}</span>
        </div>
      </div>
    </div>
  );
});

export function GithubStars({
  repo = "remotion-dev/remotion",
  totalStars = 24_813,
  stargazers = SAMPLE_STARGAZERS,
  orientation = "horizontal",
  accentColor = "#ffbb00",
  speed = 1,
  theme = "light",
  repoAvatarUrl,
  fps = 30,
  durationInFrames = 300,
  className,
}: GitHubStarsProps) {
  const durationMs = (durationInFrames / fps) * 1000;
  const t = THEMES[theme] ?? THEMES.light;
  const isVertical = orientation === "vertical";
  const refW = isVertical ? 720 : 1280;
  const refH = isVertical ? 1280 : 720;
  const safeSpeed = Math.max(0.01, speed);

  const groupRef = useRef<any>(null);
  const stateRef = useRef({ counterProgress: 0, scrollProgress: 0, settle: 0 });

  const rows = useMemo(() => downsampleStargazers(stargazers), [stargazers]);
  const N = rows.length;

  const rowH = isVertical ? 96 : 88;
  const avatarSize = isVertical ? 60 : 56;
  const loginSize = isVertical ? 30 : 28;
  const dateFormat = isVertical ? "MMM yyyy" : "MMM d, yyyy";
  const formattedRows = useMemo(
    () =>
      rows.map((sg) => {
        try {
          return { dateLabel: format(parseISO(sg.starredAt), dateFormat), sg };
        } catch {
          return { dateLabel: sg.starredAt, sg };
        }
      }),
    [rows, dateFormat]
  );

  const viewport = isVertical
    ? { h: 888, radius: 28, w: 624, x: 48, y: 320 }
    : { h: 600, radius: 24, w: 640, x: 560, y: 60 };

  const visibleRows = Math.floor(viewport.h / rowH);
  const D = Math.max(0, (N - visibleRows + 1) * rowH);
  const spacerRows = computeSpacerRows({
    N,
    rowH,
    viewportH: viewport.h,
    visibleRows,
  });
  const spacerPx = spacerRows * rowH;

  const counterSize = isVertical ? 96 : 120;
  const starSize = isVertical ? 56 : 64;
  const underlineMax = isVertical ? 200 : 240;
  const fadeH = Math.round(viewport.h * 0.12);

  const repoOwner = repo.split("/")[0] || repo;
  const repoAvatarSize = isVertical ? 28 : 32;
  const repoAvatarSrc =
    repoAvatarUrl ?? `https://unavatar.io/github/${repoOwner}`;

  useEffect(() => {
    const tg = groupRef.current;
    if (!tg) {
      return;
    }
    const cleanup = tg.addFrameTask((info: { ownCurrentTimeMs: number }) => {
      const frame = (info.ownCurrentTimeMs / 1000) * fps;
      const counterProgress = computeCounterProgress({
        durationInFrames,
        frame,
        speed: safeSpeed,
      });
      const scrollProgress = computeScrollProgress({
        durationInFrames,
        frame,
        speed: safeSpeed,
      });
      const p = Math.max(
        0,
        Math.min(1, (frame * safeSpeed) / durationInFrames)
      );
      const settle = Math.max(0, Math.min(1, (p - 0.92) / 0.08));
      stateRef.current = { counterProgress, scrollProgress, settle };
    });
    return cleanup;
  }, [fps, safeSpeed, durationInFrames]);

  const { counterProgress } = stateRef.current;
  const { scrollProgress } = stateRef.current;
  const current = counterProgress * totalStars;
  const scrollY = -scrollProgress * D;
  const settleVal = stateRef.current.settle;
  const underlineWidth = counterProgress * underlineMax;

  const listViewport = (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: viewport.radius,
        height: viewport.h,
        left: viewport.x,
        overflow: "hidden",
        position: "absolute",
        top: viewport.y,
        width: viewport.w,
      }}
    >
      <div
        style={{
          transform: `translateY(${scrollY}px)`,
          willChange: "transform",
        }}
      >
        {formattedRows.map(({ sg, dateLabel }, i) => (
          <Row
            key={`${sg.login}-${i}`}
            stargazer={sg}
            index={i}
            rowH={rowH}
            avatarSize={avatarSize}
            loginSize={loginSize}
            dateLabel={dateLabel}
            accent={accentColor}
            theme={t}
            isActive={i === N - 1}
            settle={i === N - 1 ? settleVal : 0}
            showSeparator={i < N - 1}
            opacity={1}
          />
        ))}
        {spacerPx > 0 && (
          <div style={{ height: spacerPx }} aria-hidden="true" />
        )}
      </div>
      <div
        style={{
          background: `linear-gradient(to bottom, ${t.bg}, transparent)`,
          height: fadeH,
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <div
        style={{
          background: `linear-gradient(to top, ${t.bg}, transparent)`,
          bottom: 0,
          height: fadeH,
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          right: 0,
        }}
      />
    </div>
  );

  const underline = (
    <div
      style={{
        background: accentColor,
        borderRadius: 2,
        height: 4,
        width: underlineWidth,
      }}
    />
  );

  const repoSlug = (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: 12,
        maxWidth: isVertical ? 600 : 392,
      }}
    >
      <Avatar
        login={repoOwner}
        avatarUrl={repoAvatarSrc}
        size={repoAvatarSize}
        theme={t}
      />
      <div
        style={{
          color: t.fgMuted,
          fontFamily: FONT_FAMILY,
          fontSize: isVertical ? 20 : 24,
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {repo}
      </div>
    </div>
  );

  const counterZone = isVertical ? (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: 300,
        left: 0,
        paddingTop: 72,
        position: "absolute",
        top: 0,
        width: refW,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
        <StarGlyph size={starSize} fill={accentColor} />
        <Odometer current={current} fontSize={counterSize} color={t.fg} />
      </div>
      {underline}
      {repoSlug}
    </div>
  ) : (
    <div
      style={{
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        height: refH,
        justifyContent: "center",
        left: 80,
        position: "absolute",
        top: 0,
        width: 392,
      }}
    >
      <StarGlyph size={starSize} fill={accentColor} />
      <div style={{ height: 20 }} />
      <Odometer current={current} fontSize={counterSize} color={t.fg} />
      <div style={{ height: 16 }} />
      {underline}
      <div style={{ height: 20 }} />
      {repoSlug}
    </div>
  );

  return (
    <Timegroup
      ref={groupRef}
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={
        {
          background: t.bg,
          inset: 0,
          position: "absolute",
        } as React.CSSProperties
      }
    >
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
        {counterZone}
        {listViewport}
      </div>
    </Timegroup>
  );
}
