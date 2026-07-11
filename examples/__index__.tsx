import type { ComponentType } from "react";

import { FPS, H, W } from "@/lib/customizer-config";
import type { BackdropFill } from "@/registry/bases/editframe/components/backdrop";

import {
  AccordionDemoScene,
  accordionDemoCode,
} from "./bases/editframe/ui/accordion-demo";
import {
  AlertDialogDemoScene,
  alertDialogDemoCode,
} from "./bases/editframe/ui/alert-dialog-demo";
import {
  BlurInDemoScene,
  blurInDemoCode,
} from "./bases/editframe/ui/blur-in-demo";
import {
  ButtonDemoScene,
  buttonDemoCode,
} from "./bases/editframe/ui/button-demo";
import { CaretDemoScene, caretDemoCode } from "./bases/editframe/ui/caret-demo";
import {
  CheckboxDemoScene,
  checkboxDemoCode,
} from "./bases/editframe/ui/checkbox-demo";
import {
  ComboboxDemoScene,
  comboboxDemoCode,
} from "./bases/editframe/ui/combobox-demo";
import {
  CommandMenuDemoScene,
  commandMenuDemoCode,
} from "./bases/editframe/ui/command-menu-demo";
import {
  ContextMenuDemoScene,
  contextMenuDemoCode,
} from "./bases/editframe/ui/context-menu-demo";
import {
  CursorDemoScene,
  cursorDemoCode,
} from "./bases/editframe/ui/cursor-demo";
import {
  DialogDemoScene,
  dialogDemoCode,
} from "./bases/editframe/ui/dialog-demo";
import {
  DrawerDemoScene,
  drawerDemoCode,
} from "./bases/editframe/ui/drawer-demo";
import {
  DropdownMenuDemoScene,
  dropdownMenuDemoCode,
} from "./bases/editframe/ui/dropdown-menu-demo";
import { InputDemoScene, inputDemoCode } from "./bases/editframe/ui/input-demo";
import {
  MessageBubbleDemoScene,
  messageBubbleDemoCode,
} from "./bases/editframe/ui/message-bubble-demo";
import {
  PopoverDemoScene,
  popoverDemoCode,
} from "./bases/editframe/ui/popover-demo";
import {
  ProgressDemoScene,
  progressDemoCode,
} from "./bases/editframe/ui/progress-demo";
import { RadioDemoScene, radioDemoCode } from "./bases/editframe/ui/radio-demo";
import {
  ResizableDemoScene,
  resizableDemoCode,
} from "./bases/editframe/ui/resizable-demo";
import {
  SelectDemoScene,
  selectDemoCode,
} from "./bases/editframe/ui/select-demo";
import { SheetDemoScene, sheetDemoCode } from "./bases/editframe/ui/sheet-demo";
import {
  SkeletonDemoScene,
  skeletonDemoCode,
} from "./bases/editframe/ui/skeleton-demo";
import {
  SliderDemoScene,
  sliderDemoCode,
} from "./bases/editframe/ui/slider-demo";
import {
  StepperDemoScene,
  stepperDemoCode,
} from "./bases/editframe/ui/stepper-demo";
import {
  SwitchDemoScene,
  switchDemoCode,
} from "./bases/editframe/ui/switch-demo";
import { TabsDemoScene, tabsDemoCode } from "./bases/editframe/ui/tabs-demo";
import { ToastDemoScene, toastDemoCode } from "./bases/editframe/ui/toast-demo";
import {
  ToggleGroupDemoScene,
  toggleGroupDemoCode,
} from "./bases/editframe/ui/toggle-group-demo";
import {
  TooltipDemoScene,
  tooltipDemoCode,
} from "./bases/editframe/ui/tooltip-demo";
import {
  TypingIndicatorDemoScene,
  typingIndicatorDemoCode,
} from "./bases/editframe/ui/typing-indicator-demo";

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
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "alert-dialog-demo": {
    Component: AlertDialogDemoScene,
    code: alertDialogDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "blur-in-demo": {
    Component: BlurInDemoScene,
    code: blurInDemoCode,
    durationInFrames: 40,
    fps: FPS,
    height: H,
    width: W,
  },
  "button-demo": {
    Component: ButtonDemoScene,
    code: buttonDemoCode,
    durationInFrames: 132,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "caret-demo": {
    Component: CaretDemoScene,
    code: caretDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    width: W,
  },
  "checkbox-demo": {
    Component: CheckboxDemoScene,
    code: checkboxDemoCode,
    durationInFrames: 100,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "combobox-demo": {
    Component: ComboboxDemoScene,
    code: comboboxDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "command-menu-demo": {
    Component: CommandMenuDemoScene,
    code: commandMenuDemoCode,
    durationInFrames: 130,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "context-menu-demo": {
    Component: ContextMenuDemoScene,
    code: contextMenuDemoCode,
    durationInFrames: 135,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "cursor-demo": {
    Component: CursorDemoScene,
    code: cursorDemoCode,
    durationInFrames: 140,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "dialog-demo": {
    Component: DialogDemoScene,
    code: dialogDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "drawer-demo": {
    Component: DrawerDemoScene,
    code: drawerDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "dropdown-menu-demo": {
    Component: DropdownMenuDemoScene,
    code: dropdownMenuDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "input-demo": {
    Component: InputDemoScene,
    code: inputDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "message-bubble-demo": {
    Component: MessageBubbleDemoScene,
    code: messageBubbleDemoCode,
    durationInFrames: 90,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "popover-demo": {
    Component: PopoverDemoScene,
    code: popoverDemoCode,
    durationInFrames: 130,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "progress-demo": {
    Component: ProgressDemoScene,
    code: progressDemoCode,
    durationInFrames: 160,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "radio-demo": {
    Component: RadioDemoScene,
    code: radioDemoCode,
    durationInFrames: 100,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "resizable-demo": {
    Component: ResizableDemoScene,
    code: resizableDemoCode,
    durationInFrames: 205,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "select-demo": {
    Component: SelectDemoScene,
    code: selectDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "sheet-demo": {
    Component: SheetDemoScene,
    code: sheetDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "skeleton-demo": {
    Component: SkeletonDemoScene,
    code: skeletonDemoCode,
    durationInFrames: 220,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "slider-demo": {
    Component: SliderDemoScene,
    code: sliderDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "stepper-demo": {
    Component: StepperDemoScene,
    code: stepperDemoCode,
    durationInFrames: 150,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "switch-demo": {
    Component: SwitchDemoScene,
    code: switchDemoCode,
    durationInFrames: 100,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "tabs-demo": {
    Component: TabsDemoScene,
    code: tabsDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "toast-demo": {
    Component: ToastDemoScene,
    code: toastDemoCode,
    durationInFrames: 170,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "toggle-group-demo": {
    Component: ToggleGroupDemoScene,
    code: toggleGroupDemoCode,
    durationInFrames: 115,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "tooltip-demo": {
    Component: TooltipDemoScene,
    code: tooltipDemoCode,
    durationInFrames: 120,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
  "typing-indicator-demo": {
    Component: TypingIndicatorDemoScene,
    code: typingIndicatorDemoCode,
    durationInFrames: 90,
    fps: FPS,
    height: H,
    previewBackdrop: { type: "color", value: "oklch(1 0 0)" },
    width: W,
  },
};
