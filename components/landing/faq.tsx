import { SectionHeading } from "@/components/landing/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE } from "@/constants/site";
import { PRO_COUNT } from "@/lib/catalog";
import { FaqJsonLd } from "@/seo/json-ld";

const FAQ = [
  {
    answer:
      "The caption components are free and open source under the MIT license. No account is needed to browse, customize, or install them. Every other component is part of framecn Pro, with a free live preview.",
    question: "Is framecn free?",
  },
  {
    answer:
      "A React project with Editframe set up. Components are built on @editframe/react and work alongside shadcn/ui.",
    question: "What do I need to use it?",
  },
  {
    answer: `Run npx shadcn@latest add ${SITE.REGISTRY}/<name> with the shadcn CLI, or pass the component's registry URL. The source is copied to components/framecn in your project, so you own and can edit every line.`,
    question: "How do I install a component?",
  },
  {
    answer:
      "Components are Editframe compositions with deterministic, frame-based timing, so the preview matches the output. Render them to MP4 locally with the Editframe CLI or in the Editframe cloud.",
    question: "How do I render a video?",
  },
  {
    answer: `Pro unlocks the source of all ${PRO_COUNT} Pro components — animated text, carousels, 3D globes, collages, charts, scroll animations, and full compositions — plus future Pro components. It is $179 a year, $249 once for lifetime access, or a one-time Team license for 2 to 25 seats sharing one API key ($499 for 10). The first 50 Annual and 50 Lifetime buyers pay the early-bird price of $149 a year or $199 once. Payments are handled by Dodo Payments.`,
    question: "What does Pro include, and what does it cost?",
  },
  {
    answer:
      "Yes. Free and Pro components can be used in personal and commercial work, including projects you build for clients.",
    question: "Can I use it in commercial and client projects?",
  },
  {
    answer:
      "Yes. Every component has a Copy prompt button with the install command and your customized props. The shadcn MCP server works with the framecn registry (see /docs/mcp), and the docs are available as /llms.txt and /llms-full.txt.",
    question: "Does it work with AI coding agents?",
  },
  {
    answer:
      "framecn is made by Shadcn Labs, an independent open-source org building on the shadcn/ui ecosystem. It is not endorsed by or affiliated with shadcn.",
    question: "Is framecn affiliated with shadcn?",
  },
];

export const Faq = () => (
  <section aria-labelledby="faq-title" className="container-page section-y">
    <FaqJsonLd items={FAQ} />
    <SectionHeading id="faq-title" title="FAQs" />
    <Accordion className="mx-auto mt-10 w-full max-w-3xl">
      {FAQ.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);
