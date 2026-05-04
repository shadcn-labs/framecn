"use client";

import { Timegroup } from "@editframe/react";
import type { CSSProperties } from "react";

const FONT_MONO =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

const DEFAULT_LINES = [
  "export function processOrders(orders) {",
  "  const valid = [];",
  "  for (const order of orders) {",
  "    if (!order.id) continue;",
  "    if (!order.customer) continue;",
  "    if (!order.items?.length) continue;",
  "    if (order.total <= 0) continue;",
  "    if (order.status === 'cancelled') continue;",
  "    if (order.status === 'refunded') continue;",
  "    const enriched = enrich(order);",
  "    const validated = validate(enriched);",
  "    if (!validated.ok) continue;",
  "    const priced = price(validated.value);",
  "    const taxed = applyTax(priced);",
  "    const shipped = applyShipping(taxed);",
  "    valid.push(shipped);",
  "  }",
  "  return valid;",
  "}",
];

export interface CodeAccordionProps {
  lines?: string[];
  collapseRange?: [number, number];
  collapseAt?: number;
  title?: string;
  fontSize?: number;
  width?: number;
  background?: string;
  cardColor?: string;
  textColor?: string;
  mutedColor?: string;
  speed?: number;
  fps?: number;
  durationInFrames?: number;
  height?: number;
  className?: string;
}

const Light = ({ color }: { color: string }) => (
  <div
    style={{
      background: color,
      borderRadius: "50%",
      height: 11,
      opacity: 0.6,
      width: 11,
    }}
  />
);

const Line = ({
  line,
  index,
  lineHeight,
  textColor,
  mutedColor,
}: {
  line: string;
  index: number;
  lineHeight: number;
  textColor: string;
  mutedColor: string;
}) => (
  <div
    style={{
      alignItems: "center",
      color: textColor,
      display: "flex",
      height: lineHeight,
      whiteSpace: "pre",
    }}
  >
    <span
      style={{
        color: mutedColor,
        paddingRight: 16,
        textAlign: "right",
        userSelect: "none",
        width: 56,
      }}
    >
      {index + 1}
    </span>
    <span>{line}</span>
  </div>
);

export const CodeAccordion = ({
  lines = DEFAULT_LINES,
  collapseRange = [3, 14],
  collapseAt = 30,
  title = "process-orders.ts",
  fontSize = 16,
  width = 720,
  background = "#050505",
  cardColor = "#0a0a0a",
  textColor = "#e4e4e7",
  mutedColor = "#52525b",
  speed = 1,
  fps = 30,
  durationInFrames = 150,
  height = 720,
  className,
}: CodeAccordionProps) => {
  const safeSpeed = Math.max(0.01, speed);
  const durationMs = (durationInFrames / fps) * 1000;
  const frameMs = 1000 / fps;
  const collapseStartMs = collapseAt * frameMs;
  const collapseDurationMs = (durationInFrames * 0.6 * frameMs) / safeSpeed;

  const lineHeight = Math.round(fontSize * 1.55);
  const [start, end] = collapseRange;
  const collapsedCount = Math.max(0, end - start + 1);

  const before = lines.slice(0, start);
  const collapsed = lines.slice(start, end + 1);
  const after = lines.slice(end + 1);

  const containerStyle: CSSProperties = {
    alignItems: "center",
    background,
    display: "flex",
    fontFamily: FONT_MONO,
    height,
    justifyContent: "center",
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
          @keyframes framecn-accordion-collapse {
            from { height: ${collapsedCount * lineHeight}px; }
            to { height: ${lineHeight}px; }
          }
          @keyframes framecn-accordion-fade-out {
            to { opacity: 0; }
          }
          @keyframes framecn-accordion-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div
          style={{
            background: cardColor,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
            width,
          }}
        >
          {/* Chrome */}
          <div
            style={{
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              gap: 8,
              height: 38,
              padding: "0 14px",
            }}
          >
            <Light color="#ff5f57" />
            <Light color="#febc2e" />
            <Light color="#28c840" />
            <div
              style={{
                color: mutedColor,
                flex: 1,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {title}
            </div>
          </div>

          {/* Code body */}
          <div style={{ fontSize, lineHeight: 1.55, padding: "16px 0" }}>
            {before.map((line, i) => (
              <Line
                key={`b-${i}`}
                line={line}
                index={i}
                lineHeight={lineHeight}
                textColor={textColor}
                mutedColor={mutedColor}
              />
            ))}

            {/* Collapsing region */}
            <div
              style={{
                animation: `framecn-accordion-collapse ${collapseDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${collapseStartMs}ms backwards`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  animation: `framecn-accordion-fade-out ${collapseDurationMs * 0.6}ms ease-out ${collapseStartMs}ms backwards`,
                }}
              >
                {collapsed.map((line, i) => (
                  <Line
                    key={`c-${i}`}
                    line={line}
                    index={start + i}
                    lineHeight={lineHeight}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                ))}
              </div>

              {/* Placeholder bar */}
              <div
                style={{
                  alignItems: "center",
                  animation: `framecn-accordion-fade-in ${collapseDurationMs * 0.4}ms ease-in ${collapseStartMs + collapseDurationMs * 0.6}ms backwards`,
                  bottom: 0,
                  color: mutedColor,
                  display: "flex",
                  fontStyle: "italic",
                  height: lineHeight,
                  left: 0,
                  paddingLeft: 56,
                  position: "absolute",
                  right: 0,
                }}
              >
                ⋯ {collapsedCount} lines collapsed
              </div>
            </div>

            {after.map((line, i) => (
              <Line
                key={`a-${i}`}
                line={line}
                index={end + 1 + i}
                lineHeight={lineHeight}
                textColor={textColor}
                mutedColor={mutedColor}
              />
            ))}
          </div>
        </div>
      </>
    </Timegroup>
  );
};
