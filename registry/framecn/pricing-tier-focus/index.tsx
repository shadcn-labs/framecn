"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

interface Tier {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
}

const TIERS: Tier[] = [
  {
    cta: "Get started",
    features: ["1 project", "Community support", "1 GB storage"],
    name: "Free",
    period: "/mo",
    price: "$0",
  },
  {
    cta: "Buy Pro",
    features: [
      "Unlimited projects",
      "Priority support",
      "100 GB storage",
      "Advanced analytics",
    ],
    name: "Pro",
    period: "/mo",
    price: "$24",
  },
  {
    cta: "Contact sales",
    features: ["SSO & SAML", "Dedicated manager", "Unlimited storage"],
    name: "Enterprise",
    period: "/mo",
    price: "$99",
  },
];

export interface PricingTierFocusProps {
  focusedTier?: number;
  accentColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const PricingTierFocus = ({
  focusedTier = 1,
  accentColor = "#22c55e",
  speed = 1,
  fps = 30,
  durationInFrames = 180,
  width = 1280,
  height = 720,
  className,
}: PricingTierFocusProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;

  const focusStartMs = 30 * frameMs;
  const focusMs = ((50 / fps) * 1000) / safeSpeed;

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background: "#0a0a0a",
    display: "flex",
    fontFamily: FONT_FAMILY,
    gap: 28,
    height,
    justifyContent: "center",
    overflow: "hidden",
    padding: 60,
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
          @keyframes framecn-pricing-focus {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }
          @keyframes framecn-pricing-lift {
            from { transform: translateY(20px); }
            to { transform: translateY(0); }
          }
          @keyframes framecn-pricing-side {
            from { opacity: 1; filter: brightness(1) blur(0px); }
            to { opacity: 0.4; filter: brightness(0.4) blur(4px); }
          }
          @keyframes framecn-pricing-shimmer {
            0% { transform: translateX(-150px) skewX(-20deg); }
            100% { transform: translateX(250px) skewX(-20deg); }
          }
        `}</style>

        {TIERS.map((tier, i) => {
          const isFocused = i === focusedTier;
          const scale = isFocused
            ? "framecn-pricing-focus"
            : "framecn-pricing-side";
          const lift = isFocused ? "framecn-pricing-lift" : "none";
          const z = isFocused ? 10 : 1;
          const shadow = isFocused
            ? `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}55`
            : "0 8px 24px rgba(0,0,0,0.4)";

          return (
            <div
              key={tier.name}
              style={{
                animation: `${scale} ${focusMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${focusStartMs}ms backwards, ${lift} ${focusMs * 0.5}ms cubic-bezier(0.16, 1, 0.3, 1) ${focusStartMs}ms backwards`,
                background: "linear-gradient(180deg, #161616 0%, #0e0e0e 100%)",
                border: `1px solid rgba(255,255,255,${isFocused ? 0.08 : 0.04})`,
                borderRadius: 20,
                boxShadow: shadow,
                display: "flex",
                flex: isFocused ? "1 1 0" : "1 0.95 0",
                flexDirection: "column",
                gap: 24,
                maxWidth: 320,
                minHeight: 460,
                padding: 32,
                position: "relative",
                transformOrigin: "center center",
                zIndex: z,
              }}
            >
              {isFocused && (
                <div
                  style={{
                    background: accentColor,
                    borderRadius: 999,
                    color: "#0a0a0a",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "4px 10px",
                    position: "absolute",
                    right: 16,
                    textTransform: "uppercase",
                    top: 16,
                  }}
                >
                  Popular
                </div>
              )}

              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {tier.name}
              </div>

              <div
                style={{
                  alignItems: "baseline",
                  display: "flex",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontSize: 56,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {tier.price}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 16,
                  }}
                >
                  {tier.period}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {tier.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      alignItems: "center",
                      color: "rgba(255,255,255,0.85)",
                      display: "flex",
                      fontSize: 14,
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        background: `${accentColor}22`,
                        borderRadius: 999,
                        color: accentColor,
                        display: "flex",
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 700,
                        height: 16,
                        justifyContent: "center",
                        width: 16,
                      }}
                    >
                      ✓
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <div
                style={{
                  alignItems: "center",
                  background: isFocused
                    ? accentColor
                    : "rgba(255,255,255,0.08)",
                  border: isFocused
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: isFocused ? "#0a0a0a" : "white",
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 600,
                  height: 44,
                  justifyContent: "center",
                  marginTop: 24,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {tier.cta}
                {isFocused && (
                  <div
                    style={{
                      animation: `framecn-pricing-shimmer ${focusMs * 2}ms ease-in-out ${focusStartMs + focusMs}ms backwards`,
                      background: `linear-gradient(90deg, transparent 0%, ${accentColor}55 50%, transparent 100%)`,
                      bottom: 0,
                      left: 0,
                      position: "absolute",
                      top: 0,
                      transform: "skewX(-20deg)",
                      width: 80,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </>
    </Timegroup>
  );
};
