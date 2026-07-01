"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { BlurIn } from "@/registry/bases/editframe/ui/blur-in";
import { Button } from "@/registry/bases/editframe/ui/button";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Select } from "@/registry/bases/editframe/ui/select";
import { Slider } from "@/registry/bases/editframe/ui/slider";
import { Switch } from "@/registry/bases/editframe/ui/switch";
import { Toast } from "@/registry/bases/editframe/ui/toast";

const DEFAULT_ROWS = [
  { label: "Notifications" },
  { label: "Theme" },
  { label: "Volume" },
];
const DEFAULT_SELECT_ITEMS = ["System", "Light", "Dark"];

const LEFT_X = 320;
const RIGHT_X = 700;
const COL_W = 300;

const NOTIF_LABEL_Y = 196;
const SWITCH_TOP = 222;
const SWITCH_W = 44;
const SWITCH_H = 28;
const SWITCH_CX = RIGHT_X + SWITCH_W / 2;
const SWITCH_CY = SWITCH_TOP + SWITCH_H / 2;

const THEME_LABEL_Y = 280;
const SELECT_W = 260;
const TRIGGER_TOP = 320;
const TRIGGER_H = 40;
const TRIGGER_CX = RIGHT_X + SELECT_W / 2;
const TRIGGER_CY = TRIGGER_TOP + TRIGGER_H / 2;
const ITEM_CX = TRIGGER_CX;
const PANEL_TOP = TRIGGER_TOP + TRIGGER_H + 6;
const PANEL_PAD = 4;
const ITEM_H = 33;
const ITEM_GAP = 2;

const VOL_LABEL_Y = 380;
const SLIDER_TOP = 400;
const SLIDER_W = 260;
const SLIDER_H = 16;
const SLIDER_CY = SLIDER_TOP + SLIDER_H / 2;
const SLIDER_X0 = RIGHT_X;
const THUMB_X_AT_20 = SLIDER_X0 + 0.2 * SLIDER_W;
const THUMB_X_AT_80 = SLIDER_X0 + 0.8 * SLIDER_W;

const SAVE_W = 160;
const SAVE_LEFT = RIGHT_X + SELECT_W - SAVE_W;
const SAVE_TOP = 544;
const SAVE_H = 40;
const SAVE_CX = SAVE_LEFT + SAVE_W / 2;
const SAVE_CY = SAVE_TOP + SAVE_H / 2;

const CARD_PAD = 44;
const CARD_LEFT = LEFT_X - CARD_PAD;
const CARD_TOP = NOTIF_LABEL_Y - CARD_PAD;
const CARD_W = RIGHT_X + SELECT_W + CARD_PAD - CARD_LEFT;
const CARD_H = SAVE_TOP + SAVE_H + CARD_PAD - CARD_TOP;

const DEMO = 44;

export interface SettingsToggleFlowProps {
  title?: string;
  description?: string;
  rows?: { label: string }[];
  selectItems?: string[];
  saveLabel?: string;
  toastTitle?: string;
  theme?: Partial<FramecnTheme>;
}

