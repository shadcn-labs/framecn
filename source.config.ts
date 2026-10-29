import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { rehypePrettyCode } from "rehype-pretty-code";

import { COMPONENT_DOCS_DIR, DOCS_DIR } from "@/lib/docs";
import { transformers } from "@/lib/highlight-code";

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ]);

      return plugins;
    },
  },
});

export const docs = defineDocs({
  dir: DOCS_DIR,
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const componentDocs = defineDocs({
  dir: COMPONENT_DOCS_DIR,
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});
