"use client";

import { CopyIcon, DownloadIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  LogoMark,
  LogoType,
  getLogoMarkSVG,
  getLogoTypeSVG,
} from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Frame, FrameContent, FrameFooter } from "@/components/ui/frame";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const ASSETS = {
  logomark: {
    Preview: () => <LogoMark className="size-16" />,
    download: "https://shadcn-labs.com/shadcn-labs-logomark.svg",
    getSVG: getLogoMarkSVG,
    label: "Logomark",
  },
  logotype: {
    Preview: () => <LogoType className="h-6" />,
    download: "https://shadcn-labs.com/shadcn-labs-logotype.svg",
    getSVG: getLogoTypeSVG,
    label: "Logotype",
  },
} as const;

export const BrandAssetCard = ({ asset }: { asset: keyof typeof ASSETS }) => {
  const { Preview, download, getSVG, label } = ASSETS[asset];
  const { resolvedTheme } = useTheme();
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = async () => {
    const copied = await copyToClipboard(
      getSVG(resolvedTheme === "light" ? "#000" : "#fff")
    );
    if (copied) {
      toast.success(`${label} as SVG copied`);
    }
  };

  return (
    <Frame>
      <FrameContent className="flex h-40 items-center justify-center">
        <Preview />
      </FrameContent>
      <FrameFooter className="justify-between py-1.5">
        <p className="text-foreground text-sm font-medium">{label}</p>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            <CopyIcon />
            Copy SVG
          </Button>
          <Button
            nativeButton={false}
            render={
              <a
                href={download}
                aria-label={`Download ${label}`}
                download
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            size="sm"
            variant="outline"
          >
            <DownloadIcon />
            Download
          </Button>
        </div>
      </FrameFooter>
    </Frame>
  );
};
