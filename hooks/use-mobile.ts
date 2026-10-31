import { useMediaQuery } from "@/hooks/use-media-query";

export const useIsMobile = (mobileBreakpoint = 768) =>
  useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`);
