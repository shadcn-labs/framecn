import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** The one Pro marker: thin brand pill used in the sidebar, cards and panel. */
export const ProBadge = ({ className }: { className?: string }) => (
  <Badge
    variant="brand"
    className={cn("h-4 rounded px-1.5 py-0 text-[10px] font-medium", className)}
  >
    Pro
  </Badge>
);
