"use client";

import { parkTopLeft, resizableHandleAt } from "@/lib/ui-demo-cursor";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Resizable } from "@/registry/bases/editframe/ui/resizable";
import type { ResizableDirection } from "@/registry/bases/editframe/ui/resizable";
import { useResizableTransition } from "@/registry/bases/editframe/ui/resizable/use-resizable-transition";

const PANEL_WIDTH = 440;
const HANDLE_CENTER = resizableHandleAt(0.5, PANEL_WIDTH);
const HANDLE_RIGHT = resizableHandleAt(0.75, PANEL_WIDTH);
const HANDLE_LEFT = resizableHandleAt(0.25, PANEL_WIDTH);

export interface ResizableDemoProps {
  direction?: ResizableDirection;
}

export const resizableDemoControls = ["direction"] as const;

export const ResizableDemoScene = (p: ResizableDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 32, duration: 28, ...HANDLE_CENTER },
    { at: 44, duration: 0, press: true, ...HANDLE_CENTER },
    { at: 84, duration: 40, press: true, ...HANDLE_RIGHT },
    { at: 132, duration: 48, press: true, ...HANDLE_LEFT },
    { at: 176, duration: 44, press: true, ...HANDLE_CENTER },
    { at: 184, duration: 0, ...HANDLE_CENTER },
  ]);

  const resizableStyle = useResizableTransition([
    { at: 0, handleState: "idle", ratio: 0.5 },
    { at: 32, duration: 8, handleState: "hover" },
    { at: 46, duration: 4, handleState: "press" },
    { at: 44, ratio: 0.5 },
    { at: 84, duration: 40, easing: "inOut", ratio: 0.75 },
    { at: 132, duration: 48, easing: "inOut", ratio: 0.25 },
    { at: 176, duration: 44, easing: "inOut", ratio: 0.5 },
    { at: 184, duration: 8, handleState: "idle" },
  ]);

  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      <Resizable
        style={resizableStyle}
        direction={p.direction ?? "horizontal"}
        width={PANEL_WIDTH}
      />
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const resizableDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const direction = values.direction as string | undefined;

  const props: string[] = [];
  if (direction !== undefined && direction !== "horizontal") {
    props.push(`direction="${direction}"`);
  }
  const resizableExtraProps = props.length
    ? `\n      ${props.join("\n      ")}\n      `
    : "";

  return `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { Resizable } from "@/components/framecn/resizable";
import { useResizableTransition } from "@/components/framecn/use-resizable-transition";

const PANEL_WIDTH = 440;
const handleX = (ratio: number) => W / 2 - PANEL_WIDTH / 2 + PANEL_WIDTH * ratio;
const HANDLE_Y = H / 2;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0,   x: 80,                    y: 60       },
    { at: 32,  x: handleX(0.5), y: HANDLE_Y, duration: 28 },
    { at: 44,  x: handleX(0.5), y: HANDLE_Y, press: true, duration: 0 },
    { at: 84,  x: handleX(0.75), y: HANDLE_Y, press: true, duration: 40 },
    { at: 132, x: handleX(0.25), y: HANDLE_Y, press: true, duration: 48 },
    { at: 176, x: handleX(0.5), y: HANDLE_Y, press: true, duration: 44 },
    { at: 184, x: handleX(0.5), y: HANDLE_Y, duration: 0 },
  ]);

  const resizableStyle = useResizableTransition([
    { at: 0,   ratio: 0.5, handleState: "idle"  },
    { at: 32,  handleState: "hover", duration: 8  },
    { at: 46,  handleState: "press", duration: 4  },
    { at: 44,  ratio: 0.5 },
    { at: 84,  ratio: 0.75, duration: 40, easing: "inOut" },
    { at: 132, ratio: 0.25, duration: 48, easing: "inOut" },
    { at: 176, ratio: 0.5,  duration: 44, easing: "inOut" },
    { at: 184, handleState: "idle", duration: 8 },
  ]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Resizable${resizableExtraProps}style={resizableStyle} width={PANEL_WIDTH} />
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
};
