import type { ComponentProps } from "react";

import { DocsTableOfContents } from "@/components/docs-toc";
import { DocsTocFooter } from "@/components/docs-toc-footer";

export const DocsSidebar = ({
  toc,
  filePath,
}: {
  toc: ComponentProps<typeof DocsTableOfContents>["toc"];
  filePath: string;
}) => (
  <aside className="sticky top-14 z-30 ml-auto hidden h-[calc(100svh-4rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
    <div className="h-8 shrink-0" />
    {toc.length > 0 && (
      <div className="no-scrollbar mx-8 overflow-y-auto border-b">
        <DocsTableOfContents toc={toc} />
      </div>
    )}
    <DocsTocFooter filePath={filePath} className="mx-8" />
  </aside>
);
