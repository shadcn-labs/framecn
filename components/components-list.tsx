import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { isComponentsFolder } from "@/lib/docs";
import type { PageTreeFolder, PageTreePage } from "@/lib/page-tree";
import {
  getAllPagesFromFolder,
  getFoldersFromFolder,
  getPagesFromFolder,
} from "@/lib/page-tree";
import { source } from "@/lib/source";

const getFolder = (name: string): PageTreeFolder | undefined => {
  for (const node of source.pageTree.children) {
    if (node.type === "folder" && node.name === name) {
      return node;
    }
  }
};

const ComponentGrid = ({ pages }: { pages: PageTreePage[] }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
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

export const ComponentsList = ({
  folderName = "Components",
  category,
}: {
  folderName?: string;
  category?: string;
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
    return <ComponentGrid pages={pages} />;
  }

  const categoryFolders = getFoldersFromFolder(folder);

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
    return <ComponentGrid pages={getPagesFromFolder(match, false)} />;
  }

  const pages = getAllPagesFromFolder(folder).filter(
    (page) => page.url !== ROUTES.DOCS_COMPONENTS
  );
  if (pages.length === 0) {
    return null;
  }

  return <ComponentGrid pages={pages} />;
};
