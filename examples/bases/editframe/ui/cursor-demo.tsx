"use client";

import { atCenter, parkTopLeft } from "@/lib/ui-demo-cursor";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";

const BTN = atCenter();

export interface CursorDemoProps {
  variant?: "arrow" | "pointer";
  size?: number;
  rippleColor?: string;
}

export const cursorDemoControls = ["variant", "size", "rippleColor"] as const;

export const CursorDemoScene = (p: CursorDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 40, duration: 28, ...BTN },
    { at: 72, click: true, duration: 0, ...BTN },
  ]);

  const buttonStyle = useButtonTransition([
    { at: 40, duration: 16, state: "hover" },
    { at: 68, duration: 8, state: "press" },
    { at: 76, duration: 6, state: "loading" },
    { at: 108, duration: 16, state: "success" },
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
        <Button label="Continue" style={buttonStyle} />
      </div>
      <Cursor
        style={cursorStyle}
        variant={p.variant ?? "arrow"}
        size={p.size ?? 28}
        rippleColor={p.rippleColor}
      />
    </div>
  );
};

export const cursorDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const variant = values.variant as string | undefined;
  const size = values.size as number | undefined;
  const rippleColor = values.rippleColor as string | undefined;

  const cursorProps: string[] = [];
  if (variant !== undefined && variant !== "arrow") {
    cursorProps.push(`variant="${variant}"`);
  }
  if (size !== undefined && size !== 28) {
    cursorProps.push(`size={${size}}`);
  }
  if (rippleColor !== undefined && rippleColor !== "#171717") {
    cursorProps.push(`rippleColor="${rippleColor}"`);
  }
  const cursorPropsStr = cursorProps.length ? ` ${cursorProps.join(" ")}` : "";

  return `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { Button } from "@/components/framecn/button";
import { useButtonTransition } from "@/components/framecn/use-button-transition";

const BTN_X = W / 2;
const BTN_Y = H / 2;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0, x: 80, y: 60 },
    { at: 40, x: BTN_X, y: BTN_Y, duration: 28 },
    { at: 72, x: BTN_X, y: BTN_Y, click: true, duration: 0 },
  ]);

  const buttonStyle = useButtonTransition([
    { at: 40, state: "hover", duration: 16 },
    { at: 68, state: "press", duration: 8 },
    { at: 76, state: "loading", duration: 6 },
    { at: 108, state: "success", duration: 16 },
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
        <Button label="Continue" style={buttonStyle} />
      </div>
      <Cursor style={cursorStyle}${cursorPropsStr} />
    </div>
  );
};`;
};
