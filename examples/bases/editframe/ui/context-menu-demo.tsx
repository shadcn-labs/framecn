"use client";

import { useCurrentState } from "@/lib/framecn-ui";
import { contextMenuTargets, parkTopLeft } from "@/lib/ui-demo-cursor";
import { ContextMenu } from "@/registry/bases/editframe/ui/context-menu";
import { useContextMenuTransition } from "@/registry/bases/editframe/ui/context-menu/use-context-menu-transition";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { useDropdownMenuItemTransition } from "@/registry/bases/editframe/ui/dropdown-menu-item/use-dropdown-menu-item-transition";

const MENU = contextMenuTargets();

export interface ContextMenuDemoProps {
  items?: string[];
}

export const contextMenuDemoControls = ["items"] as const;

export const ContextMenuDemoScene = (p: ContextMenuDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 30, duration: 26, ...MENU.click },
    { at: 42, click: true, duration: 0, ...MENU.click },
    { at: 58, duration: 14, ...MENU.row1 },
    { at: 72, click: true, duration: 0, ...MENU.row1 },
    { at: 104, duration: 20, ...MENU.leave },
  ]);

  // Menu: opens just after the right-click, closes after the row interaction.
  const menuStyle = useContextMenuTransition([
    { at: 44, duration: 10, state: "opened" },
    { at: 92, duration: 10, state: "closed" },
  ]);

  // Row 1 ("Reload"): idle → hover → press → idle.
  const rowState = useCurrentState(
    [
      { at: 60, state: "hover" },
      { at: 72, state: "press" },
      { at: 82, state: "idle" },
    ],
    "idle"
  );
  const rowStyle = useDropdownMenuItemTransition([{ at: 0, state: rowState }]);

  const items = p.items ?? ["Back", "Reload", "Save As…", "Inspect"];

  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      {/* File card — the target the cursor right-clicks on. */}
      <div
        style={{
          alignItems: "center",
          background: "oklch(0.97 0 0)",
          border: "1px solid oklch(0.9 0 0)",
          borderRadius: 10,
          display: "flex",
          fontFamily:
            "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          gap: 12,
          left: "50%",
          padding: "16px 20px",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            stroke="oklch(0.55 0 0)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 2v6h6"
            stroke="oklch(0.55 0 0)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{ color: "oklch(0.3 0 0)", fontSize: 14, fontWeight: 500 }}
        >
          report.pdf
        </span>
      </div>

      {/* Context menu anchored at the cursor click point (top-left = click position). */}
      <div
        style={{
          left: MENU.click.x,
          position: "absolute",
          top: MENU.click.y,
        }}
      >
        <ContextMenu
          style={menuStyle}
          items={items}
          itemStyles={[undefined, rowStyle, undefined, undefined]}
        />
      </div>

      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const contextMenuDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const items = values.items as string[] | undefined;

  const props: string[] = [];
  if (items !== undefined) {
    props.push(`items={${JSON.stringify(items)}}`);
  }
  const extraProps = props.length
    ? `\n          ${props.join("\n          ")}`
    : "";

  return `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { ContextMenu } from "@/components/framecn/context-menu";
import { useContextMenuTransition } from "@/components/framecn/use-context-menu-transition";
import { useDropdownMenuItemTransition } from "@/components/framecn/use-dropdown-menu-item-transition";
import { useCurrentState } from "@/lib/framecn-ui";

const CLICK_X = W / 2 + 20;
const CLICK_Y = H / 2 + 25;
const ROW1_X = CLICK_X + 70;
const ROW1_Y = CLICK_Y + 60;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0,   x: 80,      y: 60      },
    { at: 30,  x: CLICK_X, y: CLICK_Y, duration: 26 },
    { at: 42,  x: CLICK_X, y: CLICK_Y, click: true, duration: 0 },
    { at: 58,  x: ROW1_X,  y: ROW1_Y,  duration: 14 },
    { at: 72,  x: ROW1_X,  y: ROW1_Y,  click: true, duration: 0 },
    { at: 104, x: ROW1_X + 180, y: ROW1_Y + 80, duration: 20 },
  ]);

  // Menu opens at the click point, closes after the row interaction.
  const menuStyle = useContextMenuTransition([
    { at: 44,  state: "opened", duration: 10 },
    { at: 92,  state: "closed", duration: 10 },
  ]);

  // Animate row 1 ("Reload"): idle → hover → press → idle.
  const rowState = useCurrentState(
    [
      { at: 60, state: "hover" },
      { at: 72, state: "press" },
      { at: 82, state: "idle"  },
    ],
    "idle",
  );
  const rowStyle = useDropdownMenuItemTransition([{ at: 0, state: rowState }]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* File card — right-click target */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          padding: "16px 20px",
          background: "oklch(0.97 0 0)",
          border: "1px solid oklch(0.9 0 0)",
          borderRadius: 10,
        }}
      >
        report.pdf
      </div>

      {/* Context menu positioned at the click point — caller owns placement. */}
      <div style={{ position: "absolute", left: CLICK_X, top: CLICK_Y }}>
        <ContextMenu${extraProps}
          style={menuStyle}
          itemStyles={[undefined, rowStyle, undefined, undefined]}
        />
      </div>

      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
};
