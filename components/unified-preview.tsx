"use client";

import { ComponentPreview } from "@/components/component-preview";
import { HyperframesPreview } from "@/components/hyperframes-preview";
import registry from "@/registry/__index__";
import { getHyperframesEntry } from "@/registry/hyperframes-index";

export const UnifiedPreview = ({
  name,
  engine = "auto",
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  engine?: "auto" | "editframe" | "hyperframes";
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const resolvedEngine =
    engine === "auto"
      ? registry[name]
        ? "editframe"
        : getHyperframesEntry(name)
          ? "hyperframes"
          : "unknown"
      : engine;

  if (resolvedEngine === "hyperframes") {
    return (
      <HyperframesPreview
        name={name}
        hideCode={hideCode}
        className={className}
      />
    );
  }

  if (resolvedEngine === "editframe") {
    return (
      <ComponentPreview
        name={name}
        hideCode={hideCode}
        hideCustomizer={hideCustomizer}
        className={className}
      />
    );
  }

  return (
    <div className="not-prose mb-6 rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
      Unknown component: <code>{name}</code>
    </div>
  );
};
