"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { HapticsSwitcher } from "@/components/haptics-switcher";
import { ModeSwitcher } from "@/components/mode-switcher";
import { SoundSwitcher } from "@/components/sound-switcher";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useHapticsToggle } from "@/hooks/use-haptic-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSoundToggle } from "@/hooks/use-sound-toggle";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

export const SiteSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarBoundary, setSidebarBoundary] = useState<HTMLElement | null>(
    null
  );
  const setTriggerRef = useCallback((node: HTMLButtonElement | null) => {
    setSidebarBoundary(
      node?.closest<HTMLElement>('[data-sidebar="sidebar"]') ?? null
    );
  }, []);

  // Hotkeys must stay mounted outside the popover content.
  useThemeToggle();
  useSoundToggle();
  useHapticsToggle();

  const trigger = (
    <Button
      ref={setTriggerRef}
      variant="ghost"
      size="icon"
      className="group/settings extend-touch-target size-8"
      aria-label="Settings"
    >
      <EllipsisVerticalIcon />
    </Button>
  );

  const content = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-12 text-sm">Theme</span>
          {!isMobile && <Kbd>D</Kbd>}
        </div>
        <ModeSwitcher />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-12 text-sm">Sound</span>
          {!isMobile && <Kbd>S</Kbd>}
        </div>
        <SoundSwitcher />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-12 text-sm">Haptics</span>
          {!isMobile && <Kbd>H</Kbd>}
        </div>
        <HapticsSwitcher />
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen} sounds>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
              <DrawerDescription>Manage site preferences</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">{content}</div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button size="sm">Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen} sounds>
          <PopoverTrigger render={trigger} />
          <PopoverContent
            align="end"
            collisionBoundary={sidebarBoundary ?? undefined}
            collisionPadding={8}
            className="w-56 p-2 data-closed:fade-out-0 data-closed:zoom-out-100 data-open:fade-in-0 data-open:zoom-in-100 dark:bg-black"
            initialFocus={false}
          >
            {content}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
