import { AlertTriangleIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type CalloutVariant = "default" | "warning";

type CalloutProps = React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode;
  variant?: CalloutVariant;
};

const ICONS: Record<CalloutVariant, React.ReactNode> = {
  default: <InfoIcon />,
  warning: <AlertTriangleIcon />,
};

export const Callout = ({
  title,
  children,
  icon,
  className,
  variant = "default",
  ...props
}: CalloutProps) => {
  const Icon = icon || ICONS[variant as keyof typeof ICONS];

  return (
    <Alert
      className={cn(
        "bg-surface text-surface-foreground mt-6 w-auto border-none md:-mx-1",
        className
      )}
      variant={variant}
      {...props}
    >
      {Icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  );
};
