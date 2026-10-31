import Link from "next/link";

import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { CopyButton } from "@/components/copy-button";
import { getIconForLanguageExtension } from "@/components/icons";
import { getProAccess } from "@/lib/auth";
import { CATALOG } from "@/lib/catalog";
import { highlightCode } from "@/lib/highlight-code";
import { getProComponentSource, ProRegistryError } from "@/lib/pro-registry";
import { readFileFromRoot } from "@/lib/read-file";
import { cn } from "@/lib/utils";

const ComponentCode = ({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string;
  highlightedCode: React.ReactNode;
  language: string;
  title: string | undefined;
}) => (
  <figure
    data-rehype-pretty-code-figure=""
    className="not-typeset mx-0! [&>pre]:max-h-96"
  >
    {title ? (
      <figcaption
        className="flex items-center gap-2 font-normal [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
        data-language={language}
        data-rehype-pretty-code-title=""
      >
        {getIconForLanguageExtension(language)}
        <span className="truncate font-normal">{title}</span>
      </figcaption>
    ) : null}
    <CopyButton
      className={cn(
        title &&
          "text-muted-foreground right-2.5 bg-transparent opacity-70 hover:bg-muted hover:opacity-100 focus-visible:bg-muted focus-visible:opacity-100"
      )}
      event="copy_primitive_code"
      tooltip="Copy code"
      value={code}
    />
    <div>{highlightedCode}</div>
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
  const catalogItem = CATALOG.find((item) =>
    src
      ? src === `registry/bases/editframe/components/${item.id}/index.tsx`
      : item.id === name
  );
  if (!catalogItem) {
    return null;
  }
  if (catalogItem?.pro && !(await getProAccess())) {
    return (
      <p className="rounded-lg border p-4 text-sm">
        This source is included with framecn Pro.{" "}
        <Link href="/pricing" className="underline underline-offset-4">
          Unlock {catalogItem.name} →
        </Link>
      </p>
    );
  }
  let code: string;
  try {
    code = catalogItem.pro
      ? await getProComponentSource(catalogItem.id)
      : await readFileFromRoot(
          `registry/bases/editframe/components/${catalogItem.id}/index.tsx`
        );
  } catch (error) {
    if (error instanceof ProRegistryError) {
      return <p className="rounded-lg border p-4 text-sm">{error.message}</p>;
    }
    throw error;
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
