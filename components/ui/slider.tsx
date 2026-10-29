"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import * as React from "react";

import { cn } from "@/lib/utils";

const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) => {
  const _values = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    }
    if (typeof value === "number") {
      return [value];
    }
    if (typeof defaultValue === "number") {
      return [defaultValue];
    }
    return [min, max];
  }, [value, defaultValue, min, max]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full",
        className
      )}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-full select-none bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            )}
          />
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              index={index}
              className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden has-[:focus-visible]:ring-4 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
};

export { Slider };
