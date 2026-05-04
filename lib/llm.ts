/* eslint-disable no-inline-comments -- turbopackIgnore must annotate dynamic imports inline. */
import type { Node as PageTreeNode } from "fumadocs-core/page-tree";

import { ROUTES } from "@/constants/routes";
import { isComponentsFolder } from "@/lib/docs";
import { getAllPagesFromFolder, getPagesFromFolder } from "@/lib/page-tree";
import type { PageTreeFolder } from "@/lib/page-tree";
import { absoluteUrl } from "@/lib/utils";

interface DocsPageTree {
  children: PageTreeNode[];
}

const CODE_FENCE_REGEX = /```[\s\S]*?```/g;
const COMPONENT_PREVIEW_REGEX =
  /<ComponentPreview([^>]*)>[\s\S]*?<\/ComponentPreview>/g;
const DOCS_MARKDOWN_LINK_REGEX = /\]\((\/docs(?:\/[^)#\s]+)?)(#[^)]+)?\)/g;
const IMPORT_REGEX = /^import\s.+$/gm;
const JSX_WRAPPER_REGEX = /^<\/?[A-Z][^>]*>\s*$/gm;
const MANY_BLANK_LINES_REGEX = /\n{3,}/g;
const PROTECTED_CODE_FENCE_REGEX = /%%STARTERCN_CODE_FENCE_(\d+)%%/g;
const SELF_CLOSING_COMPONENTS_LIST_REGEX =
  /<ComponentsList(?:\s+folderName="([^"]+)")?\s*\/>/g;

const removeFrontmatter = (content: string) =>
  content.replace(/^---\n[\s\S]*?\n---\n?/, "");

const protectCodeFences = (content: string) => {
  const fences: string[] = [];
  const protectedContent = content.replaceAll(CODE_FENCE_REGEX, (match) => {
    const index = fences.push(match) - 1;
    return `%%STARTERCN_CODE_FENCE_${index}%%`;
  });

  return {
    content: protectedContent,
    restore: (value: string) =>
      value.replaceAll(
        PROTECTED_CODE_FENCE_REGEX,
        (_, index) => fences[Number(index)] ?? ""
      ),
  };
};

const docsMarkdownUrl = (url: string) =>
  absoluteUrl(
    url.startsWith(ROUTES.DOCS) && !url.endsWith(".md") ? `${url}.md` : url
  );

const normalizeDocsMarkdownLinks = (content: string) =>
  content.includes("](/docs")
    ? content.replaceAll(
        DOCS_MARKDOWN_LINK_REGEX,
        (_, pathname, hash = "") => `](${docsMarkdownUrl(pathname)}${hash})`
      )
    : content;

const componentListMarkdown = (
  pageTree: DocsPageTree,
  folderName = "Components"
) => {
  const folder = pageTree.children.find(
    (node): node is PageTreeFolder =>
      node.type === "folder" && node.name === folderName
  );

  if (!folder) {
    return "";
  }

  const pages = (
    isComponentsFolder(folder)
      ? getAllPagesFromFolder(folder)
      : getPagesFromFolder(folder)
  ).filter((page) => page.url !== ROUTES.DOCS_COMPONENTS);

  return pages
    .map((page) => `- [${page.name}](${docsMarkdownUrl(page.url)})`)
    .join("\n");
};

const componentSourceMarkdown = async (
  name: string,
  src?: string,
  title?: string
) => {
  const guessedPaths = src
    ? [src]
    : [
        `registry/new-york/${name}.tsx`,
        `components/${name}.tsx`,
        `components/ui/${name}.tsx`,
      ];

  const [{ readFile }, path] = await Promise.all([
    import(/* turbopackIgnore: true */ "node:fs/promises"),
    import(/* turbopackIgnore: true */ "node:path"),
  ]);

  for (const guessedPath of guessedPaths) {
    try {
      const code = await readFile(
        path.join(process.cwd(), guessedPath),
        "utf-8"
      );
      if (code) {
        const lang =
          title?.split(".").pop() ?? guessedPath.split(".").pop() ?? "tsx";
        return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
      }
    } catch {
      // Try the next source path.
    }
  }

  return "";
};

const previewAttrs = (attrs: string) => ({
  name: attrs.match(/\sname="([^"]+)"/)?.[1] ?? "",
  src: attrs.match(/\ssrc="([^"]+)"/)?.[1],
  title: attrs.match(/\stitle="([^"]+)"/)?.[1],
});

export const processMdxForLLMs = async (
  raw: string,
  pageTree: DocsPageTree
) => {
  const protectedFences = protectCodeFences(removeFrontmatter(raw));
  let content = protectedFences.content
    .replaceAll(IMPORT_REGEX, "")
    .replaceAll(SELF_CLOSING_COMPONENTS_LIST_REGEX, (_, folderName) =>
      componentListMarkdown(pageTree, folderName)
    );

  const previews = [...content.matchAll(COMPONENT_PREVIEW_REGEX)];
  if (previews.length > 0) {
    const replacements = await Promise.all(
      previews.map(async (preview) => {
        const { name, src, title } = previewAttrs(preview[1] ?? "");
        const sourceMarkdown =
          name || src ? await componentSourceMarkdown(name, src, title) : "";

        return { markdown: sourceMarkdown, preview: preview[0] };
      })
    );

    for (const { preview, markdown } of replacements) {
      content = content.replace(preview, markdown);
    }
  }

  const cleaned = content
    .replaceAll(JSX_WRAPPER_REGEX, "")
    .replaceAll(MANY_BLANK_LINES_REGEX, "\n\n")
    .trim();

  return protectedFences.restore(normalizeDocsMarkdownLinks(cleaned)).trim();
};
