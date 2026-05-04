import type { ReactNode } from "react";

import { ComponentSource } from "@/components/component-source";

export const ComponentPreview = ({
  name,
  src,
  title,
  children,
}: {
  name?: string;
  src?: string;
  title?: string;
  children?: ReactNode;
}) => (
  <>
    {children}
    <ComponentSource name={name} src={src} title={title} />
  </>
);
