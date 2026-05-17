import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllHyperframesEntries,
  getHyperframesCategories,
} from "@/registry/hyperframes-index";

const categoryLabels: Record<string, string> = {
  charts: "Charts & Data Viz",
  code: "Code & Terminal",
  cursor: "Cursor & Interaction",
  layouts: "Layouts & Grids",
  marketing: "Marketing & Landing",
  media: "Media & Image",
  overlays: "Overlays & Effects",
  text: "Text Effects",
  transitions: "Transitions & Wipes",
  ui: "UI Components",
};

export default function HyperframesPage() {
  const entries = getAllHyperframesEntries();
  const categories = getHyperframesCategories();

  const grouped = categories.map((cat) => ({
    category: cat,
    entries: entries.filter((e) => e.category === cat),
    label: categoryLabels[cat] ?? cat,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">HyperFrames Compositions</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              HTML + GSAP video compositions rendered with{" "}
              <a
                href="https://hyperframes.heygen.com/packages/player"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                @hyperframes/player
              </a>
              . Each composition is a standalone HTML file with GSAP timelines.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {grouped.map(({ category, label, entries: catEntries }) => (
              <section key={category}>
                <h2 className="mb-4 text-xl font-semibold">{label}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catEntries.map((entry) => (
                    <Link
                      key={entry.name}
                      href={`/preview/hyperframes/${entry.name}`}
                      className="group"
                    >
                      <Card className="h-full transition-colors hover:border-primary/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base group-hover:text-primary">
                            {entry.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {entry.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video overflow-hidden rounded-md bg-black/5">
                            <iframe
                              src={entry.src}
                              className="pointer-events-none h-full w-full scale-[0.35] origin-top-left"
                              style={{
                                height: "285.7%",
                                width: "285.7%",
                              }}
                              title={entry.title}
                              loading="lazy"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
