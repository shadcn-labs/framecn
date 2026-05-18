import Link from "next/link";

import { isComponentsFolder } from "@/lib/docs";
import type { PageTreeFolder, PageTreePage } from "@/lib/page-tree";
import { getFoldersFromFolder, getPagesFromFolder } from "@/lib/page-tree";
import { source } from "@/lib/source";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";
import { DEFAULT_BASE_NAME } from "@/registry/bases";

const getFolder = (name: string): PageTreeFolder | undefined => {
  for (const node of source.pageTree.children) {
    if (node.type === "folder" && node.name === name) {
      return node;
    }
  }
};

const ComponentGrid = ({
  pages,
  className,
}: {
  pages: PageTreePage[];
  className?: string;
}) => (
  <div
    className={cn(
      "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20",
      className
    )}
  >
    {pages.map((component) => (
      <Link
        className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
        href={component.url}
        key={component.$id}
        transitionTypes={["nav-forward"]}
      >
        {component.name}
      </Link>
    ))}
  </div>
);

const CategoryGrid = ({
  className,
  categories,
}: {
  className?: string;
  categories: PageTreeFolder[];
}) => (
  <div className={cn("flex flex-col gap-10", className)}>
    {categories.map((cat) => {
      const pages = getPagesFromFolder(cat, false);
      if (pages.length === 0) {
        return null;
      }

      return (
        <div key={cat.$id}>
          <h3 className="font-heading mb-4 text-lg font-medium tracking-tight">
            {cat.name}
          </h3>
          <ComponentGrid pages={pages} />
        </div>
      );
    })}
  </div>
);

export const ComponentsList = ({
  base = DEFAULT_BASE_NAME,
  folderName = "Components",
  category,
  className,
}: {
  base?: BaseName;
  folderName?: string;
  category?: string;
  className?: string;
}) => {
  const folder = getFolder(folderName);
  if (!folder) {
    return null;
  }

  if (!isComponentsFolder(folder)) {
    const pages = getPagesFromFolder(folder, false);
    if (pages.length === 0) {
      return null;
    }
    return <ComponentGrid className={className} pages={pages} />;
  }

  const categoryFolders = getFoldersFromFolder(folder, base);

  if (category) {
    const match = categoryFolders.find(
      (cat) =>
        cat.$id === category ||
        String(cat.$id ?? "").endsWith(`/${category}`) ||
        (typeof cat.name === "string" &&
          cat.name.toLowerCase() === category.toLowerCase())
    );
    if (!match) {
      return null;
    }
    return (
      <ComponentGrid
        className={className}
        pages={getPagesFromFolder(match, false)}
      />
    );
  }

  if (categoryFolders.length === 0) {
    return null;
  }

  return <CategoryGrid className={className} categories={categoryFolders} />;
};
