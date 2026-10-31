import { useId, useMemo } from "react";

export const usePreviewId = (name: string): string => {
  const reactId = useId();
  return useMemo(() => {
    const safeName = name.replaceAll(/[^a-zA-Z0-9_-]/gu, "-");
    const safeId = reactId.replaceAll(/[^a-zA-Z0-9_-]/gu, "");
    return `component-preview-${safeName}-${safeId}`;
  }, [name, reactId]);
};
