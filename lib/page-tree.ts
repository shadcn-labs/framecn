import type { Node as PageTreeNode } from "fumadocs-core/page-tree";

import type { BaseName } from "@/registry/bases";
import { DEFAULT_BASE_NAME } from "@/registry/bases";

export type PageTreeFolder = Extract<PageTreeNode, { type: "folder" }>;
export type PageTreePage = Extract<PageTreeNode, { type: "page" }>;

const matchesBase = (folder: PageTreeFolder, base: string): boolean =>
  folder.$id === base ||
  (typeof folder.name === "string" && folder.name.toLowerCase() === base);

const findBaseFolder = (
  folder: PageTreeFolder,
  base: string
): PageTreeFolder | undefined => {
  for (const child of folder.children) {
    if (child.type !== "folder") {
      continue;
    }
    if (matchesBase(child, base)) {
      return child;
    }
  }
};

export const getFoldersFromFolder = (
  folder: PageTreeFolder,
  base = DEFAULT_BASE_NAME
): PageTreeFolder[] => {
  const baseFolder = findBaseFolder(folder, base);
  if (!baseFolder) {
    return [];
  }

  return baseFolder.children.filter(
    (c): c is PageTreeFolder => c.type === "folder"
  );
};

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

export const getCurrentBase = (pathname: string): BaseName => {
  const match = pathname.match(/\/docs\/components\/([^/]+)\//);
  return match ? (match[1] as unknown as BaseName) : DEFAULT_BASE_NAME;
};
