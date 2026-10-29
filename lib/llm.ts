/* eslint-disable no-inline-comments -- turbopackIgnore must annotate dynamic imports inline. */
import { ROUTES } from "@/constants/routes";
import { CATALOG } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/utils";

const CODE_FENCE_REGEX = /```[\s\S]*?```/g;
const COMPONENT_PREVIEW_REGEX =
  /<ComponentPreview([^>]*)>[\s\S]*?<\/ComponentPreview>/g;
const DOCS_MARKDOWN_LINK_REGEX = /\]\((\/docs(?:\/[^)#\s]+)?)(#[^)]+)?\)/g;
const IMPORT_REGEX = /^import\s.+$/gm;
const JSX_WRAPPER_REGEX = /^<\/?[A-Z][^>]*>\s*$/gm;
const MANY_BLANK_LINES_REGEX = /\n{3,}/g;
const PROTECTED_CODE_FENCE_REGEX = /%%STARTERCN_CODE_FENCE_(\d+)%%/g;

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

export const componentSourceMarkdown = async (
  name: string,
  src?: string,
  title?: string
) => {
  const item = CATALOG.find(
    (entry) =>
      entry.id === name ||
      src === `registry/bases/editframe/components/${entry.id}/index.tsx`
  );

  if (!item || item.pro) {
    return "";
  }

  const sourcePath = `registry/bases/editframe/components/${item.id}/index.tsx`;

  const [{ readFile }, path] = await Promise.all([
    import(/* turbopackIgnore: true */ "node:fs/promises"),
    import(/* turbopackIgnore: true */ "node:path"),
  ]);

  try {
    const code = await readFile(path.join(process.cwd(), sourcePath), "utf-8");
    const lang = title?.split(".").pop() ?? "tsx";
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
  } catch {
    return "";
  }
};

const previewAttrs = (attrs: string) => ({
  name: attrs.match(/\sname="([^"]+)"/)?.[1] ?? "",
  src: attrs.match(/\ssrc="([^"]+)"/)?.[1],
  title: attrs.match(/\stitle="([^"]+)"/)?.[1],
});

export const processMdxForLLMs = async (raw: string) => {
  const protectedFences = protectCodeFences(removeFrontmatter(raw));
  let content = protectedFences.content.replaceAll(IMPORT_REGEX, "");

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
