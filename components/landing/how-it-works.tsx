import { CopyButton } from "@/components/copy-button";
import { SectionHeading } from "@/components/landing/section-heading";
import { SITE } from "@/constants/site";
import { highlightCode } from "@/lib/highlight-code";

const STEPS = [
  {
    code: `npx shadcn@latest add ${SITE.REGISTRY}/caption-highlight`,
    description:
      "Add any component from the registry. The source lands in components/framecn, so you own every line.",
    file: "Terminal",
    language: "bash",
    title: "Install with the shadcn CLI",
  },
  {
    code: `import { CaptionHighlight } from "@/components/framecn/caption-highlight";

export function Subtitles() {
  return <CaptionHighlight highlightColor="#f06292" wordsPerGroup={4} />;
}`,
    description:
      "Tune words, timing, and color live in the browser. Copy prompt hands your AI agent the install command and your exact props.",
    file: "subtitles.tsx",
    language: "tsx",
    title: "Customize props live",
  },
  {
    code: "npx @editframe/cli render -o intro.mp4",
    description:
      "Components run on the Editframe timeline, so the preview and the rendered frames match exactly.",
    file: "Terminal",
    language: "bash",
    title: "Render to MP4 with Editframe",
  },
];

export const HowItWorks = async () => {
  const highlighted = await Promise.all(
    STEPS.map((step) =>
      highlightCode(step.code, step.language, { lineNumbers: false })
    )
  );

  return (
    <section
      aria-labelledby="how-title"
      className="container-page pt-16 md:pt-24"
    >
      <SectionHeading id="how-title" title="How it works" />
      {/* Subgrid rows keep step numbers, titles, descriptions and code frames aligned across columns. */}
      <ol className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex min-w-0 flex-col lg:row-span-4 lg:grid lg:grid-rows-subgrid"
          >
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="heading-subtitle mt-2">{step.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {step.description}
            </p>
            <figure
              data-rehype-pretty-code-figure=""
              className="mx-0 mt-5 flex flex-col md:mx-0 [&>div]:flex-1 [&>div>pre]:h-full"
            >
              <figcaption
                data-rehype-pretty-code-title=""
                className="flex items-center justify-between gap-2 pr-2"
              >
                <span className="truncate font-normal">{step.file}</span>
                <CopyButton
                  value={step.code}
                  tooltip="Copy code"
                  className="text-muted-foreground static size-7 bg-transparent opacity-70 hover:bg-muted hover:opacity-100 focus-visible:bg-muted focus-visible:opacity-100"
                />
              </figcaption>
              <div dangerouslySetInnerHTML={{ __html: highlighted[index] }} />
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
};
