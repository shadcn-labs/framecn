"use client";

import { atCenter, parkTopLeft } from "@/lib/ui-demo-cursor";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Tooltip } from "@/registry/bases/editframe/ui/tooltip";
import { useTooltipTransition } from "@/registry/bases/editframe/ui/tooltip/use-tooltip-transition";

const BTN = atCenter();
const AWAY = atCenter(-440, -260);

export const tooltipDemoControls = ["label"] as const;

export interface TooltipDemoProps {
  label?: string;
}

export const TooltipDemoScene = (p: TooltipDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 28, duration: 24, ...BTN },
    { at: 110, duration: 20, ...AWAY },
  ]);

  const buttonStyle = useButtonTransition([
    { at: 28, duration: 8, state: "hover" },
    { at: 100, duration: 8, state: "idle" },
  ]);

  const tooltipStyle = useTooltipTransition([
    { at: 36, duration: 8, state: "visible" },
    { at: 100, duration: 8, state: "hidden" },
  ]);

  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      <div
        style={{
          left: "50%",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button label="Hover me" style={buttonStyle} />

        <div
          style={{
            bottom: "calc(100% + 32px)",
            left: "50%",
            position: "absolute",
            transform: "translateX(-50%)",
          }}
        >
          <Tooltip
            label={p.label ?? "Add to library"}
            side="top"
            style={tooltipStyle}
          />
        </div>
      </div>

      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const tooltipDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const label = values.label as string | undefined;
  const labelStr = label ?? "Add to library";

  return `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { Button } from "@/components/framecn/button";
import { useButtonTransition } from "@/components/framecn/use-button-transition";
import { Tooltip } from "@/components/framecn/tooltip";
import { useTooltipTransition } from "@/components/framecn/use-tooltip-transition";

const BTN_X = W / 2;
const BTN_Y = H / 2;
const AWAY_X = W / 2 - 440;
const AWAY_Y = H / 2 - 260;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0,   x: 80,    y: 60    },
    { at: 28,  x: BTN_X, y: BTN_Y, duration: 24 },
    { at: 110, x: AWAY_X, y: AWAY_Y, duration: 20 },
  ]);

  const buttonStyle = useButtonTransition([
    { at: 28,  state: "hover", duration: 8 },
    { at: 100, state: "idle",  duration: 8 },
  ]);

  const tooltipStyle = useTooltipTransition([
    { at: 36,  state: "visible", duration: 8 },
    { at: 100, state: "hidden",  duration: 8 },
  ]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button label="Hover me" style={buttonStyle} />
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 32px)",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Tooltip label="${labelStr}" side="top" style={tooltipStyle} />
        </div>
      </div>
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
};
