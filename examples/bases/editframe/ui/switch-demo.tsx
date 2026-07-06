"use client";

import { Switch } from "@/registry/bases/editframe/ui/switch";
import { useSwitchTransition } from "@/registry/bases/editframe/ui/switch/use-switch-transition";

export const switchDemoControls = ["label", "size", "primary"] as const;

export interface SwitchDemoProps {
  label?: string;
  size?: "sm" | "default" | "lg";
  primary?: string;
}

export const SwitchDemoScene = (p: SwitchDemoProps = {}) => {
  const style = useSwitchTransition(
    [
      { at: 18, duration: 14, state: "checked" },
      { at: 78, duration: 12, state: "unchecked" },
    ],
    { primary: p.primary }
  );
  return (
    <Switch
      label={p.label ?? "Enable notifications"}
      size={p.size ?? "default"}
      primary={p.primary}
      style={style}
    />
  );
};

export const switchDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const label = values.label as string | undefined;
  const size = values.size as string | undefined;
  const primary = values.primary as string | undefined;

  const props: string[] = [];
  if (label !== undefined && label !== "Enable notifications") {
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

  return `import { Switch } from "@/components/framecn/switch";
import { useSwitchTransition } from "@/components/framecn/use-switch-transition";

export const Scene = () => {
  const style = useSwitchTransition([
    { at: 18, state: "checked", duration: 14 },
    { at: 78, state: "unchecked", duration: 12 },
  ]${optsStr});

  return <Switch${propsStr} style={style} />;
};`;
};
