"use client";

import { useFramecnTheme } from "@/lib/framecn-ui";
import type { FramecnTheme } from "@/lib/framecn-ui";
import { useBlurInTransition } from "@/registry/bases/editframe/ui/blur-in/use-blur-in-transition";
import { Button } from "@/registry/bases/editframe/ui/button";
import { useButtonTransition } from "@/registry/bases/editframe/ui/button/use-button-transition";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Select } from "@/registry/bases/editframe/ui/select";
import { useSelectItemTransition } from "@/registry/bases/editframe/ui/select-item/use-select-item-transition";
import { useSelectTransition } from "@/registry/bases/editframe/ui/select/use-select-transition";
import { Slider } from "@/registry/bases/editframe/ui/slider";
import { useSliderTransition } from "@/registry/bases/editframe/ui/slider/use-slider-transition";
import { Switch } from "@/registry/bases/editframe/ui/switch";
import { useSwitchTransition } from "@/registry/bases/editframe/ui/switch/use-switch-transition";
import { Toast } from "@/registry/bases/editframe/ui/toast";
import { useToastTransition } from "@/registry/bases/editframe/ui/toast/use-toast-transition";

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
  rows?: {
    label: string;
  }[];
  selectItems?: string[];
  saveLabel?: string;
  toastTitle?: string;
  theme?: Partial<FramecnTheme>;
}
const blurRevealStyle = (e: {
  opacity: number;
  blur: number;
  translateX: number;
  translateY: number;
}) => ({
  filter: e.blur > 0 ? `blur(${e.blur}px)` : "none",
  opacity: e.opacity,
  transform: `translate(${e.translateX}px, ${e.translateY}px)`,
});

export const SettingsToggleFlow = ({
  title = "Notification settings",
  description = "Manage how you receive alerts, set your theme, and tune the volume.",
  rows = DEFAULT_ROWS,
  selectItems = DEFAULT_SELECT_ITEMS,
  saveLabel = "Save settings",
  toastTitle = "Settings saved",
  theme,
}: SettingsToggleFlowProps) => {
  const resolved = useFramecnTheme(theme);
  const opts = { theme };
  const lastItem = selectItems.length - 1;
  const ITEM_CY =
    PANEL_TOP + PANEL_PAD + lastItem * (ITEM_H + ITEM_GAP) + ITEM_H / 2;
  const cardEnter = useBlurInTransition(
    [{ at: 0, duration: 18, state: "revealed" }],
    { distance: 0 }
  );
  const enterHeader = useBlurInTransition([
    { at: 18, duration: 16, state: "revealed" },
  ]);
  const enterSwitch = useBlurInTransition([
    { at: 24, duration: 16, state: "revealed" },
  ]);
  const enterTheme = useBlurInTransition([
    { at: 30, duration: 16, state: "revealed" },
  ]);
  const enterVolume = useBlurInTransition([
    { at: 36, duration: 16, state: "revealed" },
  ]);
  const enterSave = useBlurInTransition([
    { at: 42, duration: 16, state: "revealed" },
  ]);
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
  const switchStyle = useSwitchTransition(
    [{ at: 24 + DEMO, duration: 12, state: "checked" }],
    opts
  );
  const panelStyle = useSelectTransition(
    [
      { at: 55 + DEMO, duration: 14, state: "opened" },
      { at: 90 + DEMO, duration: 12, state: "closed" },
    ],
    opts
  );
  const triggerStyle = useButtonTransition(
    [
      { at: 45 + DEMO, duration: 8, state: "hover" },
      { at: 55 + DEMO, duration: 8, state: "press" },
    ],
    { variant: "outline", ...opts }
  );
  const itemStyle = useSelectItemTransition(
    [
      { at: 68 + DEMO, duration: 8, state: "hover" },
      { at: 78 + DEMO, duration: 6, state: "press" },
      { at: 80 + DEMO, duration: 10, state: "selected" },
    ],
    opts
  );
  const sliderStyle = useSliderTransition([
    { at: 0, thumbState: "idle", value: 20 },
    { at: 105 + DEMO, duration: 6, thumbState: "press" },
    { at: 105 + DEMO, value: 20 },
    { at: 150 + DEMO, duration: 45, easing: "inOut", value: 80 },
    { at: 158 + DEMO, duration: 8, thumbState: "idle" },
  ]);
  const saveStyle = useButtonTransition(
    [
      { at: 172 + DEMO, duration: 8, state: "hover" },
      { at: 180 + DEMO, duration: 6, state: "press" },
      { at: 188 + DEMO, duration: 14, state: "success" },
    ],
    opts
  );
  const toastStyle = useToastTransition(
    [
      { at: 196 + DEMO, duration: 12, state: "visible" },
      { at: 256 + DEMO, duration: 12, state: "hidden" },
    ],
    {}
  );
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
          filter: cardEnter.blur > 0 ? `blur(${cardEnter.blur}px)` : "none",
          height: CARD_H,
          left: CARD_LEFT,
          opacity: cardEnter.opacity,
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
          ...blurRevealStyle(enterHeader),
        }}
      >
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
      </div>

      <div
        style={{
          left: RIGHT_X,
          position: "absolute",
          top: NOTIF_LABEL_Y,
          ...rowLabelStyle,
          ...blurRevealStyle(enterSwitch),
        }}
      >
        {rows[0]?.label ?? "Notifications"}
      </div>
      <div
        style={{
          height: SWITCH_H,
          left: RIGHT_X,
          position: "absolute",
          top: SWITCH_TOP,
          width: SWITCH_W,
          ...blurRevealStyle(enterSwitch),
        }}
      >
        <Switch style={switchStyle} theme={theme} />
      </div>

      <div
        style={{
          left: RIGHT_X,
          position: "absolute",
          top: VOL_LABEL_Y,
          ...rowLabelStyle,
          ...blurRevealStyle(enterVolume),
        }}
      >
        {rows[2]?.label ?? "Volume"}
      </div>
      <div
        style={{
          left: SLIDER_X0,
          position: "absolute",
          top: SLIDER_TOP,
          ...blurRevealStyle(enterVolume),
        }}
      >
        <Slider style={sliderStyle} width={SLIDER_W} theme={theme} />
      </div>

      <div
        style={{
          left: RIGHT_X,
          position: "absolute",
          top: THEME_LABEL_Y,
          ...rowLabelStyle,
          ...blurRevealStyle(enterTheme),
        }}
      >
        {rows[1]?.label ?? "Theme"}
      </div>
      <div
        style={{
          height: TRIGGER_H,
          left: RIGHT_X,
          position: "absolute",
          top: TRIGGER_TOP,
          width: SELECT_W,
          ...blurRevealStyle(enterTheme),
        }}
      >
        <Select
          style={panelStyle}
          label={selectItems[0] ?? "System"}
          items={selectItems}
          triggerStyle={triggerStyle}
          itemStyles={selectItems.map((_, i) =>
            i === selectItems.length - 1 ? itemStyle : undefined
          )}
          theme={theme}
        />
      </div>

      <div
        style={{
          height: SAVE_H,
          left: SAVE_LEFT,
          position: "absolute",
          top: SAVE_TOP,
          width: SAVE_W,
          ...blurRevealStyle(enterSave),
        }}
      >
        <Button label={saveLabel} style={saveStyle} theme={theme} />
      </div>

      <div style={{ bottom: 24, position: "absolute", right: 24 }}>
        <Toast
          style={toastStyle}
          title={toastTitle}
          variant="success"
          theme={theme}
        />
      </div>

      <Cursor style={cursorStyle} variant="pointer" theme={theme} />
    </div>
  );
};
