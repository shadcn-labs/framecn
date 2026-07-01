"use client";

import { Timegroup } from "@editframe/react";

export interface ProductLaunchTrailerProps {
  logoLabel?: string;
  productName?: string;
  versionLabel?: string;
  accentPeach?: string;
  accentLavender?: string;
  accentMint?: string;
  background?: string;
  speed?: number;
  className?: string;
}

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

// Sequence anchors (ms)
const T = {
  flyEnd: 6666,
  flyStart: 3666,
  outroEnd: 8000,
  outroStart: 6333,
  pulseEnd: 1666,
  pulseStart: 0,
  shellStart: 2333,
  zoomEnd: 2600,
  zoomStart: 1266,
};

export const ProductLaunchTrailer = ({
  logoLabel = "R",
  productName = "Framecn",
  versionLabel = "v1.0 is live",
  accentPeach = "#FFB38E",
  accentLavender = "#D4B3FF",
  accentMint = "#A1EEBD",
  background = "#141318",
  speed = 1,
  className,
}: ProductLaunchTrailerProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const totalDuration = T.outroEnd + 1;

  return (
    <Timegroup
      className={className}
      duration={`${totalDuration / safeSpeed}ms`}
      mode="fixed"
      style={{
        background,
        fontFamily: FONT_FAMILY,
        height: 720,
        overflow: "hidden",
        position: "relative",
        width: 1280,
      }}
    >
      <style>{`
        @keyframes framecn-plt-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px ${accentLavender}59; }
          50% { transform: scale(1.04); box-shadow: 0 0 140px ${accentLavender}8c; }
        }
        @keyframes framecn-plt-zoom {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(14); opacity: 0; }
        }
        @keyframes framecn-plt-fly {
          from { opacity: 0; transform: rotateX(0deg) rotateY(0deg) translateZ(-220px) scale(0.92); }
          50% { opacity: 1; }
          to { transform: rotateX(-8deg) rotateY(6deg) translateZ(80px) scale(1.04); }
        }
        @keyframes framecn-plt-outro {
          from { opacity: 1; transform: rotateX(-8deg) rotateY(6deg) translateZ(80px) scale(1.04); }
          to { opacity: 0; transform: rotateX(-8deg) rotateY(6deg) translateZ(-360px) scale(0.84); }
        }
        @keyframes framecn-plt-drop {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes framecn-plt-confetti {
          0% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Phase 1: Pulse Logo + Zoom */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <div
          style={{
            alignItems: "center",
            animation: `framecn-plt-zoom ${T.zoomEnd - T.zoomStart}ms ease-in ${T.zoomStart}ms forwards`,
            animationTimingFunction: "cubic-bezier(0.7, 0, 0.84, 0)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Logo squircle */}
          <div
            style={{
              alignItems: "center",
              animation: `framecn-plt-pulse 3.33s ease-in-out infinite`,
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)",
              border: `1px solid ${accentLavender}55`,
              borderRadius: 56,
              boxShadow: `0 0 60px ${accentLavender}59`,
              color: "white",
              display: "flex",
              fontSize: 112,
              fontWeight: 700,
              height: 200,
              justifyContent: "center",
              letterSpacing: "-0.06em",
              width: 200,
            }}
          >
            {logoLabel}
          </div>

          {/* Product name */}
          <div
            style={{
              animation: `framecn-plt-drop 466ms ease-out ${T.pulseStart + 133}ms forwards`,
              color: "rgba(255,255,255,0.92)",
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "0.02em",
              opacity: 0,
            }}
          >
            {productName}
          </div>
        </div>
      </div>

      {/* Phase 2: App Shell Flyover */}
      <div
        style={{
          animation: `
            framecn-plt-fly ${T.flyEnd - T.flyStart}ms cubic-bezier(0.16, 1, 0.3, 1) ${T.flyStart}ms forwards,
            framecn-plt-outro ${T.outroEnd - T.outroStart}ms cubic-bezier(0.16, 1, 0.3, 1) ${T.outroStart}ms forwards
          `,
          inset: 0,
          opacity: 0,
          perspective: 2000,
          perspectiveOrigin: "50% 45%",
          position: "absolute",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
            border: `1px solid ${accentLavender}1f`,
            borderRadius: 24,
            inset: 40,
            position: "absolute",
          }}
        />

        {/* Faux code block on the left */}
        <div
          style={{
            filter: "drop-shadow(0 22px 28px rgba(212,179,255,0.22))",
            height: 500,
            left: 80,
            position: "absolute",
            top: 110,
            transform: "translateZ(20px)",
            width: 520,
          }}
        >
          <div
            style={{
              backdropFilter: "blur(18px)",
              background: "rgba(20,19,24,0.78)",
              border: `1px solid ${accentLavender}33`,
              borderRadius: 20,
              fontFamily: MONO_FAMILY,
              inset: 0,
              overflow: "hidden",
              position: "absolute",
            }}
          >
            <div
              style={{
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 8,
                height: 38,
                padding: "0 16px",
              }}
            >
              {["#FFB38E", "#FCD34D", accentMint].map((c) => (
                <div
                  key={c}
                  style={{
                    background: c,
                    borderRadius: "50%",
                    height: 10,
                    opacity: 0.85,
                    width: 10,
                  }}
                />
              ))}
              <span
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 12,
                  marginLeft: 12,
                }}
              >
                scene.tsx
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "20px 22px",
              }}
            >
              {[
                { c: "#c4b5fd", t: "import { Trailer } from 'framecn'" },
                { c: "", t: "" },
                { c: "#e4e4e7", t: "export const Scene = () => (" },
                { c: "#e4e4e7", t: "  <Trailer" },
                { c: "#86efac", t: `    label="v1.0"` },
                { c: "#fcd34d", t: `    accent="lavender"` },
                { c: "#e4e4e7", t: "  />" },
                { c: "#e4e4e7", t: ")" },
              ].map((line, i) => (
                <div
                  key={i}
                  style={{
                    animation: `framecn-plt-drop 333ms ease-out ${T.flyStart + i * 166}ms forwards`,
                    display: "flex",
                    fontSize: 15,
                    gap: 14,
                    lineHeight: "22px",
                    opacity: 0,
                    transform: "translateX(12px)",
                  }}
                >
                  <span
                    style={{ color: "#3f3f46", textAlign: "right", width: 18 }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{ color: line.c || "#e4e4e7", whiteSpace: "pre" }}
                  >
                    {line.t || " "}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faux bento grid on the right */}
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "1fr 1fr",
            height: 500,
            position: "absolute",
            right: 80,
            top: 110,
            transform: "translateZ(40px)",
            width: 540,
          }}
        >
          {[
            {
              body: "Spring-tuned",
              span: 2,
              tint: accentLavender,
              title: "Animations",
            },
            {
              body: "Cinematic",
              span: 1,
              tint: accentPeach,
              title: "Transitions",
            },
            {
              body: "Volumetric",
              span: 1,
              tint: accentMint,
              title: "Backgrounds",
            },
            {
              body: "Production-ready",
              span: 2,
              tint: accentLavender,
              title: "Compositions",
            },
          ].map((c, i) => (
            <div
              key={c.title}
              style={{
                animation: `framecn-plt-drop 466ms ease-out ${T.flyStart + 1000 + i * 266}ms forwards`,
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: `1px solid ${c.tint}33`,
                borderRadius: 18,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                gridColumn: c.span === 2 ? "span 2" : "span 1",
                justifyContent: "flex-end",
                minHeight: 110,
                opacity: 0,
                padding: 22,
                transform: "translateY(18px) scale(0.92)",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {c.title}
              </div>
              <div style={{ color: `${c.tint}cc`, fontSize: 13, marginTop: 2 }}>
                {c.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 3: Outro */}
      <div
        style={{
          animation: `framecn-plt-drop 466ms ease-out ${T.outroStart + 200}ms forwards`,
          left: 0,
          opacity: 0,
          position: "absolute",
          right: 0,
          textAlign: "center",
          top: 240,
          transform: "translateY(-40px)",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            textShadow: `0 0 60px ${accentMint}55`,
          }}
        >
          {versionLabel}
        </div>
      </div>

      {/* Confetti layer */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{ inset: 0, pointerEvents: "none", position: "absolute" }}
      >
        {Array.from({ length: 70 }, (_, i) => {
          const angle = (i / 70) * Math.PI * 2;
          const cx = 640 + Math.cos(angle) * (30 + i * 3);
          const cy = 280 + Math.sin(angle) * (20 + i * 2);
          const sz = 5 + (i % 7);
          const colors = [accentMint, accentPeach, accentLavender, "#FCD34D"];
          const color = colors[i % colors.length];
          return (
            <rect
              key={i}
              x={cx - sz / 2}
              y={cy - sz / 2}
              width={sz}
              height={sz * 0.55}
              rx={1}
              fill={color}
              opacity={0}
              style={{
                animation: `framecn-plt-confetti ${2000 + i * 20}ms ease-out ${T.outroStart + 466 + i * 10}ms forwards`,
              }}
            />
          );
        })}
      </svg>
    </Timegroup>
  );
};
