"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ArrowRightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ArrowRightIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const shaftVariants: Variants = {
  animate: {
    d: ["M5 12h14", "M5 12h9", "M5 12h14"],
    transition: { duration: 0.36 },
  },
  normal: { d: "M5 12h14" },
};

const headVariants: Variants = {
  animate: {
    d: "m12 5 7 7-7 7",
    transition: { duration: 0.36 },
    translateX: [0, -3, 0],
  },
  normal: { d: "m12 5 7 7-7 7", translateX: 0 },
};

export const ArrowRightIcon = forwardRef<
  ArrowRightIconHandle,
  ArrowRightIconProps
>(({ className, onMouseEnter, onMouseLeave, size = 18, ...props }, ref) => {
  const controls = useAnimation();
  const controlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    controlledRef.current = true;
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (controlledRef.current) {
        onMouseEnter?.(event);
        return;
      }

      void controls.start("animate");
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (controlledRef.current) {
        onMouseLeave?.(event);
        return;
      }

      void controls.start("normal");
    },
    [controls, onMouseLeave]
  );

  return (
    <div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
      >
        <motion.path animate={controls} d="M5 12h14" variants={shaftVariants} />
        <motion.path
          animate={controls}
          d="m12 5 7 7-7 7"
          variants={headVariants}
        />
      </svg>
    </div>
  );
});

ArrowRightIcon.displayName = "ArrowRightIcon";
