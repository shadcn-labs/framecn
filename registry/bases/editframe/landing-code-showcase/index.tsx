"use client";

import { Timegroup } from "@editframe/react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

/* -------------------------------------------------------------------------- */
/*                                  Tokens                                    */
/* -------------------------------------------------------------------------- */

const PEACH = "#FFB38E";
const LAVENDER = "#D4B3FF";
const MINT = "#A1EEBD";
const STAGE_BG = "#0A090E";
const PANEL_BG = "#141318";

/* -------------------------------------------------------------------------- */
/*                              Timeline (ms)                                 */
/* -------------------------------------------------------------------------- */

const SCENES = {
  blur: { duration: 3000, start: 0 },
  dashboard: { duration: 3666, start: 4333 },
  endHold: 2666,
  glassWipe: { duration: 2000, start: 7666 },
  maskedSlide: { duration: 4000, start: 9666 },
  push1: { duration: 2000, start: 2333 },
  push2: { duration: 2000, start: 13_333 },
  terminal: { duration: 6000, start: 15_333 },
};

const TOTAL_DURATION_MS =
  SCENES.terminal.start + SCENES.terminal.duration + SCENES.endHold;

/* -------------------------------------------------------------------------- */
/*                              Code timeline                                 */
/* -------------------------------------------------------------------------- */

interface CodeStep {
  startMs: number;
  code: string;
  highlight?: string;
}

const HEADER = `import { BlurReveal, DashboardPopulate, MaskedSlideReveal,
  TerminalToBrowserDeploy, Transition } from "@/components/framecn";

export default function Scene() {
  return (
    <>
`;

const FOOTER = `    </>
  );
}`;

const STEPS: CodeStep[] = [
  { code: `      <BlurReveal text="Build faster." />\n`, startMs: 133 },
  {
    code: `      <Transition type="spatial-push" />\n`,
    highlight: "spatial-push",
    startMs: SCENES.push1.start,
  },
  {
    code: `      <DashboardPopulate data={metrics} />\n`,
    startMs: SCENES.dashboard.start,
  },
  {
    code: `      <Transition type="glass-wipe" />\n`,
    highlight: "glass-wipe",
    startMs: SCENES.glassWipe.start,
  },
  {
    code: `      <MaskedSlideReveal text="Ship to production." />\n`,
    startMs: SCENES.maskedSlide.start,
  },
  {
    code: `      <Transition type="spatial-push" direction="left" />\n`,
    highlight: "spatial-push",
    startMs: SCENES.push2.start,
  },
  {
    code: `      <TerminalToBrowserDeploy />\n`,
    startMs: SCENES.terminal.start,
  },
];

const CHARS_PER_MS = 0.022;

/* -------------------------------------------------------------------------- */
/*                              Syntax highlight                              */
/* -------------------------------------------------------------------------- */

interface Token {
  text: string;
  color: string;
  glow?: boolean;
}

const tokenizeLine = (
  line: string,
  accentColor: string,
  highlightedToken: string | null
): Token[] => {
  const tokens: Token[] = [];
  const regex =
    /(\bimport\b|\bfrom\b|\bexport\b|\bdefault\b|\bfunction\b|\breturn\b|\bconst\b)|("[^"]*")|(\b[A-Z][a-zA-Z0-9_]*)|(\b[a-zA-Z_][a-zA-Z0-9_]*)(?==)|(\{|\}|\(|\)|<|>|\/|;)|([0-9]+)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null = regex.exec(line);
  while (m !== null) {
    if (m.index > lastIndex) {
      tokens.push({ color: "#e4e4e7", text: line.slice(lastIndex, m.index) });
    }
    if (m[1]) {
      tokens.push({ color: LAVENDER, text: m[1] });
    } else if (m[2]) {
      const inner = m[2].slice(1, -1);
      if (highlightedToken && inner === highlightedToken) {
        tokens.push({ color: LAVENDER, glow: true, text: m[2] });
      } else {
        tokens.push({ color: MINT, text: m[2] });
      }
    } else if (m[3]) {
      tokens.push({ color: PEACH, text: m[3] });
    } else if (m[4]) {
      tokens.push({ color: accentColor, text: m[4] });
    } else if (m[5]) {
      tokens.push({ color: "#71717a", text: m[5] });
    } else if (m[6]) {
      tokens.push({ color: "#fbbf24", text: m[6] });
    }
    ({ lastIndex } = regex);
    m = regex.exec(line);
  }
  if (lastIndex < line.length) {
    tokens.push({ color: "#e4e4e7", text: line.slice(lastIndex) });
  }
  return tokens;
};

