"use client";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface ExternalLinkButtonProps extends ButtonProps {
  href: string;
}

export const ExternalLinkButton = ({
  href,
  children,
  ...props
}: ExternalLinkButtonProps) => (
  <Button
    sound="click"
    nativeButton={false}
    render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    {...props}
  >
    {children}
  </Button>
);
