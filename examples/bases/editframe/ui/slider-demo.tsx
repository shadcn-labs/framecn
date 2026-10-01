"use client";

import { parkTopLeft, sliderThumbAt } from "@/lib/ui-demo-cursor";
import { Cursor } from "@/registry/bases/editframe/ui/cursor";
import { useCursorPath } from "@/registry/bases/editframe/ui/cursor/use-cursor-path";
import { Slider } from "@/registry/bases/editframe/ui/slider";
import { useSliderTransition } from "@/registry/bases/editframe/ui/slider/use-slider-transition";

const TRACK_WIDTH = 320;
const THUMB_START = sliderThumbAt(20, TRACK_WIDTH);
const THUMB_END = sliderThumbAt(80, TRACK_WIDTH);

export const sliderDemoControls = ["showValue"] as const;

export interface SliderDemoProps {
  showValue?: boolean;
}

export const SliderDemoScene = (p: SliderDemoProps = {}) => {
  const cursorStyle = useCursorPath([
    { at: 0, ...parkTopLeft },
    { at: 30, duration: 26, ...THUMB_START },
    { at: 44, duration: 0, press: true, ...THUMB_START },
    { at: 100, duration: 56, press: true, ...THUMB_END },
    { at: 108, duration: 0, ...THUMB_END },
  ]);

  const sliderStyle = useSliderTransition([
    { at: 0, thumbState: "idle", value: 20 },
    { at: 30, duration: 8, thumbState: "hover" },
    { at: 44, duration: 6, thumbState: "press" },
    { at: 44, value: 20 },
    { at: 100, duration: 56, easing: "inOut", value: 80 },
    { at: 108, duration: 8, thumbState: "idle" },
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
        <Slider
          style={sliderStyle}
          width={TRACK_WIDTH}
          showValue={p.showValue ?? true}
        />
      </div>
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};

export const sliderDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const showValue = values.showValue as boolean | undefined;

  const props: string[] = [];
  if (showValue !== undefined && showValue !== true) {
    props.push(`showValue={${showValue}}`);
  }

  const sliderPropsStr = props.length ? ` ${props.join(" ")}` : "";
  return `import { H, W } from "@/lib/customizer-config";
import { Cursor } from "@/components/framecn/cursor";
import { useCursorPath } from "@/components/framecn/use-cursor-path";
import { Slider } from "@/components/framecn/slider";
import { useSliderTransition } from "@/components/framecn/use-slider-transition";

const TRACK_WIDTH = 320;
const THUMB_START_X = W / 2 - TRACK_WIDTH / 2 + 0.2 * TRACK_WIDTH;
const THUMB_END_X   = W / 2 - TRACK_WIDTH / 2 + 0.8 * TRACK_WIDTH;
const THUMB_Y       = H / 2;

export const Scene = () => {
  const cursorStyle = useCursorPath([
    { at: 0,   x: 80,           y: 60      },
    { at: 30,  x: THUMB_START_X, y: THUMB_Y, duration: 26 },
    { at: 44,  x: THUMB_START_X, y: THUMB_Y, press: true,  duration: 0 },
    { at: 100, x: THUMB_END_X,   y: THUMB_Y, press: true,  duration: 56 },
    { at: 108, x: THUMB_END_X,   y: THUMB_Y, duration: 0 },
  ]);

  const sliderStyle = useSliderTransition([
    { at: 0,   value: 20, thumbState: "idle"  },
    { at: 30,  thumbState: "hover", duration: 8 },
    { at: 44,  thumbState: "press", duration: 6 },
    { at: 44,  value: 20 },
    { at: 100, value: 80,           duration: 56, easing: "inOut" },
    { at: 108, thumbState: "idle",  duration: 8 },
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
        <Slider style={sliderStyle} width={TRACK_WIDTH}${sliderPropsStr} />
      </div>
      <Cursor style={cursorStyle} variant="pointer" />
    </div>
  );
};`;
};
