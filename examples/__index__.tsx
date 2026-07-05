import type { ComponentType } from "react";

import { FPS, H, W } from "@/lib/customizer-config";
import type { BackdropFill } from "@/registry/bases/editframe/components/backdrop";

import {
  AccordionDemoScene,
  accordionDemoCode,
} from "./bases/editframe/ui/accordion-demo";

export interface ExampleEntry {
  Component: ComponentType;
  code: string | ((values: Record<string, unknown>) => string);
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  previewBackdrop?: BackdropFill;
}

export const examples: Record<string, ExampleEntry> = {
  "accordion-demo": {
    Component: AccordionDemoScene,
    code: accordionDemoCode,
    durationInFrames: 100,
    fps: FPS,
    width: W,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
  },
};
