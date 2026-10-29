import { AlertTriangleIcon, CircleAlertIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type CalloutVariant = "default" | "warning" | "destructive";

type CalloutProps = React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode;
  variant?: CalloutVariant;
};

const ICONS: Record<CalloutVariant, React.ReactNode> = {
  default: <InfoIcon />,
  destructive: <CircleAlertIcon />,
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
  const Icon = icon || ICONS[variant];

  return (
    <Alert
      className={cn("mt-6 w-auto md:-mx-1 [&+&]:mt-3", className)}
      variant={variant}
      {...props}
    >
      {Icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
