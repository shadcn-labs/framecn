"use client";

import { Input } from "@/registry/bases/editframe/ui/input";
import { useInputTransition } from "@/registry/bases/editframe/ui/input/use-input-transition";

export const inputDemoControls = [
  "placeholder",
  "value",
  "size",
  "primary",
] as const;

export interface InputDemoProps {
  placeholder?: string;
  value?: string;
  size?: "sm" | "default" | "lg";
  primary?: string;
}

export const InputDemoScene = (p: InputDemoProps = {}) => {
  const style = useInputTransition(
    [
      { at: 10, duration: 8, state: "hover" },
      { at: 24, duration: 10, state: "active" },
      { at: 40, duration: 22, state: "typing" },
      { at: 78, duration: 12, state: "invalid" },
    ],
    { primary: p.primary }
  );
  return (
    <Input
      placeholder={p.placeholder ?? "you@example.com"}
      value={p.value ?? "remotion@remocn.dev"}
      size={p.size ?? "default"}
      primary={p.primary}
      style={style}
    />
  );
};

export const inputDemoCode = (values: Record<string, unknown> = {}): string => {
  const placeholder = values.placeholder as string | undefined;
  const value = values.value as string | undefined;
  const size = values.size as string | undefined;
  const primary = values.primary as string | undefined;

  const props: string[] = [];
  if (placeholder !== undefined && placeholder !== "you@example.com") {
    props.push(`placeholder="${placeholder}"`);
  }
  if (value !== undefined && value !== "remotion@remocn.dev") {
    props.push(`value="${value}"`);
  }
  if (size !== undefined && size !== "default") {
    props.push(`size="${size}"`);
  }
  if (primary !== undefined) {
    props.push(`primary="${primary}"`);
  }

  const propsStr = props.length
    ? `\n      ${props.join("\n      ")}\n    `
    : "";

  const hookOpts: string[] = [];
  if (primary !== undefined) {
    hookOpts.push(`primary: "${primary}"`);
  }
  const optsStr = hookOpts.length ? `, { ${hookOpts.join(", ")} }` : "";

  return `import { Input } from "@/components/framecn/input";
import { useInputTransition } from "@/components/framecn/use-input-transition";

export const Scene = () => {
  const style = useInputTransition([
    { at: 10, state: "hover", duration: 8 },
    { at: 24, state: "active", duration: 10 },
    { at: 40, state: "typing", duration: 22 },
    { at: 78, state: "invalid", duration: 12 },
  ]${optsStr});

  return (
    <Input${propsStr === "" ? " " : propsStr}style={style} />
  );
};`;
};
