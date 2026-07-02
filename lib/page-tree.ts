import type { Node as PageTreeNode } from "fumadocs-core/page-tree";

export type PageTreeFolder = Extract<PageTreeNode, { type: "folder" }>;
export type PageTreePage = Extract<PageTreeNode, { type: "page" }>;

export const getFoldersFromFolder = (
  folder: PageTreeFolder
): PageTreeFolder[] =>
  folder.children.filter(
    (child): child is PageTreeFolder => child.type === "folder"
  );

export const getCatalogSubfolder = (
  folder: PageTreeFolder,
  category: string
): PageTreeFolder | undefined =>
  getFoldersFromFolder(folder).find(
    (cat) =>
      cat.$id === category ||
      String(cat.$id ?? "").endsWith(`/${category}`) ||
      (typeof cat.name === "string" &&
        cat.name.toLowerCase() === category.toLowerCase())
  );

export const getPagesFromFolder = (
  folder: PageTreeFolder,
  includeRoot = true
): PageTreePage[] => {
  const pages = folder.children.filter(
    (child): child is PageTreePage => child.type === "page"
  );
  if (includeRoot) {
    return pages;
  }
  return pages.filter((page) => page.$id !== `${folder.$id}/index.mdx`);
};

export const getAllPagesFromFolder = (
  folder: PageTreeFolder
): PageTreePage[] => {
  const pages: PageTreePage[] = [];

  for (const child of folder.children) {
    if (child.type === "page") {
      pages.push(child);
    } else if (child.type === "folder") {
      pages.push(...getAllPagesFromFolder(child));
    }
  }

  return pages;
};
