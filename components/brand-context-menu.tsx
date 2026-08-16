"use client";

import { DownloadIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  LogoMark,
  LogoType,
  getLogoMarkSVG,
  getLogoTypeSVG,
} from "@/components/logo";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export const BrandContextMenu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { resolvedTheme } = useTheme();
  const { copyToClipboard } = useCopyToClipboard();

  const logoColor = resolvedTheme === "light" ? "#000" : "#fff";

  const logoMarkSvgString = useMemo(
    () => getLogoMarkSVG(logoColor),
    [logoColor]
  );
  const logoTypeSvgString = useMemo(
    () => getLogoTypeSVG(logoColor),
    [logoColor]
  );

  const handleCopy = useCallback(
    (svg: string, message: string) => {
      copyToClipboard(svg);
      toast.success(message);
    },
    [copyToClipboard]
  );

  const handleDownload = useCallback((svg: string, fileName: string) => {
    const blob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${fileName} downloaded`);
  }, []);

  return (
    <ContextMenu sounds>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          sound="copy"
          onClick={() => handleCopy(logoMarkSvgString, "Icon as SVG copied")}
        >
          <LogoMark className="mr-2 size-4 shrink-0" />
          Copy icon as SVG
        </ContextMenuItem>

        <ContextMenuItem
          sound="copy"
          onClick={() =>
            handleCopy(logoTypeSvgString, "Wordmark as SVG copied")
          }
        >
          <LogoType className="mr-2 h-4 w-auto shrink-0" />
          Copy wordmark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          sound="click"
          onClick={() => handleDownload(logoMarkSvgString, "icon.svg")}
        >
          <DownloadIcon className="mr-2 size-4" /> Download icon as SVG
        </ContextMenuItem>

        <ContextMenuItem
          sound="click"
          onClick={() => handleDownload(logoTypeSvgString, "wordmark.svg")}
        >
          <DownloadIcon className="mr-2 size-4" /> Download wordmark as SVG
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
