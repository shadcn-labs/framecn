import { examples } from "@/examples/__index__";
import type { ExampleEntry } from "@/examples/__index__";
import { accordionDemoControls } from "@/examples/bases/editframe/ui/accordion-demo";
import { alertDialogDemoControls } from "@/examples/bases/editframe/ui/alert-dialog-demo";
import { blurInDemoControls } from "@/examples/bases/editframe/ui/blur-in-demo";
import { buttonDemoControls } from "@/examples/bases/editframe/ui/button-demo";
import { caretDemoControls } from "@/examples/bases/editframe/ui/caret-demo";
import { checkboxDemoControls } from "@/examples/bases/editframe/ui/checkbox-demo";
import { comboboxDemoControls } from "@/examples/bases/editframe/ui/combobox-demo";
import { commandMenuDemoControls } from "@/examples/bases/editframe/ui/command-menu-demo";
import { contextMenuDemoControls } from "@/examples/bases/editframe/ui/context-menu-demo";
import { cursorDemoControls } from "@/examples/bases/editframe/ui/cursor-demo";
import { dialogDemoControls } from "@/examples/bases/editframe/ui/dialog-demo";
import { drawerDemoControls } from "@/examples/bases/editframe/ui/drawer-demo";
import { dropdownMenuDemoControls } from "@/examples/bases/editframe/ui/dropdown-menu-demo";
import { inputDemoControls } from "@/examples/bases/editframe/ui/input-demo";
import { messageBubbleDemoControls } from "@/examples/bases/editframe/ui/message-bubble-demo";
import { popoverDemoControls } from "@/examples/bases/editframe/ui/popover-demo";
import { progressDemoControls } from "@/examples/bases/editframe/ui/progress-demo";
import { radioDemoControls } from "@/examples/bases/editframe/ui/radio-demo";
import { resizableDemoControls } from "@/examples/bases/editframe/ui/resizable-demo";
import { selectDemoControls } from "@/examples/bases/editframe/ui/select-demo";
import { sheetDemoControls } from "@/examples/bases/editframe/ui/sheet-demo";
import { skeletonDemoControls } from "@/examples/bases/editframe/ui/skeleton-demo";
import { sliderDemoControls } from "@/examples/bases/editframe/ui/slider-demo";
import { stepperDemoControls } from "@/examples/bases/editframe/ui/stepper-demo";
import { switchDemoControls } from "@/examples/bases/editframe/ui/switch-demo";
import { tabsDemoControls } from "@/examples/bases/editframe/ui/tabs-demo";
import { toastDemoControls } from "@/examples/bases/editframe/ui/toast-demo";
import { toggleGroupDemoControls } from "@/examples/bases/editframe/ui/toggle-group-demo";
import { tooltipDemoControls } from "@/examples/bases/editframe/ui/tooltip-demo";
import { typingIndicatorDemoControls } from "@/examples/bases/editframe/ui/typing-indicator-demo";

/** Control keys each UI demo scene actually threads into its component. */
export const UI_DEMO_CONTROLS: Partial<Record<string, readonly string[]>> = {
  accordion: accordionDemoControls,
  "alert-dialog": alertDialogDemoControls,
  "blur-in": blurInDemoControls,
  button: buttonDemoControls,
  caret: caretDemoControls,
  checkbox: checkboxDemoControls,
  combobox: comboboxDemoControls,
  "command-menu": commandMenuDemoControls,
  "context-menu": contextMenuDemoControls,
  cursor: cursorDemoControls,
  dialog: dialogDemoControls,
  drawer: drawerDemoControls,
  "dropdown-menu": dropdownMenuDemoControls,
  input: inputDemoControls,
  "message-bubble": messageBubbleDemoControls,
  popover: popoverDemoControls,
  progress: progressDemoControls,
  radio: radioDemoControls,
  resizable: resizableDemoControls,
  select: selectDemoControls,
  sheet: sheetDemoControls,
  skeleton: skeletonDemoControls,
  slider: sliderDemoControls,
  stepper: stepperDemoControls,
  switch: switchDemoControls,
  tabs: tabsDemoControls,
  toast: toastDemoControls,
  "toggle-group": toggleGroupDemoControls,
  tooltip: tooltipDemoControls,
  "typing-indicator": typingIndicatorDemoControls,
};

export const getUiDemo = (name: string): ExampleEntry | undefined =>
  examples[`${name}-demo`];

export const pickHonoredProps = (
  name: string,
  values: Record<string, unknown>
): Record<string, unknown> => {
  const honored = UI_DEMO_CONTROLS[name];
  if (!honored) {
    return values;
  }
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => honored.includes(key))
  );
};

export const hasUiDemo = (name: string): boolean =>
  getUiDemo(name) !== undefined && UI_DEMO_CONTROLS[name] !== undefined;
