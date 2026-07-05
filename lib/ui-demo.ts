import { examples } from "@/examples/__index__";
import type { ExampleEntry } from "@/examples/__index__";
import { accordionDemoControls } from "@/examples/bases/editframe/ui/accordion-demo";

/** Control keys each UI demo scene actually threads into its component. */
export const UI_DEMO_CONTROLS: Partial<Record<string, readonly string[]>> = {
  accordion: accordionDemoControls,
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
