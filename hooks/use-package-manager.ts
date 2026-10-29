import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { useMounted } from "@/hooks/use-mounted";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

const DEFAULT_PACKAGE_MANAGER: PackageManager = "pnpm";

const packageManagerAtom = atomWithStorage<PackageManager>(
  "package-manager",
  DEFAULT_PACKAGE_MANAGER
);

/**
 * The stored choice can load before a late-streamed Suspense boundary hydrates, so report the
 * SSR default until this component has mounted to keep hydration consistent.
 */
export const usePackageManager = () => {
  const [packageManager, setPackageManager] = useAtom(packageManagerAtom);
  const mounted = useMounted();
  return [
    mounted ? packageManager : DEFAULT_PACKAGE_MANAGER,
    setPackageManager,
  ] as const;
};
