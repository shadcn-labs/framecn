import type { ComponentConfig } from "@/lib/customizer-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegistryComponent = React.ComponentType<any>;

export interface RegistryEntry {
  Component: RegistryComponent;
  config?: ComponentConfig;
}
