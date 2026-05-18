"use client";

import { EditframePreview } from "@/components/editframe-preview";
import { HyperframesPreview } from "@/components/hyperframes-preview";
import type { BaseName } from "@/registry/bases";

export const ComponentPreview = ({
  name,
  base = "editframe",
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  base?: BaseName;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  if (base === "hyperframes") {
    return (
      <HyperframesPreview
        name={name}
        hideCode={hideCode}
        className={className}
      />
    );
  }

  return (
    <EditframePreview
      name={name}
      hideCode={hideCode}
      hideCustomizer={hideCustomizer}
      className={className}
    />
  );
};