export function SettingsToggleFlow({
  title = "Notification settings",
  description = "Manage how you receive alerts, set your theme, and tune the volume.",
  rows = DEFAULT_ROWS,
  selectItems = DEFAULT_SELECT_ITEMS,
  saveLabel = "Save settings",
  toastTitle = "Settings saved",
  theme,
}: SettingsToggleFlowProps) {
  const resolved = useFramecnTheme(theme);

  const lastItem = selectItems.length - 1;
  const ITEM_CY =
    PANEL_TOP + PANEL_PAD + lastItem * (ITEM_H + ITEM_GAP) + ITEM_H / 2;

  const cursorStyle = useCursorPath([
    { at: 0, x: 220, y: 130 },
    { at: 24 + DEMO, duration: 20, x: SWITCH_CX, y: SWITCH_CY },
    { at: 24 + DEMO, click: true, duration: 0, x: SWITCH_CX, y: SWITCH_CY },
    { at: 55 + DEMO, duration: 22, x: TRIGGER_CX, y: TRIGGER_CY },
    { at: 55 + DEMO, click: true, duration: 0, x: TRIGGER_CX, y: TRIGGER_CY },
    { at: 80 + DEMO, duration: 18, x: ITEM_CX, y: ITEM_CY },
    { at: 80 + DEMO, click: true, duration: 0, x: ITEM_CX, y: ITEM_CY },
    { at: 105 + DEMO, duration: 18, x: THUMB_X_AT_20, y: SLIDER_CY },
    {
      at: 105 + DEMO,
      duration: 0,
      press: true,
      x: THUMB_X_AT_20,
      y: SLIDER_CY,
    },
    {
      at: 150 + DEMO,
      duration: 45,
      press: true,
      x: THUMB_X_AT_80,
      y: SLIDER_CY,
    },
    { at: 158 + DEMO, duration: 0, x: THUMB_X_AT_80, y: SLIDER_CY },
    { at: 180 + DEMO, duration: 18, x: SAVE_CX, y: SAVE_CY },
    { at: 180 + DEMO, click: true, duration: 0, x: SAVE_CX, y: SAVE_CY },
  ]);

  const rowLabelStyle = {
    color: resolved.foreground,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "-0.01em",
  } as const;

  return (
    <div
      style={{
        background: "transparent",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: resolved.background,
          border: `1px solid ${resolved.border}`,
          borderRadius: 16,
          boxShadow:
            "0 10px 30px -12px rgba(0,0,0,0.22), 0 2px 8px -3px rgba(0,0,0,0.10)",
          boxSizing: "border-box",
          height: CARD_H,
          left: CARD_LEFT,
          position: "absolute",
          top: CARD_TOP,
          width: CARD_W,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          left: LEFT_X,
          position: "absolute",
          top: NOTIF_LABEL_Y,
          width: COL_W,
        }}
      >
        <BlurIn display="block" state="revealed">
          <div
            style={{
              color: resolved.foreground,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: "28px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: resolved.mutedForeground,
              fontSize: 14,
              lineHeight: "22px",
            }}
          >
            {description}
          </div>
        </BlurIn>
      </div>

      <div
        style={{
          left: RIGHT_X,
          position: "absolute",
          top: NOTIF_LABEL_Y,
          ...rowLabelStyle,
        }}
      >
        <BlurIn display="block" state="revealed">
          {rows[0]?.label ?? "Notifications"}
        </BlurIn>
      </div>
      <div
        style={{
          height: SWITCH_H,
          left: RIGHT_X,
          position: "absolute",
          top: SWITCH_TOP,
          width: SWITCH_W,
        }}
      >
        <BlurIn display="block" state="revealed">
          <Switch
            state="checked"
            from="unchecked"
            duration="12frames"
            theme={theme}
          />
        </BlurIn>
      </div>

      <div
        style={{
          left: RIGHT_X,
          position: "absolute",
          top: VOL_LABEL_Y,
          ...rowLabelStyle,
        }}
      >
        <BlurIn display="block" state="revealed">
          {rows[2]?.label ?? "Volume"}
        </BlurIn>
      </div>
      <div
        style={{
          left: SLIDER_X0,
          position: "absolute",
          top: SLIDER_TOP,
        }}
      >
        <BlurIn display="block" state="revealed">
          <Slider value={0.5} theme={theme} />
        </BlurIn>
      </div>

      <div
        style={{
          left: RIGHT_X,
          position: "absolute",
          top: THEME_LABEL_Y,
          ...rowLabelStyle,
        }}
      >
        <BlurIn display="block" state="revealed">
          {rows[1]?.label ?? "Theme"}
        </BlurIn>
      </div>
      <div
        style={{
          height: TRIGGER_H,
          left: RIGHT_X,
          position: "absolute",
          top: TRIGGER_TOP,
          width: SELECT_W,
        }}
      >
        <BlurIn display="block" state="revealed">
          <Select
            value={selectItems[0] ?? "System"}
            items={selectItems}
            theme={theme}
          />
        </BlurIn>
      </div>

      <div
        style={{
          height: SAVE_H,
          left: SAVE_LEFT,
          position: "absolute",
          top: SAVE_TOP,
          width: SAVE_W,
        }}
      >
        <BlurIn display="block" state="revealed">
          <Button label={saveLabel} state="idle" from="idle" theme={theme} />
        </BlurIn>
      </div>

      <div style={{ bottom: 24, position: "absolute", right: 24 }}>
        <Toast
          title={toastTitle}
          variant="success"
          state="hidden"
          from="hidden"
          theme={theme}
        />
      </div>

      <Cursor style={cursorStyle} variant="pointer" theme={theme} />
    </div>
  );
}
