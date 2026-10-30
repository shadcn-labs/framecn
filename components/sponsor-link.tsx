"use client";

import Link from "next/link";

import type { HeartHandshakeIconHandle } from "@/components/animated-icons/heart-handshake";
import { HeartHandshakeIcon } from "@/components/animated-icons/heart-handshake";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useIconAnimation } from "@/hooks/use-icon-animation";

export const SponsorLink = () => {
  const {
    iconRef: heartRef,
    onMouseEnter,
    onMouseLeave,
  } = useIconAnimation<HeartHandshakeIconHandle>();

  return (
    <Button
      nativeButton={false}
      render={<Link href={ROUTES.SPONSOR} />}
      size="sm"
      variant="ghost"
      className="max-sm:size-8"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <HeartHandshakeIcon className="text-pink-500" ref={heartRef} />
      <span className="max-sm:sr-only">Sponsor</span>
    </Button>
  );
};
