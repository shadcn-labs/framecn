"use client";

import type { EFTimegroup } from "@editframe/elements";
import { Timegroup } from "@editframe/react";
import { memo, useMemo, useState, useEffect, useRef } from "react";

import { BlurOutUp } from "@/registry/bases/editframe/components/blur-out-up";
import { SoftBlurIn } from "@/registry/bases/editframe/components/soft-blur-in";

export interface Sponsor {
  login: string;
  avatarUrl: string;
}

export interface GitHubSponsorsProps {
  account?: string;
  sponsors?: Sponsor[];
  accentColor?: string;
  speed?: number;
  theme?: "light" | "dark";
  fps?: number;
  durationInFrames?: number;
  className?: string;
}

export const SAMPLE_SPONSORS: Sponsor[] = [
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    login: "mojombo",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    login: "defunkt",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    login: "pjhyett",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    login: "wycats",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/70?v=4",
    login: "schacon",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/5?v=4",
    login: "rtomayko",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    login: "bmizerany",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/38?v=4",
    login: "atmos",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/14?v=4",
    login: "ezmobius",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/15?v=4",
    login: "macournoyer",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/18?v=4",
    login: "ivey",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/16?v=4",
    login: "uggedal",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/9?v=4",
    login: "anotherjesse",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/21?v=4",
    login: "technoweenie",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/22?v=4",
    login: "takeo",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/25?v=4",
    login: "evanphx",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/26?v=4",
    login: "vanpelt",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/28?v=4",
    login: "wayneeseguin",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/30?v=4",
    login: "brynary",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/31?v=4",
    login: "kevinclark",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/7?v=4",
    login: "kballard",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/12?v=4",
    login: "jnewland",
  },
  {
    avatarUrl: "https://avatars.githubusercontent.com/u/13?v=4",
    login: "caged",
  },
  { avatarUrl: "https://avatars.githubusercontent.com/u/19?v=4", login: "sr" },
];

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const HEART_PATH =
  "M12.0001 4.52853C14.2745 2.23823 17.9866 2.23823 20.2611 4.52853C22.5784 6.86156 22.5784 10.667 20.2611 13.0001L12.0001 21.3199L3.73907 13.0001C1.42175 10.667 1.42175 6.86156 3.73907 4.52853C6.01353 2.23823 9.72563 2.23823 12.0001 4.52853Z";

const REF_W = 1280;
const REF_H = 720;
const GRID_CX = 640;
const GRID_CY = 304;
const GRID_BOX_W = 900;
const GRID_BOX_H = 236;
const HEART_START_Y = 286;
const HEART_HEADER_Y = 120;

const DRAW_END = 40;
const PULSE_END = 62;
const HEART_DOCK_START = 52;
const HEART_DOCK_END = 84;
const AVATAR_START = 70;
const AVATAR_STEP = 3;
const AVATAR_DUR = 22;
const AVATAR_WINDOW = 56;
const THANK_START = 150;
const SUB_START = 166;
const CTA_START = 182;
const CTA_DUR = 22;

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
    bgSubtle: "#161618",
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

export interface Point {
  x: number;
  y: number;
}

export const gridColumns = (
  count: number,
  boxW = GRID_BOX_W,
  boxH = GRID_BOX_H
): number => {
  if (count <= 0) {
    return 0;
  }
  return Math.max(
    1,
    Math.min(count, Math.round(Math.sqrt((count * boxW) / boxH)))
  );
};

export const gridLayout = (
  count: number,
  cols: number,
  cellW: number,
  cellH: number,
  cx = GRID_CX,
  cy = GRID_CY
): Point[] => {
  if (count <= 0 || cols <= 0) {
    return [];
  }
  const rows = Math.ceil(count / cols);
  const out: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const rowCount = Math.min(cols, count - r * cols);
    const rowW = (rowCount - 1) * cellW;
    const x = cx - rowW / 2 + c * cellW;
    const totalH = (rows - 1) * cellH;
    const y = cy - totalH / 2 + r * cellH;
    out.push({ x, y });
  }
  return out;
};
const ramp = (
  frame: number,
  speed: number,
  start: number,
  end: number
): number => {
  const fc = frame * speed;
  return Math.max(0, Math.min(1, (fc - start) / (end - start)));
};

