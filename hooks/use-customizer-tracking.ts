import { useCallback, useEffect, useRef } from "react";

import type { QueryStatesSetter } from "@/hooks/use-customizer";
import { trackEvent } from "@/lib/events";

export const useCustomizerTracking = (
  componentName: string,
  setValues: QueryStatesSetter
) => {
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  return useCallback(
    (key: string, value: unknown) => {
      void setValues({ [key]: value } as Partial<Record<string, unknown>>);
      const existing = timersRef.current.get(key);
      if (existing) {
        clearTimeout(existing);
      }
      timersRef.current.set(
        key,
        setTimeout(() => {
          trackEvent({
            name: "component_customized",
            properties: { component: componentName, prop: key },
          });
          timersRef.current.delete(key);
        }, 500)
      );
    },
    [componentName, setValues]
  );
};
