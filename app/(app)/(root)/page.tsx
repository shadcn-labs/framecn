import { CommandBox } from "@/components/command-box";
import { HomeCtas } from "@/components/home-ctas";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { YourComponent } from "@/registry/new-york/your-component";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const dynamic = "force-static";
export const revalidate = false;

export default function IndexPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: ROUTES.HOME }]} />
      <PageTransition>
        <section className="relative overflow-hidden">
          <div className="container-wrapper relative">
            <div className="container flex flex-col items-center gap-4 py-16 text-center md:py-20 lg:py-24">
              <h1 className="max-w-7xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl/tight from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent">
                startercn
              </h1>

              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                A starter kit for building and publishing your own shadcn
                registry components. Fork, customize, and deploy.
              </p>

              <CommandBox className="mt-4 w-full max-w-xl" />

              <HomeCtas className="mt-4" />
            </div>
          </div>
        </section>

        <section className="container-wrapper pb-8 lg:pb-12">
          <div className="container flex flex-col items-center gap-6">
            <YourComponent className="w-full max-w-md" />
          </div>
        </section>
      </PageTransition>
    </>
  );
}
