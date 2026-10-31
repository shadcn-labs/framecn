"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useId } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { useSoundEnabled } from "@/hooks/use-sound-toggle";
import { cn } from "@/lib/utils";

const SOUND_OPTIONS = [
  { icon: Volume2, label: "on", value: true },
  { icon: VolumeX, label: "off", value: false },
] as const;

export const SoundSwitcher = () => {
  const groupName = useId();
  const [value, setValue] = useSoundEnabled();
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className="flex h-8 w-20" />;
  }

  return (
    <div
      className="inline-flex items-center rounded-full bg-background inset-ring-1 inset-ring-border"
      role="radiogroup"
      aria-label="Sound"
    >
      {SOUND_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <label
            key={option.label}
            data-active={isActive}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color,box-shadow] hover:text-foreground data-[active=true]:text-foreground data-[active=true]:inset-ring-1 data-[active=true]:inset-ring-border [&_svg]:size-4"
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={option.label}
              checked={isActive}
              aria-label={`Switch sound ${option.label}`}
              onChange={() => setValue(option.value)}
              className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <Icon aria-hidden="true" />
          </label>
        );
      })}
    </div>
  );
};
