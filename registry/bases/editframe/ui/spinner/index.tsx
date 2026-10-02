"use client";

import {
  FramecnIcon,
  useCurrentFrame,
  useFramecnTheme,
} from "@/lib/framecn-ui";

export interface SpinnerProps {
  size?: number;
  color?: string;
  speed?: number;
  strokeWidth?: number;
  className?: string;
}

export const Spinner = ({
  size = 16,
  color,
  speed = 1,
  strokeWidth = 2,
  className,
}: SpinnerProps) => {
  const rotation = useCurrentFrame() * speed * 6;
  const theme = useFramecnTheme();
  return (
    <span role="status" aria-label="Loading" style={{ display: "inline-flex" }}>
      <FramecnIcon
        name="LoaderCircle"
        className={className}
        size={size}
        color={color ?? theme.foreground}
        style={{ strokeWidth, transform: `rotate(${rotation}deg)` }}
      />
    </span>
  );
};
