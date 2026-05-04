"use client";

import { useCallback, useRef } from "react";

import type { HeartHandshakeIconHandle } from "@/components/animated-icons/heart-handshake";
import { HeartHandshakeIcon } from "@/components/animated-icons/heart-handshake";
import { Button } from "@/components/ui/button";
import { LINK } from "@/constants/links";

export const SponsorLink = () => {
  const heartRef = useRef<HeartHandshakeIconHandle>(null);

  const handleMouseEnter = useCallback(() => {
    heartRef.current?.startAnimation();
  }, []);

  const handleMouseLeave = useCallback(() => {
    heartRef.current?.stopAnimation();
  }, []);

  return (
    <Button
      asChild
      size="sm"
      variant="ghost"
      sound="heart"
      className="max-sm:size-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href={LINK.SPONSOR} target="_blank" rel="noopener noreferrer">
        <HeartHandshakeIcon className="text-pink-500" ref={heartRef} />
        <span className="max-sm:sr-only">Sponsor</span>
      </a>
    </Button>
  );
};