/* -------------------------------------------------------------------------- */
/*                                Code editor                                 */
/* -------------------------------------------------------------------------- */

const CodeEditor = ({
  elapsedMs,
  accentColor,
}: {
  elapsedMs: number;
  accentColor: string;
}) => {
  const dynamicChunks: string[] = [];
  let activeHighlight: string | null = null;

  for (const step of STEPS) {
    if (elapsedMs < step.startMs) {
      break;
    }
    const elapsed = elapsedMs - step.startMs;
    const charsTyped = Math.min(
      step.code.length,
      Math.floor(elapsed * CHARS_PER_MS)
    );
    dynamicChunks.push(step.code.slice(0, charsTyped));
    if (step.highlight) {
      const sinceStart = elapsedMs - step.startMs;
      if (sinceStart >= 0 && sinceStart < 2000) {
        activeHighlight = step.highlight;
      }
    }
  }

  const allTyped = dynamicChunks.join("");
  const lastStep = STEPS.at(-1);
  const showFooter =
    lastStep !== undefined &&
    elapsedMs > lastStep.startMs + lastStep.code.length / CHARS_PER_MS + 133;
  const visibleCode = HEADER + allTyped + (showFooter ? FOOTER : "");
  const lines = visibleCode.split("\n");
  const lastLineIdx = lines.length - 1;
  const caretOn = Math.floor(elapsedMs / 400) % 2 === 0;

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)",
        borderRadius: 16,
        boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4)",
        maxWidth: 540,
        padding: 1,
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(20px)",
          background: "rgba(12,12,14,0.9)",
          borderRadius: 15,
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 8,
            height: 40,
            padding: "0 16px",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                background: c,
                borderRadius: 6,
                height: 11,
                opacity: 0.65,
                width: 11,
              }}
            />
          ))}
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: MONO_FAMILY,
              fontSize: 12,
              marginLeft: 12,
            }}
          >
            scene.tsx
          </div>
        </div>

        {/* Code body */}
        <div
          style={{
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            color: "#e4e4e7",
            fontFamily: MONO_FAMILY,
            fontSize: 12.5,
            lineHeight: 1.7,
            minHeight: 480,
            padding: "20px 22px",
          }}
        >
          {lines.map((line, i) => {
            const tokens = tokenizeLine(line, accentColor, activeHighlight);
            const isLast = i === lastLineIdx;
            return (
              <div key={i} style={{ display: "flex", whiteSpace: "pre" }}>
                <span
                  style={{
                    color: "rgba(255,255,255,0.18)",
                    flexShrink: 0,
                    userSelect: "none",
                    width: 26,
                  }}
                >
                  {i + 1}
                </span>
                <span>
                  {tokens.length === 0 ? (
                    <span> </span>
                  ) : (
                    tokens.map((t, j) => (
                      <span
                        key={j}
                        style={{
                          color: t.color,
                          textShadow: t.glow
                            ? `0 0 12px ${LAVENDER}, 0 0 24px ${LAVENDER}80`
                            : undefined,
                        }}
                      >
                        {t.text}
                      </span>
                    ))
                  )}
                  {isLast && caretOn && (
                    <span
                      style={{
                        background: accentColor,
                        display: "inline-block",
                        height: 14,
                        marginLeft: 1,
                        verticalAlign: "text-bottom",
                        width: 7,
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                Main component                              */
/* -------------------------------------------------------------------------- */

export interface LandingCodeShowcaseProps {
  accentColor?: string;
  speed?: number;
}

export const LandingCodeShowcase = ({
  accentColor = "#FFB38E",
  speed = 1,
}: LandingCodeShowcaseProps) => {
  const safeSpeed = Math.max(0.01, speed);

  return (
    <Timegroup
      duration={`${TOTAL_DURATION_MS / safeSpeed}ms`}
      mode="fixed"
      style={{
        background: PANEL_BG,
        fontFamily: FONT_FAMILY,
        height: 720,
        overflow: "hidden",
        position: "relative",
        width: 1280,
      }}
    >
      <style>{`
        @keyframes framecn-lcs-blur {
          from { opacity: 0; filter: blur(22px); }
          to { opacity: 1; filter: blur(0px); }
        }
        @keyframes framecn-lcs-glow {
          0%, 70% { box-shadow: inset 0 0 0px rgba(161,238,189,0); }
          100% { box-shadow: inset 0 0 60px rgba(161,238,189,0.45); }
        }
        @keyframes framecn-lcs-push-up {
          from { transform: translateY(0%); }
          to { transform: translateY(-110%); }
        }
        @keyframes framecn-lcs-push-left {
          from { transform: translateX(0%); }
          to { transform: translateX(-110%); }
        }
        @keyframes framecn-lcs-glass {
          from { opacity: 1; backdrop-filter: blur(0px); }
          to { opacity: 0; backdrop-filter: blur(28px); }
        }
      `}</style>

      {/* Backdrop wash */}
      <div
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(255,179,142,0.06), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(212,179,255,0.06), transparent 55%)",
          inset: 0,
          position: "absolute",
        }}
      />

      {/* LEFT: Code editor */}
      <div
        style={{
          alignItems: "center",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          left: 0,
          padding: 48,
          position: "absolute",
          top: 0,
          width: "38%",
        }}
      >
        <CodeEditor
          elapsedMs={(TOTAL_DURATION_MS / safeSpeed) * 0.5}
          accentColor={accentColor}
        />
      </div>

      {/* RIGHT: Live preview */}
      <div
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          bottom: 0,
          position: "absolute",
          right: 0,
          top: 0,
          width: "62%",
        }}
      >
        {/* Preview label */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 8,
            left: 24,
            position: "absolute",
            top: 22,
            zIndex: 5,
          }}
        >
          <div
            style={{
              background: MINT,
              borderRadius: 4,
              height: 8,
              width: 8,
            }}
          />
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: MONO_FAMILY,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Preview · HMR
          </div>
        </div>

        <div
          style={{
            animation: `framecn-lcs-glow ${TOTAL_DURATION_MS / safeSpeed}ms ease-out forwards`,
            inset: 0,
            overflow: "hidden",
            position: "absolute",
          }}
        >
          {/* BlurReveal scene */}
          <div
            style={{
              alignItems: "center",
              animation: `framecn-lcs-blur ${SCENES.blur.duration}ms ease-out forwards`,
              background: STAGE_BG,
              display: "flex",
              inset: 0,
              justifyContent: "center",
              position: "absolute",
            }}
          >
            <span
              style={{
                color: PEACH,
                fontFamily: FONT_FAMILY,
                fontSize: 96,
                fontWeight: 600,
                letterSpacing: "-0.04em",
              }}
            >
              Build faster.
            </span>
          </div>

          {/* SpatialPush up transition overlay */}
          <div
            style={{
              alignItems: "center",
              animation: `framecn-lcs-push-up ${SCENES.push1.duration}ms ease-in ${SCENES.push1.start}ms forwards`,
              background: STAGE_BG,
              display: "flex",
              inset: 0,
              justifyContent: "center",
              position: "absolute",
            }}
          >
            <span
              style={{
                color: MINT,
                fontFamily: FONT_FAMILY,
                fontSize: 96,
                fontWeight: 700,
              }}
            >
              Dashboard
            </span>
          </div>

          {/* Dashboard scene */}
          <div
            style={{
              animation: `framecn-lcs-glass ${SCENES.glassWipe.duration}ms ease-in ${SCENES.glassWipe.start}ms forwards`,
              background: STAGE_BG,
              inset: 0,
              position: "absolute",
            }}
          />

          {/* MaskedSlide scene */}
          <div
            style={{
              alignItems: "center",
              animation: `framecn-lcs-push-left ${SCENES.push2.duration}ms ease-in ${SCENES.push2.start}ms forwards`,
              background: STAGE_BG,
              display: "flex",
              inset: 0,
              justifyContent: "center",
              position: "absolute",
            }}
          >
            <span
              style={{
                color: MINT,
                fontFamily: FONT_FAMILY,
                fontSize: 92,
                fontWeight: 700,
              }}
            >
              Ship to production.
            </span>
          </div>

          {/* Terminal scene */}
          <div
            style={{
              alignItems: "center",
              background: STAGE_BG,
              display: "flex",
              inset: 0,
              justifyContent: "center",
              position: "absolute",
            }}
          >
            <span
              style={{
                color: PEACH,
                fontFamily: FONT_FAMILY,
                fontSize: 96,
                fontWeight: 700,
              }}
            >
              Deploy ✓
            </span>
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

// Re-export the schedule so config.ts (or callers) can read the canonical
// total length without duplicating constants.
export const LANDING_CODE_SHOWCASE_DURATION = Math.round(
  TOTAL_DURATION_MS / 30
);
