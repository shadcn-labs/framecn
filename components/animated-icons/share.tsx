"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ShareIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ShareIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const arrowVariants: Variants = {
  animate: {
    transition: {
      damping: 10,
      mass: 1,
      stiffness: 220,
      type: "spring",
    },
    y: -2,
  },
  normal: { y: 0 },
};

export const ShareIcon = forwardRef<ShareIconHandle, ShareIconProps>(
  ({ className, onMouseEnter, onMouseLeave, size = 20, ...props }, ref) => {
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
          className="overflow-visible"
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
        >
          <motion.g animate={controls} variants={arrowVariants}>
            <path d="M12 2v13" />
            <path d="m16 6-4-4-4 4" />
          </motion.g>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        </svg>
      </div>
    );
  }
);

ShareIcon.displayName = "ShareIcon";
