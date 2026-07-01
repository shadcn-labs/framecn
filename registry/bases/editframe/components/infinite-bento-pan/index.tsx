"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const SUPER_W = 3500;
const SUPER_H = 2500;

type CardKind =
  | "chart"
  | "counter"
  | "gradient"
  | "code"
  | "logo"
  | "stat"
  | "bars";

interface CardDef {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: CardKind;
  hue: number;
  label?: string;
}

const CARDS: CardDef[] = [
  { h: 280, hue: 220, kind: "chart", label: "Revenue", w: 480, x: 80, y: 80 },
  { h: 280, hue: 280, kind: "counter", label: "MRR", w: 280, x: 600, y: 80 },
  { h: 180, hue: 200, kind: "gradient", w: 360, x: 920, y: 80 },
  { h: 280, hue: 0, kind: "code", label: "deploy.ts", w: 480, x: 1320, y: 80 },
  { h: 280, hue: 320, kind: "logo", w: 280, x: 1840, y: 80 },
  { h: 180, hue: 160, kind: "stat", label: "Uptime", w: 380, x: 2160, y: 80 },
  { h: 280, hue: 40, kind: "bars", label: "Visits", w: 360, x: 2580, y: 80 },
  { h: 200, hue: 180, kind: "counter", label: "Users", w: 360, x: 920, y: 300 },
  {
    h: 200,
    hue: 100,
    kind: "chart",
    label: "Latency",
    w: 380,
    x: 2160,
    y: 300,
  },
  { h: 280, hue: 340, kind: "gradient", w: 280, x: 80, y: 400 },
  { h: 280, hue: 0, kind: "code", label: "api.ts", w: 480, x: 400, y: 400 },
  { h: 280, hue: 60, kind: "stat", label: "P95", w: 280, x: 1320, y: 420 },
  { h: 280, hue: 260, kind: "bars", label: "Builds", w: 380, x: 1640, y: 420 },
  { h: 280, hue: 200, kind: "logo", w: 360, x: 2580, y: 420 },
  { h: 240, hue: 290, kind: "chart", label: "Errors", w: 480, x: 80, y: 720 },
  { h: 240, hue: 20, kind: "stat", label: "RPS", w: 280, x: 600, y: 720 },
  { h: 220, hue: 240, kind: "gradient", w: 380, x: 920, y: 740 },
  {
    h: 220,
    hue: 140,
    kind: "counter",
    label: "Active",
    w: 360,
    x: 1320,
    y: 740,
  },
  { h: 220, hue: 0, kind: "code", label: "worker.ts", w: 480, x: 1720, y: 740 },
  { h: 220, hue: 320, kind: "bars", label: "Queue", w: 360, x: 2240, y: 740 },
  { h: 220, hue: 180, kind: "logo", w: 360, x: 80, y: 1000 },
  { h: 220, hue: 80, kind: "stat", label: "Cache", w: 380, x: 460, y: 1000 },
  { h: 220, hue: 200, kind: "chart", label: "CPU", w: 480, x: 880, y: 1000 },
  {
    h: 220,
    hue: 360,
    kind: "counter",
    label: "Jobs",
    w: 280,
    x: 1400,
    y: 1000,
  },
  { h: 220, hue: 120, kind: "gradient", w: 360, x: 1720, y: 1020 },
  { h: 220, hue: 0, kind: "code", label: "db.sql", w: 380, x: 2120, y: 1020 },
  { h: 220, hue: 280, kind: "bars", label: "Tasks", w: 400, x: 2540, y: 1020 },
  { h: 260, hue: 0, kind: "code", label: "edge.ts", w: 480, x: 80, y: 1280 },
  { h: 260, hue: 240, kind: "chart", label: "TTFB", w: 360, x: 600, y: 1280 },
  { h: 260, hue: 60, kind: "logo", w: 280, x: 1000, y: 1280 },
  { h: 260, hue: 200, kind: "stat", label: "Hits", w: 380, x: 1320, y: 1280 },
  {
    h: 260,
    hue: 300,
    kind: "counter",
    label: "Bytes",
    w: 360,
    x: 1740,
    y: 1280,
  },
  { h: 260, hue: 160, kind: "gradient", w: 380, x: 2140, y: 1280 },
  { h: 260, hue: 0, kind: "bars", label: "Errors", w: 380, x: 2560, y: 1280 },
  { h: 220, hue: 280, kind: "stat", label: "Saved", w: 380, x: 80, y: 1600 },
  { h: 220, hue: 40, kind: "chart", label: "Net Out", w: 480, x: 500, y: 1600 },
  { h: 220, hue: 0, kind: "code", label: "auth.ts", w: 360, x: 1020, y: 1600 },
  { h: 220, hue: 220, kind: "logo", w: 280, x: 1420, y: 1600 },
  {
    h: 220,
    hue: 100,
    kind: "counter",
    label: "Hooks",
    w: 380,
    x: 1740,
    y: 1620,
  },
  { h: 220, hue: 340, kind: "bars", label: "Runs", w: 360, x: 2160, y: 1620 },
  { h: 220, hue: 200, kind: "gradient", w: 380, x: 2560, y: 1620 },
  { h: 240, hue: 180, kind: "bars", label: "Edges", w: 480, x: 80, y: 1880 },
  { h: 240, hue: 320, kind: "gradient", w: 380, x: 600, y: 1880 },
  { h: 240, hue: 80, kind: "logo", w: 360, x: 1020, y: 1880 },
  {
    h: 240,
    hue: 260,
    kind: "chart",
    label: "Tokens",
    w: 480,
    x: 1420,
    y: 1880,
  },
  {
    h: 240,
    hue: 20,
    kind: "counter",
    label: "Calls",
    w: 280,
    x: 1940,
    y: 1880,
  },
  { h: 240, hue: 140, kind: "stat", label: "Score", w: 380, x: 2260, y: 1880 },
  { h: 240, hue: 0, kind: "code", label: "ws.ts", w: 260, x: 2680, y: 1880 },
];

