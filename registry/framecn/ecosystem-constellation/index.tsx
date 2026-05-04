"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const GitHubMark = () => (
  <svg viewBox="0 0 24 24" width={30} height={30} aria-hidden="true">
    <path
      fill="#fff"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.06c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.35.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39s1.97.13 2.89.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.77 1.06.77 2.13v3.16c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
    />
  </svg>
);

const VercelMark = () => (
  <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
    <path fill="#fff" d="M12 2 L23 21 L1 21 Z" />
  </svg>
);

const StripeMark = () => (
  <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
    <path
      fill="#fff"
      d="M13.5 9.6c0-.6.5-.85 1.3-.85 1.15 0 2.6.35 3.75.97V6.16c-1.25-.5-2.5-.7-3.75-.7C11.7 5.46 9.6 7.06 9.6 9.7c0 4.13 5.7 3.47 5.7 5.25 0 .7-.6.93-1.45.93-1.25 0-2.85-.52-4.1-1.2v3.65c1.4.6 2.8.85 4.1.85 3.2 0 5.4-1.55 5.4-4.25-.02-4.45-5.75-3.65-5.75-5.33z"
    />
  </svg>
);

const SlackMark = () => (
  <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden="true">
    <rect x="2" y="10" width="9" height="2.5" rx="1.25" fill="#36C5F0" />
    <rect x="13" y="10" width="9" height="2.5" rx="1.25" fill="#2EB67D" />
    <rect x="10" y="2" width="2.5" height="9" rx="1.25" fill="#ECB22E" />
    <rect x="10" y="13" width="2.5" height="9" rx="1.25" fill="#E01E5A" />
  </svg>
);

