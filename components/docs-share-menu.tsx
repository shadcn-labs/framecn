"use client";

import { EllipsisIcon, LinkIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import type { ShareIconHandle } from "@/components/animated-icons/share";
import { ShareIcon } from "@/components/animated-icons/share";
import { XIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useIconAnimation } from "@/hooks/use-icon-animation";

export const DocsShareMenu = ({
  title,
  url,
}: {
  title: string;
  url: string;
}) => {
  const {
    iconRef: shareIconRef,
    onMouseEnter,
    onMouseLeave,
  } = useIconAnimation<ShareIconHandle>();
  const { copyToClipboard } = useCopyToClipboard();

  const absoluteUrl = useMemo(() => {
    if (url.startsWith("http")) {
      return url;
    }
    if (typeof window !== "undefined") {
      return new URL(url, window.location.origin).toString();
    }
    return url;
  }, [url]);

  const urlEncoded = encodeURIComponent(absoluteUrl);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="hidden sm:flex size-7 border-none active:scale-none"
            variant="secondary"
            size="icon-sm"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        }
      >
        <ShareIcon ref={shareIconRef} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-fit"
        alignOffset={-6}
        collisionPadding={8}
        finalFocus={false}
      >
        <DropdownMenuItem
          data-sound="copy"
          onClick={() => {
            copyToClipboard(absoluteUrl);
            toast.success("Link copied");
          }}
        >
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <a
              href={`https://x.com/intent/tweet?url=${urlEncoded}`}
              target="_blank"
              rel="noopener"
            />
          }
        >
          <XIcon />
          Share on X
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <a
              href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
              target="_blank"
              rel="noopener"
            />
          }
        >
          <LinkedInIcon />
          Share on LinkedIn
        </DropdownMenuItem>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              navigator.share({ title, url: absoluteUrl });
            }}
          >
            <EllipsisIcon />
            Other app
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
