import { useMounted } from "@/hooks/use-mounted";

export const useIsMac = () => {
  const mounted = useMounted();
  return !mounted || navigator.platform.toUpperCase().includes("MAC");
};
