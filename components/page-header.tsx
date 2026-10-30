import { cn } from "@/lib/utils";

export const PageHeader = ({
  children,
  description,
  title,
  centered = false,
  display = false,
}: {
  children?: React.ReactNode;
  description?: React.ReactNode;
  title: React.ReactNode;
  /** Center the title, description and actions (marketing-style pages). */
  centered?: boolean;
  /** Use the flagship marketing H1 size instead of the standalone page title. */
  display?: boolean;
}) => (
  <header className={cn(centered && "text-center")}>
    <h1 className={display ? "heading-display" : "heading-title"}>{title}</h1>
    {description ? (
      <p
        className={cn(
          "text-muted-foreground mt-3 max-w-2xl text-[15px] leading-7 text-pretty",
          centered && "mx-auto"
        )}
      >
        {description}
      </p>
    ) : null}
    {children ? (
      <div
        className={cn(
          "mt-6 flex flex-wrap items-center gap-2",
          centered && "justify-center"
        )}
      >
        {children}
      </div>
    ) : null}
  </header>
);
