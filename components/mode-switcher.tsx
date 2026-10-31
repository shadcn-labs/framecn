"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useId } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { icon: MonitorIcon, value: "system" },
  { icon: SunIcon, value: "light" },
  { icon: MoonIcon, value: "dark" },
] as const;

const ModeSwitcher = () => {
  const groupName = useId();
  const { theme, setTheme } = useTheme();
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <div
      className="inline-flex items-center rounded-full bg-background inset-ring-1 inset-ring-border"
      role="radiogroup"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <label
            key={option.value}
            data-active={isActive}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color,box-shadow] hover:text-foreground data-[active=true]:text-foreground data-[active=true]:inset-ring-1 data-[active=true]:inset-ring-border [&_svg]:size-4"
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={isActive}
              aria-label={`Switch to ${option.value} theme`}
              onChange={() => setTheme(option.value)}
              className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <Icon aria-hidden="true" />
          </label>
        );
      })}
    </div>
  );
};

export { ModeSwitcher };