const ChartCard = ({ accent, t }: { accent: string; t: number }) => {
  const points: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    const x = (i / 11) * 100;
    const y =
      50 - (Math.sin(i * 0.7 + t) * 18 + Math.cos(i * 0.4 + t * 0.6) * 8);
    points.push(`${x},${y}`);
  }
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      style={{ height: "100%", width: "100%" }}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={accent}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`${points.join(" ")} 100,60 0,60`}
        fill={`${accent}22`}
        stroke="none"
      />
    </svg>
  );
};

const BarsCard = ({ accent, t }: { accent: string; t: number }) => (
  <div
    style={{
      alignItems: "flex-end",
      display: "flex",
      gap: 6,
      height: "100%",
      width: "100%",
    }}
  >
    {Array.from({ length: 10 }).map((_, i) => {
      const h = 25 + (Math.sin(i * 0.8 + t) * 0.5 + 0.5) * 70;
      return (
        <div
          key={i}
          style={{
            background: `linear-gradient(180deg, ${accent} 0%, ${accent}55 100%)`,
            borderRadius: 4,
            flex: 1,
            height: `${h}%`,
          }}
        />
      );
    })}
  </div>
);

const CodeCard = () => {
  const lines = [
    { c: "#7dd3fc", indent: 0, w: 60 },
    { c: "rgba(255,255,255,0.8)", indent: 1, w: 80 },
    { c: "#f9a8d4", indent: 1, w: 50 },
    { c: "rgba(255,255,255,0.8)", indent: 2, w: 70 },
    { c: "#fde047", indent: 2, w: 40 },
    { c: "rgba(255,255,255,0.6)", indent: 1, w: 30 },
    { c: "rgba(255,255,255,0.6)", indent: 0, w: 20 },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        gap: 8,
      }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            background: l.c,
            borderRadius: 3,
            height: 8,
            marginLeft: l.indent * 14,
            opacity: 0.7,
            width: `${l.w}%`,
          }}
        />
      ))}
    </div>
  );
};

const LogoCard = ({ accent, hue }: { accent: string; hue: number }) => (
  <div
    style={{
      alignItems: "center",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      width: "100%",
    }}
  >
    <div
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, hsl(${hue},70%,55%) 100%)`,
        borderRadius: 20,
        boxShadow: `0 10px 30px ${accent}44`,
        height: 80,
        width: 80,
      }}
    />
  </div>
);

const GradientCard = ({ hue }: { hue: number }) => (
  <div
    style={{
      background: `radial-gradient(circle at 30% 30%, hsl(${hue},80%,60%) 0%, hsl(${(hue + 60) % 360},70%,40%) 50%, #0a0a0a 100%)`,
      height: "100%",
      width: "100%",
    }}
  />
);

