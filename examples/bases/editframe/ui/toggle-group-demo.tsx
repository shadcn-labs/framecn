"use client";

import { parkTopLeft, toggleSegmentCenter } from "@/lib/ui-demo-cursor";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { ToggleGroup } from "@/registry/bases/editframe/ui/toggle-group";
import { useToggleGroupTransition } from "@/registry/bases/editframe/ui/toggle-group/use-toggle-group-transition";

const MONTHLY = toggleSegmentCenter(0);
const YEARLY = toggleSegmentCenter(1);

export type ToggleGroupDemoProps = Record<string, never>;

export const toggleGroupDemoControls = [] as const;

export const ToggleGroupDemoScene = (_p: ToggleGroupDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 32, duration: 28, ...YEARLY },
    { at: 44, click: true, duration: 0, ...YEARLY },
    { at: 80, duration: 20, ...MONTHLY },
    { at: 90, click: true, duration: 0, ...MONTHLY },
  ]);

  const toggleStyle = useToggleGroupTransition([
    { at: 46, duration: 14, state: "Yearly" },
    { at: 92, duration: 14, state: "Monthly" },
  ]);

  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      <ToggleGroup style={toggleStyle} />
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const toggleGroupDemoCode = (
  _values: Record<string, unknown> = {}
): string => `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { ToggleGroup } from "@/components/framecn/toggle-group";
import { useToggleGroupTransition } from "@/components/framecn/use-toggle-group-transition";

const SEG_W = 88;
const PAD = 4;
const TRACK_W = PAD * 2 + SEG_W * 2;
const TRACK_LEFT = W / 2 - TRACK_W / 2;
const MONTHLY_X = TRACK_LEFT + PAD + SEG_W / 2;
const YEARLY_X  = TRACK_LEFT + PAD + SEG_W + SEG_W / 2;
const TOGGLE_Y  = H / 2;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0,  x: 80,        y: 60       },
    { at: 32, x: YEARLY_X,  y: TOGGLE_Y, duration: 28 },
    { at: 44, x: YEARLY_X,  y: TOGGLE_Y, click: true, duration: 0 },
    { at: 80, x: MONTHLY_X, y: TOGGLE_Y, duration: 20 },
    { at: 90, x: MONTHLY_X, y: TOGGLE_Y, click: true, duration: 0 },
  ]);

  const toggleStyle = useToggleGroupTransition([
    { at: 46, state: "Yearly",  duration: 14 },
    { at: 92, state: "Monthly", duration: 14 },
  ]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ToggleGroup style={toggleStyle} />
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