const LinearMark = () => (
  <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
    <defs>
      <linearGradient id="linear-grad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#linear-grad)" />
    <path
      d="M5 13 L11 19 M5 9 L15 19 M15 9 V19"
      stroke="#0a0a0a"
      strokeWidth="0.9"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

const FigmaMark = () => (
  <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden="true">
    <circle cx="9" cy="4" r="3.5" fill="#F24E1E" />
    <circle cx="15" cy="4" r="3.5" fill="#FF7262" />
    <circle cx="9" cy="11" r="3.5" fill="#A259FF" />
    <circle cx="15" cy="11" r="3.5" fill="#1ABCFE" />
    <circle cx="9" cy="18" r="3.5" fill="#0ACF83" />
  </svg>
);

const NotionMark = () => (
  <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" />
    <path
      d="M8 7 V17 M8 7 L16 17 M16 7 V17"
      stroke="#0a0a0a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const DiscordMark = () => (
  <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
    <path
      fill="#fff"
      d="M19.5 4.7A18 18 0 0 0 15 3.3l-.2.4a16.5 16.5 0 0 0-5.6 0L9 3.3a18 18 0 0 0-4.5 1.4C2 8.7 1.4 12.5 1.7 16.3a18 18 0 0 0 5.5 2.8l.4-.6a13 13 0 0 1-2-1l.5-.4a13 13 0 0 0 11.7 0l.5.4a13 13 0 0 1-2 1l.4.6a18 18 0 0 0 5.5-2.8c.4-4.4-.6-8.2-2.7-11.6zM8.5 14c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2zm7 0c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2z"
    />
  </svg>
);

interface SatelliteBrand {
  Logo: React.ComponentType;
  bg: string;
}

const SATELLITE_BRANDS: SatelliteBrand[] = [
  { Logo: GitHubMark, bg: "#1f1f23" },
  { Logo: VercelMark, bg: "#0a0a0a" },
  { Logo: StripeMark, bg: "#635bff" },
  { Logo: SlackMark, bg: "#1a1d21" },
  { Logo: LinearMark, bg: "#5e6ad2" },
  { Logo: FigmaMark, bg: "#1e1e1e" },
  { Logo: NotionMark, bg: "#1a1a1a" },
  { Logo: DiscordMark, bg: "#5865f2" },
];

export interface EcosystemConstellationProps {
  satelliteCount?: number;
  centerLabel?: string;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const EcosystemConstellation = ({
  satelliteCount = 6,
  centerLabel = "V",
  accentColor = "#a855f7",
  speed = 1,
  fps = 30,
  durationInFrames = 240,
  width = 1280,
  height = 720,
  className,
}: EcosystemConstellationProps) => {
  const _safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const count = Math.max(
    3,
    Math.min(SATELLITE_BRANDS.length, Math.floor(satelliteCount))
  );

  const cx = width / 2;
  const cy = height / 2;
  const baseRadiusX = 230;
  const baseRadiusY = 180;

  // Generate positions for satellites in an elliptical orbit
  const satellites = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const orbitOffset = i * 22;
    const rX = baseRadiusX + orbitOffset;
    const rY = baseRadiusY + orbitOffset * 0.7;
    const x = cx + Math.cos(angle) * rX;
    const y = cy + Math.sin(angle) * rY;
    const brand = SATELLITE_BRANDS[i % SATELLITE_BRANDS.length];
    return {
      Logo: brand.Logo,
      color: brand.bg,
      index: i,
      x,
      y,
    };
  });

  const containerStyle: CSSProperties = {
    background: "radial-gradient(ellipse at center, #14101e 0%, #05030a 75%)",
    fontFamily: FONT_FAMILY,
    height,
    overflow: "hidden",
    position: "relative",
    width,
  };

  return (
    <Timegroup
      className={className}
      duration={`${durationMs}ms`}
      mode="fixed"
      style={containerStyle}
    >
      <>
        <style>{`
          @keyframes framecn-eco-pulse {
            0%, 100% { transform: scale(1); opacity: 0.12; }
            50% { transform: scale(1.06); opacity: 0.18; }
          }
          @keyframes framecn-eco-center {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          @keyframes framecn-eco-sat-fade {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes framecn-eco-line {
            from { opacity: 0; }
            to { opacity: 0.15; }
          }
        `}</style>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          style={{ inset: 0, position: "absolute" }}
        >
          {/* Connection lines */}
          {satellites.map((s, i) => (
            <line
              key={`line-${i}`}
              x1={cx}
              y1={cy}
              x2={s.x}
              y2={s.y}
              stroke={accentColor}
              strokeWidth={2}
              strokeLinecap="round"
              style={{
                animation: `framecn-eco-line ${frameMs * 20}ms ease-out ${i * frameMs * 4}ms backwards`,
              }}
            />
          ))}

          {/* Center glow */}
          <circle
            cx={cx}
            cy={cy}
            r={70}
            fill={accentColor}
            style={{
              animation: `framecn-eco-pulse 3000ms ease-in-out infinite`,
            }}
          />
          <circle cx={cx} cy={cy} r={50} fill={accentColor} opacity={0.2} />
        </svg>

        {/* Center logo */}
        <div
          style={{
            alignItems: "center",
            animation: `framecn-eco-center 3000ms ease-in-out infinite`,
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 24,
            boxShadow: `0 0 60px ${accentColor}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
            color: "white",
            display: "flex",
            fontSize: 52,
            fontWeight: 800,
            height: 96,
            justifyContent: "center",
            left: cx,
            letterSpacing: "-0.05em",
            marginLeft: -48,
            marginTop: -48,
            position: "absolute",
            top: cy,
            transform: `scale(1)`,
            width: 96,
          }}
        >
          {centerLabel}
        </div>

        {/* Satellites */}
        {satellites.map((s, i) => {
          const { Logo } = s;
          return (
            <div
              key={`sat-${i}`}
              style={{
                alignItems: "center",
                animation: `framecn-eco-sat-fade ${frameMs * 20}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * frameMs * 4}ms backwards`,
                background: `linear-gradient(180deg, ${s.color} 0%, ${s.color}dd 100%)`,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                boxShadow: `0 8px 30px ${s.color}66, inset 0 1px 0 rgba(255,255,255,0.18)`,
                display: "flex",
                height: 56,
                justifyContent: "center",
                left: s.x,
                marginLeft: -28,
                marginTop: -28,
                position: "absolute",
                top: s.y,
                transform: `scale(1)`,
                width: 56,
              }}
            >
              <Logo />
            </div>
          );
        })}
      </>
    </Timegroup>
  );
};
