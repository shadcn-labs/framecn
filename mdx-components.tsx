import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Callout } from "@/components/callout";
import { CodeBlockCommand } from "@/components/code-block-command";
import { CodeTabs } from "@/components/code-tabs";
import { ComponentPreview } from "@/components/component-preview";
import { ComponentSource } from "@/components/component-source";
import { CopyButton } from "@/components/copy-button";
import { getIconForLanguageExtension } from "@/components/icons";
import { Step, Steps } from "@/components/steps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger as AccordionTriggerBase,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Frame } from "@/components/ui/frame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const mdxComponents = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger: (
    props: React.ComponentProps<typeof AccordionTriggerBase>
  ) => <AccordionTriggerBase sound="click" {...props} />,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio,
  Button,
  Callout,
  CodeTabs,
  ComponentPreview,
  ComponentSource,
  FeatureCard: ({
    icon: Icon,
    title,
    description,
    className,
  }: React.ComponentProps<typeof Card> & {
    icon: LucideIcon;
    title: string;
    description: string;
  }) => (
    <Card
      className={cn(
        "flex flex-col gap-2 rounded-xl py-4 shadow-none",
        className
      )}
    >
      <CardHeader className="flex items-center gap-2 px-4">
        <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-md text-primary">
          <Icon className="size-4" />
        </div>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  ),
  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-md border", className)}
      src={src?.toString() || ""}
      width={Number(width)}
      height={Number(height)}
      alt={alt || ""}
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "bg-surface text-surface-foreground hover:bg-surface/80 flex w-full flex-col items-center rounded-xl p-6 transition-colors sm:p-10",
        className
      )}
      {...props}
    />
  ),

  Step,
  Steps,
  Tab: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={cn(className)} {...props} />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn("relative mt-6 w-full", className)} {...props} />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6",
        className
      )}
      {...props}
    />
  ),
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        "justify-start gap-4 bg-transparent px-0 [--tabs-radius:0px] [--tabs-padding:0px] [--tabs-border-width:0px]",
        className
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      sound="tabSwitch"
      className={cn(
        "text-muted-foreground data-active:text-foreground data-active:border-primary dark:data-active:border-primary hover:text-primary rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base data-active:bg-transparent data-active:shadow-none dark:data-active:bg-transparent",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, children, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  code: ({
    className,
    __raw__,
    __src__,
    __npm__,
    __yarn__,
    __pnpm__,
    __bun__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string;
    __src__?: string;
    __npm__?: string;
    __yarn__?: string;
    __pnpm__?: string;
    __bun__?: string;
  }) => {
    // Inline Code.
    if (typeof props.children === "string") {
      return (
        <code
          className={cn(
            "bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none",
            className
          )}
          {...props}
        />
      );
    }

    // npm command.
    const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__;
    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __npm__={__npm__}
          __yarn__={__yarn__}
          __pnpm__={__pnpm__}
          __bun__={__bun__}
        />
      );
    }

    // Default codeblock.
    return (
      <>
        {__raw__ && (
          <CopyButton
            className="bg-card top-[calc(var(--spacing)*3+3px)] opacity-70 hover:bg-muted hover:opacity-100 focus-visible:bg-muted focus-visible:opacity-100"
            value={__raw__}
            src={__src__}
            event="copy_usage_code"
            tooltip="Copy code"
          />
        )}
        <code {...props} />
      </>
    );
  },
  figcaption: ({
    className,
    children,
    ...props
  }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null;

    return (
      <figcaption
        className={cn(
          "[&_svg]:text-muted-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70",
          className
        )}
        {...props}
      >
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => (
    <figure className={cn(className)} {...props} />
  ),
  h1: ({ className, children, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn(
        "font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }: React.ComponentProps<"h2">) => (
    <h2
      id={children
        ?.toString()
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        .replaceAll("?", "")
        .toLowerCase()}
      className={cn(
        "[&+]*:[code]:text-xl mt-10 scroll-m-28 font-heading text-xl font-medium tracking-tight first:mt-0 lg:mt-12 [&+.steps]:mt-0! [&+.steps>h3]:mt-4! [&+h3]:mt-6! [&+p]:mt-4!",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-12 scroll-m-28 font-heading text-lg font-medium tracking-tight [&+p]:mt-4! *:[code]:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ className, children, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn(
        "font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ className, children, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ className, children, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h6>
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md", className)} alt={alt} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn("leading-relaxed [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  // Frame look: header row sits on the muted shell, body rows form one white card with row separators.
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <Frame className="no-scrollbar my-6 w-full overflow-x-auto">
      <table
        className={cn(
          "w-full border-separate border-spacing-0 text-sm",
          "[&_tbody_td]:bg-card [&_tbody_td]:border-t",
          "[&_tbody_td:first-child]:border-l [&_tbody_td:last-child]:border-r [&_tbody_tr:last-child_td]:border-b",
          "[&_tbody_tr:first-child_td:first-child]:rounded-tl-[var(--frame-inner-radius)] [&_tbody_tr:first-child_td:last-child]:rounded-tr-[var(--frame-inner-radius)]",
          "[&_tbody_tr:last-child_td:first-child]:rounded-bl-[var(--frame-inner-radius)] [&_tbody_tr:last-child_td:last-child]:rounded-br-[var(--frame-inner-radius)]",
          className
        )}
        {...props}
      />
    </Frame>
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "px-3 py-2 text-left whitespace-nowrap [[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "text-muted-foreground px-3 py-2 text-left text-sm font-medium [[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr className={cn("m-0", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
};
