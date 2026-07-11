"use client";

import { Radio } from "@/registry/bases/editframe/ui/radio";
import { useRadioTransition } from "@/registry/bases/editframe/ui/radio/use-radio-transition";

export const radioDemoControls = ["label", "size", "primary"] as const;

export interface RadioDemoProps {
  label?: string;
  size?: "sm" | "default" | "lg";
  primary?: string;
}

export const RadioDemoScene = (p: RadioDemoProps = {}) => {
  const style = useRadioTransition(
    [
      { at: 18, duration: 14, state: "checked" },
      { at: 78, duration: 12, state: "unchecked" },
    ],
    { primary: p.primary }
  );
  return (
    <Radio
      label={p.label ?? "Subscribe to updates"}
      size={p.size ?? "default"}
      primary={p.primary}
      style={style}
    />
  );
};

export const radioDemoCode = (values: Record<string, unknown> = {}): string => {
  const label = values.label as string | undefined;
  const size = values.size as string | undefined;
  const primary = values.primary as string | undefined;

  const props: string[] = [];
  if (label !== undefined && label !== "Subscribe to updates") {
    props.push(`label="${label}"`);
  }
  if (size !== undefined && size !== "default") {
    props.push(`size="${size}"`);
  }
  if (primary !== undefined) {
    props.push(`primary="${primary}"`);
  }

  const propsStr = props.length ? ` ${props.join(" ")}` : "";

  const hookOpts: string[] = [];
  if (primary !== undefined) {
    hookOpts.push(`primary: "${primary}"`);
  }
  const optsStr = hookOpts.length ? `, { ${hookOpts.join(", ")} }` : "";

  return `import { Radio } from "@/components/framecn/radio";
import { useRadioTransition } from "@/components/framecn/use-radio-transition";

export const Scene = () => {
  const style = useRadioTransition([
    { at: 18, state: "checked", duration: 14 },
    { at: 78, state: "unchecked", duration: 12 },
  ]${optsStr});

  return <Radio${propsStr} style={style} />;
};`;
};
