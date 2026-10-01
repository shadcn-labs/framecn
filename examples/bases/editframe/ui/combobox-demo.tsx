"use client";

import { useCurrentFrame, revealCount } from "@/lib/framecn-ui";
import { Combobox } from "@/registry/bases/editframe/ui/combobox";
import { useComboboxTransition } from "@/registry/bases/editframe/ui/combobox/use-combobox-transition";
import { useSelectItemTransition } from "@/registry/bases/editframe/ui/select-item/use-select-item-transition";

// Typing "ba" filters the default list ["Apple","Banana","Orange","Grape"] to ["Banana"].
const QUERY = "ba";
const TYPE_START = 32;
const FPS = 30;
const CPS = 4;

export const comboboxDemoControls = ["placeholder"] as const;

export interface ComboboxDemoProps {
  placeholder?: string;
}

export const ComboboxDemoScene = (p: ComboboxDemoProps = {}) => {
  const frame = useCurrentFrame();

  // Panel: opens at frame 16, closes at frame 100.
  const panelStyle = useComboboxTransition([
    { at: 16, duration: 12, state: "opened" },
    { at: 100, duration: 12, state: "closed" },
  ]);

  // Reveal "ba" character by character starting at frame 32.
  const revealed = revealCount(
    Math.max(0, frame - TYPE_START),
    FPS,
    QUERY.length,
    CPS
  );

  // Animate the first row of the filtered list: idle → hover → press → selected.
  // Once "ba" is fully revealed, only Banana remains; row 0 of the filtered list.
  const itemStyle = useSelectItemTransition([
    { at: 60, duration: 8, state: "hover" },
    { at: 72, duration: 6, state: "press" },
    { at: 80, duration: 8, state: "selected" },
  ]);

  return (
    <div style={{ height: "100%", position: "relative", width: "100%" }}>
      <Combobox
        style={panelStyle}
        query={QUERY}
        revealCount={revealed}
        itemStyles={[itemStyle]}
        placeholder={p.placeholder ?? "Select a fruit…"}
      />
    </div>
  );
};

export const comboboxDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const placeholder = values.placeholder as string | undefined;

  const props: string[] = [];
  if (placeholder !== undefined && placeholder !== "Select a fruit…") {
    props.push(`placeholder="${placeholder}"`);
  }
  const extraProps = props.length
    ? `\n        ${props.join("\n        ")}`
    : "";

  const optsStr = "";

  return `import { useCurrentFrame } from "@/lib/framecn-ui";
import { revealCount } from "@/lib/framecn-ui";
import { Combobox } from "@/components/framecn/combobox";
import { useComboboxTransition } from "@/components/framecn/use-combobox-transition";
import { useSelectItemTransition } from "@/components/framecn/use-select-item-transition";

// Typing "ba" filters ["Apple","Banana","Orange","Grape"] to ["Banana"].
const QUERY = "ba";
const TYPE_START = 32;
const FPS = 30;
const CPS = 4;

export const Scene = () => {
  const frame = useCurrentFrame();

  // Panel opens at frame 16, closes at frame 100.
  const panelStyle = useComboboxTransition(
    [
      { at: 16, state: "opened", duration: 12 },
      { at: 100, state: "closed", duration: 12 },
    ]${optsStr},
  );

  // revealCount drives how many characters of QUERY are visible.
  const revealed = revealCount(
    Math.max(0, frame - TYPE_START),
    FPS,
    QUERY.length,
    CPS,
  );

  // Animate the first row of the filtered list once "ba" narrows it to Banana.
  const itemStyle = useSelectItemTransition(
    [
      { at: 60, state: "hover",    duration: 8 },
      { at: 72, state: "press",    duration: 6 },
      { at: 80, state: "selected", duration: 8 },
    ]${optsStr},
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Combobox${extraProps}
        style={panelStyle}
        query={QUERY}
        revealCount={revealed}
        itemStyles={[itemStyle]}
      />
    </div>
  );
};`;
};