const Avatar = ({
  login,
  avatarUrl,
  size,
  theme,
  grayscale,
}: {
  login: string;
  avatarUrl: string;
  size: number;
  theme: Theme;
  grayscale: number;
}) => {
  const [errored, setErrored] = useState(false);
  const base = {
    border: `1px solid ${theme.border}`,
    borderRadius: 9999,
    filter: `grayscale(${grayscale})`,
    flexShrink: 0,
    height: size,
    width: size,
  } as const;

  if (errored || !avatarUrl) {
    return (
      <div
        style={{
          ...base,
          alignItems: "center",
          background: theme.bgSubtle,
          color: theme.fgMuted,
          display: "flex",
          fontFamily: FONT_FAMILY,
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
      style={{ ...base, objectFit: "cover" }}
    />
  );
};

const SponsorNode = memo(function SponsorNode({
  sponsor,
  cell,
  progress,
  size,
  theme,
}: {
  sponsor: Sponsor;
  cell: Point;
  progress: number;
  size: number;
  theme: Theme;
}) {
  const y = (1 - progress) * 14;
  const blur = (1 - progress) * 10;

  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        left: cell.x,
        opacity: progress,
        position: "absolute",
        top: cell.y,
        transform: `translate(-50%, -50%) translateY(${y}px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      <Avatar
        login={sponsor.login}
        avatarUrl={sponsor.avatarUrl}
        size={size}
        theme={theme}
        grayscale={1 - progress}
      />
    </div>
  );
});

const HeartGlyph = ({
  size,
  accent,
  draw,
  fill,
}: {
  size: number;
  accent: string;
  draw: number;
  fill: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>GitHub Sponsors</title>
    <path
      d={HEART_PATH}
      pathLength={1}
      fill={accent}
      fillOpacity={fill}
      stroke={accent}
      strokeWidth={1.4}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

export const GithubSponsors = ({
  account = "framecn",
  sponsors = SAMPLE_SPONSORS,
  accentColor = "#db61a2",
  speed = 1,
  theme = "light",
  fps = 30,
  durationInFrames = 300,
  className,
}: GitHubSponsorsProps) => {
  const durationMs = (durationInFrames / fps) * 1000;
  const t = THEMES[theme] ?? THEMES.light;
  const safeSpeed = Math.max(0.01, speed);

  const groupRef = useRef<EFTimegroup | null>(null);
  const frameRef = useRef(0);

  const count = sponsors.length;
  const avatarStep =
    count > 1 ? Math.min(AVATAR_STEP, AVATAR_WINDOW / (count - 1)) : 0;
  const cols = gridColumns(count);
  const rows = Math.max(1, Math.ceil(count / Math.max(1, cols)));
  const cellW = GRID_BOX_W / Math.max(1, cols);
  const cellH = GRID_BOX_H / rows;
  const avatarSize = Math.min(84, Math.min(cellW, cellH) * 0.76);

  const cells = useMemo(
    () => gridLayout(count, cols, cellW, cellH),
    [count, cols, cellW, cellH]
  );

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

  const heartBase = 168;
  const heartDy = HEART_HEADER_Y - HEART_START_Y;

  const drawProgress = Math.max(
    0,
    Math.min(1, (frameRef.current * safeSpeed) / DRAW_END)
  );
  const pulseFrame = frameRef.current * safeSpeed;
  let pulseT = 0;
  if (pulseFrame > DRAW_END - 2) {
    pulseT =
      pulseFrame >= PULSE_END
        ? 1
        : (pulseFrame - (DRAW_END - 2)) / (PULSE_END - (DRAW_END - 2));
  }
  let pulseScale = 1;
  if (pulseT > 0 && pulseT < 1) {
    pulseScale = 1 - 0.1 * Math.sin(pulseT * Math.PI);
  }
  const fillO = ramp(frameRef.current, safeSpeed, DRAW_END - 8, PULSE_END);
  const dock = ramp(
    frameRef.current,
    safeSpeed,
    HEART_DOCK_START,
    HEART_DOCK_END
  );
  const heartScale = (1 - 0.62 * dock) * pulseScale;
  const heartDyAnim = heartDy * dock;

  const ctaProgress = ramp(
    frameRef.current,
    safeSpeed,
    CTA_START,
    CTA_START + CTA_DUR
  );
  const ctaBlur = (1 - ctaProgress) * 10;
  const ctaY = (1 - ctaProgress) * 12;
  const accountOpacity = ramp(
    frameRef.current,
    safeSpeed,
    CTA_START + 8,
    CTA_START + CTA_DUR + 8
  );

  const thankDurMs = 1200;
  const subDurMs = 1000;
  const thankDelayMs = Math.max(0, (THANK_START / safeSpeed) * (1000 / fps));
  const subDelayMs = Math.max(0, (SUB_START / safeSpeed) * (1000 / fps));

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
      <>
        <style>{`
          @keyframes framecn-gs-fade {
            from { opacity: 0; transform: translateY(12px); filter: blur(8px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
        `}</style>
        <div
          style={{
            height: REF_H,
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: REF_W,
          }}
        >
          {sponsors.map((sponsor, i) => (
            <SponsorNode
              key={`node-${sponsor.login}-${i}`}
              sponsor={sponsor}
              cell={cells[i]}
              progress={ramp(
                frameRef.current,
                safeSpeed,
                AVATAR_START + i * avatarStep,
                AVATAR_START + i * avatarStep + AVATAR_DUR
              )}
              size={avatarSize}
              theme={t}
            />
          ))}

          <div
            style={{
              alignItems: "center",
              display: "flex",
              height: heartBase,
              justifyContent: "center",
              left: GRID_CX,
              position: "absolute",
              top: HEART_START_Y,
              transform: `translate(-50%, -50%) translate(0px, ${heartDyAnim}px) scale(${heartScale})`,
              width: heartBase,
              willChange: "transform",
            }}
          >
            <HeartGlyph
              size={heartBase}
              accent={accentColor}
              draw={drawProgress}
              fill={fillO}
            />
          </div>

          <div
            style={{
              height: 84,
              left: 0,
              position: "absolute",
              top: 444,
              width: REF_W,
            }}
          >
            <div
              style={{
                animation: `framecn-gs-fade ${thankDurMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${thankDelayMs}ms both`,
                inset: 0,
                position: "absolute",
              }}
            >
              <SoftBlurIn
                text="Thank you"
                fontSize={54}
                fontWeight={600}
                color={t.fg}
                speed={safeSpeed}
              />
            </div>
          </div>

          <div
            style={{
              height: 36,
              left: 0,
              position: "absolute",
              top: 532,
              width: REF_W,
            }}
          >
            <div
              style={{
                animation: `framecn-gs-fade ${subDurMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${subDelayMs}ms both`,
                inset: 0,
                position: "absolute",
              }}
            >
              <BlurOutUp
                text={`Powered by ${count} sponsors`}
                fontSize={24}
                fontWeight={500}
                color={t.fgMuted}
                speed={safeSpeed}
              />
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              left: 0,
              position: "absolute",
              top: 584,
              width: REF_W,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: accentColor,
                borderRadius: 9999,
                color: "#ffffff",
                display: "flex",
                filter: `blur(${ctaBlur}px)`,
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                fontWeight: 600,
                gap: 10,
                opacity: ctaProgress,
                padding: "14px 26px",
                transform: `translateY(${ctaY}px)`,
                willChange: "transform, opacity, filter",
              }}
            >
              <HeartGlyph size={22} accent="#ffffff" draw={1} fill={1} />
              Become a sponsor
            </div>
            <div
              style={{
                color: t.fgMuted,
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                fontWeight: 400,
                opacity: accountOpacity * 0.9,
              }}
            >
              github.com/sponsors/{account}
            </div>
          </div>
        </div>
      </>
    </Timegroup>
  );
};