const Card = ({
  card,
  accent,
  index,
  frame,
}: {
  card: CardDef;
  accent: string;
  index: number;
  frame: number;
}) => {
  const t = (Math.sin(frame / 30 + index) * 0.5 + 0.5) * 6.28;

  const baseStyle: React.CSSProperties = {
    background: "linear-gradient(180deg, #131313 0%, #0a0a0a 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 18,
    color: "white",
    display: "flex",
    flexDirection: "column",
    height: card.h,
    left: card.x,
    overflow: "hidden",
    padding: 18,
    position: "absolute",
    top: card.y,
    width: card.w,
  };

  const labelEl = card.label ? (
    <div
      style={{
        color: "rgba(255,255,255,0.55)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {card.label}
    </div>
  ) : null;

  if (card.kind === "chart") {
    return (
      <div style={baseStyle}>
        {labelEl}
        <div style={{ flex: 1 }}>
          <ChartCard accent={accent} t={t} />
        </div>
      </div>
    );
  }
  if (card.kind === "bars") {
    return (
      <div style={baseStyle}>
        {labelEl}
        <div style={{ flex: 1 }}>
          <BarsCard accent={accent} t={t} />
        </div>
      </div>
    );
  }
  if (card.kind === "counter") {
    const v = Math.floor(1200 + Math.sin(index + frame / 30) * 800);
    return (
      <div style={baseStyle}>
        {labelEl}
        <div
          style={{
            alignItems: "center",
            color: "white",
            display: "flex",
            flex: 1,
            fontSize: 56,
            fontWeight: 700,
            justifyContent: "flex-start",
            letterSpacing: "-0.04em",
          }}
        >
          {v.toLocaleString()}
        </div>
        <div style={{ color: accent, fontSize: 12, fontWeight: 600 }}>
          +{(Math.sin(index + 1 + frame / 30) * 12).toFixed(1)}%
        </div>
      </div>
    );
  }
  if (card.kind === "stat") {
    const v = (95 + Math.sin(index + frame / 30) * 5).toFixed(2);
    return (
      <div style={baseStyle}>
        {labelEl}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {v}
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 20,
              marginLeft: 4,
            }}
          >
            %
          </span>
        </div>
      </div>
    );
  }
  if (card.kind === "code") {
    return (
      <div style={{ ...baseStyle, padding: 0 }}>
        <div style={{ alignItems: "center", display: "flex", flex: 1 }}>
          <div style={{ width: "100%" }}>
            <CodeCard />
          </div>
        </div>
      </div>
    );
  }
  if (card.kind === "logo") {
    return (
      <div style={{ ...baseStyle, padding: 0 }}>
        <LogoCard accent={accent} hue={card.hue} />
      </div>
    );
  }
  // gradient
  return (
    <div style={{ ...baseStyle, padding: 0 }}>
      <GradientCard hue={card.hue} />
    </div>
  );
};

export interface InfiniteBentoPanProps {
  panSpeed?: number;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const InfiniteBentoPan = ({
  panSpeed = 1,
  accentColor = "#7c3aed",
  speed = 1,
  fps = 30,
  durationInFrames = 300,
  width = 1280,
  height = 720,
  className,
}: InfiniteBentoPanProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const panRate = Math.max(0.01, panSpeed);
  const durationMs = (durationInFrames / fps) * 1000;

  const maxX = SUPER_W - width;
  const maxY = SUPER_H - height;

  const containerStyle: CSSProperties = {
    background: "#050505",
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
          @keyframes framecn-bento-pan {
            from { transform: translate(0, 0); }
            to { transform: translate(${-maxX}px, ${-maxY}px); }
          }
        `}</style>
        <div
          style={{
            animation: `framecn-bento-pan ${durationMs / safeSpeed / panRate}ms linear backwards`,
            height: SUPER_H,
            left: 0,
            position: "absolute",
            top: 0,
            width: SUPER_W,
            willChange: "transform",
          }}
        >
          {CARDS.map((c, i) => (
            <Card key={i} card={c} accent={accentColor} index={i} frame={0} />
          ))}
        </div>
        <div
          style={{
            background:
              "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 80%, #000 100%)",
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      </>
    </Timegroup>
  );
};
