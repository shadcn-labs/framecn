"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import { atCenter, useUiDemoCursorStart } from "@/lib/ui-demo-cursor";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Popover } from "@/registry/bases/editframe/ui/popover";
import { usePopoverTransition } from "@/registry/bases/editframe/ui/popover/use-popover-transition";

const CHIP = atCenter();
const AWAY = atCenter(-440, -260);

export const popoverDemoControls = [] as const;

export type PopoverDemoProps = Record<string, never>;

export const PopoverDemoScene = (_p: PopoverDemoProps = {}) => {
  const theme = useFramecnTheme();
  const cursorStyle = useCursorPath([
    { at: 0, ...useUiDemoCursorStart() },
    { at: 28, duration: 24, ...CHIP },
    { at: 110, duration: 20, ...AWAY },
  ]);

  // Hover-card popover: opens shortly after the cursor arrives, closes as it leaves.
  const popoverStyle = usePopoverTransition([
    { at: 36, duration: 10, state: "opened" },
    { at: 100, duration: 10, state: "closed" },
  ]);

  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      {/* Anchor — the @username chip centered in the canvas. */}
      <div
        style={{
          display: "inline-block",
          left: "50%",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Chip */}
        <div
          style={{
            alignItems: "center",
            background: theme.secondary,
            border: `1px solid ${theme.border}`,
            borderRadius: 999,
            color: theme.secondaryForeground,
            cursor: "default",
            display: "inline-flex",
            fontFamily:
              "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            gap: 6,
            padding: "4px 10px",
          }}
        >
          @alexsmith
        </div>

        {/* Popover anchored above the chip, centered horizontally. */}
        <div
          style={{
            bottom: "calc(100% + 4px)",
            left: "50%",
            position: "absolute",
            transform: "translateX(-50%)",
          }}
        >
          <Popover style={popoverStyle} side="top" width={240}>
            {/* Hover-card content: avatar + name + bio */}
            <div style={{ alignItems: "flex-start", display: "flex", gap: 12 }}>
              {/* Avatar placeholder */}
              <div
                style={{
                  background: theme.muted,
                  borderRadius: 20,
                  flexShrink: 0,
                  height: 40,
                  width: 40,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily:
                      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Alex Smith
                </span>
                <span
                  style={{
                    color: theme.mutedForeground,
                    fontFamily:
                      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: 12,
                  }}
                >
                  @alexsmith
                </span>
                <span
                  style={{
                    color: theme.popoverForeground,
                    fontFamily:
                      "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: 13,
                    lineHeight: 1.4,
                    marginTop: 4,
                  }}
                >
                  Product designer. Building in public.
                </span>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const popoverDemoCode = (
  _values: Record<string, unknown> = {}
): string => `import { H, W } from "@/lib/customizer-config";
import { useFramecnTheme } from "@/lib/framecn-ui";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { Popover } from "@/components/framecn/popover";
import { usePopoverTransition } from "@/components/framecn/use-popover-transition";

const CHIP_X = W / 2;
const CHIP_Y = H / 2;
const AWAY_X = W / 2 - 440;
const AWAY_Y = H / 2 - 260;

export const Scene = () => {
  const theme = useFramecnTheme();
  const cursorStyle = useCursorPath([
    { at: 0,   x: 80,     y: 60     },
    { at: 28,  x: CHIP_X, y: CHIP_Y, duration: 24 },
    { at: 110, x: AWAY_X, y: AWAY_Y, duration: 20 },
  ]);

  // Hover-card opens shortly after the cursor arrives, closes as it leaves.
  const popoverStyle = usePopoverTransition([
    { at: 36,  state: "opened", duration: 10 },
    { at: 100, state: "closed", duration: 10 },
  ]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Anchor — the @username chip. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "inline-block",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: 999,
            background: theme.secondary,
            border: \`1px solid \${theme.border}\`,
            color: theme.secondaryForeground,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          @alexsmith
        </div>

        {/* Popover anchored above the chip, centered horizontally. */}
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Popover style={popoverStyle} side="top" width={240}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: theme.muted,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Alex Smith</span>
                <span style={{ fontSize: 12, color: theme.mutedForeground }}>@alexsmith</span>
                <span style={{ fontSize: 13, lineHeight: 1.4, color: theme.popoverForeground, marginTop: 4 }}>
                  Product designer. Building in public.
                </span>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
