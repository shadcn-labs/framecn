"use client";

import { ChevronDownIcon } from "lucide-react";
import { useCallback, useRef } from "react";

import {
  ChatGptIcon,
  ClaudeIcon,
  CursorIcon,
  GeminiIcon,
  GrokIcon,
  MarkdownDocIcon,
  PerplexityIcon,
  SciraIcon,
  V0Icon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CopyButton } from "./copy-button";

const getPromptUrl = (baseURL: string, url: string, param = "q") =>
  `${baseURL}?${param}=${encodeURIComponent(
    `I'm looking at this framecn documentation: ${url}.
Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.
`
  )}`;

const MENU_ITEMS: [string, (url: string) => React.ReactElement][] = [
  [
    "markdown",
    (url) => (
      <a href={`${url}.md`} rel="noopener noreferrer" target="_blank">
        <MarkdownDocIcon />
        View as Markdown
      </a>
    ),
  ],
  [
    "v0",
    (url) => (
      <a
        href={getPromptUrl("https://v0.dev", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <V0Icon />
        <span className="translate-x-[-2px]">Open in v0</span>
      </a>
    ),
  ],
  [
    "cursor",
    (url) => (
      <a
        href={getPromptUrl("https://cursor.com/link/prompt", url, "text")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <CursorIcon />
        Open in Cursor
      </a>
    ),
  ],
  [
    "chatgpt",
    (url) => (
      <a
        href={getPromptUrl("https://chatgpt.com", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ChatGptIcon />
        Open in ChatGPT
      </a>
    ),
  ],
  [
    "claude",
    (url) => (
      <a
        href={getPromptUrl("https://claude.ai/new", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ClaudeIcon />
        Open in Claude
      </a>
    ),
  ],
  [
    "perplexity",
    (url) => (
      <a
        href={getPromptUrl("https://perplexity.ai", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <PerplexityIcon />
        Open in Perplexity
      </a>
    ),
  ],
  [
    "gemini",
    (url) => (
      <a
        href={getPromptUrl("https://gemini.google.com/app", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <GeminiIcon />
        Open in Gemini
      </a>
    ),
  ],
  [
    "grok",
    (url) => (
      <a
        href={getPromptUrl("https://grok.com", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <GrokIcon />
        Open in Grok
      </a>
    ),
  ],
  [
    "scira",
    (url) => (
      <a
        className="m-0 p-0"
        href={getPromptUrl("https://scira.ai/", url)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <SciraIcon />
        Open in Scira AI
      </a>
    ),
  ],
];

export const DocsCopyPage = ({
  markdownUrl,
  url,
}: {
  markdownUrl: string;
  url: string;
}) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const copyValue = useCallback(async () => {
    const response = await fetch(markdownUrl);
    return response.text();
  }, [markdownUrl]);

  const trigger = (
    <Button
      variant="secondary"
      size="icon-sm"
      aria-label="More ways to use this page"
      // Two triggers (desktop menu, mobile popover) share this; pin the end cap.
      className="size-7 rounded-l-none! rounded-r-md! shadow-none"
    >
      <ChevronDownIcon className="rotate-180 sm:rotate-0" />
    </Button>
  );

  return (
    <Popover>
      {/* Same secondary fill as the share and prev/next buttons beside it. */}
      <ButtonGroup ref={groupRef} aria-label="Copy page actions">
        <CopyButton
          value={copyValue}
          showTooltip={false}
          variant="secondary"
          size="sm"
          className="h-7 shadow-none md:text-[0.8rem]"
        >
          Copy Page
        </CopyButton>
        <ButtonGroupSeparator className="bg-background" />
        <DropdownMenu>
          <DropdownMenuTrigger render={trigger} className="hidden sm:flex" />
          <DropdownMenuContent
            align="end"
            className="animate-none! [--menu-radius:var(--radius-lg)] shadow-none"
          >
            {MENU_ITEMS.map(([key, render]) => (
              <DropdownMenuItem key={key} render={render(url)} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <PopoverTrigger render={trigger} className="flex sm:hidden" />
        <PopoverContent
          anchor={groupRef}
          className="w-52 origin-center! [--copy-menu-radius:var(--radius-lg)] [--copy-menu-inset:calc(var(--spacing)+1px)] rounded-[var(--copy-menu-radius)] bg-background/70 p-1 shadow-none backdrop-blur-sm dark:bg-background/60"
          align="start"
        >
          {MENU_ITEMS.map(([key, render]) => (
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              render={render(url)}
              key={key}
              className="w-full justify-start rounded-[max(0px,calc(var(--copy-menu-radius)-var(--copy-menu-inset)))] text-base font-normal *:[svg]:text-muted-foreground"
            />
          ))}
        </PopoverContent>
      </ButtonGroup>
    </Popover>
  );
};
