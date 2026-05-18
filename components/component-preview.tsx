"use client";

import { EditframePreview } from "@/components/editframe-preview";
import type { BaseName } from "@/registry/bases";

export const ComponentPreview = ({
  name,
  // base = "editframe",
  hideCode = false,
  hideCustomizer = false,
  className,
}: {
  name: string;
  base?: BaseName;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => (
  <EditframePreview
    name={name}
    hideCode={hideCode}
    hideCustomizer={hideCustomizer}
    className={className}
  />
);
