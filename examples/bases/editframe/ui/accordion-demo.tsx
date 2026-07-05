"use client";

import { Accordion } from "@/registry/bases/editframe/ui/accordion";
import { useAccordionTransition } from "@/registry/bases/editframe/ui/accordion/use-accordion-transition";

export const accordionDemoControls = ["title", "content", "variant"] as const;

export interface AccordionDemoProps {
  title?: string;
  content?: string;
  variant?: "default" | "ghost";
}

export const AccordionDemoScene = (p: AccordionDemoProps = {}) => {
  const style = useAccordionTransition(
    [
      { at: 18, duration: 16, state: "opened" },
      { at: 78, duration: 12, state: "closed" },
    ],
    { variant: p.variant }
  );
  return (
    <Accordion
      title={p.title ?? "Is it accessible?"}
      content={p.content ?? "Yes. It adheres to the WAI-ARIA design pattern."}
      variant={p.variant ?? "default"}
      style={style}
    />
  );
};

export const accordionDemoCode = (
  values: Record<string, unknown> = {}
): string => {
  const title = values.title as string | undefined;
  const content = values.content as string | undefined;
  const variant = values.variant as string | undefined;

  const props: string[] = [];
  if (title !== undefined && title !== "Is it accessible?") {
    props.push(`title="${title}"`);
  }
  if (
    content !== undefined &&
    content !== "Yes. It adheres to the WAI-ARIA design pattern."
  ) {
    props.push(`content="${content}"`);
  }
  if (variant !== undefined && variant !== "default") {
    props.push(`variant="${variant}"`);
  }

  const propsStr = props.length
    ? `\n      ${props.join("\n      ")}\n    `
    : "";

  const hookOpts: string[] = [];
  if (variant !== undefined && variant !== "default") {
    hookOpts.push(`variant: "${variant}"`);
  }
  const optsStr = hookOpts.length ? `, { ${hookOpts.join(", ")} }` : "";

  return `import { Accordion } from "@/components/framecn/accordion";
import { useAccordionTransition } from "@/components/framecn/use-accordion-transition";

export const Scene = () => {
  const style = useAccordionTransition([
    { at: 18, state: "opened", duration: 16 },
    { at: 78, state: "closed", duration: 12 },
  ]${optsStr});

  return (
    <Accordion${propsStr === "" ? " " : propsStr}style={style} />
  );
};`;
};
