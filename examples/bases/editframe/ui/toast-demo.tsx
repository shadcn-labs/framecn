"use client";

import { atCenter, parkTopLeft } from "@/lib/ui-demo-cursor";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Toast } from "@/registry/bases/editframe/ui/toast";
import { useToastTransition } from "@/registry/bases/editframe/ui/toast/use-toast-transition";

const BTN = atCenter();

export const toastDemoControls = ["title", "description", "variant"] as const;

export interface ToastDemoProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error";
}

export const ToastDemoScene = (p: ToastDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 40, duration: 28, ...BTN },
    { at: 68, click: true, duration: 0, ...BTN },
  ]);

  const buttonStyle = useButtonTransition([
    { at: 40, duration: 16, state: "hover" },
    { at: 62, duration: 8, state: "press" },
    { at: 76, duration: 10, state: "idle" },
  ]);

  const toastStyle = useToastTransition([
    { at: 84, duration: 12, state: "visible" },
    { at: 144, duration: 12, state: "hidden" },
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
        <Button label="Show toast" style={buttonStyle} />
      </div>

      <div
        style={{
          bottom: 24,
          position: "absolute",
          right: 24,
        }}
      >
        <Toast
          title={p.title ?? "Changes saved"}
          description={p.description ?? "Your profile has been updated."}
          variant={p.variant ?? "success"}
          style={toastStyle}
        />
      </div>

      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const toastDemoCode = (values: Record<string, unknown> = {}): string => {
  const title = values.title as string | undefined;
  const description = values.description as string | undefined;
  const variant = values.variant as string | undefined;

  const toastProps: string[] = [];
  if (title !== undefined && title !== "Changes saved") {
    toastProps.push(`title="${title}"`);
  }
  if (
    description !== undefined &&
    description !== "Your profile has been updated."
  ) {
    toastProps.push(`description="${description}"`);
  }
  if (variant !== undefined && variant !== "success") {
    toastProps.push(`variant="${variant}"`);
  }

  const toastPropsStr = toastProps.length
    ? `\n          ${toastProps.join("\n          ")}\n        `
    : "";

  return `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { Button } from "@/components/framecn/button";
import { useButtonTransition } from "@/components/framecn/use-button-transition";
import { Toast } from "@/components/framecn/toast";
import { useToastTransition } from "@/components/framecn/use-toast-transition";

const BTN_X = W / 2;
const BTN_Y = H / 2;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0,  x: 80,  y: 60 },
    { at: 40, x: BTN_X, y: BTN_Y, duration: 28 },
    { at: 68, x: BTN_X, y: BTN_Y, click: true, duration: 0 },
  ]);

  const buttonStyle = useButtonTransition([
    { at: 40, state: "hover",   duration: 16 },
    { at: 62, state: "press",   duration: 8  },
    { at: 76, state: "idle",    duration: 10 },
  ]);

  const toastStyle = useToastTransition([
    { at: 84,  state: "visible", duration: 12 },
    { at: 144, state: "hidden",  duration: 12 },
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
        <Button label="Show toast" style={buttonStyle} />
      </div>
      <div style={{ position: "absolute", right: 24, bottom: 24 }}>
        <Toast${toastPropsStr === "" ? '\n          title="Changes saved"\n          description="Your profile has been updated."\n          variant="success"\n        ' : toastPropsStr}style={toastStyle} />
      </div>
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
};
