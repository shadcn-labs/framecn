import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { highlightCode } from "@/lib/highlight-code";
import { readFileFromRoot } from "@/lib/read-file";
import { cn } from "@/lib/utils";

import { CopyButton } from "./copy-button";
import { getIconForLanguageExtension } from "./icons";

const ComponentCode = ({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string;
  highlightedCode: string;
  language: string;
  title: string | undefined;
}) => (
  <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
    {title ? (
      <figcaption
        className="text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
        data-language={language}
        data-rehype-pretty-code-title=""
      >
        {getIconForLanguageExtension(language)}
        {title}
      </figcaption>
    ) : null}
    <CopyButton event="copy_primitive_code" value={code} />
    <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  </figure>
);

export const ComponentSource = async ({
  name,
  src,
  title,
  collapsible = true,
  className,
  language,
}: {
  name?: string;
  src?: string;
  title?: string;
  collapsible?: boolean;
  className?: string;
  language?: string;
}) => {
  let code: string | null = null;

  if (src) {
    code = await readFileFromRoot(src);
  } else if (name) {
    const guessedPaths = [
      `registry/new-york/${name}.tsx`,
      `components/${name}.tsx`,
      `components/ui/${name}.tsx`,
    ];

    for (const guessedPath of guessedPaths) {
      try {
        code = await readFileFromRoot(guessedPath);
        if (code) {
          break;
        }
      } catch {
        // Try next path.
      }
    }
  }

  if (!code) {
    return null;
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx";
  const highlightedCode = await highlightCode(code, lang);

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    );
  }

  return (
    <CodeCollapsibleWrapper
      className={className}
      navTriggerClassName={cn(!title && "top-3")}
    >
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
  );
};
