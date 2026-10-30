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
  AccordionTrigger,
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
  AccordionTrigger,
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
  Link,
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "not-typeset bg-surface text-surface-foreground hover:bg-surface/80 flex w-full flex-col items-center rounded-xl p-6 transition-colors sm:p-10",
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
      className={cn(
        "text-muted-foreground data-active:text-foreground data-active:border-primary dark:data-active:border-primary hover:text-primary rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base data-active:bg-transparent data-active:shadow-none dark:data-active:bg-transparent",
        className
      )}
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
    // Inline code: Typeset styles it.
    if (typeof props.children === "string") {
      return <code className={className} {...props} />;
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
  // Code blocks keep their own chrome; Typeset styles everything else in the flow.
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => (
    <figure
      className={cn(
        "data-rehype-pretty-code-figure" in props && "not-typeset",
        className
      )}
      {...props}
    />
  ),
  // Typeset sizes headings; h2 only adds the anchor id the TOC links to.
  h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
    <h2
      id={children
        ?.toString()
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        .replaceAll("?", "")
        .toLowerCase()}
      {...props}
    >
      {children}
    </h2>
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
  // Tables keep the Frame look; Frame carries data-slot, so Typeset leaves it alone.
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
};
