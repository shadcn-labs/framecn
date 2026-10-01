"use client";

import { Tabs } from "@/registry/bases/editframe/ui/tabs";
import { useTabsTransition } from "@/registry/bases/editframe/ui/tabs/use-tabs-transition";

export interface TabsDemoProps {
  variant?: "pill" | "underline";
}

export const tabsDemoControls = ["variant"] as const;

export const TabsDemoScene = (p: TabsDemoProps = {}) => {
  const style = useTabsTransition(
    [
      { at: 18, duration: 16, state: "Account" },
      { at: 58, duration: 18, state: "Password" },
      { at: 94, duration: 12, state: "Settings" },
    ],
    { variant: p.variant }
  );
  return <Tabs style={style} variant={p.variant ?? "pill"} />;
};

export const tabsDemoCode = (values: Record<string, unknown> = {}): string => {
  const variant = values.variant as string | undefined;

  const props: string[] = [];
  if (variant !== undefined && variant !== "pill") {
    props.push(`variant="${variant}"`);
  }
  const extraProps = props.length ? `\n    ${props.join("\n    ")}` : "";

  const hookOpts: string[] = [];
  if (variant !== undefined && variant !== "pill") {
    hookOpts.push(`variant: "${variant}"`);
  }
  const optsStr = hookOpts.length ? `, { ${hookOpts.join(", ")} }` : "";

  return `import { Tabs } from "@/components/framecn/tabs";
import { useTabsTransition } from "@/components/framecn/use-tabs-transition";

export const Scene = () => {
  const style = useTabsTransition([
    { at: 18, state: "Account", duration: 16 },
    { at: 58, state: "Password", duration: 18 },
    { at: 94, state: "Settings", duration: 12 },
  ]${optsStr});

  return <Tabs style={style}${extraProps} />;
};`;
};
